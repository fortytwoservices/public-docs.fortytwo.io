---
description: Add AI models to your platform, choose where inference is processed, set the primary model, and let an app use a new one. What each refusal from Azure means.
icon: cpu
---

# Models

Your platform starts with one model, so AI works from the first sign-in. This page is about adding more, and choosing which apps may use them.

Models are managed on the **AI** tab, under **Gateway settings** > **Models**. Turn on **Technical details** in the account menu to see it (see [First sign-in](../get-started/first-sign-in.md#the-account-menu)).

## Add a model

::::steps
### Pick a model

The list shows what your Azure subscription is offered in your region, under the inference scope in force, with the newest generally available version of each. A model Azure retires within a year is marked with the date.

Next to each model is the quota you have left for it in your region. **quota unknown** means the quota could not be read. That is not the same as no quota, and the deploy may still succeed.

### Set the capacity

Capacity is in thousands of tokens per minute. Leave it empty to take Azure's default for that model, shown in the box.

### Deploy

The model appears in the list when Azure confirms it.
::::

## Declare your organisation

Some model providers only allow a deployment once you have said who is deploying. Azure passes the declaration on to the provider. Enter it under **Your organisation**, on the same panel.

Only you can supply it, so the platform leaves it empty rather than guessing from your Azure region or resource names.

## Where inference is processed

**Where inference is processed**, on the same panel, chooses between:

- Azure processing a question in any region it serves the model from
- processing kept inside the data zone your Foundry account's region belongs to, such as the EU Data Boundary for a European region

Data at rest is stored the same way under both.

The choice covers the whole platform: one Foundry account serves every app, so every app moves together. Choosing a scope moves the deployed models onto it straight away and records the choice, so the next upgrade keeps it.

Fewer models are offered inside a data zone, and it has its own quota. Before you confirm, the panel names any deployed model that cannot move and any that has no quota left. If the model list could not be read at all, the panel says availability could not be checked. That does not mean the scope is unavailable.

## The primary model, and removing one

The **primary** model is the one used by an app or agent that does not name a model of its own. Changing it takes effect without a redeploy.

Removing a model does not delete it from Azure's catalogue, so it can be deployed again from the same list. Any app or agent still asking for it starts failing, so move them first.

## When Azure refuses a deploy

The panel keeps four answers apart:

| Message | What it means | What to do |
|-|-|-|
| **Not enough capacity in this region** | No room for that model in your region. | Deploy with less capacity, remove a model you no longer use, or raise the quota in the Azure portal under **Quotas** > **Azure AI Foundry**. |
| **The platform is not allowed to deploy models** | The platform may read your Foundry account but not change it. | Ask Fortytwo to grant the role. It cannot be fixed from this page. |
| **This model needs your organisation declared** | The provider wants the declaration above. | Fill in **Your organisation**, then deploy again. |
| **Azure rejected this deployment** | Any other refusal, shown in Azure's own words. | Read Azure's message. The platform does not guess which of the others it might be. |

## Let an app use a new model

Open the app, choose **Settings** and then **Model** (see [App settings](../apps/app-settings.md)).

- Choose the app's default model, or **Use the platform default** to follow the primary.
- Under **Other models this app may use**, add any further models the app may ask for. An app that asks for a model outside its list is refused.

An agent that names no model of its own uses its app's default.

There are no model aliases: the deployment name is the name an app or agent asks for.

:::note[Another provider]
To use a provider outside Microsoft Foundry's catalogue, add it as a **connection** in the Foundry project. The **Foundry project** card on the AI tab counts the connections, models, agents and tools the project holds.
:::
