## Migration patterns

This guide describes recommended patterns for migrating existing access models to Identity Universe collections.

The goal of a migration is not simply to recreate existing groups. The goal is to establish a sustainable, explainable, and maintainable access model based on collections, approval flows, and Group Link.

### Migration principles

Before migrating, identify:

- who currently has access;
- why they have access;
- how access is granted today;
- how access should be granted in the future;
- which memberships are temporary exceptions;
- which memberships can be derived from authoritative data.

Avoid treating a migration as a direct one-to-one copy of existing groups.

A migration is an opportunity to replace historical access debt with a clearer access model.

## Recommended migration strategy

A typical migration follows four phases:

```text
Existing groups
    -> Discovery
        -> Migration collections
            -> Final access collections
                -> Group Link
                    -> Entra ID groups
```

### Phase 1: Discovery

Identify:

- existing groups;
- existing owners;
- current members;
- access purpose;
- source systems;
- approval processes;
- known exceptions.

For each access group ask:

> Why is this identity a member?

If nobody can answer that question, the migration should not blindly preserve the membership.

### Phase 2: Build the target model

Create the future-state collection design.

Typical building blocks:

```text
Organizational collections
Attribute-based collections
Joinable collections
Exception collections
Final access collections
```

Use the design patterns documented in design-patterns.md.

Do not begin by importing memberships.

Begin by modelling how access should work.

### Phase 3: Preserve existing access

When existing membership must be preserved temporarily, create a migration collection.

Example:

```text
Migration - Finance reporting - Legacy membership
```

Members can be imported directly into that collection.

The migration collection is then included in the final access collection.

```text
Access - Finance reporting - User
    contains Employees - Finance
    OR
    contains Requested access - Finance reporting
    OR
    contains Migration - Finance reporting - Legacy membership
```

This allows access continuity during the transition.

### Phase 4: Remove migration membership

As each member is reviewed:

- move them to criteria-based access;
- move them to joinable access;
- move them to exception collections;
- remove unnecessary access.

Eventually:

```text
Migration collection
    -> empty
```

The migration collection can then be retired.

## Migration from Active Directory groups

A common starting point is:

```text
AD Group
    -> Collection
        -> Group Link
            -> Entra ID Group
```

Do not assume every existing member belongs in the future-state model.

Typical findings include:

- inactive users;
- historical access;
- temporary consultants;
- service accounts;
- inherited administrative memberships.

Review memberships before making them permanent.

## Migration from Entra ID groups

Existing Entra ID groups can often be used during migration.

Pattern:

```text
Existing Entra Group
    -> Migration Collection
        -> Final Access Collection
            -> Group Link
                -> Existing Entra Group
```

This allows the Entra group to remain the application-facing object while the membership source of truth moves into Identity Universe.

## Criteria-first migration

Where access can be determined from authoritative data, prefer rebuilding access through criteria collections.

Example:

Current state:

```text
Finance Reporting Group
```

Future state:

```text
Employees - Finance
    -> Access - Finance reporting - User
        -> Group Link
            -> Finance Reporting Group
```

This removes manual administration and continuously aligns access with employment data.

## Joinable migration

Some memberships cannot be reconstructed from authoritative data.

Typical examples:

- business need;
- project participation;
- temporary responsibility;
- specialist access.

Pattern:

```text
Requested access - Application X
```

Existing members may be imported during migration while future access is granted through requests and approval.

## Hybrid migration

Most production migrations end up using a hybrid model.

Example:

```text
Employees - Finance
Requested access - Finance reporting
Migration - Finance reporting - Legacy membership
Exceptions - Finance reporting - Include

    -> Access - Finance reporting - User
```

Over time:

```text
Migration membership
    -> reduced
    -> removed
```

while organizational and joinable memberships remain.

## Migrating exceptions

Not every existing member belongs in a reusable criteria rule.

Where access is legitimate but uncommon:

```text
Exceptions - Application X - Include
```

Document:

- why the exception exists;
- who approved it;
- who owns it;
- when it should be reviewed.

Avoid hiding exceptions directly inside increasingly complex criteria conditions.

## Bulk import strategy

Joinable collections support administrative member import.

This is useful when:

- hundreds of users already have access;
- access must continue immediately after migration;
- approval workflows should only apply to future requests.

Use migration collections or dedicated onboarding collections rather than importing members into unrelated collections without documentation.

## Access review during migration

A migration is often the best opportunity to perform access cleanup.

Recommended review questions:

- Does the person still require access?
- Can access be determined automatically?
- Should access become request-based?
- Is this an exception?
- Is there a business owner?

Do not treat existing access as automatically correct.

## Group Link migration pattern

Once the final access collection is validated:

```text
Final Access Collection
    -> Group Link
        -> Target Group
```

The collection becomes the source of truth.

Direct changes in the target group should no longer be treated as the authoritative access-management mechanism.

## Large-scale migrations

For environments with many collections:

1. Establish naming standards first.
2. Establish metadata standards first.
3. Create reusable organizational collections.
4. Create joinable templates.
5. Migrate low-risk access first.
6. Validate Group Link behavior.
7. Migrate high-impact access later.

Do not begin with the most critical access groups.

Use early migrations as validation of patterns and operational procedures.

## Common anti-patterns

### Recreating every historical group

Avoid rebuilding a legacy structure solely because it already exists.

Model access according to business requirements rather than historical implementation.

### Permanent migration collections

Migration collections should have an exit strategy.

They are transitional components.

### No ownership review

Every migrated access should have a known owner.

### Skipping validation

Always compare:

```text
Existing membership
vs
Expected membership
vs
Final collection membership
```

before cutover.

### Multiple authorities

Do not allow:

- legacy scripts;
- manual administration;
- Group Link;
- automation platforms;

all to maintain the same membership simultaneously.

## Migration checklist

- [ ] Existing access documented.
- [ ] Owners identified.
- [ ] Target collection model designed.
- [ ] Naming and metadata standards applied.
- [ ] Criteria collections tested.
- [ ] Joinable collections configured.
- [ ] Exceptions documented.
- [ ] Migration collections created where necessary.
- [ ] Existing memberships reviewed.
- [ ] Group Link validated.
- [ ] Application access validated.
- [ ] Legacy memberships removed.
- [ ] Migration collections retired.

## Related documentation

- [Collections](index.md)
- [Criteria collections](criteria.md)
- [Joinable collections](joinable.md)
- [Collections API](api.md)
- [PowerShell module](powershell-module.md)
- [PowerShell examples](powershell-examples.md)
- [Authenticating PowerShell](authentication-powershell.md)
- [Collection design patterns](design-patterns.md)
- [Group Link](group-link.md)
- [Collection naming and metadata](naming-and-metadata.md)
- [Collection troubleshooting](troubleshooting.md)
- [Collection migration patterns](migration-patterns.md)