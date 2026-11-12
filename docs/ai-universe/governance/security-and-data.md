---
description: Where your data lives, who can reach it, and how every AI call is governed. For security reviews and data protection officers.
icon: shield-check
---

# Security and data

AI Universe is built so that the questions you would ask in a security review have short answers.

## Where your data lives

Everything runs in **your own Azure subscription and Entra tenant**: the apps, their databases, the models, the logs and the platform itself. You choose the Azure region at install.

Fortytwo has no access to your deployment. The only connections to Fortytwo are the releases you pull when you upgrade, and the licence check.

## How it is reached

| Path | Protection |
|-|-|
| Browsers, to the control panel and apps | One Application Gateway with a web application firewall in prevention mode. Nothing else is reachable from the internet. |
| Sign-in | Your own Entra ID, with your Conditional Access policies. Each app has its own registration and only lets in the people given access to it. |
| AI and API calls | Through Azure API Management only. The platform's internal services accept calls from nothing else. |
| Optionally, by network | Install with restricted access to allow only your own IP ranges. |

## How every AI call is governed

- **One gateway.** Every model call from every app goes through the AI gateway. Apps hold no model keys, so they cannot bypass it.
- **Safety rules** on every question and reply. See [AI and models](../control-panel/ai.md#safety-rules).
- **Allowed tools only.** An agent can only use the tools switched on for it. See [Agents](../apps/agents.md).
- **One switch to stop it all.** See [Pause all AI](../control-panel/ai.md#pause-all-ai).
- **A record.** Usage is recorded for cost, and a fingerprint of every AI response is kept for compliance. See [Compliance](compliance.md).

## Secrets

Secrets are kept in Azure Key Vault and referenced from there. They are never stored in code, in the database or in build pipelines. Deployments from GitHub sign in to Azure without stored secrets.

## Least privilege

Each part of the platform runs with its own managed identity and only the permissions it needs. The identity that runs approved repairs, for example, can only read and start the platform's jobs.

## Permissions the platform holds

The platform runs as a managed identity in your subscription. These are the permissions it is given at install. Your Entra and Azure administrators can review each one before granting it.

### Microsoft Graph

Three application permissions, granted with admin consent:

| Permission | Why |
|-|-|
| `Application.ReadWrite.OwnedBy` | Creates and maintains an app registration for every app, and gives people and groups access to it. It can only change app registrations the platform owns, never other apps in your tenant. |
| `User.ReadBasic.All` | Shows names and email addresses when you choose who may use an app. Basic profile only. |
| `GroupMember.Read.All` | Lets you give access to an app through your existing Entra groups. |

The platform does not read mail, files, calendars, Teams or SharePoint. An app that needs one of those asks for it separately under [API permissions](../control-panel/settings.md), and an Entra administrator decides.

### Azure

| Role | Scope | Why |
|-|-|-|
| Contributor | The platform's resource group | Runs and upgrades the platform. |
| Contributor | Each app's resource group | Creates and updates the app's resources. The platform creates a resource group for every app and grants itself Contributor on it. |
| Role Based Access Control Administrator | The subscription | Gives each app's own identity the roles it needs. A condition limits it to those roles, so it cannot grant Owner or any other role. |

Because the platform can create resource groups and grant itself Contributor on them, its access amounts to Contributor on the whole subscription. Give it a [dedicated subscription](../get-started/before-you-install.md#checklist), and the boundary is that subscription: nothing else in your tenant is in reach.

People who create apps in the control panel get no Azure access at all. The platform builds every app from the same template, in the app's own resource group.
