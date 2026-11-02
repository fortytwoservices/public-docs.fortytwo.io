---
description: What you need in Azure, Entra ID and DNS before AI Universe can be installed in your tenant.
icon: clipboard-check
---

# Before you install

AI Universe is installed into your own Azure subscription by someone in your organisation, usually together with Fortytwo. Have these ready before you start.

## Checklist

::::steps
### A dedicated Azure subscription

The platform creates a resource group for every app, so give it a subscription of its own. Pick the Azure region you want your data in, for example Sweden Central or Norway East.

### The right person signed in

Whoever runs the installer needs, for the duration of the install:

- **Owner** on that subscription
- **Global Administrator** or **Privileged Role Administrator** in Entra ID

The installer grants Microsoft Graph admin consent once, which is why it needs the Entra role. It stops before changing anything if either role is missing.

### A domain for your apps

Every app gets its own address under a domain you choose, such as `hr-assistant.ai.yourcompany.com`. Decide on the domain (here `ai.yourcompany.com`) before installing.

:::warning[Choose the domain carefully]
Changing the app domain later means every app has to be set up again. Pick one you intend to keep.
:::

### An email address for alerts

A shared mailbox or distribution list for the platform's alerts, for example `platform-admins@yourcompany.com`. Without one, the deployment raises no alerts at all.

### A GitHub organisation

Every app's code lives in its own repository. After the install you connect the platform to a GitHub **organisation** (not a personal account). See [Connect GitHub](connect-github.md).
::::

## What gets created

The installer creates everything inside the subscription you give it: networking, the control panel, the kernel, the AI gateway, a PostgreSQL database, a Key Vault, a container registry and Microsoft Foundry for the models. Nothing is reachable from the internet except through the Application Gateway and its web application firewall.

:::tip
If an install stops part-way, `fortytwo-setup --diagnose -g <resource group>` gives a read-only report of what is wrong. It changes nothing. Send the whole output to Fortytwo support.
:::
