---
description: Assign permissions on Microsoft Graph and other Entra APIs to an app, see each permission's consent state, remove an assignment, and call the API from the app's code.
icon: key-round
sidebarTitle: API assignments
---

# API assignments

An assignment gives one app permissions on one enterprise app in your Entra tenant. An enterprise app is any app in Entra that exposes an API, for example Microsoft Graph. A permission is a delegated scope or an application role of that enterprise app.

A platform admin assigns the permissions in the control panel. The platform writes them to the required permissions of the app's own app registration in Entra, and stores no copy: Entra is the only record. A tenant admin gives consent in Entra. The app then calls the API directly, with a token for its own identity.

## Where to find it

Both places are shown to platform admins only.

- **Settings > API assignments** in the control panel, in the **Platform** group. The page lists every permission assigned to the apps in the deployment.
- **Settings > API assignments** in an app. Open the app, choose the **Settings** tab, then **API assignments**. The section lists the assignments of that app.

### Every app

The **API assignments** page is a table with one row for each assigned permission. The columns are:

- **App**, which opens the **API assignments** section of that app;
- **Enterprise app**;
- **Permission**, with its value (such as `User.Read`) and its display name;
- **Kind** and **Consent**, as described below, with **Grant consent in Entra** on a permission that is **Not granted**;
- **Remove**, which removes the assignment that holds the permission.

An app with no assignment, or with no Entra app registration, has no row. When the platform cannot read an app from Entra, a notice above the table names the app and the reason. That app's assignments are unknown, not empty, and the other apps are still listed.

### One app

The **API assignments** section of an app lists every enterprise app the app has permissions on, read from the required permissions of the app's registration in Entra. Every entry is listed, also one written in the Entra admin center.

Each enterprise app shows its name, its app id, and a **Microsoft** badge when Microsoft publishes it. Each permission shows its display name, its value (such as `User.Read`), its kind and its consent state.

| Kind | What the app does with it |
|-|-|
| **Delegated** | Calls the API as the signed-in user. The API returns only what that user may reach. |
| **Application** | Calls the API as the app itself, with no user signed in, for example from a scheduled job. |

| Consent state | Meaning |
|-|-|
| **Granted** | Entra has consent for the permission. The app gets tokens that contain it. |
| **Not granted** | The permission is assigned, but Entra has no consent for it yet. |
| **Consent unknown** | The platform did not check consent, because the enterprise app was not read from Entra or has no enabled permission with that id. |

When the platform cannot read the assignments from Entra, the section says why. The list is then unknown, not empty.

## Assign permissions

1. Choose **Add an assignment**, in the app's section or on the **API assignments** page.
2. On the **API assignments** page, select the app first and choose **Next**. An app without an Entra app registration shows **No Entra app registration** and cannot be selected.
3. Search the enterprise apps by a word of the display name: `Graph` finds `Microsoft Graph`. With no search text, Microsoft Graph is listed first. The list shows only enterprise apps that expose at least one permission, each with its publisher and the number of delegated and application permissions. The platform reads at most the first 500 enterprise apps in Entra; when Entra has more, the dialog says so, and a longer search narrows the list.
4. Choose **Show permissions** on the enterprise app. The dialog lists every permission of the enterprise app. Filter the list by value or display name, for example `User.Read`, and by kind with **All**, **Delegated** or **Application**. Permissions marked **Admin consent** need consent from a tenant admin before they work. **Open in Entra** opens the enterprise app in Entra.
5. Select the permissions the app needs and choose **Assign**. One Assign adds at most 50 permissions.

The platform adds the selected permissions to the required permissions of the app's registration in Entra, and keeps every other entry unchanged. Then:

- For an application role, the platform also creates the app role assignment when the platform's own identity is an owner of the enterprise app. The permission is then **Granted** straight away.
- For an application role on an enterprise app the platform does not own, such as Microsoft Graph, the permission stays **Not granted** until a tenant admin gives consent. The dialog shows why, with **Grant consent in Entra**.
- For a delegated scope, the permission stays **Not granted** until a tenant admin gives consent. The platform never consents to a delegated scope.

The dialog then shows the assignment as read from Entra after the change. Assigning a permission the app already has changes nothing in Entra.

The platform also writes a skill for the app's coding agent, described in [The skill for the app's coding agent](#the-skill-for-the-apps-coding-agent).

The platform assigns nothing, and shows the reason, when:

- the app has no Entra app registration yet;
- the required permissions of the app's registration hold an entry the platform cannot read in full (no `resourceAppId`, or a permission with no id or a type other than `Scope` or `Role`). The platform writes the whole list, so it does not write over an entry it would lose. Fix or remove that entry in Entra, then assign again.

Each assignment is recorded in the platform's config change log with the platform admin who made it. Entra's own audit log names the platform's identity as the writer.

## Give consent in Entra

When at least one permission is **Not granted**, the control panel shows the **Grant consent in Entra** button and how many permissions are not granted. The button opens the API permissions page of the app's registration in Entra, where a tenant admin chooses **Grant admin consent**. For Microsoft Graph permissions that is a Global Administrator or a Privileged Role Administrator.

The control panel reads the consent state again each time the page or the section is opened. A permission shows **Granted** once Entra has the consent.

## Remove an assignment

Choose **Remove** on the enterprise app in the app's **API assignments** section, or on a row of the **API assignments** page, and confirm. Removing an assignment takes every permission on that enterprise app away from the app, also on the **API assignments** page, where Remove is on one permission's row. To keep some of them, remove the assignment and assign those permissions again.

- The platform deletes the app role assignments it can delete, before it changes the required permissions.
- The platform removes the enterprise app's scopes and roles from the required permissions of the app's registration.
- Consent the platform cannot delete stays in Entra: a delegated consent granted for the whole tenant, and an app role assignment on an enterprise app the platform does not own. The control panel lists each one under **Grants the platform identity cannot delete**, with the reason and the Microsoft Graph PowerShell command a tenant admin runs to delete it. **Copy the PowerShell command** copies it.

The platform also deletes the app's skill for that enterprise app. When the removal fails in Entra, the skill stays, as the permissions do.

After the removal, the section no longer lists the enterprise app, even while such consent is still in Entra. Entra keeps issuing tokens with that consent to the app until a tenant admin runs the listed commands. Removing the same assignment again lists the commands again.

Each removal is recorded in the platform's config change log with the platform admin who made it.

## The skill for the app's coding agent

Each assignment writes a skill into the app's own guidance, so the coding agent that works on the app knows the permission exists and how to call the API. The skill is named `api-<app id>`, after the enterprise app's app id, and is titled **Call <enterprise app> from this app**. It lists every permission the app has on that enterprise app, each with the exact `getAccessToken` call described in [Call the API from the app](#call-the-api-from-the-app):

- a delegated permission, as the signed-in user: `getAccessToken({ scopes: ['<app id>/<value>'], as: req })`;
- an application permission, as the app itself: `getAccessToken({ scopes: ['<app id>/.default'] })`.

The skill also tells the agent to send the token as `Authorization: Bearer <token>`, and that `getAccessToken` throws `AccessTokenError` with `failure` `rejected` while a permission has no admin consent.

- Assigning more permissions of the same enterprise app rewrites the same skill with the whole list. An edit made to the skill's text in the app's guidance is replaced by the next assignment; topics added to it are kept.
- Removing the assignment deletes the skill.
- Assignments made before this version have no skill. Assign one of the permissions again, even one the app already has, and the skill is written.

The assignment succeeds even when the skill is not written, for example when the organization's guidance already has a skill with the same name, or the guidance cannot be read at that moment. Assign again to write it.

## Call the API from the app

The app's server code gets a token with `getAccessToken` from the platform runtime package `@fortytwoservices/ai-universe-galaxy-runtime`, and calls the API with it. The code stores no key or client secret. The platform gateway is not in this call: the app calls the API directly.

```ts
import { getAccessToken } from '@fortytwoservices/ai-universe-galaxy-runtime';

// As the app itself, with its application permissions.
const app = await getAccessToken({ scopes: ['https://graph.microsoft.com/.default'] });
const users = await fetch('https://graph.microsoft.com/v1.0/users', {
  headers: { authorization: `Bearer ${app.token}` },
});

// As the signed-in user, with delegated permissions, inside an Express handler.
const user = await getAccessToken({ scopes: ['https://graph.microsoft.com/User.Read'], as: req });
const me = await fetch('https://graph.microsoft.com/v1.0/me', {
  headers: { authorization: `Bearer ${user.token}` },
});
```

- Without `as`, the token is app-only and holds the app's application permissions.
- With `as: req`, the token is issued for the user signed in on `req` and holds the app's delegated permissions.
- The result holds `token` and `expiresOn`.

With `@microsoft/microsoft-graph-client`, pass the same call as its `authProvider`:

```ts
Client.init({
  authProvider: (done) =>
    getAccessToken({ scopes, as: req }).then((t) => done(null, t.token), (e) => done(e, null)),
});
```

When no token is issued, `getAccessToken` throws an `AccessTokenError`. Its `failure` says why:

| `failure` | Meaning |
|-|-|
| `no-app-registration` | The app has no Entra app registration configured. The platform configures one for every deployed app. |
| `not-signed-in` | `as` was given, but `req` carries no signed-in user. |
| `rejected` | Entra refused the token. The message holds Entra's error code. A permission that is assigned but **Not granted** gives this error. |
| `unavailable` | Entra did not answer, or answered with an error. Get the token again. |
