---
description: Upgrade the platform to a new release from the control panel. It plans the upgrade, you approve it, and it runs inside your tenant.
icon: circle-arrow-up
---

# Upgrades

New releases of AI Universe are installed from the control panel, under **Settings**, **Platform version**. Nobody needs to reinstall anything, and no one outside your tenant is involved.

When a new version is out, the home page shows it under **Needs attention** with **Open Upgrade**.

![Settings, Platform version, with a new version available](/screenshots/ai-universe/settings-upgrade.webp)

The page shows the version you are running, the newer versions available, **What changed** in each, and the **Deployment state**.

## How an upgrade runs

::::steps
### Review the plan

Choose the version, then **Review plan**. The platform reads the release and shows what will change.

### Approve it

An administrator approves the plan. Nothing happens before that.

### It runs inside your tenant

1. **Check**: reads the release and the plan again.
2. **Import**: copies the release into your deployment's own registry.
3. **Infrastructure**: applies any changes to the Azure resources, with the running apps kept on the current version.
4. **Health**: the database, Key Vault, AI gateway and Foundry must all answer.
5. **Migrate**: updates the database. Migrations only add, never remove.
6. **Roll**: moves the control panel and the kernel to the new version.
7. **Verify**, then **observe**: checks the new version, and again a while later.
::::

Your apps keep running throughout.

## When an upgrade fails

If a step fails, including a check after the roll, the platform goes back to the version it ran before and keeps your data. The **Upgrade** page says whether that restore completed, and if it did not, what is needed.

There is no manual rollback to perform. Do not deploy an older version by hand: that skips the database and infrastructure checks an upgrade makes, and older versions are removed from the registry over time.

:::details[An upgrade that has stopped making progress]
An open upgrade holds the deploy job, so while it is open, later upgrades and changes to alerts, tags and network settings wait. A platform administrator can close a stuck upgrade from the **Upgrade** page, as failed. Closing asks for a reason and for the version typed out, and records who closed it and why.

Closing undoes nothing: whatever the upgrade already deployed stays deployed. The platform refuses to close it while a deploy or a database update is still running, or while it cannot tell whether one is.
:::

## Deployments from before general availability

Upgrades start from the first generally available release. A deployment installed before it cannot be upgraded from the control panel: the upgrade refuses before it changes anything. Uninstall it and [install](../get-started/install.md) the current release fresh.

## Apps and the platform libraries

Your apps use Fortytwo's libraries for sign-in, the AI gateway and their runtime. When a new version is out, Dependabot offers the update as a pull request in each app's repository, and the app's team merges it when it suits them.

:::tip
Read **What changed** before you approve. **Release notes** under Settings has the full history in plain language.
:::
