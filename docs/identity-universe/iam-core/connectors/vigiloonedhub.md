# Vigilo OnEdHub

A [first party connector](./index.md#first-party-connector) that imports schools, classes, pupils and teachers from Vigilo through the OnEdHub OneRoster API.

## Configuration inputs

| Input | Kind | Required | Description |
|-|-|-|-|
| clientid | Configuration | Yes | The client ID issued for the OnEdHub API. |
| clientsecret | Secret | Yes | The matching client secret. |
| orgid | Configuration | Yes | The organisation identifier the connector reads data for. |

!!! tip "Check which templates your tenant has"
    Templates are enabled per tenant, so run `Get-IAMCoreConnectorTemplate` to confirm this one is available to you and to see the exact inputs it expects.

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "Vigilo" `
    -TemplateId vigiloonedhub `
    -Configuration @{
        clientid = "your-client-id"
        orgid    = "your-org-id"
    } `
    -Secrets @{
        clientsecret = "your-client-secret"
    }

Write-Host "Created with id $($Connector.id)"
```

All three inputs are checked before the import starts, so a missing one fails immediately with a message naming it — for example `orgid is required.`

## Connector object types

| Object type | External id | Contents |
|-|-|-|
| org | `sourcedId` | The organisation |
| school | `sourcedId` | Schools |
| class | `sourcedId` | Classes, both homeroom and scheduled |
| course | `sourcedId` | Courses |
| student | `sourcedId` | Pupils |
| teacher | `sourcedId` | Teachers |
| studentmember | `studentmember-{school}-{class}-{student}` | A pupil's membership of a class |
| teachermember | `teachermember-{school}-{class}-{teacher}` | A teacher's membership of a class |

### Memberships

`studentmember` and `teachermember` are the join between a person and a class, and are what become [CoreRelationships](../objecttypes/corerelationship.md). Because a person can be in many classes, the external id combines the school, the class and the person.

Each membership carries:

| Attribute | Description |
|-|-|
| sourcedId | The pupil's or teacher's identifier |
| schoolSourcedId | The school |
| classSourcedId | The class |
| eduPersonEntitlement | Feide group entitlements for that membership |

### Feide entitlements

`eduPersonEntitlement` is a multi-valued attribute of Feide group URNs, built by the connector from the school's organisation number, the class, and the start and end dates of the class's terms. Homeroom and scheduled classes produce different URN forms, and scheduled classes produce one pair per subject code on the class.

Flow it into a `custom/` attribute with a `multivaluedstring` flow:

```powershell
@{
    '$type'             = "multivaluedstring"
    targetAttributeName = "custom/eduPersonEntitlement"
    value               = @{
        '$type'   = "attribute"
        attribute = "eduPersonEntitlement"
    }
}
```

Since the connector has already assembled the URNs, no rewriting is needed on the way in. If you do need to reshape them, [`multivalueregexreplace`](../syncrule-expressions.md#multivalueregexreplace) transforms each value in place.

## Example sync rules

The usual mapping is:

- **school** → a [CoreOrgUnit](../objecttypes/coreorgunit.md), with **org** as its parent
- **class** → a [CoreOrgUnit](../objecttypes/coreorgunit.md) whose `parent` is the school
- **student** and **teacher** → [CoreIdentities](../objecttypes/coreidentity.md)
- **studentmember** and **teachermember** → [CoreRelationships](../objecttypes/corerelationship.md), using `sourcedId` to reference the person and `classSourcedId` to reference the class

Only active classes are imported, so a class that is closed in Vigilo stops appearing and the memberships that pointed at it fall out of [scope](../syncrules.md#scope) on the next synchronization, removing the relationships. This is usually enough to keep the picture current without scoping on dates yourself — note that a class carries references to its academic terms rather than resolved start and end dates, so date-based scoping would mean resolving the term first.

See [sync rules](../syncrules.md#managing-sync-rules-with-powershell) for complete worked examples.
