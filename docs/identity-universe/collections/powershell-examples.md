# PowerShell examples

The module **Fortytwo.IAM.Collections** is created for managing Identity Universe collections through PowerShell.

Before interacting with the Fortytwo Collections API proper tenant authorization and user authentication must be in place.

An EntraIDAccessTokenProfile must also be present. This can be in context of a user, a service principal or a computer.

## Examples on how to use the Fortytwo.IAM.Collections PowerShell Module

The module is listed as [**Fortytwo.IAM.Collections**](https://www.powershellgallery.com/packages/Fortytwo.IAM.Collections/) in the [Fortytwo section of PowerShell Gallery](https://www.powershellgallery.com/profiles/fortytwo)

## Installation

The Fortytwo PowerShell modules are frequently updated. By using the `Install-Module` cmdlet the PowerShell module will fetch the latest revision available in PSGallery.

```PowerShell
Install-Module Fortytwo.IAM.Collections -Scope CurrentUser
```

## Add EntraIDAccessTokenProfile

```PowerShell
Add-EntraIDInteractiveUserAccessTokenProfile -Name "Default" -TenantId "TENANTID" -ClientId "68bf2f1d-b9e1-4477-8b90-81314861f05f" -Scope "https://api.fortytwo.io/.default"
```

## Connect to the collections API

By default, the `Connect-Collection` cmdlet connects using interactive sign-in, which is useful for most situations.

```PowerShell
# Connect to the Fortytwo collections API
Connect-Collection -AccessTokenProfile "Default" -Verbose

# Get all collections, regardless of type
$collections = Get-Collection -Verbose

# Get GUIDs of members in a collection. See section "Use IAM Core for object lookup" for resolving memberIds
$collections | Where-Object name -like "*External*" | Select-Object -ExpandProperty id | Get-CollectionResult

<#
collectionId : 2ddb976e-3d7a-4f2f-bbca-8c6ca69a275a
name         : [User] External consultants
description  : External consultants that will be onboarded
objectType   : Identity
memberIds    : {d42a1f3f-4a1b-42e5-bb04-63536796ec70}
#>

# Get all criteria collections
$critCollections = Get-CriteriaCollection -Verbose

#Get all joinable collections
$joinableCollections = Get-joinableCollection -Verbose

# Use the collection *preview endpoint* to calculate members based on the criteria collection condition
$critCollections | Where-Object name -like "*Onboard*" | Test-CriteriaCollectionMember

# Create new collection is easiest to do based an existing collection
$joinableCollections | Where-Object name -like "*manager*" | ConvertTo-Json -Depth 10 | Set-Clipboard

<#
# RESULT
{
  "id": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "objectType": "Relationship",
  "name": "[License] E3 - Manual assignment (collection approval - manager approval)",
  "description": "All relationshipIds that require a E3 license",
  "joinPolicy": {
    "approvalRequired": true,
    "approverCollectionIds": [],
    "approvalGates": [
        {
        "order": 1,
        "type": "Collection",
        "approvers": [
          "1ee874ac-6c2c-4990-8fd6-e80fbc0b4e33",
          "7b296580-e4f0-4985-bf62-ec49d28ed2cb"
        ]
      },
      {
        "order": 2,
        "type": "Manager",
        "approvers": []
      }
    ],
    "joinableBy": {
      "collectionIds": [
        "4fd301f8-0409-4856-bc3d-7f0102231f7a"
      ]
    }
  },
  "createdBy": "1e2c82bc-aacb-4510-a5a4-a76fd5ba42c9",
  "createdAt": "2026-08-05T07:04:34.7777906+02:00",
  "updatedAt": "2026-08-08T07:00:51.8462339+02:00",
  "metadata": {
    "tags": [
      "license",
      "collectionapproved",
      "managerapproved"
    ],
    "attributes": {}
  }
}
#>

# NEW collection (updated name, description and tags, OPTIONAL to remove id, createdBy and dates)

$newJoinableCollection = '{
  "objectType": "Relationship",
  "name": "[License] E5 - Manual assignment (manager approval)",
  "description": "All relationshipIds that require a E5 license",
  "joinPolicy": {
    "approvalRequired": true,
    "approverCollectionIds": [],
    "approvalGates": [
      {
        "order": 1,
        "type": "Manager",
        "approvers": []
      }
    ],
    "joinableBy": {
      "collectionIds": [
        "4fd301f8-0409-4856-bc3d-7f0102231f7a"
      ]
    }
  },
  "metadata": {
    "tags": [
      "license",
      "managerapproved"
    ],
    "attributes": {}
  }
}'

# Create new collection by using the modified collection
New-JoinableCollection -Collection ($newJoinableCollection | ConvertFrom-Json -AsHashtable) -Verbose
```

## Use IAM Core for object lookup

See [Get IAM Core object](../iam-core/powershell-examples.md#get-iam-core-object) for how to perform memberId lookups (memberIds result from Get-CollectionResult).