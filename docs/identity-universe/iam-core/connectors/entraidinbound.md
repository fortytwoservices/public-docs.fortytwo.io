# Entra ID Inbound

In order for users to be able to talk to the Fortytwo Universe, we need to identify them. This is done by matching the ```oid``` claim in the Entra ID access token, to a [CoreIdentity's](../objecttypes/coreidentity.md) attribute ```entraObjectId```. In order to populate this attribute, you can use this connector.

## Pre-reqs:

- An attribute with the [CoreIdentity's](../objecttypes/coreidentity.md) ```id``` attribute set, either through syncing from AD or directly in Entra ID (when doing cloud only provisioning). When provisioning in AD, we recommend using ```msDs-cloudExtensionAttribute19``` as this attribute.
- [Admin consent our read access app](https://login.microsoftonline.com/common/adminconsent?client_id=2fcb40bf-98fd-499c-b47f-935aaa071984)

## Steps

### Create connector in IAM Core

!!! note "No user interface available yet"

!!! note "Please follow the [Authenticating PowerShell](../authentication-powershell.md) documentation in order to have a working PowerShell connection"

Create a new connector using the below cmdlet:

```PowerShell
New-IAMCoreConnector -Name "Entra ID - Inbound" -TemplateId "entraidinbound"
```

This will cause the connector to be eventually provisioned, and users will be populated.

### Sync rule

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "id"
        joinPriority        = 1
        value               = @{
            '$type'   = "attribute"
            attribute = "extension_6bc257b4005f49359d9fdca3e38cbfdf_msDS_cloudExtensionAttribute19"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "entraUserPrincipalName"
        value               = @{
            '$type'   = "attribute"
            attribute = "userPrincipalName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "entraOnPremisesSamAccountName"
        value               = @{
            '$type'   = "attribute"
            attribute = "onPremisesSamAccountName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "entraOnPremisesDistinguishedName"
        value               = @{
            '$type'   = "attribute"
            attribute = "onPremisesDistinguishedName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "entraObjectId"
        value               = @{
            '$type'   = "externalid"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "email"
        value               = @{
            '$type'   = "attribute"
            attribute = "mail"
        }
    }
)

New-IAMCoreSyncRule `
    -Name "Entra ID - Inbound - User" `
    -ConnectorId "00000000-0000-0000-0000-000000000000" `
    -ConnectorObjectType "user" `
    -CoreObjectType "Identity" `
    -ProvisioningEnabled:$false `
    -Priority 11000 `
    -InboundAttributeFlows $InboundAttributeFlows
```