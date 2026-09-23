# API

## Authentication

All API endpoints are authenticated with the customer's own Entra ID, through our multi tenant application Fortytwo Universe (for how to provide admin consent, if not already in place, see [this URL](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408)).

This means that you can use any kind of identity to talk to our API! Users, Agents, Service Principals, Managed Service Identities, you name it. As long as you can get a token for the scope ```https://api.fortytwo.io/.default``` or the resource ```2808f963-7bba-4e66-9eee-82d0b178f408``` you are good.

We strongly recommend our PowerShell module [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken) for getting one. The multi-tenant client app `68bf2f1d-b9e1-4477-8b90-81314861f05f` (**Fortytwo Universe - Prod - PowerShell Client**) allows redirect to localhost for simple and interactive sign-ins.

```PowerShell
# Invoke interactive sign in
Add-EntraIDInteractiveUserAccessTokenProfile -Profile "Default" -TenantId "TENANTID" -ClientId "68bf2f1d-b9e1-4477-8b90-81314861f05f" -Scope https://api.fortytwo.io/.default

# Or invoke a request
Invoke-RestMethod "https://api.fortytwo.io/group-link/beta/group-links/by-collection/$CollectionId" -Headers (Get-EntraIDAccessTokenHeader -Profile "Default")
```

## Authorization

Group Link answers to the collections roles. A link is a property of a collection, so anyone who may manage the collection may manage what it is linked to, and nothing new has to be granted.

### Users

Can only be assigned to users:

| Role | Role value | Granted access |
|------|------------|----------------|
| Collection Criteria - Administrator | collection_criteria_definition-administrator | Full access to group links |

### Applications

Can only be assigned to applications:

| Role | Role value | Granted access |
|------|------------|----------------|
| collections-criteria.criteria.read.all | collections-criteria.criteria.read.all | Read links, preview, and read sync jobs |
| collections-criteria.criteria.readwrite.all | collections-criteria.criteria.readwrite.all | The above, plus create, update, delete and trigger a sync |

Reads need `read.all`; anything that changes a link or starts a sync needs `readwrite.all`. Note that `preview` is a `POST` but only needs `read.all` — it changes nothing.

## Endpoints

Everything is under `https://api.fortytwo.io/group-link/beta`, and every response is wrapped in an envelope:

```json
{ "data": { }, "isSuccess": true, "statusCode": 200, "errors": [] }
```

On failure, `error` carries the reason and `isSuccess` is `false`.

| Method | Route | Description |
|-|-|-|
| `POST` | `/group-links` | Create a link. Queues its first sync. |
| `GET` | `/group-links/{id}` | One link, by link id |
| `GET` | `/group-links/by-collection/{collectionId}` | The link for a collection |
| `PATCH` | `/group-links/{id}` | Enable or disable |
| `DELETE` | `/group-links/{id}` | Delete the link |
| `POST` | `/group-links/preview` | What a sync would add and remove, without doing it |
| `POST` | `/group-links/{collectionId}/sync` | Queue a synchronization |
| `GET` | `/sync-jobs?collectionId=` | A collection's recent sync jobs, newest first |
| `GET` | `/sync-jobs/{id}` | One sync job |

### The link

```json
{
  "id": "6f3a1c02-4e1d-4a5f-9a9a-5b6f4d0c2e11",
  "collectionId": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "entraGroupId": "c1e4a7d0-92b8-4a3e-bb70-2d7f1f0a94c5",
  "azureTenantId": "8f2a...",
  "createdAt": "2026-02-11T09:14:22.117+00:00",
  "state": "Enabled",
  "lastSyncedAt": "2026-02-11T10:14:35.902+00:00",
  "lastSyncOutcome": "Succeeded",
  "entraGroupDisplayName": "Finance reporting - Reader"
}
```

`state` is `Enabled` or `Disabled`; `lastSyncOutcome` is `Succeeded` or `Failed`, and null until the first sync finishes. `entraGroupDisplayName` is the group's name as it was last read — fall back to `entraGroupId` if it is null.

### Create

```json
{
  "collectionId": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "entraGroupId": "c1e4a7d0-92b8-4a3e-bb70-2d7f1f0a94c5"
}
```

Returns the new link's id, and queues its first synchronization.

The collection and the group are both checked before the link is created, so a link that exists is a link that can work:

| Status | Meaning |
|-|-|
| `400` | `collectionId` or `entraGroupId` is empty, or the collection does not exist |
| `403` | The group does not exist, cannot be written, or is a [group type that cannot be linked](./index.md#groups-that-cannot-be-linked) |
| `409` | That Entra ID group is already linked to a collection |
| `502` | The collection or the group could not be verified — the check failed, rather than failing the check. Retry; if it persists, Identity Universe may be missing access. |

### Enable and disable

```json
{ "state": "Disabled" }
```

A disabled link is skipped by the sweep and by reconciliation. The group keeps whatever membership it has at that point — disabling changes nothing in Entra ID, it only stops future alignment.

### Preview

```json
{
  "collectionId": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "groupId": "c1e4a7d0-92b8-4a3e-bb70-2d7f1f0a94c5"
}
```

Responds with the difference between the collection and the group:

```json
{
  "membersToAdd": ["9c1f...", "b704..."],
  "membersToRemove": ["4a12..."],
  "membersWithoutEntraAccount": 0
}
```

The ids are Entra ID object ids. Nothing is written.

Preview does not need an existing link, so it works as a dry run before linking an existing production group. Read `membersToRemove` first — on a group that already has members, that list is the risk.

`membersWithoutEntraAccount` is how many members of the collection have no Entra ID account to place. While it is above zero, [no member will be removed](./index.md#members-without-an-entra-id-account).

### Trigger a synchronization

```
POST /group-link/beta/group-links/{collectionId}/sync
```

Takes no body, and answers `202 Accepted` with the queued job's id:

```json
{ "jobId": "2e77b0a4-3f57-4f33-9a2c-9db35c6b4d8e" }
```

Accepted means queued, not finished. Poll the job to find out what happened.

### Sync jobs

```json
{
  "id": "2e77b0a4-3f57-4f33-9a2c-9db35c6b4d8e",
  "collectionId": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "entraGroupId": "c1e4a7d0-92b8-4a3e-bb70-2d7f1f0a94c5",
  "type": "ManualSync",
  "status": "Succeeded",
  "attempts": 1,
  "added": 12,
  "removed": 3,
  "skipped": 0,
  "createdAt": "2026-02-11T10:14:30.004+00:00",
  "startedAt": "2026-02-11T10:14:31.220+00:00",
  "completedAt": "2026-02-11T10:14:35.902+00:00",
  "error": null
}
```

| Field | |
|-|-|
| `type` | `ManualSync`, `LinkCreated` or `ScheduledSweep` — see [when a link synchronizes](./index.md#when-a-link-synchronizes) |
| `status` | `Queued`, `Running`, `Succeeded` or `Failed` |
| `attempts` | A failed job is retried up to three times before it stays failed |
| `added` / `removed` | Members written to the group |
| `skipped` | Collection members with no Entra ID account. Above zero, nothing is removed. |
| `error` | Why it failed, when it did |

`GET /sync-jobs?collectionId={id}` lists a collection's jobs newest first, ten by default; `limit` takes up to 50. This is the history — polling the job you queued and then forgetting it makes a run that changed membership invisible as soon as another follows it.

Jobs are kept for 30 days when someone triggered them, and two days for the hourly sweep.

## Examples

Link a collection to a group and watch the first sync:

```PowerShell
$Headers = Get-EntraIDAccessTokenHeader -Profile "Default"
$Base = "https://api.fortytwo.io/group-link/beta"

# See what it would do first
$Preview = Invoke-RestMethod "$Base/group-links/preview" -Method Post -Headers $Headers -ContentType "application/json" -Body (@{
    collectionId = $CollectionId
    groupId      = $EntraGroupId
} | ConvertTo-Json)

"Would add {0}, remove {1}, skip {2}" -f $Preview.data.membersToAdd.Count, $Preview.data.membersToRemove.Count, $Preview.data.membersWithoutEntraAccount

# Create the link - this queues the first synchronization by itself
$Link = Invoke-RestMethod "$Base/group-links" -Method Post -Headers $Headers -ContentType "application/json" -Body (@{
    collectionId = $CollectionId
    entraGroupId = $EntraGroupId
} | ConvertTo-Json)

# Follow it
Invoke-RestMethod "$Base/sync-jobs?collectionId=$CollectionId" -Headers $Headers |
    Select-Object -ExpandProperty data |
    Format-Table type, status, added, removed, skipped, completedAt
```

Disable a link without touching the group's current membership:

```PowerShell
Invoke-RestMethod "$Base/group-links/$($Link.data)" -Method Patch -Headers $Headers -ContentType "application/json" -Body (@{ state = "Disabled" } | ConvertTo-Json)
```

## Related documentation

- [Group Link](./index.md) — how a link behaves
- [Group Link design guidance](../collections/group-link.md) — composing the collections behind a link
- [Collections API](../collections/api.md) — creating the collection a link points at
