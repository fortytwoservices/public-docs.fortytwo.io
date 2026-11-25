---
description: An app can expose an API to the other apps in your deployment. The API section of its settings shows its permissions, the apps granted each one, and the identifier URI.
icon: plug
---

# An app's API

One app can expose an API to the other apps in the same deployment. For example, a master data app
lets a CRM app read its organisations.

The permissions and grants are stored in Microsoft Entra, on the app's registration. AI Universe
stores only whether the API is enabled, and reads everything else from Entra each time you open the
section.

## Open the API section

Open the app, choose the **Settings** tab, then **API**. The app's admins and platform admins see it.

## Enable the API

A new app's API is not enabled. A platform admin selects **Enable the API**. An app admin sees that
the API is not enabled and that a platform admin enables it.

Enabling writes nothing to Entra.

## What the section shows

| Part | What it lists |
|-|-|
| **Identifier URI** | `api://<client id>`, the address another app requests a token for. When the app registration does not contain it, the section says so. |
| **Permissions** | Each permission the app exposes, with its kind and name. An **App role** is checked in the `roles` claim of a token the calling app gets as itself. A **Scope** is checked in the `scp` claim of a token the calling app gets for its signed-in user. |
| **Granted to** | Each app granted a permission. An app that is not part of this deployment, granted directly in Entra, is shown by its client id or its Entra name. |

An app role allowed for users, such as one on the app's **People** page, is not an API permission and
is not listed. Neither are the platform's own role and scope.

:::note
When the section cannot read the app registration from Entra, it shows the reason and no list. The
list is then unknown, not empty.
:::
