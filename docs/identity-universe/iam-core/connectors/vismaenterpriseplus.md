# Visma Enterprise Plus

Visma has a very old fashioned approach to APIs, where they need to _install_ the API on a per customer basis, and the API is xml based. After getting the API installed, the below configuration inputs are privided by Visma:

## Configuration inputs

| Input | Description | Example value |
|-|-|-|
| clientid | Client ID for the customer | Kommune_Fortytwo |
| clientsecret | The key of the client created | N/A |
| fqdn | The hostname of the API | x-kommune.enterprise.visma.no |
| companyid | The company in Visma Enterprise that the connector will get data for. If you have multiple companies, add multiple connectors. | 1 |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Credential = Get-Credential -Message "Input Visma clientid and clientsecret"
$Connector = New-IAMCoreConnector `
    -Name "Visma - 1" `
    -TemplateId vismaenterpriseplus  `
    -Configuration @{
        clientid = "PlaceholderKommune_Fortytwo"
        fqdn = "test-kommune.enterprise.visma.no"
        companyid = "1"
    } `
    -Secrets @{
        clientsecret = "secret123"
    }

Write-Host "Created with id $($Connector.id)"
```

## Example sync rules

### Unit to CoreOrgUnit

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type'   = "attribute"
            attribute = "Name"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type' = "constant"
            value   = "company"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "subType"
        value               = @{
            '$type'   = "attribute"
            attribute = "UnitType"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "parent"
        value               = @{
            '$type'             = "asreference"
            objectType          = "unit"
            referencedAttribute = "Kode"
            input               = @{
                '$type'   = "attribute"
                attribute = "Parentid"
            }
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "anchor1"
        joinPriority        = 1
        value               = @{
            '$type'   = "externalid"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "manager"
        value               = @{
            '$type'             = "asreference"
            objectType          = "person"
            referencedAttribute = "PersonIdHrm"
            input               = @{
                '$type'   = "attribute"
                attribute = "Manager/Id"
            }
        }
    }
)

New-IAMCoreSyncRule `
    -Name "HR - Unit" `
    -ConnectorId $Connector.id `
    -ConnectorObjectType "unit" `
    -CoreObjectType "OrgUnit" `
    -ProvisioningEnabled:$true `
    -Priority 102 `
    -InboundAttributeFlows $InboundAttributeFlows
```

### Person to CoreIdentity

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "lastName"
        value               = @{
            '$type'   = "attribute"
            attribute = "FamilyName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "firstName"
        value               = @{
            '$type'   = "attribute"
            attribute = "GivenName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "mobile"
        value               = @{
            '$type'   = "attribute"
            attribute = "ContactInfo/Mobile"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type'   = "join"
            inputs = @(
                @{
                    '$type'   = "attribute"
                    attribute = "GivenName"
                },
                @{
                    '$type'   = "constant"
                    value     = " "
                },
                @{
                    '$type'   = "attribute"
                    attribute = "FamilyName"
                }
            )
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "nin"
        joinPriority        = 1
        value               = @{
            '$type'   = "attribute"
            attribute = "Ssn"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "privateMobile"
        value               = @{
            '$type'   = "attribute"
            attribute = "ContactInfo/PrivateMobilePhone"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "privateEmail"
        value               = @{
            '$type'   = "attribute"
            attribute = "ContactInfo/PrivateEmail"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "countryCode"
        value               = @{
            '$type'   = "attribute"
            attribute = "PostalAddress/CountryCode"
        }
    }
)

New-IAMCoreSyncRule `
    -Name "HR - Person" `
    -ConnectorId $Connector.id `
    -ConnectorObjectType "person" `
    -CoreObjectType "Identity" `
    -ProvisioningEnabled:$true `
    -Priority 100 `
    -InboundAttributeFlows $InboundAttributeFlows
```

### Position to CoreRelationship

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "title"
        value               = @{
            '$type'   = "attribute"
            attribute = "PositionInfo/PositionCode/Name"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type' = "constant"
            value   = "position"
        }
    }

    @{
        '$type'             = "datetime"
        targetAttributeName = "startDate"
        value               = @{
            '$type' = "todatetime"
            input   = @{
                '$type'   = "attribute"
                attribute = "PositionStartDate"
            }
        }
    }

    @{
        '$type'             = "datetime"
        targetAttributeName = "endDate"
        value               = @{
            '$type' = "todatetime"
            input   = @{
                '$type'   = "attribute"
                attribute = "PositionEndDate"
            }
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "orgUnit"
        value               = @{
            '$type'             = "asreference"
            objectType          = "unit"
            referencedAttribute = "Kode"
            input               = @{
                '$type'   = "attribute"
                attribute = "Chart/Unit/Id"
            }
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "anchor1"
        joinPriority        = 1
        value               = @{
            '$type' = "externalid"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "identity"
        value               = @{
            '$type'             = "asreference"
            objectType          = "person"
            referencedAttribute = "PersonIdHrm"
            input               = @{
                '$type'   = "attribute"
                attribute = "PersonIdHrm"
            }
        }
    }
)

New-IAMCoreSyncRule `
    -Name "HR - Position" `
    -ConnectorId $Connector.id `
    -ConnectorObjectType "position" `
    -CoreObjectType "Relationship" `
    -ProvisioningEnabled:$true `
    -Priority 101 `
    -InboundAttributeFlows $InboundAttributeFlows
```

## External documentation

- [API for Visma Enterprise](https://community.visma.com/t5/API-for-Visma-Enterprise/ct-p/NO_UN_API_Enterprise)