## Collection troubleshooting

This guide provides a structured approach to troubleshooting Identity Universe collections across the web interface, API, PowerShell, membership evaluation, joinable request flows, and Group Link.

Start at the layer where the expected state is first incorrect. Avoid changing several parts of the configuration at the same time, as this makes it harder to determine the actual cause.

### Troubleshooting model

For collection-based access, validate each layer separately:

```text
Authoritative source data
    -> IAM Core object and attributes
        -> Criteria or joinable collection
            -> Final access collection
                -> Group Link
                    -> Microsoft Entra ID group
                        -> Target application or service
```

The first layer that differs from the expected state normally identifies where further investigation should begin.

For example:

- If the source collection is wrong, investigate source data, object type, criteria, referenced collections, or request membership.
- If the source collection is correct but the Entra ID group is wrong, investigate Group Link and target-group writability.
- If the Entra ID group is correct but application access is wrong, investigate the target application's assignment, synchronization, token, session, or authorization behavior.

## Quick diagnostic sequence

Use this sequence before investigating a specific scenario:

1. Confirm that you are working in the intended tenant.
2. Confirm that your user or application has the required authorization.
3. Confirm the collection type and object type.
4. Retrieve or open the collection and inspect its current configuration.
5. For a criteria collection, preview the condition before saving changes.
6. Compare preview results with the materialized collection membership.
7. For a joinable collection, inspect eligibility, approval gates, and request state.
8. If Group Link is involved, validate the source collection before inspecting the Entra ID group.
9. Check whether another process is managing the same collection or target group.
10. Record the failing request, endpoint, method, status code, response body, collection ID, and correlation information available to you.

## The Collections interface is empty or unavailable

If the Collections interface is empty or administrative functionality is not visible, verify authorization before troubleshooting collection data.

### User access

Interactive users require an appropriate user-assigned role in the Fortytwo Universe enterprise application. The Collections API documentation identifies the following user role:

```text
Collection Criteria - Administrator
```

Role value:

```text
collection_criteria_definition-administrator
```

After assigning or changing a role:

1. Sign out and sign in again if the existing session does not reflect the assignment.
2. Confirm that the role was assigned in the intended tenant and enterprise application.
3. Confirm that the signed-in account is the account that received the assignment.
4. Check the API separately if you need to distinguish a user-interface authorization issue from a collection-data issue.

### The interface opens, but expected collections are missing

Check the following:

- You are signed into the intended tenant.
- The collection exists under the expected collection type.
- Search filters or metadata filters are not excluding the collection.
- The collection was not created in another tenant or environment.
- The user has the required access to read or administer the collection.

## Authentication succeeds, but the API returns 403 Forbidden

A valid access token proves authentication, but it does not prove that the caller is authorized for the requested endpoint.

### Application authorization

The collections documentation defines application roles including:

```text
collections-criteria.criteria.read.all
collections-criteria.criteria.readwrite.all
```

The read/write role grants access to read and write criteria definitions and read results. Confirm the current role requirements for the endpoint you are calling, especially for beta endpoints and functionality covering more than one collection type.

Check the following:

1. The app registration has been granted the required application permission.
2. Admin consent has been granted in the intended tenant.
3. The token was issued after the permission and consent were added.
4. The token contains the expected application role claim.
5. The token audience or scope is for the Identity Universe API.
6. The endpoint and HTTP method are correct.
7. The feature supports application permissions for the operation being attempted.

The API scope is:

```text
https://api.fortytwo.io/.default
```

If a token works against one route prefix but returns 403 against another, compare the authorization requirements for the two endpoints. Do not assume that successful access to criteria endpoints proves access to every joinable or membership-request operation.

### Delegated versus application access

Interactive administration and centralized automation use different authentication contexts.

- A delegated token represents a signed-in user.
- An application token represents an application or workload identity.

When troubleshooting, inspect the token and identify which context is actually being used. If the operation is intended for unattended automation, confirm that the endpoint supports application access and that the required application role is present.

## Authentication fails or the token is rejected

Confirm that the token was requested for the correct tenant and API scope.

For interactive PowerShell, a token profile can be created for the Fortytwo Universe PowerShell client. For unattended automation, use an appropriate workload identity, managed identity, certificate, or client credential method supported by the environment.

Check the following:

- Tenant ID is correct.
- Client ID is correct.
- The credential has not expired or been revoked.
- The requested scope is `https://api.fortytwo.io/.default`.
- Required consent has been granted.
- The token audience matches the Identity Universe API.
- The token has not expired.
- The system clock is correct enough for token validation.

Do not log access tokens, client secrets, or private key material while troubleshooting.

## A criteria collection preview returns an error

The preview endpoint evaluates a criteria definition without saving it. Use it to validate a condition before creating or updating a collection.

### Field does not exist in schema

A criteria field must exist in the tenant schema for the collection's object type.

Retrieve the tenant schema with PowerShell:

```powershell
Get-CollectionTenantSchema
```

Or use the API endpoint:

```text
GET /collections-criteria/beta/tenant-schemas
```

Check that:

- `id` matches an attribute in the relevant tenant schema;
- the collection uses the intended object type;
- the attribute prefix is correct;
- the source data has been mapped into the expected IAM Core attribute.

Identity, Relationship, and OrgUnit collections use merged Core schemas. IAM Core attributes are prefixed according to their source, such as `identityFirstName`, `relationshipTitle`, and corresponding `orgUnit` attributes.

### Value is not valid for the attribute type

The comparison value must parse as the declared attribute type.

Examples of supported schema types include:

```text
String
Integer
Boolean
DateTime
Guid
List
ExternalList
Array
```

If a Boolean condition uses a value such as `yes`, validation will fail because the value is not a valid Boolean.

Check the schema type and provide a correctly typed value.

### The condition tree is invalid

The root of a criteria condition must be a group. Each node is either:

- a group with `groupOperator` and `conditions`; or
- a leaf with `id`, `field`, `operator`, and, where required, `value`.

Minimal example:

```json
{
  "groupOperator": "AND",
  "conditions": [
    {
      "id": "relationshipType",
      "field": "relationshipType",
      "operator": "Equals",
      "value": "Employee"
    }
  ]
}
```

Check for:

- missing root group;
- unsupported group operator;
- missing leaf properties;
- a value that does not match the field type;
- invalid helper-function syntax;
- nested functions on a DateTime field.

## Preview returns no members

An empty preview normally means that the condition does not match the current tenant data or that the condition refers to the wrong field, object type, value, or referenced collection.

Investigate in this order:

1. Confirm the collection's object type.
2. Retrieve the tenant schema and confirm the field.
3. Verify that representative IAM Core objects contain the expected value.
4. Test one condition at a time.
5. Add additional conditions only after the basic condition returns the expected objects.
6. Check case, formatting, identifiers, and data types.
7. If referencing another collection, confirm that the referenced collection has the expected members.
8. Confirm that the operator matches the attribute type and intended comparison.

### List attributes require membership testing

For list attributes, use the operator documented for membership testing.

Example for direct Entra ID group membership:

```json
{
  "id": "directMemberOfEntraGroups",
  "field": "directMemberOfEntraGroups",
  "operator": "Contains",
  "value": "99b64c1d-5d6c-44a8-8bac-75fe796302ea"
}
```

Do not use `In` as a substitute for testing whether a list attribute contains one value. The `In` operator expects the condition value itself to be a list.

### Referencing another collection

The criteria reference documents `memberOfCollection` as the special attribute used to build one collection from another.

Use the operator and payload supported by the current tenant schema and API version. The existing criteria reference in this documentation shows the following form:

```json
{
  "id": "memberOfCollection",
  "field": "memberOfCollection",
  "operator": "Equals",
  "value": "4fd301f8-0409-4856-bc3d-7f0102231f7a"
}
```

When troubleshooting a collection reference:

- confirm the referenced collection ID;
- confirm the referenced collection contains the expected object type and members;
- confirm the current criteria documentation and interface expose the same operator behavior;
- preview the referencing collection before saving;
- test the collection-reference condition without unrelated conditions first.

If the web interface normalizes or rejects an operator submitted through automation, treat that as a signal to compare the API payload with the current criteria reference and tenant schema before proceeding.

## Preview is correct, but the saved collection is empty or outdated

Criteria membership is evaluated asynchronously.

The preview gives an immediate calculation of the condition. The collection result represents the most recently materialized membership.

Therefore, immediately after creating or changing a criteria collection:

- preview may show the expected members;
- the saved collection result may still show the previous state or no members;
- the materialized membership may update after background evaluation.

Use:

```powershell
$Collection | Test-CriteriaCollectionMember
```

for immediate validation, and:

```powershell
Get-CollectionResult -Id $Collection.id
```

for the materialized membership.

If the materialized result does not update as expected, confirm that:

- the collection was successfully created or updated;
- the saved definition matches the previewed definition;
- no automation overwrote the collection after the change;
- background evaluation is not reporting an error;
- the collection ID used to read results is correct.

Do not repeatedly recreate the collection merely because the materialized membership is not immediate.

## Updating a criteria collection has an unexpected effect

The API documentation states that, on update, omitted properties retain their current value and only `objectType` is required.

Even so, use a read-modify-preview-write pattern to reduce accidental changes:

1. Read the existing collection.
2. Modify only the intended properties.
3. Preview the resulting condition.
4. Review `preview`, `added`, and `removed` results.
5. Save the update.
6. Retrieve the collection again and verify the stored definition.

In PowerShell:

```powershell
$Collection = Get-CriteriaCollection | Where-Object name -eq "Employees in Bergen"
$Collection.description = "Employees at the Bergen office"
$Collection | Test-CriteriaCollectionMember
$Collection | Set-CriteriaCollection
```

For access-related collections, review both additions and removals before applying a change.

## A joinable collection is not visible to a user

Joinable collections can be scoped through `joinableBy`.

A user is eligible when they are a member of at least one collection listed in `joinableBy.collectionIds`. If `joinableBy` is omitted or its collection list is empty, everyone is eligible.

Check the following:

1. The joinable collection exists and can be read.
2. The user is a member of at least one scoping collection.
3. The scoping collection uses the intended object type and membership model.
4. The collection ID in `joinableBy.collectionIds` is correct.
5. The user's relevant relationship is represented correctly.
6. The request interface is being used in the intended tenant.

If the scoping collection is criteria-based, preview it to confirm that the user or relationship is included.

## A request cannot be submitted

Check:

- the requester is eligible through `joinableBy`;
- the request uses the relevant relationship where membership is position-specific;
- a manager submitting on behalf of someone is recognized as that person's manager;
- the request is not already in a state that prevents a duplicate or conflicting action;
- the caller has access to the membership-request operation.

Requests and membership in joinable collections can be relationship-specific. Someone with two positions may be eligible or become a member for one relationship but not the other.

## Approval is not reaching the expected approver

Approval gates run in ascending `order`. Each gate must be approved before the next gate begins.

Check the active gate and then verify its configuration.

### Identity gate

Confirm that:

- the approver list contains valid identity IDs;
- the expected person is represented by the configured identity;
- the request is currently waiting at that gate.

### Collection gate

Confirm that:

- the approver list contains valid collection IDs;
- the expected approver is a member of at least one configured approver collection;
- the approver collection membership is current;
- the request is currently waiting at that gate.

### Manager gate

A Manager gate resolves the manager from the relationship used by the request, with fallback to the manager of the relationship's organizational unit.

Confirm that:

- the request contains the intended relationship;
- the relationship has the expected manager data;
- the organizational unit has the expected manager when fallback is required;
- the policy contains no more than one Manager gate;
- `approvers` is empty for the Manager gate.

## A request cannot be approved, rejected, cancelled, or left

The action must be valid for the current request state and caller.

- **Approve or reject**: only the current approver may act while the request is waiting at their gate.
- **Cancel**: the requester, or the manager who submitted on behalf, may cancel while the request is Requested or PendingApproval.
- **Leave**: only the member may leave, and only after the request has reached Joined.

Retrieve the request and inspect its current state and lifecycle before retrying the action.

Send an empty JSON object when the API operation expects a body but no notes or relationship value are required:

```json
{}
```

## Directly imported members are not associated with the expected identity

Administrative member import for joinable collections uses IAM Core identity IDs, not Entra ID object IDs.

PowerShell example:

```powershell
$Ids = @(
    "d42a1f3f-4a1b-42e5-bb04-63536796ec70",
    "8c1e..."
)

Import-JoinableCollectionMemberBatch -Id $Collection.id -Members $Ids
```

Pass the array as one argument. Piping individual identifiers sends one request per ID and is less suitable for batch import.

Before importing:

- resolve the intended person to the correct IAM Core identity ID;
- confirm whether relationship-specific membership is required;
- record why the member is being added outside the request flow;
- avoid using direct import as an undocumented permanent exception mechanism.

## PowerShell returns no collection or the wrong collection

Collection names are display values and may not be unique. Avoid relying on broad name matching for changes.

Prefer:

1. retrieving the collection;
2. confirming its ID, type, object type, and name;
3. using the stable collection ID for subsequent operations.

The combined endpoint and `Get-Collection` return both collection kinds. If you need to know the kind, retrieve it from the criteria or joinable route or corresponding PowerShell cmdlet.

Examples:

```powershell
Get-CriteriaCollection
Get-JoinableCollection
```

When using `Where-Object`, confirm that the filter returns exactly one intended object before submitting an update or delete operation.

## API search does not return the expected collection

The combined collections API can search by tags and attributes. Attributes are supplied as `key:value`.

Check the metadata currently stored on the collection and remember:

- tags are lower-cased and trimmed when stored;
- attribute keys are lower-cased and trimmed when stored;
- attribute values preserve their casing;
- duplicate tags or attributes are rejected;
- metadata limits apply.

Current documented limits are:

| Metadata item | Limit |
|---|---:|
| Tags | 20 |
| Tag length | 50 characters |
| Attribute entries | 20 |
| Attribute key length | 50 characters |
| Attribute value length | 200 characters |

If search behavior is unexpected, retrieve the collection directly by ID and inspect the stored metadata rather than relying on the original submitted casing.

## Group Link does not update the Entra ID group

Troubleshoot Group Link only after confirming that the source collection contains the expected members.

Validate in this order:

1. Confirm the final access collection is correct.
2. Confirm the intended collection is linked to the intended Entra ID group.
3. Confirm the target group is a supported and writable group.
4. Confirm the service has the required permissions.
5. Confirm that no other automation is managing the same membership.
6. Inspect available processing status, logs, or errors.
7. Recheck the target-group membership.
8. Validate effective access in the consuming application separately.

Do not use direct changes in the Entra ID group to correct a collection-driven membership issue. Correct the appropriate source collection, request membership, exception, or source data.

## A direct Entra ID group change is reverted

This is expected when Group Link treats the source collection as the membership source of truth.

Examples:

- A member added directly to the target group may be removed when the identity is not in the source collection.
- A member removed directly from the target group may be added again when the identity remains in the source collection.

Make the required change in the collection model instead of the target group.

Also verify that no second automation process independently maintains the group. Competing authorities can repeatedly undo each other's changes.

## The Entra ID group is correct, but application access is incorrect

When the source collection and Entra ID group are correct, investigate outside Collections and Group Link.

Check:

- the intended group is assigned to the application or service;
- the application has processed the membership change;
- application provisioning is healthy where applicable;
- the user has refreshed tokens or sessions where required;
- application-specific roles or claims are configured correctly;
- cached authorization has not delayed the effective result.

Keep the validation layers separate:

```text
Collection membership
    -> Entra ID group membership
        -> Application assignment
            -> Effective authorization
```

A correct group membership does not by itself prove that the target application has granted or removed access.

## Automation repeatedly changes a collection back

When UI, PowerShell, API, or automation all manage the same collection, identify which system is authoritative for configuration.

Check:

- whether Ansible or another automation platform runs on a schedule;
- whether the automation compares desired configuration with the current API state;
- whether display names or unstable values are used as identifiers;
- whether metadata generated by one tool is omitted by another;
- whether manual changes are expected to be overwritten;
- whether more than one repository or pipeline defines the collection.

Use stable object IDs or explicit external references for idempotent administration. Document which properties are automation-managed and where changes must be made.

## Collecting diagnostic information

Before escalating an issue, collect enough information to reproduce and isolate it.

Include, where applicable:

- tenant identifier;
- collection ID;
- collection type;
- object type;
- collection definition with sensitive values removed;
- relevant metadata;
- endpoint and HTTP method;
- UTC timestamp of the failing request;
- HTTP status code;
- response body or validation message;
- correlation or request ID if available;
- token type, such as delegated or application, without including the token;
- application role values present in the token;
- preview result summary;
- materialized membership result;
- request ID and current request state for joinable flows;
- source collection ID and target group ID for Group Link;
- whether other automation manages the same object.

Do not include:

- access tokens;
- client secrets;
- private keys;
- passwords;
- unnecessary personal data.

## Troubleshooting checklist

- [ ] I am working in the intended tenant.
- [ ] The caller has the required role or application permission.
- [ ] The token uses the correct API scope.
- [ ] The collection type and object type are correct.
- [ ] Criteria fields exist in the tenant schema.
- [ ] Criteria values match the declared field types.
- [ ] The condition has been previewed before saving.
- [ ] I have distinguished preview results from asynchronously materialized membership.
- [ ] Referenced collections contain the expected members.
- [ ] Joinable eligibility and approval gates are configured as intended.
- [ ] The request is in a state that permits the attempted action.
- [ ] Imported member IDs are IAM Core identity IDs where required.
- [ ] Metadata search uses the stored tag and attribute format.
- [ ] The final access collection is correct before Group Link is investigated.
- [ ] The intended Entra ID group is linked and writable.
- [ ] No competing process manages the same collection or group membership.
- [ ] The target application has been validated separately from group membership.
- [ ] Diagnostic information has been captured without secrets.

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
- [Collection naming and metadata](naming-and-metadata.md)
- [Collection migration patterns](migration-patterns.md)
