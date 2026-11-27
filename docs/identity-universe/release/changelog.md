# Changelog

## 2026-11-26

- Source organizational unit attributes now supports displayName, in order not to only display the technical name of the attribute (which is limited to a-z, 0-9 and dash).
- The [organization connector](../organization/index.md) now populates the connector space with ```relationshipTypeName```, ```relationshipType``` and ```relationshipTypeEnabled```. This simplifies the [synchronization rules](../iam-core/sync/syncrules.md) required to populate the [CoreRelationship](../iam-core/objecttypes/corerelationship.md) object.

## 2026-11-20

- It is now possible to configure attributes for source organizational units, including the option to require certain attributes and to provide a regex value available.
- The education features now issue events for student internet policy, usable by the [events feature](../events/).
- The [CoreOrgUnit](../iam-core/objecttypes/coreorgunit.md) now has additional attributes available.
- The API now supports searching for [CoreIdentities](../iam-core/objecttypes/coreidentity.md) by their Entra ObjectID.

## 2026-11-17

- Fixes an issue where the new admin endpoint for creating source person always returned an error when core identity was provided, due to an error in the 'existing source person check'.
- The [CoreOrgUnit](../iam-core/objecttypes/coreorgunit.md) now has a multi valued costCenters attribute available.

## 2026-11-16

- New endpoints available for creating sourceperson and sourcerelationship as admin or app role.

## 2026-11-04

- Add title and displayName visibility and default value fields for relationship type, as well as an option to disallow creation of a new person.
- The [IAM Core](../iam-core/) now issues more events to the audit log, including sync rule changes
- The read model is now updated automatically when a full sync job is run, reducing the time between sync and collection membership changes from hours to minutes

## 2026-10-20

- Allow dash in relationship type names + remove question mark and exclamation.

## 2026-10-01

- The new role ```Education - Reader``` is now available.
- For the [CoreOrgUnit](../iam-core/objecttypes/coreorgunit.md) object, the externalId attribute can now be used for joining

## 2026-09-30

- A new way of expressing multi valued selection for [sync rule](../iam-core/sync/syncrules.md) is now available. A value can be selected using array indexing, such as ```prop[0]/employeeId```.

## 2026-08-18

- The [student internet policy feature](../education/internet-policy/) is now available.

## Start of change log

- We are now starting to track the changes in our system with a publicly available change log. This will allow customers to have visibility into changes we have made to our systems.