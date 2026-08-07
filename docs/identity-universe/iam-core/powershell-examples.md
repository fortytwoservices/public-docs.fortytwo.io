# PowerShell examples

The module **Fortytwo.IAM.Core.Admin** exists for managing the IAM Core data through PowerShell.

To install and connect see [PowerShell Module](./powershell-module.md). 

An EntraIDAccessTokenProfile must also be present. To attain a token credentials must be authenticated to create an active session.

The module is listed as [**Fortytwo.IAM.Core.Admin**](https://www.powershellgallery.com/packages/Fortytwo.IAM.Core.Admin/) in the [Fortytwo section of PowerShell Gallery](https://www.powershellgallery.com/profiles/fortytwo)

## Examples on how to use the Fortytwo.IAM.Core.Admin PowerShell Module

### Install module and load required PowerShell cmdlets

```PowerShell
Install-Module Fortytwo.IAM.Core.Admin -Scope CurrentUser
```

### Get IAM Core object

```PowerShell
# Get IAM Core identityId
Get-IAMCoreIdentity -Id "d42a1f3f-4a1b-42e5-bb04-63536796ec70" -IncludeConnectors

<#
displayName                      : 
firstName                        : 
lastName                         : 
mobile                           : 
privateMobile                    : 
email                            : 
privateEmail                     : 
countryCode                      : 
nin                              : 
entraObjectId                    : 
entraUserPrincipalName           : 
entraOnPremisesSamAccountName    : 
entraOnPremisesDistinguishedName : 
entraOnPremisesSyncEnabled       : 
id                               : d42a1f3f-4a1b-42e5-bb04-63536796ec70
joinScope                        : 
customStringAttributeValues      : 
anchor1                          : 
anchor2                          : 
anchor3                          : 
anchor4                          : 
anchor5                          : 
anchor6                          : 
anchor7                          : 
anchor8                          : 
anchor9                          : 
connectors                       : 
#>

# Get IAM Core relationshipId
Get-IAMCoreRelationship -Id "relationshipId" -IncludeConnectors

# Get IAM Core orgUnitId
Get-IAMCoreOrgUnit -Id "orgUnitId" -IncludeConnectors

```
