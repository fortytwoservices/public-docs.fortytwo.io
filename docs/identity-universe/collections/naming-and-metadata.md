# Collection naming and metadata

Consistent naming and metadata make collections easier to find, understand, automate, review, and maintain.

This guide provides recommendations for collection names, tags, attributes, descriptions, and ownership metadata. The recommendations are intended as a starting point. Each organization should adopt a documented convention that reflects its terminology, governance model, and automation requirements.

## Why naming and metadata matter

A collection name rarely provides enough context on its own.

As the number of collections grows, administrators need to distinguish between:

- organizational collections;
- attribute-based collections;
- request and approval collections;
- final access collections;
- exception collections;
- migration collections;
- collections associated with different organizations, systems, and sectors.

A consistent metadata model also reduces ambiguity in API-based administration. Automation should not have to infer the purpose of a collection from an abbreviated display name.

## Separate identity, classification, and configuration

Use each field for a clear purpose:

- **Name** identifies the collection in a human-readable way.
- **Description** explains its business purpose and membership model.
- **Tags** classify the collection for filtering and discovery.
- **Attributes** store named metadata values that belong to the collection.
- **Criteria and gates** define membership and approval behavior.

Do not place all metadata into the display name. Conversely, do not rely on metadata to compensate for an unclear name.

## Naming principles

Collection names should be:

- understandable without internal project knowledge;
- stable over time;
- specific enough to distinguish similar collections;
- aligned with the business purpose;
- independent of temporary implementation details where possible;
- suitable for display in administrative and self-service interfaces.

Avoid names that consist only of:

- unexplained abbreviations;
- source-system identifiers;
- GUIDs or object IDs;
- temporary project names;
- personal names;
- generic terms such as `Users`, `Group 1`, or `Access`.

## Recommended naming structure

A practical baseline is:

```text
<Collection purpose> - <Business scope> - <Qualifier>
```

The qualifier is optional and may describe an access level, approval path, exception type, or lifecycle purpose.

Examples:

```text
Employees - Finance
Employees - Municipality A
Requested access - Finance reporting
Requested access - Case management - System owner approval
Access - Finance reporting - Reader
Access - Finance reporting - Administrator
Exceptions - Finance reporting - Include
Exceptions - Finance reporting - Exclude
Migration - Finance reporting - Legacy membership
```

The exact vocabulary may differ between organizations. Consistency is more important than reproducing these terms verbatim.

## Name collections by purpose

Use a recognizable prefix or first name component to communicate the collection's role.

### Organizational collections

Use organizational collections to represent affiliation with an organizational scope.

```text
Employees - Finance
Employees - School A
Employees - Municipality A
```

If subordinate units are included, make that clear where ambiguity is likely:

```text
Employees - Finance - Including subordinate units
```

### Attribute-based collections

Use a business-readable description of the qualifying population.

```text
Employees - Permanent
Employees - Location Trondheim
Employees - Licensed health personnel
```

Avoid exposing technical filter syntax in the name.

### Request and approval collections

Make it clear that membership is requested rather than calculated automatically.

```text
Requested access - Finance reporting
Requested access - Case management - Manager approval
Requested access - Payroll - System owner approval
```

If two request paths have different approvers or lifecycle rules, use separate names and collections.

### Final access collections

Use `Access` or another agreed term to identify the consolidated collection that represents the final desired membership for an independently managed access.

```text
Access - Finance reporting - Reader
Access - Finance reporting - Contributor
Access - Finance reporting - Administrator
```

These names should correspond clearly to the access represented in the target system.

### Exception collections

State whether the collection includes or excludes identities.

```text
Exceptions - Finance reporting - Include
Exceptions - Finance reporting - Exclude
```

Do not use a generic collection named only `Exceptions`.

### Migration collections

State that the membership is transitional and identify the original or legacy purpose.

```text
Migration - Finance reporting - Legacy membership
Migration - Payroll - Imported from AD group
```

Migration collections should have an owner and an exit condition documented in the description or operational documentation.

## Name for the business outcome, not the implementation

Prefer:

```text
Access - Finance reporting - Reader
```

Instead of:

```text
Criteria collection 0042
Entra group sync collection
Ansible Finance group
```

Implementation details may change while the business purpose remains stable.

Technical references that are required for automation should be stored as attributes or in the relevant configuration repository rather than embedded into the display name.

## Tags

Tags provide lightweight classification and make collections easier to filter and discover.

Typical tag dimensions include:

- organization or municipality;
- system or application;
- sector or business area;
- collection purpose;
- environment;
- lifecycle state.

### Use namespaced tags

Prefer namespaced tags when values from different classification dimensions may overlap.

```text
organization:municipality-a
system:finance-reporting
sector:finance
purpose:access
```

A standalone tag such as `or`, `ha`, or `finance` may be short and visually simple, but its meaning may be ambiguous. The same value could represent an organization code, a system abbreviation, a sector, or another classification.

Namespaced tags make the meaning explicit for both administrators and automation.

### Recommended tag format

Use:

```text
<namespace>:<value>
```

Recommended formatting rules:

- use lowercase;
- use one agreed language;
- use stable identifiers rather than display labels where possible;
- use hyphens to separate words;
- avoid spaces;
- avoid personal data;
- avoid environment-specific values unless environment is an intentional dimension;
- document allowed namespaces.

Examples:

```text
organization:municipality-a
organization:municipality-b
system:case-management
sector:health
purpose:organizational
purpose:request
purpose:access
environment:production
lifecycle:migration
```

### Suggested tag namespaces

The following namespaces are examples, not mandatory product-defined values:

```text
organization:<value>
system:<value>
sector:<value>
purpose:<value>
environment:<value>
lifecycle:<value>
```

An organization should define the namespaces it actually needs and avoid creating several names for the same dimension.

For example, do not use all of the following:

```text
municipality:municipality-a
organization:municipality-a
org:municipality-a
customer:municipality-a
```

Choose one namespace and use it consistently.

### Use tags for classification, not configuration

Tags are best suited for questions such as:

- Which collections belong to a particular organization?
- Which collections relate to a particular system?
- Which collections represent final access?
- Which collections are temporary migration objects?

Do not rely on an unstructured tag when automation needs a specific named value with a defined meaning. Use an attribute instead.

## Attributes

Attributes store named metadata values associated with a collection.

Use attributes when the metadata:

- has a defined key and value;
- is consumed by automation or an integration;
- needs to be interpreted consistently;
- represents configuration rather than simple classification;
- may contain a value that is not suitable as a tag.

Examples may include:

```text
businessOwnerId = <identity or external reference>
technicalOwnerId = <identity or external reference>
sourceSystem = <system identifier>
targetGroupId = <Entra ID group identifier>
allowedEmailDomains = <defined value or values>
externalReference = <record identifier>
```

These are suggested metadata concepts. Use only attributes supported by the implementation and required by the organization's operating model.

### Attribute naming

Attribute keys should be:

- descriptive;
- stable;
- consistently cased;
- documented;
- unambiguous;
- suitable for programmatic use.

Choose one casing convention, such as camel case:

```text
businessOwnerId
technicalOwnerId
sourceSystem
externalReference
```

Do not mix variants such as:

```text
BusinessOwner
business_owner
businessownerid
owner-business
```

### Tags and attributes may coexist

A collection may use both a tag and an attribute when they serve different purposes.

Example:

```text
Tag:
    system:case-management

Attributes:
    sourceSystem = service-catalogue
    externalReference = access-record-1842
```

The tag supports discovery and filtering. The attributes provide named values for integrations or administration.

Avoid duplicating the same metadata in both places unless there is a documented reason.

## Description

Every production access collection should have a description that explains its intent.

A useful description should answer:

- What does the collection represent?
- How is membership determined?
- What access or process depends on it?
- Who owns the business decision?
- Are there important exclusions, exceptions, or migration conditions?

Recommended structure:

```text
Purpose: <business purpose>
Membership: <criteria, referenced collections, or request path>
Target: <target access or system, if applicable>
Owner: <business owner or owning function>
Notes: <important restrictions, exceptions, or lifecycle information>
```

Example:

```text
Purpose: Represents identities that should receive reader access to Finance reporting.
Membership: Employees in Finance or identities approved through the Finance reporting request collection.
Target: Entra ID group Finance reporting - Reader through Group Link.
Owner: Finance application owner.
Notes: Explicit inclusions are maintained in the approved exception collection.
```

Avoid descriptions that merely repeat the collection name.

## Ownership metadata

Collections used for access control should have identifiable ownership.

Distinguish between:

- **Business owner**, accountable for who should receive the access;
- **Technical owner**, responsible for implementation and operational follow-up;
- **Approval owner**, responsible for request decisions where applicable.

These responsibilities may belong to the same person or function, but they should not be assumed to be identical.

Where ownership can be represented as collection attributes, prefer stable identity or system references over free-text personal names. Where this is not supported, document ownership in the description or the organization's access catalogue.

## External references

API-based administration commonly requires a relationship between a collection and a record in another source of truth, such as a service catalogue, configuration repository, or automation platform.

Store this relationship explicitly where supported.

Example attributes:

```text
externalSource = service-catalogue
externalReference = access-record-1842
```

Do not use the collection display name as the only programmatic key if a stable identifier is available.

A display name may change. Automation should use stable object identifiers or explicit external references for idempotent administration.

## Environment classification

If collections from several environments are visible within the same administrative scope, classify the environment explicitly.

Example:

```text
environment:development
environment:test
environment:production
```

Do not add environment markers to every name unless this is required by the organization's naming standard or necessary to prevent confusion.

Prefer metadata when the environment is classification rather than part of the business purpose.

## Lifecycle classification

A lifecycle tag or attribute can help distinguish active collections from transitional or retired objects.

Example tags:

```text
lifecycle:active
lifecycle:migration
lifecycle:deprecated
```

Do not use lifecycle metadata as a substitute for an operational retirement process. A deprecated collection may still grant access until its references and links are removed.

## Recommended metadata profile

The following is a suggested baseline for a final access collection:

```text
Name:
    Access - Finance reporting - Reader

Description:
    Purpose: Represents identities that should receive reader access to Finance reporting.
    Membership: Finance employees or identities approved through the request collection.
    Target: Entra ID group Finance reporting - Reader through Group Link.
    Owner: Finance application owner.

Tags:
    organization:municipality-a
    system:finance-reporting
    sector:finance
    purpose:access
    lifecycle:active

Attributes:
    businessOwnerId = <stable owner reference>
    technicalOwnerId = <stable owner reference>
    externalSource = <source-of-truth identifier>
    externalReference = <stable external record identifier>
```

The exact owner and external-reference attributes depend on supported functionality and the organization's governance model.

## Examples

### Reusable organizational collection

```text
Name:
    Employees - Finance

Description:
    Purpose: Represents active employee relationships associated with the Finance organizational unit.
    Membership: Calculated from organizational affiliation in IAM Core.
    Owner: HR data owner and Finance organizational owner.

Tags:
    organization:municipality-a
    sector:finance
    purpose:organizational
    lifecycle:active
```

### Joinable collection with system-owner approval

```text
Name:
    Requested access - Case management - System owner approval

Description:
    Purpose: Provides a request path for user access to Case management.
    Membership: Identities with an approved access request.
    Owner: Case management system owner.

Tags:
    organization:municipality-a
    system:case-management
    purpose:request
    approval:system-owner
    lifecycle:active
```

`approval:system-owner` is an example organizational convention, not a required product tag.

### Migration collection

```text
Name:
    Migration - Case management - Legacy membership

Description:
    Purpose: Temporarily preserves reviewed membership imported from the legacy group.
    Membership: Administratively imported during migration.
    Owner: IAM migration team.
    Notes: Remove after all members have been moved to criteria, request, or exception collections.

Tags:
    organization:municipality-a
    system:case-management
    purpose:migration
    lifecycle:migration
```

## Governance recommendations

Maintain a short, version-controlled convention that defines:

- approved collection-purpose terms;
- approved tag namespaces;
- value formatting rules;
- required metadata for production access collections;
- ownership requirements;
- rules for migration and exception collections;
- which fields automation may depend on;
- how renamed or retired values are handled.

Review the convention before introducing a new tag namespace or attribute key.

For API-based administration, validate metadata as part of the automation pipeline where practical. This may include checking for required tags, approved namespaces, valid external references, and a non-empty description.

## Common anti-patterns

### Ambiguous short tags

Avoid tags such as:

```text
or
ha
fin
prod
```

Their meaning may be clear to the original author but ambiguous to others and to automation.

Prefer:

```text
organization:or
organization:ha
sector:finance
environment:production
```

Use the organization's actual stable codes and documented namespaces.

### Encoding every property in the name

Avoid:

```text
PROD-MUNICIPALITY-A-FINANCE-CASE-MANAGEMENT-READER-SYSTEMOWNER-ACTIVE
```

Use a readable name and place classification and configuration in metadata.

### Using tags as unstructured notes

Avoid long sentences, ticket references, or operational instructions as tags.

Use the description, attributes, repository documentation, or runbook instead.

### Duplicating conflicting metadata

Do not store one system value in a tag and a different system value in an attribute without a documented distinction.

Conflicting metadata makes filtering and automation unreliable.

### Personal names as permanent ownership identifiers

People change roles. Prefer a stable identity reference, group, role, or owning function where possible.

### Using names as automation identifiers

Display names can change and may not be unique. Use stable object IDs or explicit external references for programmatic administration.

### Uncontrolled namespace growth

Do not introduce `org:`, `organization:`, `municipality:`, and `customer:` as interchangeable namespaces.

Define one meaning for each namespace and reuse it consistently.

## Review checklist

Before publishing or automating a collection, verify the following:

- [ ] The name communicates the collection's business purpose.
- [ ] The name follows the documented naming convention.
- [ ] Abbreviations are documented and understandable.
- [ ] The description explains purpose and membership.
- [ ] The business owner is identifiable.
- [ ] The technical owner is identifiable where required.
- [ ] Tags use approved namespaces and values.
- [ ] Ambiguous standalone tags have been avoided.
- [ ] Attributes use approved keys and casing.
- [ ] Tags and attributes do not conflict.
- [ ] Personal or sensitive data is not stored unnecessarily in metadata.
- [ ] Automation uses stable identifiers rather than display names.
- [ ] Migration or exception collections have explicit ownership and lifecycle information.
- [ ] Final access collections can be associated clearly with their target access.

## Related documentation

- [Collections](index.md)
- [Collections API](api.md)
- [Criteria Collections](criteria.md)
- [Joinable collections](joinable.md)
- [Authenticating PowerShell](authentication-powershell.md)
- [PowerShell module](powershell-module.md)
- [PowerShell examples](powershell-examples.md)
- [Collection design patterns](design-patterns.md)
- [Group Link](group-link.md)
- [Collections troubleshooting](troubleshooting.md)
- [Collection migration patterns](migration-patterns.md)
