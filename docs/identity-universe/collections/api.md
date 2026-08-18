# API

## Authentication

All API endpoints are authenticated with the customer's own Entra ID, through our multi tenant application Fortytwo Universe (for how to provide admin consent, if not already in place, see [this URL](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408)).

This means that you can use any kind of identity to talk to our API! Users, Agents, Service Principals, Managed Service Identities, you name it. As long as you can get a token for the scope ```https://api.fortytwo.io/.default``` or the resource ```2808f963-7bba-4e66-9eee-82d0b178f408``` you are good.

**Ok, so how do I get an access token?**

In order to document that, we would have a lot of content with overlap with Microsoft's own documentation, but we strongly recommend using our PowerShell module named [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken), which makes this super easy! We have a multi-tenant client app client id `68bf2f1d-b9e1-4477-8b90-81314861f05f` (**Fortytwo Universe - Prod - PowerShell Client**), that allows redirect to localhost for simple and interactive sign-ins.

```PowerShell
# Invoke interactive sign in
Add-EntraIDInteractiveUserAccessTokenProfile -Profile "Default" -TenantId "TENANTID" -ClientId "68bf2f1d-b9e1-4477-8b90-81314861f05f" -Scope https://api.fortytwo.io/.default 

# The TenantId will be your Entra tenant identifier (GUID) or tenant name
# The ClientId is for the "Fortytwo Universe - Prod - PowerShell Client"

# Get access_token and copy it to clipboard
Get-EntraIDAccessToken -Profile "Default" | Set-Clipboard

# To inspect the contents of the access_token
Get-EntraIDAccessToken -Profile "Default" | Get-EntraIDAccessTokenPayload

# Or invoke a request
Invoke-RestMethod "https://api.fortytwo.io/collections" -Headers (Get-EntraIDAccessTokenHeader -Profile "Default")
```

## Authorization

All API endpoints requires some kind of authorization.

### Users

Can only be assigned to users:

| Role | Role value | Granted access |
|------|------------|----------------|
| Collection Criteria - Administrator | collection_criteria_definition-administrator | Full access to collections |

### Applications

Can only be assigned to applications:

| Role                                        |  Role value | Granted access |
|---------------------------------------------|-------------|----------------|
| collections-criteria.criteria.read.all      | collections-criteria.criteria.read.all | Read all criteria definitions and all results. |
| collections-criteria.criteria.readwrite.all | collections-criteria.criteria.readwrite.all | Read and write all criteria definitions and read all results. |

## Endpoints

There are three route prefixes, all under `https://api.fortytwo.io`:

| Prefix | Covers |
|-|-|
| `/collections/beta` | Reading across both kinds of collection |
| `/collections-criteria/beta` | Managing [criteria collections](./criteria.md) |
| `/collections-joinable/beta` | Managing [joinable collections](./joinable.md) and their membership requests |

Every response is wrapped in an envelope:

```json
{ "data": { }, "isSuccess": true, "statusCode": 200, "errors": [] }
```

### All collections

Read-only, and covers criteria and joinable collections together.

| Method | Route | Description |
|-|-|-|
| `GET` | `/collections/beta` | List all collections. Optional `objectType` query parameter. |
| `GET` | `/collections/beta/search` | Search by `tags` and `attributes`. Attributes are given as `key:value`. |
| `GET` | `/collections/beta/{collectionId}` | A single collection |
| `GET` | `/collections/beta/{collectionId}/results` | Its members |
| `POST` | `/collections/beta/{collectionId}/filter-members` | Given a list of object ids, return those that are members |

!!! note "The kind is not on the payload"
    A collection returned by `/collections/beta` does not say whether it is a criteria or a joinable collection. If you need to know, look it up under the prefix for that kind.

### Criteria collections

| Method | Route | Description |
|-|-|-|
| `GET` | `/collections-criteria/beta` | List |
| `POST` | `/collections-criteria/beta` | Create. Returns the new id. |
| `GET` | `/collections-criteria/beta/{id}` | Get one |
| `PUT` | `/collections-criteria/beta/{id}` | Update |
| `DELETE` | `/collections-criteria/beta/{id}` | Delete |
| `GET` | `/collections-criteria/beta/{id}/results` | Members |
| `POST` | `/collections-criteria/beta/{id}/results/filter-members` | Filter a candidate list down to members |
| `POST` | `/collections-criteria/beta/preview` | Evaluate a condition without saving |
| `GET` | `/collections-criteria/beta/tenant-schemas` | The attributes available to filter on |

Creating one takes `objectType`, `name` and `condition`, with `description` and `metadata` optional:

```json
{
  "objectType": "Relationship",
  "name": "Employees in Bergen",
  "description": "Everyone employed at the Bergen office",
  "condition": {
    "groupOperator": "AND",
    "conditions": [
      {
        "id": "relationshipOfficeLocation",
        "field": "relationshipOfficeLocation",
        "operator": "Equals",
        "value": "Bergen"
      }
    ]
  },
  "metadata": { "tags": ["location"], "attributes": {} }
}
```

On update, only `objectType` is required — anything you leave out keeps its current value.

The preview endpoint takes the collection under a `preview` key, and optionally `currentId` to diff against an existing collection:

```json
{
  "currentId": "a3cd66b6-b1f3-420a-a5b6-24d4dce9ee23",
  "preview": { "objectType": "Relationship", "condition": { } }
}
```

It responds with `preview`, `added` and `removed`. See [previewing](./criteria.md#previewing).

### Joinable collections

| Method | Route | Description |
|-|-|-|
| `GET` | `/collections-joinable/beta` | List |
| `POST` | `/collections-joinable/beta` | Create |
| `GET` | `/collections-joinable/beta/{id}` | Get one |
| `PUT` | `/collections-joinable/beta/{id}` | Update |
| `DELETE` | `/collections-joinable/beta/{id}` | Delete |
| `GET` | `/collections-joinable/beta/{id}/results` | Members |
| `POST` | `/collections-joinable/beta/{id}/results/members` | Add members directly, bypassing the request flow |
| `DELETE` | `/collections-joinable/beta/{id}/results/members` | Remove members directly |
| `GET` | `/collections-joinable/beta/member-of` | Collections the caller is a member of |
| `GET` | `/collections-joinable/beta/search` | Search by `tags` and `attributes` |

Creating one takes `objectType`, `name` and `joinPolicy` — see [the join policy](./joinable.md#the-join-policy).

Adding or removing members directly takes IAM Core identity ids:

```json
{ "coreIdentityIds": ["d42a1f3f-4a1b-42e5-bb04-63536796ec70"] }
```

### Membership requests

All under `/collections-joinable/beta/membership-requests`. These are the endpoints behind the request and approval experience in the web interface.

| Method | Route | Description |
|-|-|-|
| `POST` | `/{collectionId}/submit` | Ask to join |
| `POST` | `/{collectionId}/submit-on-behalf` | A manager asks on behalf of a direct report |
| `GET` | `/{collectionId}` | Requests for a collection |
| `GET` | `/{collectionId}/{requestId}` | A single request |
| `POST` | `/{collectionId}/{requestId}/approve` | Approve at the current gate |
| `POST` | `/{collectionId}/{requestId}/reject` | Reject at the current gate |
| `POST` | `/{collectionId}/{requestId}/cancel` | Withdraw a request not yet decided |
| `POST` | `/{collectionId}/{requestId}/leave` | Leave a collection you are a member of |
| `GET` | `/eligible` | Collections the caller may request to join |
| `GET` | `/eligible/{userId}` | The same, for another user |
| `GET` | `/submitted-on-behalf` | Requests the caller filed for other people |
| `GET` | `/pending-approval` | The caller's own requests awaiting a decision |
| `GET` | `/pending-approval-review` | Collections where the caller is the current approver |
| `GET` | `/pending-approval-review/{collectionId}` | The requests in one of those collections awaiting the caller |

Submitting takes optional `notes` and a `relationshipId` naming the position the membership is for. Approve and reject take the same two; cancel and leave take just `relationshipId`. All of them expect a body, so send `{}` if you have nothing to say.

A request that cannot be acted on in its current state is refused — approving something that is not waiting at a gate, or leaving a collection you have not joined. Acting without being the current approver is refused as well. See [the request lifecycle](./joinable.md#the-request-lifecycle).