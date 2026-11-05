---
description: Each app has its own list of people. Giving someone access to an app gives them that app and nothing else.
icon: users
---

# People in an app

Open an app and choose the **People** tab: *Give colleagues access to this app, and to nothing else.*

![The People tab of an app](/screenshots/ai-universe/app-people-tab.webp)

Access to an app and access to the control panel are separate. Giving someone access to one app does not let them into the control panel or into any other app.

## Give someone access

1. Under **Give someone access**, choose **A person** or **A group**.
2. Under **Who**, search your directory by name or email.
3. Choose **What they can do**.
4. Choose **Give access**.

| Role | Can |
|-|-|
| **Can use it** | Open the app and use it. Cannot change how it works. |
| **Can help build it** | Everything above, and change what the app does, in Studio or in a coding agent. |
| **Runs it** | Everything above, and this page: decide who else gets in, and remove the app. |

The access applies from their next sign-in. Your directory can take a moment to list them, so the control panel marks them *Just added* until it does.

:::tip[Prefer groups]
Give access to an Entra ID group rather than to one person at a time. When people join or leave the group, their access follows, with nothing to change here.
:::

## App roles

App roles are your app's own roles, such as an approver. A person can hold several of them on top of what they can do in the app. Your app's code checks the role's value, for example `requireGalaxyRole('app.approver')` from the galaxy runtime on the server, or the roles `useMe` reads in the client. A change applies from the person's next sign-in to the app.

An app role alone lets nobody in. Someone who holds app roles but has no access is listed with a reminder to give them access, or to take the app roles away.

### Add an app role

1. Under **App roles**, choose **Add an app role**.
2. Enter a **Name**, such as *Approver*, and optionally what it lets someone do.
3. Choose **Add role**.

The value your code checks is made from the name, for example `app.approver`, and cannot be changed later. To use another value, add a new role. The platform's own roles and values cannot be made here.

### Give someone an app role

Next to a person or group in the list, choose **Add an app role…** and pick the role. To take it away again, remove it next to their name. Removing someone's access also removes their app roles.

### Edit or delete an app role

Choose **Edit** to rename a role or change what it says it lets someone do. Its value stays the same.

Choose **Delete** to remove a role. It is taken away from everyone who holds it first. This cannot be undone.

## Guests

People from another organisation, invited as guests in your Entra ID, are marked **Guest** in the list.

## Remove access

Choose **Remove** next to a person or group. Anyone already signed in keeps access until their sign-in expires, so removal is not instant.
