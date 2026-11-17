---
description: Let an app use Microsoft Graph, other Entra APIs and other apps, and let other apps use it, with every request approved first.
icon: link
sidebarTitle: API Links
---

# API Links

API Links shows what an app reaches beyond itself and which apps reach it. Here an app owner requests access to APIs and other apps, approves or declines other apps that want to use this one, and chooses what this app offers them.

:::note[In preview]
API Connections and API Links are in preview and still rolling out. They are switched off by default, and Fortytwo turns them on for your deployment. Until then, an app uses **App links** and **API permissions** as before.
:::

Open an app, choose the **Settings** tab, then **API Links**.

An app can only request what a platform admin has opened on [API Connections](../control-panel/api-connections.md). If the list is empty, nothing has been opened yet.

## What this app uses

Everything the app holds, by name: Entra permissions and other apps' tools, approved or still waiting. Each item says how it is called:

- **As the person**: the call carries the signed-in person, so it reaches only what that person may reach.
- **As the app**: the app calls on its own, for example from a scheduled job.

Open a row to see each item, how to call it from the app's code, and **Remove** to stop using it. When approved permissions still wait for an Entra admin to consent, the page shows how many and links to the page in Entra where consent is given.

## Use an API

::::steps
### Choose a connection

Pick Microsoft Graph, another Entra API or another app from the connections a platform admin has added.

### Choose the items

Tick the permissions or tools the app needs, each as the person or as the app. Only items that are open on the connection are offered.

### Say why

Write why the app needs them, in at most 500 characters. Whoever approves the request reads it.

### Wait for approval

A request for an Entra API is approved by a platform admin. A request for another app is approved by that app's owner. They can approve every item or fewer.
::::

A request gives nothing until it is approved. While it waits you can cancel it, and you can request again once it is closed.

## Apps that use this app

When a platform admin has added this app as a connection, other apps can request its tools and the scopes it offers. Their requests wait here for you, with the reason each owner gave. Approve or decline them.

Each app that uses this app is listed with what it holds. You can stop an app from using it, completely or for chosen items.

## What this app offers

An app offers its own HTTP endpoints to other apps through scopes its code checks. Each route that other apps may call is guarded in the code with `requireScope`:

```ts
router.get('/orders', requireScope('orders.read'), listOrders);
```

Once the app is deployed, every value the code checks is listed here. **Offer** writes it on the app's own registration in Entra, so it can be granted both to a signed-in person and to another app calling as itself. The code's single `requireScope('orders.read')` accepts both.

- **Who may use it**: limit an offer to people holding one of this app's roles. The app then checks the role on every call, and calls as another app are not allowed for that offer.
- **Remove**: the value is no longer issued in any token. If other apps hold it, they are listed first and lose it when you confirm. Values the code no longer checks are marked so you can remove them.

Offering a value does not open it. A platform admin opens it on this app's connection before other apps can request it.

If the page asks you to update the app's runtime, the app runs a version of the platform runtime that does not yet publish the scopes its code checks. Update the platform packages in the app's repository and deploy it.

## Call from the app's code

Calls go through the platform's gateway from the app's server code, using the platform runtime package `@fortytwoservices/ai-universe-galaxy-runtime`. The runtime signs in to Entra and adds the token, so the code holds no key of its own. **How to call** on each row shows the exact names to use.

Another app's tools, here for an app with the path name `master-data`:

```ts
import { callTool } from '@fortytwoservices/ai-universe-galaxy-runtime';

// as the app itself
const result = await callTool('master-data', 'find-customer', { name: 'Nordlys AS' });

// as the signed-in person, inside a request handler
const mine = await callTool('master-data', 'find-customer', { name: 'Nordlys AS' }, { as: req });
```

Microsoft Graph, other Entra APIs, and another app's HTTP endpoints, here for a connection with the path name `graph`:

```ts
import { callApi } from '@fortytwoservices/ai-universe-galaxy-runtime';

// as the app itself, with the application permissions it was granted
const asApp = await callApi('graph', '/v1.0/users?$top=5');

// as the signed-in person, with the delegated permissions it was granted
const asUser = await callApi('graph', '/v1.0/me', { as: req });
```

Paths start after the connection's base address, which the row shows. For another app, that address ends in `/api/linked`, where the app serves the routes it offers. Send no Authorization header yourself.

Limits: 600 calls a minute per app, and 30 seconds per call. A 401 or 403 from the API usually means a permission still waits for consent in Entra.

For an API in Entra, the platform also writes these instructions into [Wisdom](wisdom.md), so AI coding assistants working on the app know how to call it.

## Where access is checked

- **Tools**: the app that owns the tools checks every call against the approved link, for the person or for the app as approved. A caller that skips its own checks still reaches only what the link holds.
- **HTTP endpoints and Entra APIs**: Entra issues the token with only the scopes and roles that were granted, and the gateway passes it on. An app's routes under `/api/linked` accept only a token issued for that app.

When access is taken back, the target app stops serving the tools within seconds.
