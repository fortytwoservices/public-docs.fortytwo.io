---
description: "Problems after an AI Universe install finishes: the app domain, the app certificate and running the installer again."
sidebarTitle: After the deployment
---

# After the deployment

:::note
This guide assumes you are installing with the command provided by [marketplace.fortytwo.io](https://marketplace.fortytwo.io/). To continue after you fix an error, see [Resume the install](troubleshoot-install.md#resume-the-install).
:::

These come up once the install has finished, or when you run the installer against a platform that is already installed.

## The app domain is not delegated

**Symptom.** The installer prints `Delegate … now: add this NS record on …`, or `The galaxy domain is not delegated yet`. After the install, the control panel or the apps do not open from the internet, or browsers warn about the certificate.

**Cause.** The installer creates an Azure DNS zone for your app domain. That zone must be delegated from the parent domain with an NS record at your DNS provider. Until it is, nothing under the domain resolves publicly. If the control panel address is under the same domain, it does not resolve either.

**What to do.**

1. Copy the name servers the installer prints. They are also in the summary at the end of the run, under `Galaxy public edge`.
2. At your DNS provider, on the parent domain, add an NS record for the app domain pointing at those name servers. For `ai.example.com`, the record goes on `example.com`.
3. Leave the installer running. An interactive run checks every 30 seconds for up to 30 minutes and issues the trusted certificate once the delegation resolves.

If the delegation is not in place by the end of the run, the install still finishes with a self-signed certificate. The platform's nightly renewal job replaces it with a trusted one at 03:17 UTC once the delegation resolves. Nothing else is needed. To have it sooner, [renew the certificate now](#the-app-certificate-needs-renewing).

To check the delegation yourself:

```bash
dig NS ai.example.com +short
```

The answer should be the name servers the installer printed.

## The app certificate needs renewing

The apps are served under one wildcard certificate, `*.<app domain>`. The installer gets it free from Let's Encrypt, and a job on the platform renews it daily inside the last 30 days.

To renew it now, for example after you fix the delegation, run this in the installer's folder (`~/fortytwo-setup`, or `~` in Cloud Shell) with the alert email you gave when you installed:

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

## The platform is already installed

**Symptom.** You run the installer against a platform that is already installed, with a newer installer, and it stops with `Install rejected: the installer does not move a running deployment to another version`.

**Cause.** The installer only installs. An upgrade migrates the database before it rolls out the new version, and runs from inside your tenant. A re-run of the installer does neither.

**What to do.** Upgrade from the control panel, under **Settings**, **Platform version**. See [Upgrades](../operations/upgrades.md).

If the control panel cannot do it, for example because it will not sign you in, the stop message prints a command with `--repair-to <version> -g <resource group>` that moves the platform through its own upgrade job instead. Use it only when the **Platform version** page cannot, and talk to Fortytwo support first.

If the first install never finished, this requires an uninstall and a new install. See [Start again](troubleshoot-install.md#start-again).
