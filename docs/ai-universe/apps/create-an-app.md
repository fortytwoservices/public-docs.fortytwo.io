---
description: Pick a starter, name it, answer four compliance questions and name the person who oversees it. The platform sets up the repository, the cloud resources, sign-in and the AI in about a minute.
icon: circle-plus
---

# Create an app

An app is one AI solution for one purpose, such as an HR assistant or a contract reviewer. Each app gets its own repository, its own address, its own people and its own agent, and is kept apart from every other app.

:::note[Who can create apps]
Administrators can always create apps. Anyone else needs to be allowed under **Who can create apps** on the control panel's [People](../control-panel/people.md) page.
:::

## Open the dialog

Choose **Create an app** on the home page or on the **Apps** page.

![The Apps page in list view](/screenshots/ai-universe/apps-list.webp)

## Fill it in

The dialog has three steps: **Start from**, **Name it** and **Details**. **Next** and **Back** move between them, and a step opens only once the steps before it are filled in.

::::steps
### Start from

Pick what the app starts as. Search the starters, or narrow them with the categories above the cards. Choose a card to see what it includes.

| Starter | What you get |
|-|-|
| **Web app** | A signed-in web app that people use in their browser. It comes with the shared look, an AI helper wired to the platform and a small sample task list that shows how a feature is built, ready to replace with your own. |
| **Empty app** | No pages, only the platform connection with its coding guidance and shared knowledge, tests and a small landing page. Pick it when your team builds its own front end elsewhere or needs a service that runs in the background. |

The starter cannot change after the app is created, but everything in the app can. Until you choose **Create it**, **Change** at the top of the dialog takes you back to pick another one.

:::note[Apps that are a set of actions for other AI tools]
New apps can no longer be created as a set of actions for other AI tools. Apps created that way before keep working as they are.
:::

### Name it

**Name** becomes the app's address. The dialog shows it as you type, for example `https://meeting-notes.ai.yourcompany.com`. The address cannot be changed later, so choose the name with care. A name can be at most 120 characters.

**What should it do?** is one or two plain sentences. It is also what the app's agent starts out knowing about its job.

### Details

These four questions fill in the app's entry in your [AI system register](../governance/compliance.md). Each is required, but *Not assessed yet* is an allowed answer you can change later.

| Question | What you choose |
|-|-|
| **Data classification** | How sensitive the data it works with is. |
| **Personal data** | Whether it handles personal data, and what kind. |
| **Who uses it** | Your own staff, or people outside the organisation too. |
| **EU AI Act risk** | The risk category under the EU AI Act. |

**Human oversight** is the person accountable for what the app does. It starts as you, the creator, when your sign-in is in your organisation's directory. To pick someone else, type at least three characters of their name or email and choose them from the list, which shows up to ten matches. Leaving it empty is allowed. When a person is named, **How they review it** is an optional note, for example *checks a sample of conversations every week*. See [Human oversight](../governance/compliance.md#human-oversight).

**Cost group** is the department the app's AI spend is reported under.

Most apps can leave **Other options** as they are. Open it to choose:

| Option | Choices |
|-|-|
| **Stores data** | Whether the app gets its own database. |
| **Has an AI helper** | Whether the app gets an agent. |

### Create it

Choose **Create it**. The platform now builds the app and shows each phase as it goes: **Repository**, **Sign-in**, **Cloud resources** and **Guardrails**.

![The app being set up, a third of the way through](/screenshots/ai-universe/create-app-dialog-provisioning.webp)

It is ready in about a minute. You don't have to wait: **Leave it running** closes the window and setup carries on.
::::

## When it is ready

![The finished app](/screenshots/ai-universe/create-app-dialog-done.webp)

The app is running at its own address. Open it from the Apps page with **Manage** to set it up further.

| Next | Where |
|-|-|
| Decide what its agent may do and try it | [Agents](agents.md) |
| Give colleagues access | [People](people.md) |
| Change what the app does | [Build](build.md) |

## When setup does not finish

If a phase fails, the app shows *Its setup did not finish* and offers to finish it. Finishing picks up where it stopped and only builds what is missing. Nothing that already works is touched.
