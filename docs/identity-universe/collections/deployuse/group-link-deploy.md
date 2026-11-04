# Group Link

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
