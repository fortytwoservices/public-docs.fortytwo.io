# Collection design patterns

Collections can be combined to model access based on organizational affiliation, identity attributes, manual approval, or a combination of these.

This guide describes recommended design patterns for creating collections that are reusable, understandable, and suitable for long-term administration.

## Before you start

Before creating a collection, define the business purpose of the collection:

- Which identities should become members?
- Is membership determined by source data, an approved request, or both?
- Will the collection be reused by other collections?
- Will the collection control access through an Entra ID group?
- Who is responsible for validating the membership logic?
- How should exceptions be handled?

A collection should represent a clear and explainable membership rule. Avoid combining unrelated purposes in the same collection.

## Prefer reusable collections

Create reusable collections for organizational units, identity categories, locations, or other commonly used membership conditions.

For example, instead of referring directly to an organizational unit in every application-specific collection, create a reusable collection that represents the organizational unit:

```text
Employees - Finance
```

The collection can then be referenced by several access collections:

```text
Access - Finance reporting
Access - Finance archive
Access - Budget application
```

This approach separates organizational membership from application-specific access rules.

### Benefits

- The organizational membership logic is defined in one place.
- Changes to the underlying criteria are inherited by collections that reference it.
- The same collection can be reused for several systems and access purposes.
- Membership rules are easier to review and explain.
- Application-specific collections remain focused on business access.

### When direct criteria may be sufficient

A separate reusable collection may not be necessary when:

- the criterion is used by only one collection;
- the membership rule is simple and unlikely to be reused;
- introducing another collection would make the model harder to understand;
- there is no independent business meaning associated with the criterion.

Do not create additional layers without a clear purpose. Reuse should improve maintainability rather than introduce unnecessary complexity.

## Pattern 1: Organizational membership

Use a criteria collection to represent identities associated with an organizational unit.

```text
Employees - Finance
```

Example membership logic:

```text
Include identities with an active relationship to the Finance organizational unit.
```

This collection should describe organizational affiliation only. It should not contain application-specific approval logic or manually maintained exceptions.

The collection can be reused as an input to one or more access collections.

### Appropriate uses

- Access granted to everyone in a department
- Access granted to everyone at a location
- Access granted to employees associated with a school
- Common licensing or notification scopes
- Reusable organizational scopes for several applications

### Design consideration

Determine whether membership should include only identities directly associated with the organizational unit or also identities associated with subordinate units.

Make this decision explicit in the collection name, description, or membership criteria.

## Pattern 2: Attribute-based membership

Use a criteria collection when membership can be determined from reliable identity or relationship attributes.

Examples include:

- employment type;
- position code;
- location;
- municipality;
- lifecycle state;
- identity category;
- other normalized attributes available in IAM Core.

Example:

```text
Employees - Permanent
```

Example membership logic:

```text
Include active employee relationships where employment type is permanent.
```

Attribute-based collections should use attributes with a defined source and understood data quality.

### Recommendations

- Prefer normalized IAM Core attributes over system-specific source attributes.
- Use attributes with stable meaning.
- Document any important assumptions about the source data.
- Test criteria against representative identities before using the collection for access.
- Avoid criteria that depend on free-text values unless the values are controlled.
- Avoid duplicating the same criteria across several collections.

Criteria collections continuously express who should be a member based on the available data. They should not be used to preserve historical membership after an identity no longer satisfies the criteria.

## Pattern 3: Request-based membership

Use a joinable collection when membership cannot be derived entirely from source data.

Typical examples include:

- access granted based on an individual business need;
- access requiring approval from a manager;
- access requiring approval from a system owner;
- temporary or exceptional access;
- membership that must be requested through self-service.

Example:

```text
Requested access - Finance reporting
```

The joinable collection should represent one understandable request and approval path.

The approval configuration should reflect who is accountable for granting the access. Depending on the use case, this may be:

- the identity's manager;
- a system owner;
- members of another collection;
- another configured approval mechanism.

### Recommendations

- Use a clear name that distinguishes requested access from automatic access.
- Describe who may request access.
- Describe who approves the request.
- State the business purpose of the requested membership.
- Avoid using manual membership as a substitute for missing or unreliable source data without documenting the exception.
- Review whether the requested access should be time-limited or periodically reviewed.

## Pattern 4: Combined automatic and requested access

An access collection can combine automatic membership with approved, request-based membership.

Example:

```text
Access - Finance reporting
```

The collection may include:

```text
Employees - Finance
Requested access - Finance reporting
```

Conceptually:

```text
Access - Finance reporting
    contains Employees - Finance
    OR
    contains Requested access - Finance reporting
```

This pattern supports two valid paths to the same access:

1. The identity receives access automatically because of organizational affiliation.
2. The identity receives access after an approved request.

The access collection becomes the consolidated representation of who should have the access.

### Benefits

- Automatic and approved access paths remain separately understandable.
- Approval logic is not mixed into organizational criteria.
- The final access membership can be evaluated in one place.
- Additional access paths can be introduced without rewriting the original criteria.

### Important consideration

The combined collection should represent the final desired membership. Avoid maintaining the same identities manually in several underlying collections.

## Pattern 5: System-owner-approved access

Use a dedicated joinable collection when a system owner must approve access.

Example:

```text
Requested access - Case management - System owner approval
```

This collection can be referenced by the final access collection:

```text
Access - Case management
```

Conceptually:

```text
Access - Case management
    contains Employees - Case management department
    OR
    contains Requested access - Case management - System owner approval
```

This separates the approval path from the resulting access.

If different access paths require different approvers, use separate joinable collections instead of placing several unrelated approval responsibilities in one collection.

## Pattern 6: Manager-controlled access

Use a joinable collection when a manager should be able to request access on behalf of an employee or approve an employee's request.

Example:

```text
Requested access - Project workspace - Manager approval
```

This pattern is appropriate when access depends on a work-related need that is understood and controlled by the employee's manager.

Manager-controlled access should not replace criteria-based membership when the access applies automatically to everyone with the same organizational affiliation or position.

## Pattern 7: Exceptions

Exceptions should be explicit and traceable.

Examples include:

- an identity requiring access without matching the normal criteria;
- an identity that must be excluded despite matching the normal criteria;
- temporary access during migration;
- access granted while source data is being corrected.

Where practical, represent exceptions using a dedicated collection instead of adding identity-specific conditions to a complex criteria expression.

Example:

```text
Exceptions - Finance reporting - Include
Exceptions - Finance reporting - Exclude
```

Conceptually:

```text
Access - Finance reporting
    contains Employees - Finance
    OR
    contains Exceptions - Finance reporting - Include
    AND NOT
    contains Exceptions - Finance reporting - Exclude
```

### Recommendations

- Give the exception collection a narrow and explicit purpose.
- Document who owns the exceptions.
- Document how exceptions are approved.
- Review exceptions regularly.
- Remove exceptions when the underlying reason no longer applies.
- Do not hide permanent business rules inside collections labelled as exceptions.

## Pattern 8: Migration from an existing group

During migration, a joinable collection can temporarily represent membership imported from an existing AD or Entra ID group.

Example:

```text
Migration - Finance reporting - Legacy membership
```

The final access collection may temporarily combine:

```text
Employees - Finance
Requested access - Finance reporting
Migration - Finance reporting - Legacy membership
```

This allows existing membership to be preserved while each member is evaluated against the new criteria and approval model.

Conceptually:

```text
Access - Finance reporting
    contains Employees - Finance
    OR
    contains Requested access - Finance reporting
    OR
    contains Migration - Finance reporting - Legacy membership
```

As the migration progresses, identities should be removed from the legacy collection when they are covered by the new model or no longer require access.

When the migration is complete:

1. Verify the membership of the final access collection.
2. Remove the reference to the legacy collection.
3. Remove or archive the legacy collection according to the organization's operational procedures.

The migration collection should not become an undocumented permanent source of access.

## Pattern 9: Final access collection

Create one final collection for each independently managed access.

Example:

```text
Access - Finance reporting - User
```

This collection may combine:

- one or more organizational collections;
- attribute-based collections;
- one or more joinable collections;
- explicitly managed exception collections;
- a temporary migration collection.

The final access collection should answer one question:

> Who should have this access?

It should not attempt to represent several unrelated roles or access levels.

If an application has different permissions, create separate final access collections:

```text
Access - Finance reporting - Reader
Access - Finance reporting - Contributor
Access - Finance reporting - Administrator
```

This provides a clear boundary between the different access levels.

## Pattern 10: Linking access to Entra ID

When the final access collection is ready, it can be associated with the corresponding Entra ID group through Group Link.

```text
Access - Finance reporting - User
    -> Group Link
        -> Entra ID group: Finance reporting - User
```

The collection represents the desired membership. The linked Entra ID group represents that membership in Entra ID and can be used by the target application or service.

Use the final access collection as the source for Group Link. Do not link every underlying organizational, request, or exception collection to the same target group.

This preserves a clear relationship:

```text
Membership inputs
    -> Final access collection
        -> Group Link
            -> Entra ID group
                -> Application or service
```

For more information, see group-link.md.

## Complete example

The following example grants access to a case management application.

Employees in the relevant organizational unit receive access automatically. Other employees may request access, subject to system-owner approval. Explicit exceptions are maintained separately.

```text
Employees - Case management department
Requested access - Case management - System owner approval
Exceptions - Case management - Include
Exceptions - Case management - Exclude
```

These collections are combined in the final access collection:

```text
Access - Case management - User
```

Conceptually:

```text
Access - Case management - User
    contains Employees - Case management department
    OR
    contains Requested access - Case management - System owner approval
    OR
    contains Exceptions - Case management - Include
    AND NOT
    contains Exceptions - Case management - Exclude
```

The final collection is linked to an Entra ID group:

```text
Access - Case management - User
    -> Group Link
        -> Entra ID group: Case management - User
```

The Entra ID group can then be assigned to the target application.

## Recommended collection structure

A scalable collection model normally separates the following concerns:

```text
Organizational collections
    Reusable collections representing organizational affiliation

Attribute-based collections
    Reusable collections representing normalized identity properties

Joinable collections
    Request and approval paths

Exception collections
    Explicit inclusions and exclusions

Migration collections
    Temporary preservation of legacy membership

Final access collections
    Consolidated desired membership for a specific access

Group Link
    Connection between the final access collection and an Entra ID group
```

Not every access requires every collection type. Use only the building blocks that have a clear purpose.

## Designing understandable criteria

Criteria should be understandable to someone other than the original author.

Prefer several reusable collections with clear responsibilities over one large expression containing unrelated business rules.

For example, prefer:

```text
Access - Application X
    contains Employees - Finance
    OR
    contains Employees - Procurement
    OR
    contains Requested access - Application X
```

Instead of repeating the full organizational and identity criteria inside the application collection.

However, avoid splitting a simple rule into many small collections when they have no independent meaning or reuse value.

The objective is not to maximize the number of collections. The objective is to make the access model understandable, reusable, and maintainable.

## Naming recommendations

Names should make the purpose and type of a collection clear.

Suggested structure:

```text
<Collection purpose> - <Business scope> - <Access level or qualifier>
```

Examples:

```text
Employees - Finance
Employees - Municipality A
Requested access - Finance reporting
Exceptions - Finance reporting - Include
Migration - Finance reporting - Legacy membership
Access - Finance reporting - Reader
Access - Finance reporting - Administrator
```

Avoid names that depend only on internal abbreviations or technical identifiers.

The naming convention should make it possible to distinguish:

- reusable membership collections;
- request and approval collections;
- exception collections;
- migration collections;
- final access collections.

For more information, see naming-and-metadata.md.

## Common anti-patterns

### One collection for several unrelated accesses

Avoid using the same final collection for applications or permissions with different business ownership or approval requirements.

Create separate collections when access can be granted, changed, or removed independently.

### Duplicating organization criteria

Avoid copying the same organizational criteria into every application collection.

Create a reusable organizational collection when the membership has independent meaning and will be reused.

### Overly complex criteria

Avoid criteria that attempt to address every exception in one expression.

Complex expressions are difficult to understand, validate, and maintain. Use dedicated collections for reusable conditions and explicit exceptions.

### Manual membership for data that already exists

Avoid manually maintaining membership when the required information is reliably available through IAM Core.

Use criteria collections for deterministic membership based on authoritative data.

### Permanent migration collections

A migration collection should have an owner, a defined purpose, and an exit condition.

Do not allow imported legacy membership to become a permanent and undocumented access mechanism.

### Mixing requested access with automatic access

Do not place manual approval logic inside a collection whose purpose is organizational membership.

Keep organizational criteria and request-based membership separate, then combine them in the final access collection.

### Linking every component collection to the target group

Use the consolidated final access collection as the source for Group Link.

Linking several component collections independently to the same access target makes ownership and effective membership more difficult to understand.

## Design checklist

Before using a collection for access control, verify the following:

- [ ] The collection has one clear business purpose.
- [ ] The collection name describes its purpose.
- [ ] The membership logic is understandable.
- [ ] Reusable criteria are not unnecessarily duplicated.
- [ ] Source attributes have understood ownership and data quality.
- [ ] Request and approval paths are separated from automatic membership.
- [ ] Exceptions are explicit and traceable.
- [ ] Migration membership has an exit condition.
- [ ] The final access collection represents one independently managed access.
- [ ] The expected membership has been previewed and validated.
- [ ] The collection owner is known.
- [ ] The corresponding Entra ID group and Group Link are documented where applicable.

## Related documentation

- [Collections](index.md)
- [Collections API](api.md)
- [Criteria Collections](criteria.md)
- [Joinable collections](joinable.md)
- [Authenticating PowerShell](authentication-powershell.md)
- [PowerShell module](powershell-module.md)
- [PowerShell examples](powershell-examples.md)
- [Group Link](group-link.md)
- [Collection naming and metadata](naming-and-metadata.md)
- [Collections troubleshooting](troubleshooting.md)
- [Collection migration patterns](migration-patterns.md)