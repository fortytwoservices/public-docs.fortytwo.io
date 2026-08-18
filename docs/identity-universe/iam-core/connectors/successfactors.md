# SAP SuccessFactors

A [first party connector](./index.md#first-party-connector) that imports people, employments and foundation objects from SAP SuccessFactors over the OData API.

## Configuration inputs

| Input | Kind | Required | Description |
|-|-|-|-|
| baseurl | Configuration | Yes | The SuccessFactors API endpoint for your instance, for example `https://api4.successfactors.com/odata/v2`. |
| clientid | Configuration | Yes | The API key registered in SuccessFactors. |
| companyid | Configuration | Yes | The SuccessFactors company id. |
| authflow | Configuration | No | `Assertion` or `ClientCredentials`. Defaults to `Assertion`. |
| userid | Configuration | Only for `Assertion` | The SuccessFactors user the connector acts as. |
| privatekey | Secret | Only for `Assertion` | The X.509 private key used to sign the SAML assertion. |
| clientsecret | Secret | Only for `ClientCredentials` | The client secret. |

!!! tip "Check which templates your tenant has"
    Templates are enabled per tenant, so run `Get-IAMCoreConnectorTemplate` to confirm this one is available to you and to see the exact inputs it expects.

## Authentication

SuccessFactors supports two OAuth 2.0 flows, and which one you use decides which inputs are needed.

=== "Assertion (default)"

    The connector signs a SAML assertion with your private key and exchanges it for an access token. This is the default, and needs `userid` and the `privatekey` secret in addition to the common inputs.

    ```PowerShell
    $Connector = New-IAMCoreConnector `
        -Name "SuccessFactors" `
        -TemplateId successfactors `
        -Configuration @{
            baseurl   = "https://api4.successfactors.com/odata/v2"
            clientid  = "your-api-key"
            companyid = "your-company-id"
            authflow  = "Assertion"
            userid    = "the-api-user"
        } `
        -Secrets @{
            privatekey = "<X.509 private key>"
        }

    Write-Host "Created with id $($Connector.id)"
    ```

=== "Client credentials"

    A direct client credentials exchange, needing only the `clientsecret` secret.

    ```PowerShell
    $Connector = New-IAMCoreConnector `
        -Name "SuccessFactors" `
        -TemplateId successfactors `
        -Configuration @{
            baseurl   = "https://api4.successfactors.com/odata/v2"
            clientid  = "your-api-key"
            companyid = "your-company-id"
            authflow  = "ClientCredentials"
        } `
        -Secrets @{
            clientsecret = "your-client-secret"
        }

    Write-Host "Created with id $($Connector.id)"
    ```

If a required input for the chosen flow is missing, the import fails immediately with a message naming it — for example `userid is required when authflow is 'Assertion'.`

## Connector object types

The connector object types are the SuccessFactors entity names, so they keep their original casing.

| Object type | External id | Contents |
|-|-|-|
| User | `userId` | User accounts |
| PerPerson | `personIdExternal` | People |
| PerPersonal | `personIdExternal` | Personal details, as of the current date |
| EmpEmployment | `employmentId` | Employments |
| EmpJob | `userId`, `startDate` and `seqNumber` combined | Job assignments, filtered to the latest effective change |
| Position | `code` | Positions |
| FOCompany | `externalCode` | Companies |
| FOCostCenter | `externalCode` | Cost centres |
| FOLocation | `externalCode` | Locations, including the default address |
| FOJobFunction | `externalCode` | Job functions, including the parent function |

!!! note "EmpJob has a composite key"
    A job assignment is identified in SuccessFactors by three fields together, so its external id is `userId|startDate|seqNumber`. Join on it with an [anchor](../objecttypes/common.md#anchors) built from the same three values, or on `userId` alone if one relationship per person is enough.

Foundation objects are fetched as of the day the import runs, so future-dated changes appear on the day they take effect rather than in advance.

## Example sync rules

The usual mapping is:

- **PerPerson** → a [CoreIdentity](../objecttypes/coreidentity.md), provisioning enabled, enriched from **PerPersonal** and **User**
- **FOCompany** (or another foundation object matching your structure) → a [CoreOrgUnit](../objecttypes/coreorgunit.md)
- **EmpEmployment** or **EmpJob** → a [CoreRelationship](../objecttypes/corerelationship.md)

Because person data is split across `PerPerson`, `PerPersonal` and `User`, more than one rule usually writes to the same identity. Give each a distinct [priority](../syncrules.md#priority-and-attribute-ownership) so it is clear which one wins where they overlap.

See [sync rules](../syncrules.md#managing-sync-rules-with-powershell) for complete worked examples.
