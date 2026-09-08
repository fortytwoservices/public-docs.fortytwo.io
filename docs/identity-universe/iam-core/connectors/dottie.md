# Dottie

## Configuration inputs

| Input | Description | Example value |
|-|-|-|
| clientid | Client ID of the API token created by following the [Dottie API docs](https://github.com/meetdottie/dottie-api-docs) | NABfNzX |
| apikey | The key of the client created | N/A |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "Dottie" `
    -TemplateId dottie `
    -Configuration @{
        clientid = "your-client-id"
    } `
    -Secrets @{
        apikey = "your-client-secret"
    }
```

## Example sync rules

### Organizationunit to CoreOrgUnit

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type'   = "attribute"
            attribute = "name"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type' = "constant"
            value   = "organization"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "parent"
        value               = @{
            '$type'             = "asreference"
            objectType          = "organizationunit"
            referencedAttribute = "id"
            input               = @{
                '$type'   = "attribute"
                attribute = "parentId"
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
            objectType          = "employee"
            referencedAttribute = "id"
            input               = @{
                '$type'   = "attribute"
                attribute = "leaderId"
            }
        }
    }
)

New-IAMCoreSyncRule `
    -Name "Dottie - Organizationunit" `
    -ConnectorId $Connector.id `
    -ConnectorObjectType "organizationunit" `
    -CoreObjectType "OrgUnit" `
    -ProvisioningEnabled:$true `
    -Priority 102 `
    -InboundAttributeFlows $InboundAttributeFlows
```

### Employee to CoreIdentity

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "lastName"
        value               = @{
            '$type'   = "attribute"
            attribute = "lastName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "firstName"
        value               = @{
            '$type'   = "attribute"
            attribute = "firstName"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type' = "join"
            inputs  = @(
                @{
                    '$type'   = "attribute"
                    attribute = "firstName"
                },
                @{
                    '$type' = "constant"
                    value   = " "
                },
                @{
                    '$type'   = "attribute"
                    attribute = "lastName"
                }
            )
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "mobile"
        value               = @{
            "`$type"      = "regexreplace"
            "input"       = @{
                "`$type"    = "tostring"
                "input"     = @{
                    "`$type" = "selectindex"
                    "input"  = @{
                        "`$type"    = "multivaluedobjectattribute"
                        "attribute" = "phones"
                    }
                    "index"  = 0
                }
                "attribute" = "number"
            }
            "pattern"     = "\s"
            "replacement" = ""
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "anchor1"
        joinPriority        = 1
        value               = @{
            '$type'   = "attribute"
            attribute = "employeeNumber"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "nin"
        joinPriority        = 1
        value               = @{
            '$type'   = "attribute"
            attribute = "nationalIdNumber"
        }
    }
)

New-IAMCoreSyncRule `
    -Name "Dottie - Employee" `
    -ConnectorId $Connector.id `
    -ConnectorObjectType "employee" `
    -CoreObjectType "Identity" `
    -ProvisioningEnabled:$true `
    -Priority 500 `
    -InboundAttributeFlows $InboundAttributeFlows
```

### Employment to CoreRelationship

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "title"
        value               = @{
            '$type'   = "attribute"
            attribute = "employee/jobTitle/name"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type' = "constant"
            value   = "organization"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "subType"
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
                attribute = "dateStart"
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
                attribute = "dateEnd"
            }
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "orgUnit"
        value               = @{
            '$type'             = "asreference"
            objectType          = "organizationunit"
            input               = @{
                '$type'   = "attribute"
                attribute = "employee/organizationUnitId"
            }
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "employeeId"
        value               = @{
            '$type' = "attribute"
            attribute = "employee/employeeNumber"
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
            objectType          = "employee"
            input               = @{
                '$type'   = "attribute"
                attribute = "employeeId"
            }
        }
    }
)

<#
# Note that Joincope is set to the connector id, in order to 
# not have employments potentially join to other connectors:
#>

New-IAMCoreSyncRule `
    -Name "OFI - Dottie - Employments" `
    -ConnectorId $Connector.id `
    -JoinScope $Connector.id `
    -ConnectorObjectType "employment" `
    -CoreObjectType "Relationship" `
    -ProvisioningEnabled:$true `
    -Priority 502 `
    -InboundAttributeFlows $InboundAttributeFlows
```

## External documentation

- [Dottie API docs](https://github.com/meetdottie/dottie-api-docs)
- [Dottie API swagger](https://api.dottie.no/swagger/index.html)
