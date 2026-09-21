# Group Link

Group Link connects an Identity Universe collection to a Microsoft Entra ID group.

The collection represents the desired membership, while Group Link keeps the membership of the connected Entra ID group aligned with the collection.

This page describes the purpose of Group Link, the recommended design model, expected membership behavior, and the operational considerations that should be understood before enabling it.

For how a link behaves once it exists, and the endpoints that manage one, see the [Group Link](../group-link/index.md) section and [its API](../group-link/api.md).

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

## Existing Entra ID groups

Before connecting an existing Entra ID group, determine whether its current membership should be:

- replaced by collection-based desired membership;
- represented temporarily during migration; or
- preserved outside the scope of Group Link.

Do not enable membership enforcement against an existing group before understanding how its current members received access.

Existing membership may include:

- valid access that should be represented by criteria;
- approved exceptions;
- obsolete membership;
- nested groups or objects that require separate assessment;
- membership maintained by another automated process.

If existing membership must be preserved temporarily, import or represent it through a migration collection and include that collection in the final access collection.

Example:

```text
Migration - Finance reporting - Legacy membership

    -> Access - Finance reporting - User
        -> Group Link
            -> Entra ID group: Finance reporting - User
```

Remove the migration collection from the final access model after the members have been evaluated and moved to their intended long-term membership paths.

## Avoid competing membership authorities

Only one process should be authoritative for the membership managed through a Group Link.

Competing automation may repeatedly add or remove the same members and make the effective state difficult to understand.

Before enabling Group Link, identify any process that currently manages the target group, including:

- scripts;
- automation platforms;
- identity governance processes;
- dynamic group rules;
- application-specific provisioning;
- manual operational procedures.

Retire or clearly delimit conflicting membership processes before Group Link becomes authoritative.

Infrastructure-as-code tooling may still be used to create and configure collections and Group Links. It should not independently enforce a different membership state for the same target group.

## Group ownership and other group properties

Group Link should be treated as a membership relationship unless additional behavior is explicitly documented for the deployed version.

Do not assume that Group Link manages other properties of the Entra ID group, such as:

- group owners;
- group name;
- description;
- assigned licenses;
- application assignments;
- role assignments;
- expiration settings;
- access reviews;
- sensitivity labels;
- lifecycle policies.

Document how these properties are created and maintained separately from membership alignment.

## Group types and supported objects

Confirm that the intended Entra ID group type and member object types are supported before designing an access model around Group Link.

Do not assume support for every group configuration, including:

- groups synchronized from on-premises Active Directory;
- Microsoft 365 groups;
- mail-enabled groups;
- dynamic membership groups;
- role-assignable groups;
- groups containing nested groups;
- groups with non-user members.

The target group must also be writable by the identity and services responsible for membership alignment.

Record any environment-specific restrictions in the relevant implementation documentation or runbook.

## Access removal

Access removal should be driven by removal from the desired membership represented by the source collection.

Depending on the design, this may occur when:

- an identity no longer satisfies the collection criteria;
- authoritative source data changes;
- an approved membership ends or is revoked;
- an exception is removed;
- migration membership is cleaned up;
- the final access collection is reconfigured.

Validate removal at all relevant layers:

```text
Source collection
    -> Connected Entra ID group
        -> Target application or service
```

Removal from the Entra ID group does not necessarily prove that access has already been removed from the target system. The target system may use cached data, tokens, sessions, or a separate synchronization process.

## Pausing or removing a Group Link

Before pausing, replacing, or removing a Group Link, define what should happen to the current target-group membership.

Questions to answer include:

- Should existing members remain in the Entra ID group?
- Will another process become authoritative?
- Should the group be retired?
- Must effective application access be preserved during a transition?
- Is a rollback path required?

Do not assume that removing a link automatically removes, preserves, or transfers existing membership unless this behavior has been verified for the deployed version.

Treat changes to an active Group Link as access-control changes and manage them through the organization's normal change process.

## Validation before enabling Group Link

Before connecting a collection to a production group:

1. Confirm that the collection represents one clear access.
2. Preview and validate the expected collection membership.
3. Review both expected additions and expected removals.
4. Confirm that exceptions are represented explicitly.
5. Identify and assess existing membership in the target group.
6. Confirm that the intended group and member object types are supported.
7. Confirm that the target group can be managed by the service.
8. Identify and remove competing membership automation.
9. Confirm the business owner and technical owner.
10. Document the rollback or recovery approach.
11. Test the design with a non-production group where appropriate.
12. Validate effective access in the target application or service.

For large or business-critical groups, use a staged migration rather than replacing legacy membership without prior comparison.

## Operational validation

When investigating a membership issue, validate each layer separately.

### 1. Validate the source collection

Confirm that the identity is, or is not, a member of the source collection as intended.

If the collection membership is incorrect, inspect:

- the underlying source data;
- the criteria expression;
- referenced collections;
- joinable collection membership and approval state;
- inclusion or exclusion collections;
- migration membership.

### 2. Validate the Group Link

Confirm that the intended source collection is connected to the intended Entra ID group.

Check that the relationship is active and that the relevant identities and services have the required permissions.

### 3. Validate the Entra ID group

Confirm whether the identity is present in the connected Entra ID group.

If the collection is correct but the group is not aligned, investigate the Group Link processing and available service logs.

### 4. Validate the target application

If the Entra ID group is correct but effective access is not, investigate the application assignment, application provisioning, synchronization, token, session, or authorization behavior.

The issue may be outside Group Link when both the source collection and target-group membership are correct.

## Troubleshooting scenarios

### A member is missing from the Entra ID group

Check the following:

1. Is the identity a member of the source collection?
2. Does the final access collection include the expected component collection?
3. Is the correct collection connected to the correct Entra ID group?
4. Is the target group writable and supported?
5. Is membership alignment reporting an error?
6. Has the target application processed the group membership change?

### An unexpected member is added to the Entra ID group

Check the following:

1. Is the identity present in the source collection?
2. Is the identity included through another component collection?
3. Is the identity present in an exception or migration collection?
4. Does the criteria expression include a broader scope than intended?
5. Is another process also managing the group?

### A direct group change is reverted

This is expected when the direct change differs from the desired membership in the source collection.

Make the required change in the appropriate source collection or membership path instead of directly changing the Entra ID group.

### The Entra ID group is correct, but application access is not

Confirm that:

- the correct Entra ID group is assigned to the application or service;
- the application has processed the membership change;
- existing sessions or tokens do not preserve previous access;
- no application-specific role or provisioning rule is missing.

This scenario does not by itself indicate a Group Link failure.

## Monitoring and audit considerations

Operational monitoring should make it possible to determine:

- which collection is connected to which Entra ID group;
- whether membership alignment is succeeding;
- whether a membership difference remains unresolved;
- whether permissions or target-group restrictions prevent updates;
- when the relationship or its configuration changed.

The access design should also make it possible to explain why an identity is included in the final access collection.

For important access, retain traceability between:

```text
Business access
    -> Final access collection
        -> Membership path or approval
            -> Group Link
                -> Entra ID group
                    -> Application assignment
```

Monitoring requirements, alert handling, and recovery procedures belong in the operational runbook for the environment.

## Naming recommendations

Use names that make the relationship between the source collection and target group easy to identify.

Example:

```text
Collection: Access - Finance reporting - Reader
Group:      Finance reporting - Reader
```

Where naming standards differ between Identity Universe and Entra ID, record the relationship in the collection and group metadata or in the environment's access catalogue.

Avoid relying only on shortened internal identifiers that are not understandable to administrators or access owners.

## Common anti-patterns

### Directly maintaining linked group membership

Do not grant or revoke managed access by directly changing the connected Entra ID group.

Represent the intended change in the collection model.

### Multiple authorities for the same membership

Do not allow Group Link, scripts, automation platforms, and manual procedures to independently enforce different membership rules for the same group.

### Linking a component collection instead of the final access collection

Do not link only the organizational collection when the complete access also includes approved requests or exceptions.

Link the collection that represents the complete desired membership.

### Enabling Group Link without assessing existing members

Do not connect an existing production group before determining how its current membership should be represented.

Unrepresented legacy members may no longer match the desired state.

### One group for unrelated permissions

Do not use one Group Link and one target group for permissions that have different owners, approval rules, or lifecycle requirements.

Create separate access collections and target groups.

### Assuming Group Link manages the complete group lifecycle

Do not assume that membership alignment also creates, renames, owns, assigns, reviews, or deletes the target group unless those capabilities are explicitly documented.

## Implementation checklist

Before enabling Group Link, verify the following:

- [ ] The source collection represents one independently managed access.
- [ ] The source collection is the final consolidated access collection.
- [ ] The collection membership has been previewed and validated.
- [ ] Expected additions and removals have been reviewed.
- [ ] Existing target-group membership has been assessed.
- [ ] Exceptions and migration members are represented explicitly.
- [ ] The target group is the correct group.
- [ ] The target group and member object types are supported.
- [ ] The target group is writable by the service.
- [ ] Competing membership automation has been removed or delimited.
- [ ] The business owner is known.
- [ ] The technical owner is known.
- [ ] Group properties outside membership have a defined owner.
- [ ] The rollback or recovery approach is documented.
- [ ] Monitoring and support ownership are defined.
- [ ] Effective access has been tested in the target application or service.

## Related documentation

- [Group Link](../group-link/index.md) — how a link behaves
- [Group Link API](../group-link/api.md) — creating and managing a link
- [Collection design patterns](design-patterns.md)
- [Criteria collections](criteria.md)
- [Joinable collections](joinable.md)
- Collection naming and metadata
- Collection troubleshooting
- Collection automation and API usage
