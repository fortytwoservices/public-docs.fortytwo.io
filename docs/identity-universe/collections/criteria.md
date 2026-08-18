# Criteria reference

A [criteria collection](./index.md#criteria-collections) holds whoever matches its condition. This page documents how conditions are written.

A condition is a tree. Every node is either a **group**, which combines child nodes with an operator, or a **leaf**, which tests one attribute. The root must always be a group.

```json
{
  "groupOperator": "AND",
  "conditions": [
    {
      "id": "identityLastName",
      "field": "identityLastName",
      "operator": "Equals",
      "value": "Taylor"
    }
  ]
}
```

## Group nodes

| Property | Type | Description |
|-|-|-|
| `groupOperator` | string | How the children are combined. |
| `conditions` | array | The child nodes. May contain further groups. |

| `groupOperator` | Matches when |
|-|-|
| `AND` | Every child matches |
| `OR` | At least one child matches |
| `NOT` | No child matches |
| `XOR` | Exactly one child matches |

Groups nest freely, which is how you express "in this department, but not these two job titles":

```json
{
  "groupOperator": "AND",
  "conditions": [
    {
      "id": "relationshipType",
      "field": "relationshipType",
      "operator": "Equals",
      "value": "Employee"
    },
    {
      "groupOperator": "NOT",
      "conditions": [
        {
          "id": "relationshipTitle",
          "field": "relationshipTitle",
          "operator": "Contains",
          "value": "Consultant"
        }
      ]
    }
  ]
}
```

## Leaf nodes

| Property | Type | Description |
|-|-|-|
| `id` | string | The attribute being tested. Must exist in the tenant schema. |
| `field` | string | The expression evaluated. Usually the same as `id`, or a [helper function](#helper-functions) wrapping it. |
| `operator` | string | The comparison. |
| `value` | any | What to compare against. Omitted for `IsNull`. |

`id` and `field` are separate because `id` is what the attribute is called in the schema — used to look up its type — while `field` is the expression actually evaluated. They are identical unless you wrap the attribute in a helper function.

### Operators

| Operator | Notes |
|-|-|
| `Equals` | |
| `NotEquals` | |
| `Contains` | Also used for list attributes, to test membership |
| `NotContains` | |
| `StartsWith` | |
| `EndsWith` | |
| `In` | `value` is a list |
| `GreaterThan` | |
| `GreaterThanOrEqual` | |
| `LessThan` | |
| `LessThanOrEqual` | |
| `IsNull` | Needs no `value` |

Operator names are matched case insensitively, so `Equals` and `equals` both work.

`value` must parse as the attribute's declared type. A condition on a `Boolean` attribute with a `value` of `"yes"` is rejected with `Value yes is not a valid Boolean`.

### Helper functions

A `field` may wrap its attribute in one of these:

| Function | Description |
|-|-|
| `Substring(attribute, startIndex, length)` | Part of a string value |
| `ToUpper(attribute)` | Upper case |
| `ToLower(attribute)` | Lower case |
| `AddDays(attribute, days)` | Shift a date. Negative subtracts. |
| `Today()` | The current date |

Matching on a prefix of a value, where `id` stays the plain attribute name and only `field` changes:

```json
{
  "id": "identityDisplayName",
  "field": "Substring(identityDisplayName,0,4)",
  "operator": "Equals",
  "value": "John"
}
```

Shifting a date before comparing it, so that a membership persists for a grace period after the employment formally ends:

```json
{
  "id": "relationshipEndDate",
  "field": "AddDays(relationshipEndDate,30)",
  "operator": "GreaterThan",
  "value": "2026-08-01"
}
```

!!! note "Functions cannot be nested on date attributes"
    A date attribute rejects a `field` containing a function inside another function, with `Nested functions not allowed on DateTime field`.

## Which attributes can be filtered

The set of filterable attributes is **specific to your tenant**, so there is no fixed list. Ask the API what yours is:

```PowerShell
Get-CollectionTenantSchema
```

This returns one schema per object type — `userSchema`, `groupSchema`, `identitySchema`, `relationshipSchema` and `orgUnitSchema` — each a map of attribute name to type. An `id` that is not in the schema for the collection's object type is rejected with `Field {id} does not exist in schema`.

Attribute types are `String`, `Integer`, `Boolean`, `DateTime`, `Guid`, `List`, `ExternalList` and `Array`.

!!! tip "Core object types share one schema"
    For `Identity`, `Relationship` and `OrgUnit`, the identity, relationship and org unit attributes are merged into a single schema. That means a `Relationship` collection can filter on `identity*` and `orgUnit*` attributes as well as its own — which is how you express "employees in this part of the organisation".

The IAM Core attributes are prefixed by the object they come from, so the [CoreIdentity](../iam-core/objecttypes/coreidentity.md) attribute `firstName` appears as `identityFirstName`, and the [CoreRelationship](../iam-core/objecttypes/corerelationship.md) attribute `title` appears as `relationshipTitle`.

### Special attributes

Three attributes are computed rather than stored, and are the ones worth knowing about:

| Attribute | Use |
|-|-|
| `directMemberOfEntraGroups` | `Contains` with an Entra group object id — membership of that group |
| `assignedLicenses` | Licences assigned to the user |
| `memberOfCollection` | `Equals` with a collection id — membership of another collection |

`memberOfCollection` is what lets collections build on each other. Rather than repeating a complicated condition in several places, define it once and reference it:

```json
{
  "groupOperator": "AND",
  "conditions": [
    {
      "id": "memberOfCollection",
      "field": "memberOfCollection",
      "operator": "Equals",
      "value": "4fd301f8-0409-4856-bc3d-7f0102231f7a"
    },
    {
      "id": "relationshipOfficeLocation",
      "field": "relationshipOfficeLocation",
      "operator": "Equals",
      "value": "Bergen"
    }
  ]
}
```

Membership of an Entra group, which is a list attribute and therefore uses `Contains`:

```json
{
  "id": "directMemberOfEntraGroups",
  "field": "directMemberOfEntraGroups",
  "operator": "Contains",
  "value": "99b64c1d-5d6c-44a8-8bac-75fe796302ea"
}
```

## Previewing

Always check who a condition matches before saving it. The preview evaluates a condition without storing anything:

```PowerShell
$Collection | Test-CriteriaCollectionMember
```

It returns three lists — `preview` is everyone the condition matches, and `added` and `removed` are the difference against the collection's current members, so you can see exactly what an edit would change. Each entry has an `objectId` and a `displayName`.

## Membership is refreshed in the background

A criteria collection's members are recalculated asynchronously, not at the moment you save it. A newly created collection may report no members for a short while, and an edit takes effect on the next evaluation rather than immediately.

Use the preview when you want an immediate answer, and `Get-CollectionResult` when you want the materialized membership.

## Metadata limits

Both collection kinds accept `metadata` with `tags` and `attributes`, used for grouping and searching:

| Limit | Value |
|-|-|
| Tags | 20 |
| Tag length | 50 characters |
| Attribute entries | 20 |
| Attribute key length | 50 characters |
| Attribute value length | 200 characters |

Tags and attribute keys are lower-cased and trimmed when stored; attribute values keep their casing. Duplicates are rejected.
