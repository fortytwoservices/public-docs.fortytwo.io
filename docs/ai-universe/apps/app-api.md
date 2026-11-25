---
description: An app can expose an API to other apps. The API section of its settings shows the identifier URI and the roles and scopes of its app registration, and adds and removes them.
icon: plug
---

# An app's API

One app can expose an API to other apps. For example, a master data app lets a CRM app read its
organisations.

The roles and scopes are stored in Microsoft Entra, on the app's registration. AI Universe stores only
whether the API is enabled, and reads the roles and scopes from Entra each time you open the section.

## Open the API section

Open the app, choose the **Settings** tab, then **API**.

## Enable or disable the API

A new app's API is not enabled. A platform admin selects **Enable the API**. An app admin sees that
the API is not enabled and that a platform admin enables it.

A platform admin selects **Disable the API** to turn the API setting off. While it is off, the app's
admin cannot add or remove roles and scopes.

Enabling and disabling write nothing to Entra. Disabling leaves the roles, the scopes and the
assignments of other apps to them unchanged.

## What the section shows

While the API is enabled, the section shows:

| Part | What it lists |
|-|-|
| **Identifier URI** | `api://<client id>`, the address another app requests a token for. When the app registration does not contain it, the section says so. |
| **Roles and scopes** | Each role and scope of the app registration, with its value, its kind (**App role** or **Scope**), its name and its state (**Enabled** or **Disabled**). |

An **App role** is checked in the `roles` claim of a token the calling app gets as itself. A **Scope**
is checked in the `scp` claim of a token the calling app gets for its signed-in user.

:::note
When the section cannot read the app registration from Entra, it shows the reason and no list. The
list is then unknown, not empty.
:::

## Add a role or scope

1. Choose **Add role or scope**.
2. Select the **Kind**: **App role** when another app calls as itself, **Scope** when another app calls
   as its signed-in user.
3. Enter the **Value your code checks**, for example `Organisations.Write`. The value has 1 to 120
   characters: letters, digits, `.`, `-` or `_`, starting with a letter. It cannot be changed later.
   `platform.call`, `access_as_user` and values that start with `galaxy` or `platform` are reserved
   for the platform.
4. Enter the **Name**, for example `Write organisations`, and optionally what it allows.

A scope requires the identifier URI on the app registration.

## Remove a role or scope

Choose **Remove** on the role or scope and confirm. The role or scope is set disabled, then removed from
the app registration.

Entra rejects the removal while another app is assigned the role or scope. Remove that assignment first.

## Let another app call the API

The app's API is a registered API in Entra, like any other. To let another app call it, assign that app
a role or scope of this app in the **API assignments** section of the calling app's settings. See
[API assignments](../control-panel/api-assignments.md).
