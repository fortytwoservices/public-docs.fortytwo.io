---
description: "What to do when the AI Universe installer stops: the error, why it happens and the command that fixes it."
icon: life-buoy
sidebarTitle: Overview
---

# Troubleshoot an install

:::note
This guide assumes you are installing with the command provided by [marketplace.fortytwo.io](https://marketplace.fortytwo.io/).
:::

## Installer overview

The installer, `fortytwo-setup`, explains every stop in its own output. When a run ends, it prints **What this run left you**: what broke, what needs an action from you, and what is only informational. Everything the run created is kept in the resource group, so you continue from there: you do not start again.

This page and the three below it cover the stops support sees most often, with the command for each.

### Find the error

At the end of the output, under **What this run left you**, the installer says `The run stopped at …`, with the error above it. Find the error in the pages below and fix it before you run anything again. If the installer says `This one CANNOT be resumed`, [start again](#start-again) instead.

Errors are grouped by when they happen:

::::cards{cols=3}
:::card{title="Before the deployment" icon="list-checks" href="/ai-universe/get-started/troubleshoot-before-deployment/"}
Before the platform's resources are deployed: Entra role, Azure sign-in, preflight checks, certificate authority.
:::
:::card{title="During the deployment" icon="server" href="/ai-universe/get-started/troubleshoot-during-deployment/"}
While the platform's resources are deployed: providers, database, role assignment, names, regions.
:::
:::card{title="After the deployment" icon="circle-check" href="/ai-universe/get-started/troubleshoot-after-install/"}
App domain delegation, the app certificate, and a platform that is already installed.
:::
::::

### Resume the install

Go to the installer's folder. A resume needs the installer version that stopped, which is the one in the folder it was downloaded to.

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

Then run the resume command. Use your resource group in place of `<resource group>`. It is the value after `--resource-group` in your install command, `rg-` followed by your platform name.

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

The installer recorded everything else from your install command, such as the platform name, region, app domain and certificate settings. Do not paste your install command again: it does not say who may reach the platform, so if the run stopped before the Application Gateway was built, the installer rejects it. Leave the run going until it finishes: a full install takes 20 to 45 minutes.

If the run stopped before it created the resource group, there is nothing to resume. Fix the error and run your install command again.

:::warning[Each re-run can request a new certificate]
Your install command asks Let's Encrypt for a trusted certificate for your app domain. A run that stops before the infrastructure deploy finishes does not keep that certificate, and the next run requests another one. Let's Encrypt issues at most five certificates for the same domain names in seven days. Fix the cause before you re-run, rather than re-running to see whether the error comes back.
:::

## Start again

A resume reads the platform name, region and your other settings back from the deployment's record, and does not take new values. Remove the stopped install and start again when:

- The installer says `This one CANNOT be resumed`, because [the name is already taken](troubleshoot-during-deployment.md#the-name-is-already-taken) or [the region cannot host the platform](troubleshoot-during-deployment.md#the-region-cannot-host-the-platform).
- [A preflight check fails](troubleshoot-before-deployment.md#the-preflight-check-fails) and the fix is another region.
- You need to change the platform name or the region. The alert email and the resource tags are changed in the control panel instead, under **Settings**.
- The first install never finished, and the installer you now have is a newer version. It stops with `the installer does not move a running deployment to another version`.

Remove the stopped install from the installer's folder:

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

The uninstall frees the names the stopped run reserved. Then go back to [marketplace.fortytwo.io](https://marketplace.fortytwo.io/), change what you need, and run the new install command it gives you.

## Still stuck

Generate a deployment report. In the installer's folder (`~/fortytwo-setup`, or `~` in Cloud Shell), run:

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
If you changed the flags of your install command or built your own command, for example for restricted access, an unattended install or your own certificate, see [Installing with your own flags](troubleshoot-custom-flags.md). If the install does not complete, contact Fortytwo support with a [deployment report](#still-stuck) and the command you ran.
:::
