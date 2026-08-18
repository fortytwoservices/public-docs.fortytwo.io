# CoreRelationship

A CoreRelationship is a CoreIdentity's relationship to a CoreOrgUnit. An employment is an example of a relationship.

It carries everything that is true about a particular connection between a person and a part of the organisation rather than about the person themselves — the job title, the employee number, the dates it runs between. A person with two part-time positions has one [CoreIdentity](coreidentity.md) and two relationships.

## Default attributes

!!! tip "All [common attributes](common.md) are available as well"

| Type                      | Attribute                             | Description                                                        |
|---------------------------|---------------------------------------|--------------------------------------------------------------------|
| string                    | title                                 | Job or position title                                              |
| string                    | employeeId                            | Employee number for this engagement                                |
| string                    | type                                  | Classification, for example Employee or Consultant                 |
| string                    | subType                               | Finer-grained classification within the type                       |
| string                    | positionCode                          | Position or role code from the source system                       |
| string                    | officeLocation                        | Physical work location                                             |
| string                    | category                              | Additional categorisation of the relationship                      |
| multi-valued string       | costCenters                           | Cost centres the relationship is charged to                        |
| datetime                  | startDate                             | When the relationship starts                                       |
| datetime                  | endDate                               | When the relationship ends                                         |
| reference to CoreOrgUnit  | orgUnit                               | The org unit the relationship is placed in                         |
| reference to CoreIdentity | identity                              | The identity that has the relationship to the CoreOrgUnit          |
| reference to CoreIdentity | manager                               | Not really used, but available                                     |

## Dates and validity

`startDate` and `endDate` are ordinary attributes — nothing removes a relationship when its end date passes. If you want a relationship to stop existing once it has ended, express that in the [scope](../syncrules.md#scope) of the sync rule that creates it, using [`isdatetimebefore`](../syncrule-expressions.md#isdatetimebefore) or [`isdatetimeafter`](../syncrule-expressions.md#isdatetimeafter). When the object falls out of scope the relationship is removed.

That approach also makes a grace period easy: [`adddays`](../syncrule-expressions.md#adddays) with a positive number keeps the relationship alive for a while after it formally ends, which is often what you want so that access is not cut off the moment a contract expires.

## References

`identity` and `orgUnit` are what make a relationship useful, and both are set with [`asreference`](../syncrule-expressions.md#asreference) — you point at another connector object and IAM Core resolves it to whichever core object that object is joined to. `identity` and `manager` must resolve to a CoreIdentity, and `orgUnit` must resolve to a [CoreOrgUnit](coreorgunit.md).

A relationship depends on both the identity and the org unit existing, so if a reference comes out empty the usual cause is that the rule which should have created the target did not match — check that the referenced connector object is in scope of a rule of the right core object type.
