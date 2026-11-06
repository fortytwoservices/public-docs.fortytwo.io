---
description: What to do when the AI Universe installer stops, stalls or asks for something you do not have. Each entry gives the symptom, the cause and the exact command.
icon: life-buoy
---

# Troubleshoot an install

The installer, `fortytwo-setup`, explains every stop in its own output. When a run ends, it prints **What this run left you**: what broke, what needs an action from you, and what is only informational. Read that block first. This page covers the stops support sees most often, with the command for each.

:::tip[Start with a read-only report]
`fortytwo-setup --diagnose -g <resource group>` prints a report on a deployment that will not install. It creates, changes and deletes nothing. Where it finds a remedy it prints the command and labels it safe or destructive, and you decide whether to run it. Send the whole output to Fortytwo support with any question.
:::

## The install stopped part-way

**Symptom.** The run ends with *The run stopped at …* and a command to re-run, or Cloud Shell disconnected during the install.

**Cause.** A step failed, or the session ended. Everything created up to that step is kept in the resource group.

**What to do.** Fix what the error names, then run the installer again against the same resource group:

```bash
fortytwo-setup -g <resource group>
```

The installer reads the deployment's own record, so you do not type the values again, and no secret it can read is regenerated. Copy the command the installer prints rather than typing your own: it adds `--default-access` and `--allowed-ips` when you set them, because those are not recorded.

Resume with the same installer version that stopped. The stop message names it. A newer installer refuses to continue an install started by an older one, because the templates and the images it deploys are one version.

:::note
If the run stopped before a resource group was chosen, there is nothing to resume. Fix the error and start the installer again.
:::

## The name is already taken

**Symptom.** The run stops with *This one CANNOT be resumed*, naming one of `CustomDomainInUse`, `NameAlreadyInUse`, `VaultAlreadyExists`, `StorageAccountAlreadyTaken`, `ServerNameAlreadyExists` or `ServiceAlreadyExists`.

**Cause.** Several Azure resources need a name that is unique across all of Azure, and the platform name you chose is already used by someone else. A deleted Key Vault keeps its name reserved while it is soft-deleted, and a PostgreSQL server name is never released.

**What to do.** A resume would send the same name and fail the same way. Remove the stopped install, then start again with a different platform name in a new resource group:

```bash
fortytwo-setup --uninstall -g <resource group>
```

```bash
fortytwo-setup --portal-name <new name> --resource-group <new resource group> --region <region> --galaxy-domain <domain>
```

The uninstall frees the names the stopped run reserved.

## The region cannot host the platform

**Symptom.** The run stops with `LocationIsOfferRestricted`, `SkuNotAvailable`, or *Region '…' is out of capacity for … right now*.

**Cause.** The subscription is not entitled to that region, the region does not offer a service the platform needs, or Azure has no capacity there at the moment.

**What to do.**

- `LocationIsOfferRestricted` and `SkuNotAvailable` cannot be resumed. Remove the stopped install with `fortytwo-setup --uninstall -g <resource group>`, then start again in a new resource group with a different `--region`. The installer suggests Sweden Central, `--region swedencentral`.
- A capacity shortage is usually temporary. Re-run later with `fortytwo-setup -g <resource group>`. If the region stays short, remove the install and start again in another region as above.

The installer accepts only the regions it has checked model availability in: `swedencentral`, `norwayeast`, `westeurope`, `northeurope`, `eastus`, `eastus2`, `westus2`, `southeastasia` and `australiaeast`. To test a region before you commit to it, add `--probe-region`. It runs a real check that takes about five minutes.

## The preflight check fails

Before it deploys anything, the installer checks that PostgreSQL and the AI model are available in the region and runs a dry run of the deployment. A failed check stops the run with *Preflight failed*. Fix what it names and run the installer again with `-g <resource group>`. Nothing needs to be deleted.

| The check says | What to do |
|-|-|
| *this subscription is restricted from creating Postgres Flexible Servers in …* | Ask Azure for access to Azure Database for PostgreSQL Flexible Server in that region through an Azure support quota request, or re-run with `--region swedencentral`. |
| *could not list Postgres Flexible Server SKUs in …* | Check that you are signed in, that the subscription can use the region, and that the `Microsoft.DBforPostgreSQL` resource provider is registered. |
| *region … offers no Postgres server version to this subscription* | Choose another region. |
| *model … is not offered in this region*, or is not generally available there | Choose another region. The message lists models that are. |
| *what-if reported errors* | The dry run found a problem with the deployment. The errors are listed above the message. Fix them and re-run. |

## The database server cannot be created

**Symptom.** The PostgreSQL server fails with `CapacityNotAvailable`, again after the installer's own retries.

**Cause.** Azure has no capacity for the server size in that region right now. The default size is `Standard_B2s`.

**What to do.** Re-run with a different size:

```bash
fortytwo-setup -g <resource group> --postgres-sku Standard_D2s_v3
```

A flag you pass on a re-run takes precedence over the recorded value. The same setting can come from the `FORTYTWO_POSTGRES_SKU` environment variable.

:::warning[Avoid the smallest size]
`Standard_B1ms` is accepted but leaves only 35 usable database connections. The platform can use them all up while it rolls out a new version. The installer warns when you choose it.
:::

## The Microsoft.Web provider is not registered

**Symptom.** The run stops with `SubnetSubscriptionMustBeRegisteredWithMicrosoftWeb`.

**Cause.** The API gateway needs the `Microsoft.Web` resource provider registered in the subscription. The installer tries to register it, and this means the attempt was rejected or has not taken effect yet.

**What to do.** Ask someone with Contributor or Owner on the subscription to run the command below, then re-run with `-g <resource group>`. Choosing another region does not help, because the registration is for the whole subscription.

```bash
az provider register -n Microsoft.Web --wait
```

## Your Azure sign-in is about to expire

**Symptom.** The installer warns *Your Azure token expires in ~N min* or *Your Azure session looks stale*, or a step fails with *Azure session is not valid*.

**Cause.** The install runs for 20 to 45 minutes. The Azure CLI normally renews its token during a long run, but a session that is about to expire, or one that cannot renew, can break a step part-way.

**What to do.** Sign in again before you start, or before you resume:

```bash
az login
```

If the subscription is in another tenant, sign in to that tenant:

```bash
az login --tenant <tenant id>
```

Then run the installer again. A stopped install resumes with `-g <resource group>`.

## The app domain is required

**Symptom.** An unattended install will not start and lists `--galaxy-domain` as missing, or rejects the value you gave.

**Cause.** Every app gets its address under one domain you control, for example `hr-assistant.ai.yourcompany.com`. The platform cannot install without one. The domain needs at least two labels and no leading `*`. The installer adds the wildcard itself.

**What to do.** Pass it with `--galaxy-domain ai.yourcompany.com`, or set `FORTYTWO_GALAXY_DOMAIN`. Choose it carefully: changing it later renames every app and sets each one up again.

## The app domain is not delegated

**Symptom.** The installer prints *Delegate … now: add this NS record on …*, or *The galaxy domain is not delegated yet*. After the install, the control panel or the apps do not open from the internet, or browsers warn about the certificate.

**Cause.** When the installer creates an Azure DNS zone for your app domain (`--galaxy-dns-zone`), that zone must be delegated from the parent domain with an NS record at your DNS provider. Until it is, nothing under the domain resolves publicly. If the control panel address is under the same domain, it does not resolve either.

**What to do.**

1. Copy the name servers the installer prints. They are also in the summary at the end of the run, under *Galaxy public edge*.
2. At your DNS provider, on the parent domain, add an NS record for the app domain pointing at those name servers. For `ai.yourcompany.com`, the record goes on `yourcompany.com`.
3. Leave the installer running. An interactive run checks every 30 seconds for up to 30 minutes and issues the trusted certificate once the delegation resolves.

If the delegation is not in place by the end of the run, the install still finishes with a self-signed certificate. The platform's nightly renewal job replaces it with a trusted one at 03:17 UTC once the delegation resolves. Nothing else is needed. To have it sooner, run the installer again with the same flags plus `--galaxy-cert-acme-production`.

To check the delegation yourself:

```bash
dig NS ai.yourcompany.com +short
```

The answer should be the name servers the installer printed.

:::note
Without `--galaxy-dns-zone` the installer creates no zone. The summary then asks for one record instead: `*.<domain>  A  <Application Gateway IP>`.
:::

## The certificate authority is blocked

**Symptom.** The certificate step reports that the domain *publishes CAA records that do not authorize Let's Encrypt*.

**Cause.** A CAA record on your domain, or on the closest parent that has any, lists which certificate authorities may issue for it, and Let's Encrypt is not one of them.

**What to do.** Add the two records the message prints on the domain it names, then re-run:

```text
yourcompany.com   CAA   0 issue "letsencrypt.org"
yourcompany.com   CAA   0 issuewild "letsencrypt.org"
```

## Choosing the app wildcard certificate

The apps are served under one wildcard certificate, `*.<app domain>`. You choose where it comes from when you install.

| You want | Flags | What happens |
|-|-|-|
| A free certificate the platform renews | `--galaxy-dns-zone --galaxy-cert-acme <email> --galaxy-cert-acme-production` | The installer issues a Let's Encrypt certificate over DNS. A job renews it daily inside the last 30 days. |
| To test the DNS setup first | `--galaxy-dns-zone --galaxy-cert-acme <email>` | The install proves that issuing works against Let's Encrypt's staging service, then keeps a self-signed certificate. The nightly job swaps in a trusted one at its first run. |
| Your own certificate | `--galaxy-cert <file.pfx>` with the password in `FORTYTWO_GALAXY_CERT_PASSWORD` | The installer binds your PFX. Renewing it stays with you. |
| None yet | no certificate flags | A self-signed certificate is created so names work from day one. Browsers warn until a trusted one is bound. |

On a running platform:

```bash
fortytwo-setup --renew-galaxy-cert -g <resource group> --galaxy-cert-acme <email>
```

renews a Let's Encrypt certificate now. It does nothing unless the certificate expires within 30 days or is not trusted; add `--force` to renew anyway.

```bash
fortytwo-setup --rebind-galaxy-cert -g <resource group> --galaxy-cert ./wildcard.pfx
```

replaces your own certificate with a new PFX, without a full installer run. It checks that the certificate covers `*.<app domain>`, has not expired and opens with the password before it changes anything.

:::warning[Supply your certificate on every full run]
If you supplied your own certificate, pass `--galaxy-cert` again on every full installer run. A run without it replaces your certificate with a self-signed one, and the installer warns before it does.
:::

## You are not an Entra administrator

**Symptom.** You hold Owner on the subscription but neither Global Administrator nor Privileged Role Administrator in Entra ID.

**Cause.** The platform needs some Microsoft Graph permissions and admin consent that only those roles can grant.

**What to do.** Install in handoff mode. An interactive run asks *Do you hold Global Administrator or Privileged Role Administrator in this tenant, or will another person grant the Entra permissions?* Choose **Another person grants the Entra permissions (handoff mode)**. An unattended run with `--non-interactive` switches to handoff mode by itself and says so.

In handoff mode:

- You install as subscription Owner. You must own the platform app registration, which the installer creates or adopts as `ai-universe-platform-<platform name>`.
- Every Entra grant the run cannot make is recorded as owed rather than stopping the install.
- At the end, the installer writes and prints `entra-admin-handoff.sh`. An Entra administrator runs it to finish.
- The control panel, Support and Wisdom work straight away. The home page shows **Entra admin action owed** with the same script under **Script for the Entra admin**. Creating apps stays off until the grants exist, and turns on by itself within about ten minutes after that. **Check again now** checks at once.

If your login cannot create app registrations at all, the run stops and prints the commands an Entra administrator (Application Administrator, Cloud Application Administrator or Global Administrator) runs to create the app and make you its owner. Then run the installer again with the ID it printed:

```bash
fortytwo-setup -g <resource group> --entra-app-id <application (client) id>
```

If you pass `--entra-app-id` for an app you do not own, the run stops before changing anything and prints the command an owner runs to add you:

```bash
az ad app owner add --id <application (client) id> --owner-object-id <your object id>
```

## Running the installer unattended

**Symptom.** A scripted install stops with *Cannot start a non-interactive install. The following are missing or invalid:*.

**Cause.** With `--non-interactive` (also `--yes` or `-y`) the installer never prompts, so every required value must come from a flag or an environment variable. A flag wins over its environment variable.

**What to do.** Supply each value listed. The required ones:

| Value | Flag | Environment variable |
|-|-|-|
| Platform name | `--portal-name` | `FORTYTWO_PORTAL_NAME` |
| Resource group | `--resource-group` or `-g` | `FORTYTWO_RESOURCE_GROUP` |
| Region | `--region` | `FORTYTWO_REGION` |
| App domain | `--galaxy-domain` | `FORTYTWO_GALAXY_DOMAIN` |
| Subscription, when your login sees more than one | `--subscription` | `FORTYTWO_SUBSCRIPTION` |

Also pass `--alert-email` or set `FORTYTWO_ALERT_EMAIL`. An unattended install without one warns and installs with no alerts at all. The certificate password is read only from `FORTYTWO_GALAXY_CERT_PASSWORD`, so it never appears in the shell history.

```bash
fortytwo-setup --portal-name nordlys --resource-group nordlys-rg --region swedencentral \
  --galaxy-domain ai.nordlys.no --alert-email platform-admins@nordlys.no --non-interactive
```

Run `fortytwo-setup --help` for every flag.

## Upgrading an installed platform

**Symptom.** You run the installer against a platform that is already installed, with a newer installer, and it stops with *Install rejected: the installer does not move a running deployment to another version*.

**Cause.** The installer only installs. An upgrade migrates the database before it rolls out the new version, and runs from inside your tenant. A re-run of the installer does neither.

**What to do.** Upgrade from the control panel, under **Settings**, **Platform version**. See [Upgrades](../operations/upgrades.md).

If the control panel cannot do it, for example because it will not sign you in, the stop message prints a `fortytwo-setup --repair-to <version> -g <resource group>` command that moves the platform through its own upgrade job instead. Use it only when the Upgrade page cannot, and talk to Fortytwo support first.

If the first install never finished, remove it with `fortytwo-setup --uninstall -g <resource group>` and install again.

## Still stuck

Run `fortytwo-setup --diagnose -g <resource group>` and send the whole output to Fortytwo support, together with the installer output and what you tried. See [Support](../operations/support.md).
