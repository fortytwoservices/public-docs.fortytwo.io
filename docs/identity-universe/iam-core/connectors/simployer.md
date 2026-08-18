# Simployer

A [first party connector](./index.md#first-party-connector) that imports people, employments and organizational data from Simployer.

!!! note "Not the same as Alexis HR"
    Simployer and [Alexis HR](./alexishr.md) are separate connectors with different configuration and different connector object types. This page covers Simployer, which authenticates with a client id and client secret.

## Configuration inputs

| Input | Kind | Required | Description |
|-|-|-|-|
| clientid | Configuration | Yes | The client ID issued by Simployer. |
| clientsecret | Secret | Yes | The matching client secret. |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

The client secret is a secret rather than an ordinary input, so it goes in `-Secrets`:

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "Simployer" `
    -TemplateId simployer `
    -Configuration @{
        clientid = "your-client-id"
    } `
    -Secrets @{
        clientsecret = "your-client-secret"
    }

Write-Host "Created with id $($Connector.id)"
```

A newly created connector stays in the state `Created` until the first party connector runtime picks it up, at which point it becomes `Provisioned`.

!!! tip "Check which templates your tenant has"
    Templates are enabled per tenant, so run `Get-IAMCoreConnectorTemplate` to confirm this one is available to you and to see the exact inputs it expects.

## Connector object types

| Object type | External id | Contents |
|-|-|-|
| person | `id` | People |
| personIdentityIdentifier | `id` | Identity numbers belonging to a person |
| personExtendedProperty | `id` | Additional properties held against a person |
| employment | `employmentId` | Employments |
| employee | `employeeId` | Employee records |
| organization | `id` | The organizational structure |
| tenantUser | `id` | User accounts in Simployer |

Person data is spread across several object types, which is worth knowing when writing [sync rules](../syncrules.md): the national identity number lives on `personIdentityIdentifier` rather than on `person`. Use [`findreferencingobjectforstring`](../syncrule-expressions.md#findreferencingobjectforstring) to reach it from the person, or [`followreferenceforstring`](../syncrule-expressions.md#followreferenceforstring) to go the other way.

To see the real shape of an object before writing rules against it:

```PowerShell
Find-IAMCoreConnectorDataObject -ConnectorId $Connector.id -ConnectorObjectType "person" |
    Select-Object -First 1
```

## Example sync rules

The usual mapping is:

- **person** → a [CoreIdentity](../objecttypes/coreidentity.md), provisioning enabled
- **organization** → a [CoreOrgUnit](../objecttypes/coreorgunit.md), provisioning enabled
- **employment** → a [CoreRelationship](../objecttypes/corerelationship.md), referencing the identity and the org unit

See [sync rules](../syncrules.md#managing-sync-rules-with-powershell) for complete worked examples of all three.
