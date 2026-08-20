# CoreOrgUnit

A CoreOrgUnit is a part of the organisation: a company, a department, a school, a class. Org units nest through their `parent` reference to form the organizational tree, and [relationships](corerelationship.md) attach people to them.

## Default attributes

!!! tip "All [common attributes](common.md) are available as well"

| Type                     | Attribute                             | Description                                                        |
|--------------------------|---------------------------------------|--------------------------------------------------------------------|
| string                   | displayName                           | Name of the org unit                                               |
| string                   | type                                  | Classification, for example Company or Department                  |
| string                   | subType                               | Finer-grained classification within the type                       |
| string                   | email                                 | Contact email address for the unit                                 |
| string                   | legalIdentifier                       | Official registration identifier, such as an organisation number   |
| string                   | address                               | Street address                                                     |
| string                   | postalCode                            | Postal code                                                        |
| string                   | city                                  | City                                                               |
| string                   | externalId                            | Identifier of the unit in an external system                       |
| string                   | educationStatus                       | Education sector status of the unit                                |
| string                   | educationSchoolYear                   | The school year the unit applies to                                |
| string                   | educationLanguage                     | Primary language of instruction                                    |
| string                   | educationCourse                       | The course the unit teaches                                        |
| string                   | educationSourcedId                    | The unit's identifier in the student information system            |
| datetime                 | educationStartDate                    | When the unit starts, such as the beginning of a school year       |
| datetime                 | educationEndDate                      | When the unit ends                                                 |
| multi-valued string      | educationGrades                       | Grade levels covered by the unit                                   |
| multi-valued string      | educationSubjectCodes                 | Subject codes taught by the unit                                   |
| multi-valued string      | educationCodes                        | Other codes associated with the unit                               |
| reference to CoreOrgUnit | parent                                | The parent unit in the organizational tree                         |
| reference to Identity    | manager                               | The person who manages the unit                                    |
| reference to Identities  | deputies                              | People acting as deputy managers for the unit                      |

The `education*` attributes exist for schools and are usually only populated when the source is a student information system.

`educationStartDate` and `educationEndDate` are the only dates on an org unit, and they are ordinary attributes — nothing expires a class when its end date passes. To have a teaching group disappear at the end of the year, scope the sync rule that creates it, the same way [relationships](corerelationship.md#dates-and-validity) are handled. [`lastdatetime` and `nextdatetime`](../syncrule-expressions.md#lastdatetime) express an annual cycle without needing the dates edited each year.

## Building the tree

`parent` is what turns a flat list of units into a hierarchy. It is set with [`asreference`](../syncrule-expressions.md#asreference), pointing at the parent's own connector object:

```powershell
@{
    '$type'             = "reference"
    targetAttributeName = "parent"
    value               = @{
        '$type'             = "asreference"
        objectType          = "department"
        referencedAttribute = "id"
        input               = @{
            '$type'   = "attribute"
            attribute = "parent"
        }
    }
}
```

The top of the tree is simply a unit whose source record has no parent value — the reference resolves to nothing and the unit sits at the root.

You can inspect the resulting tree with `Show-IAMCoreOrgUnitStructure` from the [PowerShell module](../powershell-module.md), which is the quickest way to confirm that a hierarchy came out the way you expected.

## Managers and deputies

`manager` and `deputies` must resolve to [CoreIdentities](coreidentity.md), and they are what delegated administration builds on — a manager can see and act on the people below them in the tree. `deputies` is multi-valued, for units where more than one person shares that responsibility.
