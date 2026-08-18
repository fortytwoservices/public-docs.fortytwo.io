# Connector PowerShell Module

The module **Fortytwo.IAM.Core.Connector** is for building an [API based connector](./connectors/index.md#api-based-connector) in PowerShell. It wraps the [Connector API](./connector-api.md) and, more usefully, works out for you which objects need to be created, updated and deleted on each import.

## Installing the module

```PowerShell
Install-Module Fortytwo.IAM.Core.Connector -Scope CurrentUser
```

## Connect

A connector authenticates as an application, so create an access token profile for the app registration that the connector was created with, then connect using the connector's id:

```PowerShell
Add-EntraIDClientSecretAccessTokenProfile `
    -Name "MyConnector" `
    -TenantId "00000000-0000-0000-0000-000000000000" `
    -ClientId "<the app registration client id>" `
    -ClientSecret ($Secret | ConvertTo-SecureString -AsPlainText -Force) `
    -Scope "https://api.fortytwo.io/.default"

Connect-Connector -ConnectorId "<the connector id>" -AccessTokenProfile "MyConnector"
```

See [setting up](./connector-api.md#setting-up) for how the app registration and the connector are tied together.

## The sync session

The heart of the module is the sync session. Rather than issuing individual creates and deletes, you declare the complete set of objects the source system currently contains, and the module compares that against the connector space to work out what actually changed.

```PowerShell
# Begin an import
Start-ConnectorSyncSession

# Add every object the source system currently has
foreach ($Employee in Get-MyEmployees) {
    Build-ConnectorObject `
        -ExternalId $Employee.Id `
        -ObjectType "person" `
        -Data @{
            id     = $Employee.Id
            names  = @{
                firstname = $Employee.FirstName
                lastname  = $Employee.LastName
            }
            nin    = $Employee.NationalId
        } | Add-ConnectorSyncSessionObject
}

# Work out what changed, then apply it
$Operations = Get-ConnectorSyncSessionOperation
$Operations | Complete-ConnectorSyncSessionOperation
```

Because the session is a declaration of the full current state, objects that were in the connector space but were not added to the session are deleted. This is what makes deletions work — see [how full imports work](./connector-api.md#deleting-and-how-full-imports-work).

!!! warning "Add everything, or things get deleted"
    If the source system fails halfway through and you only add half the objects, the missing half will be deleted. Let the import fail loudly rather than completing a session with partial data. `Get-ConnectorSyncSessionOperation` refuses an empty session unless you pass `-AllowEmptySession`, which guards against the worst case.

To see what a session is about to do before applying it:

```PowerShell
Get-ConnectorSyncSessionOperationStatistics
```

## Cmdlets

| Cmdlet | Purpose |
|-|-|
| `Connect-Connector` | Connect as the connector's application. Takes `-ConnectorId` and `-AccessTokenProfile`. |
| `Get-ConnectorConfiguration` | The connector's own configuration, including any inputs configured on it. |
| `Get-ConnectorData` | Read the current contents of the connector space. |
| `Build-ConnectorObject` | Build one object from `-ExternalId`, `-ObjectType` and `-Data`. |
| `Start-ConnectorSyncSession` | Begin an import. |
| `Add-ConnectorSyncSessionObject` | Add an object to the session. Accepts pipeline input. |
| `Get-ConnectorSyncSessionOperation` | Compute the create, update and delete operations. |
| `Get-ConnectorSyncSessionOperationStatistics` | Summarise those operations without applying them. |
| `Complete-ConnectorSyncSessionOperation` | Apply the operations. |
| `Send-ConnectorFile` | Upload a `.zip` for connectors that take a file rather than an API push. |
| `Write-ConnectorVerbose`, `Write-ConnectorError` | Write to the connector's log, visible in the admin interface. |
| `Send-ConnectorLog` | Send a log entry to IAM Core. |
| `ConvertFrom-ConnectorXmlToPowerShellObject` | Helper for source systems that return XML. |

## After the import

Populating the connector space does not change any core objects on its own. Run a synchronization to have the [sync rules](./syncrules.md) evaluated — this is done with the [admin module](./powershell-module.md), not this one:

```PowerShell
New-IAMCoreSyncJob | Wait-IAMCoreSyncJob
```
