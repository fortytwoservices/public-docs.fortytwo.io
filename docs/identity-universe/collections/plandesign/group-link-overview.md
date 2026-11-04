# Group Link Overview

Group Link connects an Identity Universe collection to a Microsoft Entra ID group.

The collection represents the desired membership, while Group Link keeps the membership of the connected Entra ID group aligned with the collection.

This page describes the purpose of Group Link, the recommended design model, expected membership behavior, and the operational considerations that should be understood before enabling it.

For how a link behaves once it exists, and the endpoints that manage one, see the [Group Link](group-link-entraid.md) section and [its API](../api/grouplink-api.md).

## Conceptual model

A Group Link establishes a relationship between:

- one source collection in Identity Universe; and
- one target group in Microsoft Entra ID.

```text
Identity Universe collection
    -> Group Link
        -> Microsoft Entra ID group
```

The source collection is the membership source of truth.

The connected Entra ID group exposes the resulting membership to applications and services that use Entra ID groups for access control, licensing, role assignment, or other group-based configuration.

Group Link manages membership alignment. It does not change the business logic that determines membership in the source collection.

## Recommended design

Use a final access collection as the source for Group Link.

The final access collection may combine several membership paths, such as:

- organizational membership;
- attribute-based membership;
- approved request-based membership;
- explicitly managed exceptions;
- temporary migration membership.

Example:

```text
Employees - Finance
Requested access - Finance reporting
Exceptions - Finance reporting - Include

    -> Access - Finance reporting - User
        -> Group Link
            -> Entra ID group: Finance reporting - User
```

This creates a clear separation between:

1. the rules that determine who should have access;
2. the collection that represents the final desired membership; and
3. the Entra ID group used by the target application or service.

For more information about composing collections, see [Collection design patterns](design-patterns.md).

## Membership source of truth

When Group Link is used, the Identity Universe collection is authoritative for the membership managed through that link.

Conceptually:

```text
Desired membership
    = Members of the source collection

Target membership
    = Members of the connected Entra ID group
```

Group Link aligns the target membership with the desired membership.

Administrators should therefore make membership changes through the collections that contribute to the final access collection, rather than by directly changing the connected Entra ID group.

Depending on the access model, a membership change may be made by:

- correcting authoritative source data;
- changing criteria in a criteria collection;
- requesting or approving membership in a joinable collection;
- adding or removing an approved exception;
- adjusting temporary migration membership.

## Reconciliation of direct changes

A direct membership change in the connected Entra ID group does not change the desired membership defined by the source collection.

If a member is added directly to the Entra ID group without being a member of the source collection, membership alignment may remove that member again.

If a member represented by the source collection is removed directly from the Entra ID group, membership alignment may add that member again.

Therefore, do not treat direct membership changes in the connected Entra ID group as a supported method for granting or revoking access managed by Group Link.

If an identity requires exceptional access, represent the exception explicitly in the collection model.

Example:

```text
Access - Finance reporting - User
    contains Employees - Finance
    OR
    contains Requested access - Finance reporting
    OR
    contains Exceptions - Finance reporting - Include
```

This makes the effective access explainable and ensures that the exception remains part of the desired membership.

## Membership updates

Membership alignment is designed to respond to changes in the source collection and to reconcile differences between the source collection and the connected Entra ID group.

Do not design operational processes around an assumed exact propagation time unless a specific service-level expectation has been defined for the environment.

Systems that consume the Entra ID group may also have their own processing or synchronization delay after the group membership has changed.

When validating a change, distinguish between:

1. membership in the source collection;
2. membership in the connected Entra ID group; and
3. effective access in the target application or service.

These are separate validation points.

## One final access collection per independently managed access

Create a separate final access collection when an access level can be granted, changed, or removed independently.

For example:

```text
Access - Finance reporting - Reader
Access - Finance reporting - Contributor
Access - Finance reporting - Administrator
```

Each final access collection should normally connect to the Entra ID group that represents the corresponding access level:

```text
Access - Finance reporting - Reader
    -> Group Link
        -> Entra ID group: Finance reporting - Reader

Access - Finance reporting - Contributor
    -> Group Link
        -> Entra ID group: Finance reporting - Contributor

Access - Finance reporting - Administrator
    -> Group Link
        -> Entra ID group: Finance reporting - Administrator
```

This keeps the relationship between business access, collection membership, and Entra ID group membership explicit.

Avoid using one final collection for several unrelated permissions or target groups unless they are intentionally governed as one access package.

## Do not link every component collection

Component collections should normally feed into one final access collection.

Avoid connecting every organizational, request, exception, or migration collection directly to the same target access.

Prefer:

```text
Employees - Finance
Requested access - Finance reporting
Exceptions - Finance reporting - Include

    -> Access - Finance reporting - User
        -> Group Link
            -> Entra ID group: Finance reporting - User
```

Instead of:

```text
Employees - Finance
    -> Entra ID group: Finance reporting - User

Requested access - Finance reporting
    -> Entra ID group: Finance reporting - User

Exceptions - Finance reporting - Include
    -> Entra ID group: Finance reporting - User
```

A consolidated final access collection provides one place to evaluate the complete desired membership and reduces ambiguity about which membership path controls the target group.

## Criteria and joinable collections

Group Link can be used with a final collection whose membership is determined through criteria, referenced collections, or a combination of automatic and request-based membership paths.

### Criteria-based access

Use criteria collections when membership can be determined from reliable data in IAM Core.

Example:

```text
Employees - Finance
    -> Access - Finance reporting - User
        -> Group Link
            -> Entra ID group: Finance reporting - User
```

### Request-based access

Use a joinable collection when access depends on a request and approval.

Example:

```text
Requested access - Finance reporting
    -> Access - Finance reporting - User
        -> Group Link
            -> Entra ID group: Finance reporting - User
```

### Combined access

Combine automatic and approved access paths in the final access collection when both paths grant the same resulting access.

```text
Access - Finance reporting - User
    contains Employees - Finance
    OR
    contains Requested access - Finance reporting
```

The final access collection is then connected to the Entra ID group through Group Link.
