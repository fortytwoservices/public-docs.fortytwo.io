---
description: "Installer errors that stop an AI Universe install while it deploys the platform's resources, and how to fix them."
sidebarTitle: During the deployment
---

# Errors during the resource deployment

:::note
This guide assumes you are installing with the command provided by [marketplace.fortytwo.io](https://marketplace.fortytwo.io/). To continue after you fix an error, see [Resume the install](troubleshoot-install.md#resume-the-install).
:::

These stop the run while the installer deploys the platform's resources, in the part of the output headed `Deploying infrastructure`.

## The Microsoft.Web provider is not registered

**Symptom.** The run stops with `SubnetSubscriptionMustBeRegisteredWithMicrosoftWeb`.

**Cause.** The API gateway needs the `Microsoft.Web` resource provider registered in the subscription. The installer tries to register it, and this means the attempt was rejected or has not taken effect yet.

**What to do.** Ask someone with Contributor or Owner on the subscription to run the command below, then [resume the install](troubleshoot-install.md#resume-the-install). Choosing another region does not help, because the registration is for the whole subscription.

```bash
az provider register -n Microsoft.Web --wait
```

## The database server cannot be created

**Symptom.** The PostgreSQL server fails with `RegionalAllocationFailed`, `SkuNotAvailable`, or `CapacityNotAvailable` after the installer's own retries.

**Cause.** Azure has no capacity for the server size in that region right now, or does not offer that size there. The default size is `Standard_B2s`. The region itself can still host the platform, and no server was created, so the install can be resumed in the same resource group and region.

**What to do.** [Resume the install](troubleshoot-install.md#resume-the-install) with a different server size: add `--postgres-sku Standard_D2s_v3` to the end of the resume command.

::::tabs
:::tab[macOS and Linux]
```bash
./fortytwo-setup -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
:::tab[Windows]
```powershell
./fortytwo-setup.exe -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
:::tab[Azure Cloud Shell]
```bash
./fortytwo-setup -g <resource group> --default-access open --postgres-sku Standard_D2s_v3
```
:::
::::

The server size is not recorded, so `--postgres-sku` applies to the run you pass it on. Pass it on every resume until the install completes. The same setting can come from the `FORTYTWO_POSTGRES_SKU` environment variable.

:::warning[Avoid the smallest size]
`Standard_B1ms` is accepted but leaves only 35 usable database connections. The platform can use them all up while it rolls out a new version. The installer warns when you choose it.
:::

## Role assignment is refused although you are Owner

**Symptom.** The infrastructure deploy fails with `AuthorizationFailed` on `Microsoft.Authorization/roleAssignments/write`, usually naming the `platformProvisioningRoles` deployment, even though you are Owner of the subscription.

**Cause.** Your Owner or User Access Administrator role assignment carries a condition that forbids assigning Owner, User Access Administrator or Role Based Access Control Administrator. This is Microsoft's pattern for constrained delegation. By default the installer assigns Role Based Access Control Administrator to the platform at subscription scope, so the condition blocks it.

The installer's first step already warns when it sees a condition on your role assignments, and prints a command that shows it:

```bash
az role assignment list --assignee "$(az ad signed-in-user show --query id -o tsv)" --include-inherited --query "[?condition!=null].{role:roleDefinitionName,condition:condition}"
```

**What to do.** [Resume the install](troubleshoot-install.md#resume-the-install) with `--custom-provisioning-role` added to the end of the resume command. The platform then gets a custom role instead of the built-in one, which such a condition normally allows. Creating that role definition needs `Microsoft.Authorization/roleDefinitions/write`, which Owner and User Access Administrator include, because the condition limits role assignments, not role definitions.

This does not help when the condition only allows a fixed list of roles: the installer says so in its warning. In that case, ask whoever owns the condition to widen it, or have someone whose role assignment has no condition run the install.

## The name is already taken

**Symptom.** The run stops with `This one CANNOT be resumed`, naming one of `CustomDomainInUse`, `NameAlreadyInUse`, `VaultAlreadyExists`, `StorageAccountAlreadyTaken`, `ServerNameAlreadyExists` or `ServiceAlreadyExists`.

**Cause.** Several Azure resources need a name that is unique across all of Azure, and the platform name you chose is already used by someone else. A deleted Key Vault keeps its name reserved while it is soft-deleted, and a PostgreSQL server name is never released.

**What to do.** A resume would send the same name and fail the same way. This requires an uninstall and a new install with a different platform name. See [Start again](troubleshoot-install.md#start-again).

## The region cannot host the platform

**Symptom.** The run stops with `LocationIsOfferRestricted`, `SkuNotAvailable`, or `Region '…' is out of capacity for … right now`.

**Cause.** The subscription is not entitled to that region, the region does not offer a service the platform needs, or Azure has no capacity there at the moment.

**What to do.**

- `LocationIsOfferRestricted` and `SkuNotAvailable` cannot be resumed, except `SkuNotAvailable` on the PostgreSQL server: see [The database server cannot be created](#the-database-server-cannot-be-created). This requires an uninstall and a new install in a different region, such as Sweden Central, which the installer suggests. See [Start again](troubleshoot-install.md#start-again).
- A capacity shortage is usually temporary. Wait, then [resume the install](troubleshoot-install.md#resume-the-install). If the region stays short, this requires an uninstall and a new install in a different region. See [Start again](troubleshoot-install.md#start-again).

The installer accepts these regions: `swedencentral`, `norwayeast`, `westeurope`, `northeurope`, `eastus`, `eastus2`, `westus2`, `southeastasia` and `australiaeast`. To test a region before you commit to it, add `--probe-region`. It runs a real check that takes about five minutes.
