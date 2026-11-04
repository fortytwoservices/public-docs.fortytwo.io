---
description: Run the installer once to set up AI Universe in your subscription. After that, everything happens in the control panel.
icon: download
---

# Install AI Universe

The installer is a single program, `fortytwo-setup`, for macOS, Linux and Windows. Your Fortytwo contact tells you which release to install.

## Get the installer

Releases are published to Fortytwo's public release registry and pulled with [ORAS](https://oras.land). Each release comes with a checksum file, so you can confirm the download is genuine.

```bash
V=<release>   # the version Fortytwo gave you
oras pull craiuniversenwe.azurecr.io/ai-universe-installer:$V
oras pull craiuniversenwe.azurecr.io/ai-universe-installer:$V-checksums
shasum -a 256 -c SHA256SUMS
```

Every line must read `OK`. On Windows, compare `(Get-FileHash .\fortytwo-setup-win-x64.exe).Hash` with the line in `SHA256SUMS`.

## Run it

Sign in to Azure as the person described in [Before you install](before-you-install.md), then start the installer. It asks for anything it needs.

:::::tabs
::::tab[macOS]
```bash
az login
chmod +x fortytwo-setup-osx-arm64
./fortytwo-setup-osx-arm64
```
::::
::::tab[Linux]
```bash
az login
chmod +x fortytwo-setup-linux-x64
./fortytwo-setup-linux-x64
```
::::
::::tab[Windows]
```powershell
az login
.\fortytwo-setup-win-x64.exe
```
::::
:::::

It asks for:

| Question | Example |
|-|-|
| Subscription | `AI Universe Production` |
| Portal name, 2 to 17 lowercase letters and dashes | `nordlys` |
| Resource group | `rg-nordlys` |
| Region | `swedencentral` |
| App domain | `ai.nordlys.no` |
| Alert email | `platform-admins@nordlys.no` |

`--help` lists every option, including running it without questions in a pipeline.

## Certificates and DNS

Your apps share one wildcard certificate for `*.` your app domain. Choose one of:

| Option | Installer flags |
|-|-|
| Bring your own wildcard certificate | `--galaxy-cert <file.pfx>`, password in `FORTYTWO_GALAXY_CERT_PASSWORD` |
| Host the domain in Azure DNS and let the platform issue and renew a Let's Encrypt certificate | `--galaxy-dns-zone --galaxy-cert-acme <email> --galaxy-cert-acme-production` |

Then point the control panel's host name and `*.` your app domain at the Application Gateway's public IP address in your DNS.

To limit who can reach the platform at all, add `--default-access restricted --allowed-ips <ranges>`.

## When it finishes

Open the control panel address and sign in. See [First sign-in](first-sign-in.md).

:::note
There is no separate upgrade tool. Once installed, the platform is upgraded from the control panel. See [Upgrades](../operations/upgrades.md).
:::
