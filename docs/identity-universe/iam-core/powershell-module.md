# PowerShell Module

The module **Fortytwo.IAM.Core.Admin** exists for the purposes of managing the IAM Core solution through PowerShell.

The module is listed as [**Fortytwo.IAM.Core.Admin**](https://www.powershellgallery.com/packages/Fortytwo.IAM.Core.Admin/) in the [Fortytwo section of PowerShell Gallery](https://www.powershellgallery.com/profiles/fortytwo).

!!! note "PowerShell 7 required"
    The module targets PowerShell 7.1 or later and does not run on Windows PowerShell 5.1. It depends on the [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken) module, which is installed alongside it.

## Installation

```PowerShell
Install-Module Fortytwo.IAM.Core.Admin -Scope CurrentUser
```

## Connect

By default, the ```Connect-IAMCore``` cmdlet connects using interactive sign-in, which is useful for most situations.

```PowerShell
Connect-IAMCore
```

If your account exists in more than one tenant, or you want to be explicit about which one you are administering, pass the tenant:

```PowerShell
Connect-IAMCore -TenantId "00000000-0000-0000-0000-000000000000"
```

For unattended use — a scheduled job, a pipeline — create an access token profile yourself with the [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken) module and hand it to `Connect-IAMCore`:

```PowerShell
Add-EntraIDClientSecretAccessTokenProfile `
    -Name "IAMCore" `
    -TenantId "00000000-0000-0000-0000-000000000000" `
    -ClientId "<your app registration>" `
    -ClientSecret ($Secret | ConvertTo-SecureString -AsPlainText -Force) `
    -Scope "https://api.fortytwo.io/.default"

Connect-IAMCore -AccessTokenProfile "IAMCore"
```

The `EntraIDAccessToken` module has a profile cmdlet per credential type — `Add-EntraIDClientCertificateAccessTokenProfile` for a certificate, `Add-EntraIDAzureVMMSIAccessTokenProfile` and `Add-EntraIDFunctionAppMSIAccessTokenProfile` for managed identities, `Add-EntraIDGitHubFederatedCredentialAccessTokenProfile` for GitHub Actions. Run `Get-Command -Module EntraIDAccessToken` for the full list.

The application or user behind the token needs the appropriate roles — see [authorization](./api.md#authorization). There is no tenant parameter on the individual cmdlets; which tenant you are working in comes from the token.

## Cmdlets

### Connectors

| Cmdlet | Purpose |
|-|-|
| `Get-IAMCoreConnectorTemplate` | List the available connector templates. |
| `New-IAMCoreConnector` | Create a connector from a template. |
| `Get-IAMCoreConnector` | List connectors, or get one by `-Id`. |
| `Set-IAMCoreConnector` | Update a connector's name or configuration. |
| `Remove-IAMCoreConnector` | Delete a connector. |
| `Get-IAMCoreConnectorDataStatistics` | Object counts in a connector's connector space, by `-Id`. |

### Connector data

| Cmdlet | Purpose |
|-|-|
| `Find-IAMCoreConnectorDataObject` | Search a connector space. Takes `-ConnectorId`, `-ConnectorObjectType` and an optional `-SearchValue`. |
| `Get-IAMCoreConnectorDataObjectSyncPreview` | Show what synchronizing one object would do, without writing anything. |
| `Start-IAMCoreConnectorDataObjectSync` | Synchronize a single object. |
| `Disconnect-IAMCoreConnectorDataObject` | Disconnect one connector object from the core object it is joined to. |

### Sync rules

| Cmdlet | Purpose |
|-|-|
| `Get-IAMCoreSyncRule` | List sync rules, or get one by `-Id`. |
| `New-IAMCoreSyncRule` | Create a sync rule. |
| `Set-IAMCoreSyncRule` | Update a sync rule. Only the parameters you supply change. |
| `Copy-IAMCoreSyncRule` | Duplicate a rule, optionally onto another connector. |
| `Remove-IAMCoreSyncRule` | Delete a sync rule. It must be disabled first. |
| `Test-IAMCoreSyncRuleExpression` | Evaluate an expression against a real connector object. |

See [sync rules](./syncrules.md#managing-sync-rules-with-powershell) for worked examples.

### Core objects

| Cmdlet | Purpose |
|-|-|
| `Get-IAMCoreIdentity` | List identities, or get one by `-Id`. |
| `Get-IAMCoreRelationship` | List relationships, or get one by `-Id`. |
| `Get-IAMCoreOrgUnit` | List org units, or get one by `-Id`. Add `-IncludeParents` to walk up the tree. |
| `Get-IAMCoreObject` | The same, with `-ObjectType` as `CoreIdentity`, `CoreRelationship` or `CoreOrgUnit`. |
| `Show-IAMCoreOrgUnitStructure` | Render the org unit hierarchy as a tree. |
| `Get-IAMCoreSchema` | The attribute schema of the core object types. |

All four `Get-` cmdlets accept `-IncludeConnectors` when fetching a single object, which adds the connector objects contributing to it — the quickest way to see where a value came from.

When listing, `-PageSize` defaults to 10000.

### Sync jobs

| Cmdlet | Purpose |
|-|-|
| `New-IAMCoreSyncJob` | Queue a job. `-JobType` is `FullSyncTenant` (default) or `ConnectorImport` with a `-ConnectorId`. |
| `Get-IAMCoreSyncJob` | List jobs, or get one by `-Id`. |
| `Wait-IAMCoreSyncJob` | Block until a job finishes. `-TimeoutMinutes` defaults to 30, `-Sleep` to 5 seconds. |

## Common patterns

Run a full synchronization and wait for it:

```PowerShell
New-IAMCoreSyncJob | Wait-IAMCoreSyncJob -TimeoutMinutes 10
```

Import from one connector, then synchronize:

```PowerShell
New-IAMCoreSyncJob -JobType ConnectorImport -ConnectorId $Connector.id | Wait-IAMCoreSyncJob
New-IAMCoreSyncJob | Wait-IAMCoreSyncJob
```

Find a person and see which connectors contribute to them:

```PowerShell
Get-IAMCoreIdentity |
    Where-Object { $_.displayName -eq "Ola Nordmann" } |
    Get-IAMCoreIdentity -IncludeConnectors
```

Inspect the organizational tree:

```PowerShell
Get-IAMCoreOrgUnit | Show-IAMCoreOrgUnitStructure
```

More examples are on the [PowerShell examples](./powershell-examples.md) page.
