# CoreIdentity

A CoreIdentity is a person: an employee, a student, a consultant, an agent. It holds what is true about the human being regardless of what they do — their name, their contact details, their accounts.

What a person *does* belongs on a [CoreRelationship](corerelationship.md) instead. Someone who holds two positions is one CoreIdentity with two relationships, not two identities.

## Default attributes

!!! tip "All [common attributes](common.md) are available as well"

| Type   | Attribute                           | Description                                                        |
|--------|-------------------------------------|--------------------------------------------------------------------|
| string | displayName                         | Display name                                                       |
| string | firstName                           | First name                                                         |
| string | lastName                            | Last name                                                          |
| string | mobile                              | Work mobile phone number                                           |
| string | privateMobile                       | Private mobile phone number                                        |
| string | email                               | Work email address                                                 |
| string | privateEmail                        | Private email address                                              |
| string | countryCode                         | Country the person is associated with                              |
| string | nin                                 | National identity number                                           |
| string | entraObjectId                       | The Entra Object ID, required for any user accessing the services  |
| string | entraUserPrincipalName              | The user principal name of the Entra ID account                    |
| string | entraOnPremisesSamAccountName       | The on-premises Active Directory sAMAccountName                    |
| string | entraOnPremisesDistinguishedName    | The on-premises Active Directory distinguished name                |
| boolean | entraOnPremisesSyncEnabled         | Whether the Entra ID account is synchronized from on-premises AD   |
| reference to CoreRelationship | primaryRelationship   | The person's main position, where they hold more than one          |

## Primary relationship

A person with several [relationships](corerelationship.md) — two part-time positions, or a job alongside an elected role — has no inherent "main" one. `primaryRelationship` is where you record which it is, so that downstream systems have a single answer for questions like which department to show or which manager to route an approval to.

It is set with a `reference` attribute flow, pointing at the connector object that becomes the relationship:

```powershell
@{
    '$type'             = "reference"
    targetAttributeName = "primaryRelationship"
    value               = @{
        '$type'             = "asreference"
        objectType          = "position"
        referencedAttribute = "id"
        input               = @{
            '$type'   = "attribute"
            attribute = "primaryPositionId"
        }
    }
}
```

This only works if the source system says which position is primary. Where it does not, leave the attribute unset rather than guessing.

CoreIdentity has no date or multi-valued attributes — those appear on [CoreRelationship](corerelationship.md) and [CoreOrgUnit](coreorgunit.md).

## The Entra attributes

The `entra*` attributes are not something an HR system provides. They are filled in by an [Entra ID connector](../connectors/entraidscim.md) that joins to an identity another connector already created.

`entraObjectId` matters most: it is the link between a signed-in session and the CoreIdentity, so a person cannot use most Identity Universe features until it is populated.

## Identifying a person

`nin` and the [anchors](common.md#anchors) are what [sync rules](../syncrules.md) normally join on, since they are stable identifiers that survive a change of name or position. A common pattern is to join on the source system's own id first and fall back to the national identity number, so that a person known to two HR systems still becomes one identity — see [join priority](../syncrules.md#join-priority).
