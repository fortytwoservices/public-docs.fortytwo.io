# Organization

Organizations need to manage people who do not arrive through their HR system, such as external hires and contractors. Organization provides workflows to add and maintain these records, place them in the organizational structure, and manage their relationships. It is part of Identity Universe and works with IAM Core: Organization manages its source records, while IAM Core remains the shared data foundation used by the rest of the platform.

## The records

| Record | What it represents |
|-|-|
| **Source org unit** | An organizational unit, with its place in the hierarchy and optional manager, deputies and source data. |
| **Source person** | The source identity record used in organization workflows, optionally linked to a Core identity. |
| **Source relationship** | A source person's connection to an org unit, including its relationship type and start and end dates. A source person can have more than one relationship. |
| **Relationship type** | The rules for a kind of relationship: where it can be used, which identities and org units are in scope, who may act, what person fields are required, and how dates are validated. |

The distinction between an identity record and a relationship matters. One record may hold different positions in different parts of the organization; details and dates that belong to a position are recorded on each relationship, not on the identity record.

The API represents these records as `SourcePerson` and does not provide a separate identity type. Relationship types configure which person fields are required, while IAM Core connector and sync-rule configuration determines how the source data is mapped.

## How it fits with IAM Core

Organization sends its source org units, people and relationships to an IAM Core connector. The connector and its [sync rules](./sync/syncrules.md) determine how those records are matched and represented as Core objects. A record in Organization does not by itself define the final Core data; that is the job of the IAM Core configuration.

Relationship types use IAM Core collections to limit the identities and org units that can participate in a workflow. This lets the organization define its workflow rules while relying on the shared identity and organizational data in IAM Core.

## A typical workflow

1. An administrator configures the relationship types and their scope, permitted actors, required person fields and date rules. The corresponding identity and org-unit collections are configured in IAM Core.
2. An authorized user opens an org unit available to them and chooses one of its applicable relationship types.
3. The user searches for an identity in scope. If it is not already available as a source person, the user can create a source-person record, subject to the relationship type's validation rules.
4. The user creates a relationship between the source-person record and org unit, providing the required details and dates. The relationship type validates the information and the caller's permission is checked.
5. Tenant synchronization sends the source records to the configured IAM Core connector. IAM Core's sync rules then determine the resulting Core identities, relationships and org units.

Users can also view their own relationships and choose a primary relationship. Managers and deputies can access the org units they manage, subject to their assigned permissions.

## Access and personal data

Access depends on the caller's assigned permissions, the org-unit scope and the actors allowed by the relationship type. Being able to see an org unit does not automatically grant permission to perform every action in it.

In org-unit workflow responses, the national identity number (NIN) is not returned; a `ninIsSet` value indicates whether one is stored. Treat NIN as sensitive personal data and follow your organization's handling requirements.

## Working with Organization

Organization exposes the organization workflows through its public API. An internal API supports source-data integration and tenant synchronization. For the shared identity model and synchronization configuration, see [IAM Core](./index.md) and [sync rules](./sync/syncrules.md).