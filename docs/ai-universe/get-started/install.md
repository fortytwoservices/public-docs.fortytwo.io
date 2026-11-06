---
description: Buy AI Universe on Microsoft Marketplace, then paste one command to install it in your subscription. After that, everything happens in the control panel.
icon: download
---

# Install AI Universe

AI Universe is bought on Microsoft Marketplace and installed into your own Azure subscription. The install page asks four questions and gives you one command to paste. It always offers the newest release of the installer, `fortytwo-setup`.

::::::steps
### Buy it on Microsoft Marketplace

Open [Fortytwo AI Universe on Microsoft Marketplace](https://marketplace.microsoft.com/en-us/product/fortytwoio.fortytwo_ai_universe) and buy it in the same tenant as the subscription you will install into. The subscription is active as soon as the purchase is done.

### Open the install page

Choose **Configure account now**. It opens the install page at [marketplace.fortytwo.io](https://marketplace.fortytwo.io/). You can open that address again at any time.

### Answer four questions

| Question | Rule | Example |
|-|-|-|
| Platform name | 3 to 17 lowercase letters, digits and hyphens, starting with a letter | `nordlys` |
| Region | Sweden Central, Norway East, West Europe, North Europe, East US, East US 2, West US 2, Southeast Asia or Australia East | Sweden Central |
| Workspace domain | A domain you control. Your apps get their addresses under it. | `ai.nordlys.no` |
| Alert and certificate email | Gets Azure Monitor alerts and is the Let's Encrypt contact | `platform-admins@nordlys.no` |

The resource group is named after the platform, for example `nordlys-rg`.

:::warning[Choose the domain carefully]
Changing the domain later means every app has to be set up again. See [Before you install](before-you-install.md).
:::

### Paste the command

Sign in as the person described in [Before you install](before-you-install.md), then paste the command the page gives you. It downloads the installer from Fortytwo's release registry, checks its SHA-256 and starts it.

:::::tabs
::::tab[Azure Cloud Shell]
Recommended, nothing to install. Choose **Open Azure Cloud Shell** on the install page, pick **Bash** and paste the command.
::::
::::tab[macOS or Linux]
Install the Azure CLI, run `az login`, then paste the command in a terminal.
::::
::::tab[Windows]
Install the Azure CLI, run `az login`, then paste the command in PowerShell.
::::
:::::

### Answer the installer's questions

The installer asks which subscription to install into. When it asks, add one NS record for your workspace domain at your DNS provider. The installer creates the Azure DNS zone and a Let's Encrypt certificate for it.

### Leave it running

The install takes 20 to 45 minutes. If it stops, or Cloud Shell disconnects, paste the same command again and it carries on.
::::::

## When it finishes

Open the control panel address and sign in. See [First sign-in](first-sign-in.md).

:::note
There is no separate upgrade tool. Once installed, the platform is upgraded from the control panel. See [Upgrades](../operations/upgrades.md).
:::
