---
description: What to do when the AI Universe installer stops, stalls or asks for something you do not have. Each entry gives the symptom, the cause and the exact command.
icon: life-buoy
---

# Troubleshoot an install

:::note
This guide assumes you are installing with the command provided by [marketplace.fortytwo.io](https://marketplace.fortytwo.io/).
:::

## Installer overview

The installer, `fortytwo-setup`, explains every stop in its own output. When a run ends, it prints **What this run left you**: what broke, what needs an action from you, and what is only informational.

This page covers the stops support sees most often, with the command for each.

## The install stopped part-way

**Symptom 1.** The run ends with `The run stopped at …` and a command to re-run. Follow the steps below.

**Symptom 2.** The installer did not print a command, for example because Cloud Shell disconnected. Follow [The installer did not print a command](#the-installer-did-not-print-a-command).

**Cause.** A step failed, or the session ended. Everything created up to that step is kept in the resource group.

**What to do.** Continue the install in the same resource group. You do not start again, and you do not type your answers again.

:::::steps
### Find out why it stopped

Scroll to the end of the installer output. Under **What this run left you**, the installer says `The run stopped at …`, with the error that stopped it above.

- If it says `This one CANNOT be resumed`, do not continue here. Follow [The name is already taken](#the-name-is-already-taken) or [The region cannot host the platform](#the-region-cannot-host-the-platform).
- If a section further down this page describes the error, follow it.

### Fix the cause

Fix what the error names before you run anything again.

:::warning[Each re-run can request a new certificate]
Your install command asks Let's Encrypt for a trusted certificate for your app domain. A run that stops before the infrastructure deploy finishes does not keep that certificate, and the next run requests another one. Let's Encrypt issues at most five certificates for the same domain names in seven days. Fix the cause before you re-run, rather than re-running to see whether the error comes back.
:::

### Copy the command the installer printed

Under `The run stopped at …`, the installer prints the command that continues the install. It looks like this:

```text
The run stopped at <step>. Nothing after that step was created. Fix what the error
above names, then re-run to resume: …

      ./fortytwo-setup -g rg-nordlys --default-access open
```

Copy the line that starts with `./fortytwo-setup`. It names your resource group and who may reach the platform. The installer recorded everything else from your first command, such as the platform name, region, app domain and certificate settings, so the command needs nothing more. No secret it can read is regenerated.

Do not paste your install command again. It does not say who may reach the platform, so if the run stopped before the Application Gateway was built, the installer rejects it and changes nothing.

### Go to the installer's folder

Run the command in the folder the installer was downloaded to. That installer is the version that stopped, and a resume needs the same version.

::::tabs
:::tab[macOS and Linux]
```bash
cd ~/fortytwo-setup
```
:::
:::tab[Windows]
```powershell
cd ~/fortytwo-setup
```
:::
:::tab[Azure Cloud Shell]
```bash
cd ~
```
:::
::::

### Run the command

Paste the command you copied and press Enter. The installer continues in the same resource group. Leave it running until it finishes: a full install takes 20 to 45 minutes.
:::::

:::note
If the run stopped before a resource group was chosen, there is nothing to resume. Fix the error and start the installer again.
:::

## The installer did not print a command

**Symptom.** The installer stopped without printing a command to continue, for example because Cloud Shell disconnected or the terminal closed.

**Cause.** The session ended before the installer could print it. Everything created up to that point is kept in the resource group.

**What to do.** Build the command yourself from your install command, then run it.

:::::steps
### Find your resource group

Your resource group is the value after `--resource-group` in your install command.

### Go to the installer's folder

Run the command in the folder the installer was downloaded to. That installer is the version that stopped, and a resume needs the same version.

::::tabs
:::tab[macOS and Linux]
```bash
cd ~/fortytwo-setup
```
:::
:::tab[Windows]
```powershell
cd ~/fortytwo-setup
```
:::
:::tab[Azure Cloud Shell]
```bash
cd ~
```
:::
::::

### Run the command

Use your resource group in place of `<resource group>`.

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup -g <resource group> --default-access open
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe -g <resource group> --default-access open
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup -g <resource group> --default-access open
```
:::
::::

Leave it running until it finishes: a full install takes 20 to 45 minutes.
:::::

## Errors you fix, then continue

Fix the cause, then continue the install as described in [The install stopped part-way](#the-install-stopped-part-way).

### The preflight check fails

Before it deploys anything, the installer checks that PostgreSQL and the AI model are available in the region and runs a dry run of the deployment. A failed check stops the run with `Preflight failed`. Fix what it names, then [resume the install](#the-install-stopped-part-way). Nothing needs to be deleted.

| The check says | What to do |
|-|-|
| `this subscription is restricted from creating Postgres Flexible Servers in …` | Ask Azure for access to Azure Database for PostgreSQL Flexible Server in that region through an Azure support quota request, or start again in Sweden Central as described in [The region cannot host the platform](#the-region-cannot-host-the-platform). |
| `could not list Postgres Flexible Server SKUs in …` | Check that you are signed in, that the subscription can use the region, and that the `Microsoft.DBforPostgreSQL` resource provider is registered. |
| `region … offers no Postgres server version to this subscription` | Choose another region. |
| `model … is not offered in this region`, or is not generally available there | Choose another region. The message lists models that are. |
| `what-if reported errors` | The dry run found a problem with the deployment. The errors are listed above the message. Fix them and re-run. |

### The database server cannot be created

**Symptom.** The PostgreSQL server fails with `RegionalAllocationFailed`, `SkuNotAvailable`, or `CapacityNotAvailable` after the installer's own retries.

**Cause.** Azure has no capacity for the server size in that region right now, or does not offer that size there. The default size is `Standard_B2s`. The region itself can still host the platform, and no server was created, so the install can be resumed in the same resource group and region.

**What to do.** [Resume the install](#the-install-stopped-part-way) with a different server size. When the installer stops on the server size, the command it prints already contains `--postgres-sku Standard_D2s_v3`. If yours does not, add it to the end of the command:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
::::

The server size is not recorded, so `--postgres-sku` applies to the run you pass it on. Pass it on every re-run until the install completes. The same setting can come from the `FORTYTWO_POSTGRES_SKU` environment variable.

:::warning[Avoid the smallest size]
`Standard_B1ms` is accepted but leaves only 35 usable database connections. The platform can use them all up while it rolls out a new version. The installer warns when you choose it.
:::

### The Microsoft.Web provider is not registered

**Symptom.** The run stops with `SubnetSubscriptionMustBeRegisteredWithMicrosoftWeb`.

**Cause.** The API gateway needs the `Microsoft.Web` resource provider registered in the subscription. The installer tries to register it, and this means the attempt was rejected or has not taken effect yet.

**What to do.** Ask someone with Contributor or Owner on the subscription to run the command below, then [resume the install](#the-install-stopped-part-way). Choosing another region does not help, because the registration is for the whole subscription.

```bash
az provider register -n Microsoft.Web --wait
```

### Role assignment is refused although you are Owner

**Symptom.** The infrastructure deploy fails with `AuthorizationFailed` on `Microsoft.Authorization/roleAssignments/write`, usually naming the `platformProvisioningRoles` deployment, even though you are Owner of the subscription.

**Cause.** Your Owner or User Access Administrator role assignment carries a condition that forbids assigning Owner, User Access Administrator or Role Based Access Control Administrator. This is Microsoft's pattern for constrained delegation. By default the installer assigns Role Based Access Control Administrator to the platform at subscription scope, so the condition blocks it.

The installer's first step already warns when it sees a condition on your role assignments, and prints a command that shows it:

```bash
az role assignment list --assignee "$(az ad signed-in-user show --query id -o tsv)" --include-inherited --query "[?condition!=null].{role:roleDefinitionName,condition:condition}"
```

**What to do.** [Resume the install](#the-install-stopped-part-way) with `--custom-provisioning-role` added to the end of the command the installer printed. It resumes in the same resource group, with no uninstall needed. The platform then gets a custom role instead of the built-in one, which such a condition normally allows. Creating that role definition needs `Microsoft.Authorization/roleDefinitions/write`, which Owner and User Access Administrator include, because the condition limits role assignments, not role definitions.

This does not help when the condition only allows a fixed list of roles: the installer says so in its warning. In that case, ask whoever owns the condition to widen it, or have someone whose role assignment has no condition run the install.

### Your Azure sign-in is about to expire

**Symptom.** The installer warns `Your Azure token expires in ~N min` or `Your Azure session looks stale`, or a step fails with `Azure session is not valid`.

**Cause.** The install runs for 20 to 45 minutes. The Azure CLI normally renews its token during a long run, but a session that is about to expire, or one that cannot renew, can break a step part-way.

**What to do.** Sign in again before you start, or before you resume:

```bash
az login
```

If the subscription is in another tenant, sign in to that tenant:

```bash
az login --tenant <tenant id>
```

Then run the installer again. To continue a stopped install, see [The install stopped part-way](#the-install-stopped-part-way).

### The certificate authority is blocked

**Symptom.** The certificate step reports that the domain `publishes CAA records that do not authorize Let's Encrypt`.

**Cause.** A CAA record on your domain, or on the closest parent that has any, lists which certificate authorities may issue for it, and Let's Encrypt is not one of them.

**What to do.** Add the two records the message prints on the domain it names, then re-run:

```text
yourcompany.com   CAA   0 issue "letsencrypt.org"
yourcompany.com   CAA   0 issuewild "letsencrypt.org"
```

## Errors that need a fresh start

The installer says `This one CANNOT be resumed`. Remove the stopped install and start again.

### The name is already taken

**Symptom.** The run stops with `This one CANNOT be resumed`, naming one of `CustomDomainInUse`, `NameAlreadyInUse`, `VaultAlreadyExists`, `StorageAccountAlreadyTaken`, `ServerNameAlreadyExists` or `ServiceAlreadyExists`.

**Cause.** Several Azure resources need a name that is unique across all of Azure, and the platform name you chose is already used by someone else. A deleted Key Vault keeps its name reserved while it is soft-deleted, and a PostgreSQL server name is never released.

**What to do.** A resume would send the same name and fail the same way. Remove the stopped install, then start again with a different platform name.

First remove the stopped install. In [the installer's folder](#go-to-the-installers-folder), run:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup --uninstall -g <resource group>
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe --uninstall -g <resource group>
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup --uninstall -g <resource group>
```
:::
::::

The uninstall frees the names the stopped run reserved.

Then go back to [marketplace.fortytwo.io](https://marketplace.fortytwo.io/), choose a different platform name, and run the new install command it gives you. The new command installs into a new resource group named after the platform.

### The region cannot host the platform

**Symptom.** The run stops with `LocationIsOfferRestricted`, `SkuNotAvailable`, or `Region '…' is out of capacity for … right now`.

**Cause.** The subscription is not entitled to that region, the region does not offer a service the platform needs, or Azure has no capacity there at the moment.

**What to do.**

- `LocationIsOfferRestricted` and `SkuNotAvailable` cannot be resumed. Remove the stopped install with the uninstall command in [The name is already taken](#the-name-is-already-taken), then go back to [marketplace.fortytwo.io](https://marketplace.fortytwo.io/) and start again with a different region. The installer suggests Sweden Central. The exception is `SkuNotAvailable` on the PostgreSQL server: see [The database server cannot be created](#the-database-server-cannot-be-created).
- A capacity shortage is usually temporary. Wait, then [resume the install](#the-install-stopped-part-way). If the region stays short, remove the install and start again in another region as above.

The installer accepts only the regions it has checked model availability in: `swedencentral`, `norwayeast`, `westeurope`, `northeurope`, `eastus`, `eastus2`, `westus2`, `southeastasia` and `australiaeast`. To test a region before you commit to it, add `--probe-region`. It runs a real check that takes about five minutes.

## After the install

### The app domain is not delegated

**Symptom.** The installer prints `Delegate … now: add this NS record on …`, or `The galaxy domain is not delegated yet`. After the install, the control panel or the apps do not open from the internet, or browsers warn about the certificate.

**Cause.** The installer creates an Azure DNS zone for your app domain. That zone must be delegated from the parent domain with an NS record at your DNS provider. Until it is, nothing under the domain resolves publicly. If the control panel address is under the same domain, it does not resolve either.

**What to do.**

1. Copy the name servers the installer prints. They are also in the summary at the end of the run, under `Galaxy public edge`.
2. At your DNS provider, on the parent domain, add an NS record for the app domain pointing at those name servers. For `ai.yourcompany.com`, the record goes on `yourcompany.com`.
3. Leave the installer running. An interactive run checks every 30 seconds for up to 30 minutes and issues the trusted certificate once the delegation resolves.

If the delegation is not in place by the end of the run, the install still finishes with a self-signed certificate. The platform's nightly renewal job replaces it with a trusted one at 03:17 UTC once the delegation resolves. Nothing else is needed. To have it sooner, [renew the certificate now](#renewing-the-app-certificate).

To check the delegation yourself:

```bash
dig NS ai.yourcompany.com +short
```

The answer should be the name servers the installer printed.

### Renewing the app certificate

The apps are served under one wildcard certificate, `*.<app domain>`. The installer gets it free from Let's Encrypt, and a job on the platform renews it daily inside the last 30 days.

To renew it now, for example after you fix the delegation, run this in [the installer's folder](#go-to-the-installers-folder) with the alert email you gave when you installed:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup --renew-galaxy-cert -g <resource group> --galaxy-cert-acme <email>
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe --renew-galaxy-cert -g <resource group> --galaxy-cert-acme <email>
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup --renew-galaxy-cert -g <resource group> --galaxy-cert-acme <email>
```
:::
::::

It does nothing unless the certificate expires within 30 days or is not trusted. Add `--force` to renew anyway.

## You are not an Entra administrator

**Symptom.** You hold Owner on the subscription but neither Global Administrator nor Privileged Role Administrator in Entra ID.

**Cause.** The platform needs some Microsoft Graph permissions and admin consent that only those roles can grant.

**What to do.** Install in handoff mode. An interactive run asks `Do you hold Global Administrator or Privileged Role Administrator in this tenant, or will another person grant the Entra permissions?` Choose **Another person grants the Entra permissions (handoff mode)**.

In handoff mode:

- You install as subscription Owner. You must own the platform app registration, which the installer creates or adopts as `ai-universe-platform-<platform name>`.
- Every Entra grant the run cannot make is recorded as owed rather than stopping the install.
- At the end, the installer writes and prints `entra-admin-handoff.sh`. An Entra administrator runs it to finish.
- The control panel, Support and Wisdom work straight away. The home page shows **Entra admin action owed** with the same script under **Script for the Entra admin**. Creating apps stays off until the grants exist, and turns on by itself within about ten minutes after that. **Check again now** checks at once.

If your login cannot create app registrations at all, the run stops and prints the commands an Entra administrator (Application Administrator, Cloud Application Administrator or Global Administrator) runs to create the app and make you its owner. Then run the installer again with the ID it printed:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup -g <resource group> --entra-app-id <application (client) id>
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe -g <resource group> --entra-app-id <application (client) id>
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup -g <resource group> --entra-app-id <application (client) id>
```
:::
::::

If you pass `--entra-app-id` for an app you do not own, the run stops before changing anything and prints the command an owner runs to add you:

```bash
az ad app owner add --id <application (client) id> --owner-object-id <your object id>
```

## Upgrading an installed platform

**Symptom.** You run the installer against a platform that is already installed, with a newer installer, and it stops with `Install rejected: the installer does not move a running deployment to another version`.

**Cause.** The installer only installs. An upgrade migrates the database before it rolls out the new version, and runs from inside your tenant. A re-run of the installer does neither.

**What to do.** Upgrade from the control panel, under **Settings**, **Platform version**. See [Upgrades](../operations/upgrades.md).

If the control panel cannot do it, for example because it will not sign you in, the stop message prints a command with `--repair-to <version> -g <resource group>` that moves the platform through its own upgrade job instead. Use it only when the Upgrade page cannot, and talk to Fortytwo support first.

If the first install never finished, remove it with the uninstall command in [The name is already taken](#the-name-is-already-taken) and install again.

## Still stuck

Generate a deployment report. In [the installer's folder](#go-to-the-installers-folder), run:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup --diagnose -g <resource group>
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe --diagnose -g <resource group>
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup --diagnose -g <resource group>
```
:::
::::

It creates, changes and deletes nothing. Where it finds a remedy it prints the command and labels it safe or destructive, and you decide whether to run it. Send the whole output to Fortytwo support, together with the installer output and what you tried. See [Support](../operations/support.md).

:::note[Installing with your own flags]
If you changed the flags of your install command or built your own command, for example for an unattended install or your own certificate, and the install does not complete, contact Fortytwo support with a [deployment report](#still-stuck) and the command you ran.
:::
