# CoreRelationship

A CoreRelationship is a CoreIdentity's relationship to a CoreOrgUnit. An employment is an example of a relationship.

## Default attributes

!!! tip "All [common attributes](common.md) are available as well"

| Type                      | Attribute                             | Description                                                        |
|---------------------------|---------------------------------------|--------------------------------------------------------------------|
| string                    | title                                 |                                                                    |
| string                    | employeeId                            |                                                                    |
| string                    | type                                  |                                                                    |
| string                    | subType                               |                                                                    |
| datetime                  | startDate                             |                                                                    |
| datetime                  | endDate                               |                                                                    |
| reference to OrgUnit      | orgUnit                               |                                                                    |
| reference to CoreIdentity | identity                              | The identity that has the relationship to the CoreOrgUnit          |
| reference to CoreIdentity | manager                               | Not really used, but available                                     |

