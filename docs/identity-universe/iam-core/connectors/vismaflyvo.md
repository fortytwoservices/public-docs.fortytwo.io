# Visma Flyktning og Voksenopplæring

This connector is a file upload based connector, which requires [setting up file upload](./fileupload.md).

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "FLYVO" `
    -TemplateId flyvo  `
    -Configuration @{
        clientid = "your-app-reg-clientid"
    }

Write-Host "Created with id $($Connector.id)"
```

## Example sync rules

### Student

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "nin"
        value               = @{
            '$type'   = "attribute"
            attribute = "sourcedid/id"
        }
        joinPriority        = 1
    }

    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type' = "join"
            inputs  = @(
                @{
                    '$type'   = "attribute"
                    attribute = "name/n/given"
                }

                @{
                    '$type' = "constant"
                    value   = " "
                }

                @{
                    '$type'   = "attribute"
                    attribute = "name/n/family"
                }
            )
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "firstName"
        value               = @{
            '$type'   = "attribute"
            attribute = "name/n/given"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "lastName"
        value               = @{
            '$type'   = "attribute"
            attribute = "name/n/family"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "mobile"
        value               = @{
            '$type'   = "attribute"
            attribute = "tel/#text"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "anchor1"
        value               = @{
            '$type'      = "join"
            inputs       = @(
                @{
                    '$type' = "constant"
                    value   = "PREFIX-SHOULD-BE-UPDATED-"
                }

                @{
                    '$type'   = "attribute"
                    attribute = "extension/InternalInformation/Id"
                }
            )
            joinPriority = 2
        }
    }
)

New-IAMCoreSyncRule `
    -ConnectorId $Connector.Id `
    -Name "$($Connector.Name) - student" `
    -JoinScope "student" `
    -InboundAttributeFlows $InboundAttributeFlows `
    -ProvisioningEnabled $true `
    -ScheduleEnabled:$true `
    -CoreObjectType Identity `
    -ConnectorObjectType student `
    -Priority 2100
```

### Teacher

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "nin"
        value               = @{
            '$type'   = "attribute"
            attribute = "sourcedid/id"
        }
        joinPriority        = 1
    }
)

New-IAMCoreSyncRule `
    -ConnectorId $Connector.Id `
    -Name "$($Connector.Name) - teacher" `
    -JoinScope "teacher" `
    -InboundAttributeFlows $InboundAttributeFlows `
    -ProvisioningEnabled $false `
    -ScheduleEnabled:$true `
    -CoreObjectType Identity `
    -ConnectorObjectType teacher `
    -Priority 2200
```

### Group


```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "anchor5"
        value               = @{
            '$type'   = "attribute"
            attribute = "sourcedid/id"
        }
        joinPriority        = 1
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type' = "constant"
            value   = "education"
        }
    }


    @{
        '$type'             = "string"
        targetAttributeName = "displayName"
        value               = @{
            '$type'   = "attribute"
            attribute = "description/short"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "parent"
        value               = @{
            '$type'             = "asreference"
            objectType          = "group"
            referencedAttribute = "sourcedid/id"
            input               = @{
                '$type'   = "attribute"
                attribute = 'relationship/sourcedid/id'
            }
        }
    }
)

New-IAMCoreSyncRule `
    -ConnectorId $Connector.Id `
    -Name "$($Connector.Name) - group" `
    -InboundAttributeFlows $InboundAttributeFlows `
    -ProvisioningEnabled $true `
    -ScheduleEnabled:$true `
    -CoreObjectType OrgUnit `
    -ConnectorObjectType group `
    -Priority 2300
```

### Student member

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "anchor5"
        value               = @{
            '$type'   = "externalid"
        }
        joinPriority        = 1
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type'   = "constant"
            value     = "student"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "title"
        value               = @{
            '$type'   = "constant"
            value     = "Elev"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "identity"
        value               = @{
            '$type'             = "asreference"
            objectType          = "student"
            referencedAttribute = "sourcedid/id"
            input               = @{
                '$type'   = "attribute"
                attribute = 'member/sourcedid/id'
            }
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "orgUnit"
        value               = @{
            '$type'             = "asreference"
            objectType          = "group"
            referencedAttribute = "sourcedid/id"
            input               = @{
                '$type'   = "attribute"
                attribute = 'sourcedid/id'
            }
        }
    }
)

New-IAMCoreSyncRule `
    -ConnectorId $Connector.Id `
    -Name "$($Connector.Name) - student membership" `
    -InboundAttributeFlows $InboundAttributeFlows `
    -ProvisioningEnabled $true `
    -JoinScope $Connector.Name `
    -ScheduleEnabled:$true `
    -CoreObjectType Relationship `
    -ConnectorObjectType membership `
    -Scope @{
        '$type' = "stringequals"
        left = @{
            '$type'   = "attribute"
            attribute = "member/role/roletype"
        }
        right = @{
            '$type' = "constant"
            value   = "01"
        }
    } `
    -Priority 2400
```

### Teacher member

```PowerShell
$InboundAttributeFlows = @(
    @{
        '$type'             = "string"
        targetAttributeName = "anchor5"
        value               = @{
            '$type'   = "externalid"
        }
        joinPriority        = 1
    }

    @{
        '$type'             = "string"
        targetAttributeName = "type"
        value               = @{
            '$type'   = "constant"
            value     = "teacher"
        }
    }

    @{
        '$type'             = "string"
        targetAttributeName = "title"
        value               = @{
            '$type'   = "constant"
            value     = "Lærer"
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "identity"
        value               = @{
            '$type'             = "asreference"
            objectType          = "teacher"
            referencedAttribute = "sourcedid/id"
            input               = @{
                '$type'   = "attribute"
                attribute = 'member/sourcedid/id'
            }
        }
    }

    @{
        '$type'             = "reference"
        targetAttributeName = "orgUnit"
        value               = @{
            '$type'             = "asreference"
            objectType          = "group"
            referencedAttribute = "sourcedid/id"
            input               = @{
                '$type'   = "attribute"
                attribute = 'sourcedid/id'
            }
        }
    }
)

New-IAMCoreSyncRule `
    -ConnectorId $Connector.Id `
    -Name "$($Connector.Name) - teacher membership" `
    -InboundAttributeFlows $InboundAttributeFlows `
    -ProvisioningEnabled $true `
    -JoinScope $Connector.Name `
    -ScheduleEnabled:$true `
    -CoreObjectType Relationship `
    -ConnectorObjectType membership `
    -Scope @{
        '$type' = "stringequals"
        left = @{
            '$type'   = "attribute"
            attribute = "member/role/roletype"
        }
        right = @{
            '$type' = "constant"
            value   = "02"
        }
    } `
    -Priority 2500
```