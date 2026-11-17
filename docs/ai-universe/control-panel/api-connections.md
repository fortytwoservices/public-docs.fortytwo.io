---
description: Choose which APIs and apps the apps of your deployment may use, decide what each one opens, approve requests, and take access back.
icon: plug
sidebarTitle: API Connections
---

# API Connections

API Connections is where a platform admin decides what the apps of a deployment may reach beyond themselves. A connection is either an API registered in your Entra tenant, such as Microsoft Graph, or another app of this deployment. Apps never get anything from a connection by themselves: you open items on it, an app owner requests the ones their app needs on the app's [API Links](../apps/api-links.md), and the request is approved before the app can call anything.

:::note[In preview]
API Connections and API Links are in preview and still rolling out. They are switched off by default, and Fortytwo turns them on for your deployment. Until then, **App links** and **API permissions** under [Settings](settings.md) work as before.
:::

Open **Settings**, then **API Connections**. The page lists every connection, how many items are open on it, and how many apps use it.

## How access works

1. You add a connection. Nothing is open on it yet.
2. You open the items other apps may request: Entra permissions, or an app's tools and the scopes its owner offers.
3. An app owner requests some of those items on their app's API Links, and writes why the app needs them.
4. The request is approved. Requests for an Entra API wait for a platform admin under **Waiting for you**. Requests for another app wait for that app's owner.
5. The app calls the API through the platform's gateway, with the access it was given and nothing more.

## Add a connection

Choose **Add a connection**, then what to connect:

- **An API in Entra**: Microsoft Graph is suggested and added in one click. Any other API registered as an enterprise app in your Entra tenant can be found by name. The apps of this deployment are left out of this list, because they are added as apps.
- **An app of this deployment**: other apps can then request its tools, and the scopes and roles its owner offers. An app can be requested by other apps only once it is added here.

Each connection has a path name, the short name an app's code uses to call it. For an API in Entra you give the path name and the API's base address. For an app, the platform uses the app's own name, and adds a suffix such as `-app` when that name is taken. A path name is never reused, even after its connection is removed.

The platform publishes a route for the connection on the API gateway. If the gateway does not take the route, the connection is still saved and the page says so. A route that is still waiting is published again by the platform within about ten minutes.

## Choose what is open

Open a connection to see what it offers right now, read live from Entra or from the app, and which apps already hold any of it.

- **Permissions** of an Entra API are shown the way Entra's own permission picker shows them. Each permission has a **Delegated** box (called as the signed-in person) and an **Application** box (called as the app itself). Permissions that need admin consent in Entra are marked.
- **Tools** of an app can each be opened for calls as the person, as the app, or both. A tool that only the app's own admins may run cannot be opened to other apps. If the app runs an older version of the platform runtime, its tools can be opened only for calls as the app.
- **Scopes and roles** an app's owner has offered are listed with its permissions. Until the owner offers something, there is nothing of this kind to open.

When Entra or the app cannot be read, the page tells you why instead of showing an empty list.

Opening an item gives no app anything. Closing an item that apps already hold lists those apps first. When you confirm, the item is taken back from each of them straight away.

## Approve requests

**Waiting for you** at the top of API Connections lists the requests for Entra APIs. Each one names the app, the connection, every item requested, and the reason the app owner gave. You can approve all the items or fewer, or decline the request.

Requests for an app of this deployment are approved by that app's owner on the app's API Links, so they are not listed here.

## Add items to an app directly

**Add to an app** on a connection gives an app items that are open on it, without waiting for the app's owner to request them. The result is the same as approving a request, and the history records that you granted it.

## Consent in Entra

Approval adds the permissions to the app's own app registration in Entra. Some permissions also need an Entra administrator to consent:

- An application permission on an API the platform does not own waits for consent. After you approve, the platform shows the permissions still waiting and a **Grant consent in Entra** link to the right page in Entra.
- An application permission on an API the platform owns can be granted by the platform itself with **Grant now**.
- A delegated scope that one app of this deployment offers another needs no consent prompt. The platform authorizes it for the calling app when it is approved.

An app shows a permission as awaiting consent until Entra has it.

## Take access back

- **Close an item** on a connection: the apps that hold it are listed, and they lose it when you confirm.
- **Remove a connection**: no app can request it or call it through the gateway any more, and waiting requests on it are declined. If apps hold anything on it, they are listed first and lose it when you confirm. If something cannot be taken back, the connection is kept, so you can try again. A removed app connection can be added again later.

When an app loses access to another app's tools, the target app stops serving them within seconds. Access in Entra is taken down before the platform deletes its own records, so Entra never keeps access the platform no longer shows.

## When you upgrade

A deployment that already used App links or API permissions keeps working, and nobody has to approve anything again:

- Every app that other apps link to becomes an app connection, open for exactly the tools its links hold, and every App link stays live as an approved link.
- Every API registered for API permissions becomes a connection with everything still open, as before. The connection page says so. When you save your choice on it, only the items you ticked stay open.
