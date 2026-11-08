---
description: Let one app use chosen tools in another app in your AI Universe, approved by the other app's admin, with no Entra portal and no keys.
icon: link
---

# App links

An **app link** lets one app use chosen tools in another app in your AI Universe. A master data app can, for example, let a sales app look up customers without giving it anything else.

App links are for apps **inside** your AI Universe. To call an API **outside** it, such as Microsoft Graph, use **API permissions** on the same settings page.

| | App links | API permissions |
|-|-|-|
| For | Another app in your AI Universe | An API outside it, such as Microsoft Graph |
| What is granted | Named tools of the other app, such as *List customers* | That API's own permissions, defined in Microsoft Entra |
| Who approves | The other app's admin, in the control panel | An Entra admin, who grants consent |

## What a tool is

A **tool** is one operation an app offers, such as *List customers* or *Get one customer*, written by the app's developers. Other apps reach an app only through its tools, and only through the ones its admin approved. A tool that only the app's own admins or developers may run can never be shared, and the control panel shows it as unavailable.

## Ask to use another app

::::steps
### Open App links
Open your app and choose **Settings** > **App links**.
### Choose the app
Choose **Use another app** and pick the app.
### Choose the tools
Tick the tools you need. Each tool shows what it does.
### Request
Choose **Request**.
::::

The request shows as **Waiting for approval** until the other app's admin answers. You can **Cancel** it while it waits.

## Approve or decline a request

::::steps
### Open App links
Open your app and choose **Settings** > **App links**.
### Review the request
Under **Apps that use this app**, each request shows the app and the tools it requested.
### Answer it
Choose **Approve** or **Decline**.
::::

Approving gives the other app exactly those tools. The platform sets up everything in Microsoft Entra for you.

## Remove a link

Either app's admin can choose **Remove** on a link. The other app loses access to the tools within a minute.

## For developers

Once a link is approved, server code calls the other app's tools with `callTool` from the platform's runtime library:

```ts
import { callTool } from '@fortytwoservices/ai-universe-galaxy-runtime';

const customers = await callTool('master-data', 'customers_list', { country: 'NO' }, { as: req });
```

- With `{ as: req }` the call is made for the person who is signed in. The other app runs the tool as that person, so they reach no more than they could in that app themselves.
- Without it, the call is made as your app, for example from a scheduled job.
- A call to an app or a tool the link does not include fails before anything is sent, and the error names what is missing.

The app being called needs no code for this: the platform checks every call against the link. The app's AI agent can use the same approved tools.
