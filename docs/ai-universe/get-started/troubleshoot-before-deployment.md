---
description: "Installer errors that stop an AI Universe install before it deploys any platform resources, and how to fix them."
sidebarTitle: Before the deployment
---

# Errors before the resource deployment starts

:::note
This guide assumes you are installing with the command provided by [marketplace.fortytwo.io](https://marketplace.fortytwo.io/). To continue after you fix an error, see [Resume the install](troubleshoot-install.md#resume-the-install).
:::

These stop the run before the installer deploys the platform's resources.

## The installer cannot confirm your Entra role

**Symptom.** You answer that you hold Global Administrator or Privileged Role Administrator, and the run stops with `Installing requires Global Administrator or Privileged Role Administrator. This run stopped before step 1 and changed nothing.` Under it, the installer says either `The directory-role lookup failed` or `Neither Global Administrator nor Privileged Role Administrator is among them`.

**Cause.** The installer reads your active Entra roles from Microsoft Graph before it creates anything, and stops rather than guess. The lookup fails when your Azure sign-in has expired, for example because Conditional Access limits how long a sign-in lasts. When the lookup works but neither role is listed, you do not hold the role, or you hold it through Privileged Identity Management (PIM) and it is not activated.

**What to do.** Sign in again. If the subscription is in another tenant, add `--tenant <tenant id>`.

```bash
az login
```

Then check your active roles. The list should contain Global Administrator or Privileged Role Administrator. If your role is eligible in PIM, activate it and check again.

```bash
az rest --method GET --url "https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.directoryRole" --query "value[].displayName"
```

The run changed nothing, so paste your install command again. If you do not hold either role, answer **Another person grants the Entra permissions (handoff mode)** instead, as described in [You are not an Entra administrator](#you-are-not-an-entra-administrator).

## You are not an Entra administrator

**Symptom.** You hold Owner on the subscription but neither Global Administrator nor Privileged Role Administrator in Entra ID.

**Cause.** The platform needs some Microsoft Graph permissions and admin consent that only those roles can grant.

**What to do.** Install in handoff mode. An interactive run asks `Do you hold Global Administrator or Privileged Role Administrator in this tenant, or will another person grant the Entra permissions?` Choose **Another person grants the Entra permissions (handoff mode)**.

In handoff mode:

- You install as subscription Owner. You must own the platform app registration, which the installer creates or adopts as `ai-universe-platform-<platform name>`.
- Every Entra grant the run cannot make is recorded as owed rather than stopping the install.
- At the end, the installer writes and prints `entra-admin-handoff.sh`. An Entra administrator runs it to finish.
- The control panel, Support and Wisdom work straight away. The home page shows **Entra admin action owed** with the same script under **Script for the Entra admin**. Creating apps stays off until the grants exist, and turns on by itself within about ten minutes after that. **Check again now** checks at once.

If your login cannot create app registrations at all, the run stops and prints the commands an Entra administrator (Application Administrator, Cloud Application Administrator or Global Administrator) runs to create the app and make you its owner. Then run your install command again with `--entra-app-id <application (client) id>` added to the end, using the ID it printed.

If you pass `--entra-app-id` for an app you do not own, the run stops before changing anything and prints the command an owner runs to add you:

```bash
az ad app owner add --id <application (client) id> --owner-object-id <your object id>
```

## Your Azure sign-in is about to expire

**Symptom.** The installer warns `Your Azure token expires in ~N min` or `Your Azure session looks stale`, or a step fails with `Azure session is not valid`.

**Cause.** The install runs for 20 to 45 minutes. The Azure CLI normally renews its token during a long run, but a session that is about to expire, or one that cannot renew, can break a step part-way.

**What to do.** Sign in again before you start, or before you resume. If the subscription is in another tenant, add `--tenant <tenant id>`.

```bash
az login
```

Then [resume the install](troubleshoot-install.md#resume-the-install).

## The preflight check fails

Before it deploys the platform, the installer checks that PostgreSQL and the AI model are available in the region and runs a dry run of the deployment. A failed check stops the run with `Preflight failed`.

What to do depends on the check. When the fix is in your subscription, fix it, then [resume the install](troubleshoot-install.md#resume-the-install). Nothing needs to be deleted. When the fix is another region, the region is recorded, so a resume cannot change it, even though the installer says no delete is needed. This requires an uninstall and a new install in a different region. See [Start again](troubleshoot-install.md#start-again).

| The check says | What to do |
|-|-|
| `this subscription is restricted from creating Postgres Flexible Servers in …` | Ask Azure for access to Azure Database for PostgreSQL Flexible Server in that region through an Azure support quota request. Otherwise, this requires an uninstall and a new install in a different region, such as Sweden Central. See [Start again](troubleshoot-install.md#start-again). |
| `could not list Postgres Flexible Server SKUs in …` | Check that you are signed in, that the subscription can use the region, and that the `Microsoft.DBforPostgreSQL` resource provider is registered. |
| `region … offers no Postgres server version to this subscription` | This requires an uninstall and a new install in a different region. See [Start again](troubleshoot-install.md#start-again). |
| `model … is not offered in this region`, `model … is in-region but not under SKU GlobalStandard`, or `… not GenerallyAvailable` | The model the platform deploys is not available in this region, and it cannot be changed. This requires an uninstall and a new install in a different region. See [Start again](troubleshoot-install.md#start-again). The other models the message lists cannot be used instead. |
| `what-if reported errors` | The dry run found a problem with the deployment. The errors are listed above the message. Fix them, then [resume the install](troubleshoot-install.md#resume-the-install). |

## The certificate authority is blocked

**Symptom.** The certificate step reports that the domain `publishes CAA records that do not authorize Let's Encrypt`.

**Cause.** A CAA record on your domain, or on the closest parent that has any, lists which certificate authorities may issue for it, and Let's Encrypt is not one of them.

**What to do.** Add the two records the message prints on the domain it names, then [resume the install](troubleshoot-install.md#resume-the-install):

```text
example.com   CAA   0 issue "letsencrypt.org"
example.com   CAA   0 issuewild "letsencrypt.org"
```
