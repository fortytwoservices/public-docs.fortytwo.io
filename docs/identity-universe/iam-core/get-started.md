# Get started

## Admin consent to Fortytwo Universe

https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408

Consent has to be granted by a Global Administrator, once per tenant. See [getting started](../getting-started/index.md) for what the consent screen looks like, and [IAM administrator](../getting-started/iam-admins/index.md) for the roles that have to be assigned afterwards.

## Setting up IAM Core

Getting from an empty tenant to useful data is four steps, in this order.

### 1. Add a connector

A [connector](./connectors/index.md) brings a source system into IAM Core. Start with whichever system is authoritative for people — usually HR.

```PowerShell
Install-Module Fortytwo.IAM.Core.Admin -Scope CurrentUser
Connect-IAMCore

Get-IAMCoreConnectorTemplate
```

If you just want something to look at, the [demo data connectors](./connectors/demodatahr.md) populate a fictional municipality and need no credentials.

### 2. Look at what arrived

Before writing any rules, see what the source actually produced. Sync rules are written against these exact attribute names, so this step saves a lot of guessing:

```PowerShell
Get-IAMCoreConnectorDataStatistics -Id $Connector.id

Find-IAMCoreConnectorDataObject -ConnectorId $Connector.id -ConnectorObjectType "person" |
    Select-Object -First 1
```

### 3. Write sync rules

[Sync rules](./syncrules.md) decide which connector objects matter and what they become. The usual order is org units first, then identities, then the relationships that tie them together.

Build them up one at a time and preview before committing:

```PowerShell
Get-IAMCoreConnectorDataObjectSyncPreview -ConnectorId $Connector.id -ConnectorObjectId $Object.id
```

### 4. Synchronize

```PowerShell
New-IAMCoreSyncJob | Wait-IAMCoreSyncJob
```

Then check the result:

```PowerShell
Get-IAMCoreIdentity | Select-Object -First 5
Get-IAMCoreOrgUnit | Show-IAMCoreOrgUnitStructure
```

## Adding a second source

Once one system is flowing, additional systems join onto what is already there rather than creating duplicates. The second connector's rules are usually [join only](./syncrules.md#provisioning) — they enrich existing identities instead of provisioning new ones — and [priority](./syncrules.md#priority-and-attribute-ownership) decides which system wins where both supply the same attribute.

## Where to go next

- [Connectors](./connectors/index.md) — the available source systems, and how to build your own
- [Sync rules](./syncrules.md) — scope, joining, and attribute flows
- [Core object types](./objecttypes/common.md) — what you can write to
- [PowerShell module](./powershell-module.md) — the full cmdlet reference
