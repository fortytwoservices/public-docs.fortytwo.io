---
description: Assign permissions on Microsoft Graph and other Entra APIs to an app, see each permission's consent state, and call the API from the app's code.
icon: key-round
sidebarTitle: API assignments
---

# API assignments

An assignment gives one app permissions on one enterprise app in your Entra tenant. An enterprise app is any app in Entra that exposes an API, for example Microsoft Graph. A permission is a delegated scope or an application role of that enterprise app.

A platform admin assigns the permissions in the control panel. The platform writes them to the app's own app registration in Entra. A tenant admin gives consent in Entra. The app then calls the API directly, with a token for its own identity.

## Where to find it

Open an app, choose the **Settings** tab, then **API assignments**. The section is shown to platform admins only.

The section lists every enterprise app the app has permissions on, read from the required permissions of the app's registration in Entra. Each enterprise app shows its name, its app id, and a **Microsoft** badge when Microsoft publishes it. Each permission shows its display name, its value (such as `User.Read`), its kind and its consent state.

| Kind | What the app does with it |
|-|-|
| **Delegated** | Calls the API as the signed-in user. The API returns only what that user may reach. |
| **Application** | Calls the API as the app itself, with no user signed in, for example from a scheduled job. |

| Consent state | Meaning |
|-|-|
| **Granted** | Entra has consent for the permission. The app gets tokens that contain it. |
| **Not granted** | The permission is assigned, but Entra has no consent for it yet. |
| **Consent unknown** | The platform did not check consent, because the enterprise app was not read from Entra or no longer exposes the permission. |

When the platform cannot read the assignments from Entra, the section says why. The list is then unknown, not empty.

## Assign permissions

1. Choose **Add an assignment**.
2. Search the enterprise apps by the start of the display name, for example `Microsoft Graph`. The list shows only enterprise apps that expose at least one permission, each with its publisher and the number of delegated and application permissions.
3. Choose **Show permissions** on the enterprise app. Search the permissions by value or display name, for example `User.Read`. Permissions marked **Admin consent** need consent from a tenant admin before they work. **Open in Entra** opens the enterprise app in Entra.
4. Choose the permissions the app needs and assign them.

The platform adds the permissions to the required permissions of the app's registration in Entra, and then:

- For an application role, the platform also creates the app role assignment when the platform's own identity is an owner of the enterprise app. The permission is then **Granted** straight away.
- For an application role on an enterprise app the platform does not own, such as Microsoft Graph, the permission stays **Not granted** until a tenant admin gives consent.
- For a delegated scope, the permission stays **Not granted** until a tenant admin gives consent. The platform never consents to a delegated scope.

## Give consent in Entra

When at least one permission is **Not granted**, the section shows the **Grant consent in Entra** button and how many permissions are not granted. The button opens the API permissions page of the app's registration in Entra, where a tenant admin grants admin consent.

The control panel reads the consent state again each time the section is opened. A permission shows **Granted** once Entra has the consent.

## Remove an assignment

Removing an assignment takes every permission on that enterprise app away from the app:

- The platform deletes the app role assignments it can delete.
- The platform removes the enterprise app's scopes and roles from the required permissions of the app's registration.
- Consent the platform cannot delete stays in Entra: a delegated consent granted for the whole tenant, and an app role assignment on an enterprise app the platform does not own. The platform lists each one, with the Microsoft Graph PowerShell command a tenant admin runs to delete it.

After the removal, the section no longer lists the enterprise app, even while such consent is still in Entra. Run the listed commands to take the consent away completely.

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
