# PowerShell Module

The module **Fortytwo.IAM.Collections** is created for managing Identity Universe collections through PowerShell.

The module is listed as [**Fortytwo.IAM.Collections**](https://www.powershellgallery.com/packages/Fortytwo.IAM.Collections/) in the [Fortytwo section of PowerShell Gallery](https://www.powershellgallery.com/profiles/fortytwo)

!!! note "PowerShell 7 required"
    The module targets PowerShell 7.1 or later and does not run on Windows PowerShell 5.1. It depends on the [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken) module, which is installed alongside it.

## Installation

```PowerShell
Install-Module Fortytwo.IAM.Collections -Scope CurrentUser
```

## Connect

By default, the `Connect-Collection` cmdlet connects using interactive sign-in, which is useful for most situations.

```PowerShell
Connect-Collection
```

If your account exists in more than one tenant, name the one you want:

```PowerShell
Connect-Collection -TenantId "00000000-0000-0000-0000-000000000000"
```

For unattended use, create an access token profile first and pass its name. See [authenticating PowerShell](./authentication-powershell.md) for the available credential types.

```PowerShell
Add-EntraIDClientSecretAccessTokenProfile `
    -Name "Collections" `
    -TenantId "00000000-0000-0000-0000-000000000000" `
    -ClientId "<your app registration>" `
    -ClientSecret ($Secret | ConvertTo-SecureString -AsPlainText -Force) `
    -Scope "https://api.fortytwo.io/.default"

Connect-Collection -AccessTokenProfile "Collections"
```

Which tenant you are working in comes from the token, so there is no tenant parameter on the individual cmdlets.

## Cmdlets

### Reading

| Cmdlet | Purpose |
|-|-|
| `Get-Collection` | All collections of both kinds, or one by `-Id`. |
| `Get-CriteriaCollection` | Criteria collections, or one by `-Id`. |
| `Get-JoinableCollection` | Joinable collections, or one by `-Id`. |
| `Get-CollectionResult` | The members of a collection, by `-Id`. Works for either kind. |
| `Get-CollectionTenantSchema` | The attributes available to filter on. |

### Criteria collections

| Cmdlet | Purpose |
|-|-|
| `New-CriteriaCollectionTemplate` | Build an empty collection hashtable locally. Makes no API call. |
| `Test-CriteriaCollectionMember` | Evaluate a condition without saving it. |
| `New-CriteriaCollection` | Create one from a hashtable. |
| `Set-CriteriaCollection` | Update one. |

### Joinable collections

| Cmdlet | Purpose |
|-|-|
| `New-JoinableCollectionTemplate` | Build an empty collection hashtable locally. Makes no API call. |
| `New-JoinableCollection` | Create one from a hashtable. |
| `Set-JoinableCollection` | Update one. |
| `Import-JoinableCollectionMemberBatch` | Add members directly, bypassing the request flow. |

!!! note "Approvals are not available in PowerShell"
    There are no cmdlets for submitting, approving or rejecting membership requests. Use the web interface, or [the API](./api.md#membership-requests) directly.

## Creating a criteria collection

Collections are ordinary PowerShell hashtables. The template cmdlet gives you the right shape with an empty `condition` for you to fill in.

```PowerShell
# See which attributes you can filter on
Get-CollectionTenantSchema

$Collection = New-CriteriaCollectionTemplate `
    -ObjectType Relationship `
    -Name "Employees in Bergen" `
    -Description "Everyone employed at the Bergen office" `
    -tags "location","employees"

$Collection.condition = @{
    groupOperator = "AND"
    conditions    = @(
        @{
            id       = "relationshipOfficeLocation"
            field    = "relationshipOfficeLocation"
            operator = "Equals"
            value    = "Bergen"
        }
        @{
            id       = "relationshipType"
            field    = "relationshipType"
            operator = "Equals"
            value    = "Employee"
        }
    )
}
```

Check who it matches before creating it:

```PowerShell
$Result = $Collection | Test-CriteriaCollectionMember
$Result.preview.Count
$Result.preview | Select-Object -First 10
```

Then create it:

```PowerShell
$Collection | New-CriteriaCollection -SkipCollectionMemberTest
```

!!! tip "Preview first, then skip the built-in check"
    `New-CriteriaCollection` runs its own member check and warns when it finds none. Since `Test-CriteriaCollectionMember` gives you a far better answer — the actual matches, not just a count — the practical pattern is to preview explicitly and pass `-SkipCollectionMemberTest` when creating.

The new collection's id is only written to the verbose stream, so add `-Verbose` if you need it, or fetch the collection afterwards.

See the [criteria reference](./criteria.md) for the full condition syntax.

## Editing a collection

Read it, change it, write it back. The id travels on the hashtable.

```PowerShell
$Collection = Get-CriteriaCollection | Where-Object name -eq "Employees in Bergen"

$Collection.description = "Employees at the Bergen office"
$Collection | Test-CriteriaCollectionMember     # confirm the effect first
$Collection | Set-CriteriaCollection
```

## Creating a joinable collection

```PowerShell
$Collection = New-JoinableCollectionTemplate `
    -ObjectType Relationship `
    -Name "[License] E5" `
    -Description "Relationships that require an E5 license" `
    -ApprovalRequired $true

$Collection.joinPolicy.approvalGates = @(
    @{ order = 1; type = "Manager"; approvers = @() }
)

$Collection.joinPolicy.joinableBy = @{
    collectionIds = @("4fd301f8-0409-4856-bc3d-7f0102231f7a")
}

$Collection.metadata.tags = @("license", "managerapproved")

$Collection | New-JoinableCollection
```

`-ApprovalRequired` takes a boolean rather than being a switch, so write `-ApprovalRequired $true`.

The template starts `joinableBy` as an empty hashtable, which means anyone may request. To scope it, set `collectionIds` as above. See the [joinable collections reference](./joinable.md) for gates and eligibility.

### Seeding members

To add people who already have the access the collection represents, without sending them through the approval flow:

```PowerShell
$Ids = @("d42a1f3f-4a1b-42e5-bb04-63536796ec70", "8c1e...")
Import-JoinableCollectionMemberBatch -Id $Collection.id -Members $Ids
```

These are **IAM Core identity ids**, not Entra object ids. Pass the array as an argument rather than piping it — piping sends one request per id.

## Reading members

```PowerShell
Get-Collection |
    Where-Object name -like "*Bergen*" |
    Select-Object -ExpandProperty id |
    Get-CollectionResult
```

```
collectionId : 2ddb976e-3d7a-4f2f-bbca-8c6ca69a275a
name         : Employees in Bergen
description  : Everyone employed at the Bergen office
objectType   : Relationship
memberIds    : {d42a1f3f-4a1b-42e5-bb04-63536796ec70}
```

Members come back as identifiers. To resolve them into people, see [getting an IAM Core object](../iam-core/powershell-examples.md#get-iam-core-object).

!!! note "Criteria membership is refreshed in the background"
    A criteria collection recalculates its members asynchronously, so a collection you have just created or edited may report nothing for a short while. `Test-CriteriaCollectionMember` answers immediately; `Get-CollectionResult` reflects the last evaluation.

More examples are on the [PowerShell examples](./powershell-examples.md) page.
