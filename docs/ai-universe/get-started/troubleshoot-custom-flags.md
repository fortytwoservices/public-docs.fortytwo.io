---
description: "Installing AI Universe with your own installer flags: restricted access, unattended installs, the app domain and the app certificate."
sidebarTitle: Custom install flags
---

# Installing with your own flags

The command from [marketplace.fortytwo.io](https://marketplace.fortytwo.io/) sets the installer's flags for you. This page is for when you changed them or wrote your own command.

Every flag can also come from an environment variable: `FORTYTWO_` followed by the flag name in capitals, with underscores for hyphens, for example `FORTYTWO_PORTAL_NAME` for `--portal-name`. A flag wins over its environment variable. Run `./fortytwo-setup --help`, or `./fortytwo-setup.exe --help` on Windows, for every flag.

:::note
If an install with your own flags does not complete, contact Fortytwo support with a [deployment report](troubleshoot-install.md#still-stuck) and the command you ran.
:::

## Restricted access

By default anyone on the internet can reach the platform. To limit it, add `--default-access restricted` and `--allowed-ips` with a comma-separated list of CIDR ranges. The control panel and every app accept only those ranges.

The installer does not record either flag. When you resume a stopped install, pass both again with the same values:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup -g <resource group> --default-access restricted --allowed-ips <cidr>,<cidr>
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe -g <resource group> --default-access restricted --allowed-ips <cidr>,<cidr>
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup -g <resource group> --default-access restricted --allowed-ips <cidr>,<cidr>
```
:::
::::

:::warning[Do not use the open resume command]
The resume command in [Resume the install](troubleshoot-install.md#resume-the-install) passes `--default-access open`, which opens the platform to the internet.
:::

## Running the installer unattended

**Symptom.** A scripted install stops with `Cannot start a non-interactive install. The following are missing or invalid:`.

**Cause.** With `--non-interactive` (also `--yes` or `-y`) the installer never prompts, so every required value must come from a flag or an environment variable.

**What to do.** Supply each value listed. The required ones:

| Value | Flag | Example |
|-|-|-|
| Platform name | `--portal-name` | `acme` |
| Resource group | `--resource-group` or `-g` | `rg-acme` |
| Region | `--region` | `swedencentral` |
| App domain | `--galaxy-domain` | `ai.example.com` |
| Subscription, when your login sees more than one | `--subscription` | The subscription's ID or name |

Also pass `--alert-email`. Without it the platform raises no alerts at all. The certificate password is read only from `FORTYTWO_GALAXY_CERT_PASSWORD`, so it never appears in the shell history.

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup --portal-name acme --resource-group rg-acme --region swedencentral --galaxy-domain ai.example.com --alert-email platform-admins@example.com --non-interactive
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe --portal-name acme --resource-group rg-acme --region swedencentral --galaxy-domain ai.example.com --alert-email platform-admins@example.com --non-interactive
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup --portal-name acme --resource-group rg-acme --region swedencentral --galaxy-domain ai.example.com --alert-email platform-admins@example.com --non-interactive
```
:::
::::

## The app domain is required

**Symptom.** An unattended install will not start and lists `--galaxy-domain` as missing, or rejects the value you gave.

**Cause.** Every app gets its address under one domain you control, for example `hr-assistant.ai.example.com`. The platform cannot install without one. The domain needs at least two labels and no leading `*`. The installer adds the wildcard itself.

**What to do.** Pass it with `--galaxy-domain ai.example.com`, or set `FORTYTWO_GALAXY_DOMAIN`. Choose it carefully: changing it later renames every app and sets each one up again.

## Choosing the app wildcard certificate

The apps are served under one wildcard certificate, `*.<app domain>`. You choose where it comes from when you install.

| You want | Flags | What happens |
|-|-|-|
| A free certificate the platform renews | `--galaxy-dns-zone --galaxy-cert-acme <email> --galaxy-cert-acme-production` | The installer issues a Let's Encrypt certificate over DNS. A job renews it daily inside the last 30 days. This is what the marketplace command uses. |
| To test the DNS setup first | `--galaxy-dns-zone --galaxy-cert-acme <email>` | The install proves that issuing works against Let's Encrypt's staging service, then discards that certificate and keeps a self-signed one. Run again with `--galaxy-cert-acme-production` to issue the trusted certificate. |
| Your own certificate | `--galaxy-cert <file.pfx>` with the password in `FORTYTWO_GALAXY_CERT_PASSWORD` | The installer binds your PFX. Renewing it stays with you. |
| None yet | no certificate flags | A self-signed certificate is created so names work from day one. Browsers warn until a trusted one is bound. |

To replace your own certificate with a new PFX without a full installer run:

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup --rebind-galaxy-cert -g <resource group> --galaxy-cert ./wildcard.pfx
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe --rebind-galaxy-cert -g <resource group> --galaxy-cert ./wildcard.pfx
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup --rebind-galaxy-cert -g <resource group> --galaxy-cert ./wildcard.pfx
```
:::
::::

It checks that the certificate covers `*.<app domain>`, has not expired and opens with the password before it changes anything.

:::warning[Supply your certificate on every full run]
If you supplied your own certificate, pass `--galaxy-cert` again on every full installer run. A run without it replaces your certificate with a self-signed one, and the installer asks before it does.
:::
