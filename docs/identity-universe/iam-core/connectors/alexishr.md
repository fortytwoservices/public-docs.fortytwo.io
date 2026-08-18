# Alexis HR (Simployer)

A [first party connector](./index.md#first-party-connector) that imports people and organizational data from Alexis HR.

!!! note "Simployer is a separate connector"
    Alexis HR and Simployer are two different integrations with different configuration and different connector object types. This page covers the Alexis HR connector, which authenticates with a single access token. If you are integrating Simployer, ask Fortytwo which connector applies to your tenant.

## Configuration inputs

| Input | Kind | Required | Description |
|-|-|-|-|
| accesstoken | Secret | Yes | An Alexis HR API access token. Created in Alexis HR, and sent as a bearer token on every request. |

There is nothing else to configure — the API host is fixed, so no hostname, client id or client secret is needed.

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

Because the access token is a secret rather than an ordinary input, it goes in `-Secrets` and not `-Configuration`:

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "Alexis HR" `
    -TemplateId alexishr `
    -Secrets @{
        accesstoken = "<your Alexis HR access token>"
    }

Write-Host "Created with id $($Connector.id)"
```

A newly created connector sits in the state `Created` until the first party connector runtime picks it up, at which point it becomes `Provisioned`. Expect a short delay before the first import runs.

## Connector object types

Each import is a full export of the following resources. The external id of each object is the Alexis HR `id`.

| Object type | Contents |
|-|-|
| employee | People |
| employment | Employments held by people |
| employment-type | The employment type reference data |
| department | Departments |
| company | Companies |
| office | Offices |
| team | Teams |
| project | Projects |
| cost-center | Cost centres |
| organization | The organization itself |

To see what an individual object actually looks like before writing [sync rules](../syncrules.md) against it:

```PowerShell
Find-IAMCoreConnectorDataObject -ConnectorId $Connector.id -ConnectorObjectType "employee" |
    Select-Object -First 1
```

`Get-IAMCoreConnectorDataStatistics -Id $Connector.id` gives the object counts per type once an import has run.

## Example sync rules

The mapping you need depends on how your organisation uses Alexis HR, but the usual shape is:

- **employee** → a [CoreIdentity](../objecttypes/coreidentity.md), provisioning enabled
- **department** (or **company**) → a [CoreOrgUnit](../objecttypes/coreorgunit.md), provisioning enabled
- **employment** → a [CoreRelationship](../objecttypes/corerelationship.md), referencing the identity and the org unit

See [sync rules](../syncrules.md#managing-sync-rules-with-powershell) for complete worked examples of all three.
