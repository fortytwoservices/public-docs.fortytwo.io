---
description: An app can expose an API to other apps. The API section of its settings shows the identifier URI and the roles and scopes of its app registration, and adds and removes them.
icon: plug
---

# An app's API

One app can expose an API to other apps. For example, a master data app lets a CRM app read its
organisations.

The roles and scopes are stored in Microsoft Entra, on the app's registration. AI Universe stores no
copy, and reads them from Entra each time you open the section.

## Open the API section

Open the app, choose the **Settings** tab, then **API**.

## What the section shows

The section shows:

| Part | What it lists |
|-|-|
| **Identifier URI** | `api://<client id>`, the address another app requests a token for. When the app registration does not contain it, the section says so. |
| **Roles and scopes** | Each role and scope of the app registration, with its value, its kind (**Application** for an app role, **Delegated** for a scope), its name and its state (**Enabled** or **Disabled**). |

An app role is an application permission: it is checked in the `roles` claim of a token the calling
app gets as itself, with no user signed in. A scope is a delegated permission: it is checked in the
`scp` claim of a token the calling app gets for its signed-in user. These are the words Microsoft Entra
lists on the calling app's **API permissions** page, and the words of the **API assignments** section.

:::note
When the section cannot read the app registration from Entra, it shows the reason and no list. The
list is then unknown, not empty.
:::

## Add a role or scope

1. Choose **Add role or scope**.
2. Select the **Kind**: **Application permission (app role)** when another app calls as itself, with no
   user signed in, or **Delegated permission (scope)** when another app calls for its signed-in user.
3. Enter the **Value your code checks**, for example `Organisations.Write`. The value has 1 to 120
   characters: letters, digits, `.`, `-` or `_`, starting with a letter. It cannot be changed later.
   `platform.call`, `access_as_user` and values that start with `galaxy` or `platform` are reserved
   for the platform.
4. Enter the **Name**, for example `Write organisations`, and optionally what it allows.

A scope requires the identifier URI on the app registration.

## Remove a role or scope

Choose **Remove** on the role or scope and confirm. The role or scope is set disabled, then removed from
the app registration. When Entra rejects the removal, the section shows Entra's error.

## Let another app call the API

The app's API is a registered API in Entra, like any other. Entra lists the app as an API another app
can be assigned once the app has at least one enabled role or scope. To let another app call it, assign
that app a role or scope of this app in the **API assignments** section of the calling app's settings.
See [API assignments](../control-panel/api-assignments.md).
