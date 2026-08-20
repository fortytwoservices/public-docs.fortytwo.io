# API

[Swagger](https://api.fortytwo.io/iamcore/swagger)

## Authentication

All API endpoints are authenticated with the customer's own Entra ID, through our multi tenant application [Fortytwo Universe](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408). This means that you can use any kind of identity to talk to our API! Users, Agents, Service Principals, Managed Service Identities, you name it. As long as you can get a token for the scope ```https://api.fortytwo.io/.default``` or the resource ```2808f963-7bba-4e66-9eee-82d0b178f408``` you are good.

**Ok, so how do I get an access token?**

In order to document that, we would have a lot of content with overlap with Microsoft's own documentation, but we strongly recommend using our PowerShell module named [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken), which makes this super easy! We have a multi tenant client app client id ```68bf2f1d-b9e1-4477-8b90-81314861f05f```, that allows redirect to localhost for simple and interactive sign-ins.

```PowerShell
# Invoke interactive sign in
Add-EntraIDInteractiveUserAccessTokenProfile -Scope https://api.fortytwo.io/.default -ClientId 68bf2f1d-b9e1-4477-8b90-81314861f05f

# Get access token and copy it to clipboard
Get-EntraIDAccessToken | Set-Clipboard

# Or invoke a request
Invoke-RestMethod "https://api.fortytwo.io/iamcore/sync/connectors" -Headers (Get-EntraIDAccessTokenHeader)
```

## Authorization

All API endpoints requires some kind of authorization, which should be listed on the swagger.

### Users

Can be assigned only to users:

| Role | Grants access to |
|-|-|
| User | Get the delegated access to org units, see him/herself and his/her data |
| Administrator | Full access to everything: Read all data, configure connectors and sync rules, invoke syncs, etc. |

### Applications

Can be assigned only to applications:

| Role                                                     | Grants access to |
|----------------------------------------------------------|-|
| iam-core.connector-configuration.read.all                | Grants the ability to read connectors |
| iam-core.connector-configuration.readwrite.all           | Grants the ability to manage connectors |
| iam-core.connector-data.readwrite.self                   | Grants access to a connector's connector space, required to act as a connector |
| iam-core.synchronization-configuration.read.all          | Grants the ability to read sync rules |
| iam-core.synchronization-configuration.readwrite.all     | Grants the ability to manage sync rules |

## Reading core objects

Each core object type has its own set of routes under `https://api.fortytwo.io/iamcore/beta/sync/coreobjects`:

| Method | Route | Description |
|-|-|-|
| `GET` | `/coreobjects/identities` | List identities |
| `GET` | `/coreobjects/identities/{id}` | One identity |
| `GET` | `/coreobjects/identities/{id}/relationships` | The relationships that identity holds |
| `GET` | `/coreobjects/identities/search?text=` | Search identities |
| `POST` | `/coreobjects/identities/multiple` | Several identities by id, body `{ "ids": [] }` |
| `GET` | `/coreobjects/orgunits` | List org units |
| `GET` | `/coreobjects/orgunits/{id}` | One org unit |
| `GET` | `/coreobjects/orgunits/{id}/relationships` | The relationships attached to that org unit |
| `GET` | `/coreobjects/orgunits/search?text=` | Search org units |
| `POST` | `/coreobjects/orgunits/multiple` | Several org units by id, body `{ "ids": [], "includeParents": false }` |
| `GET` | `/coreobjects/relationships` | List relationships |
| `GET` | `/coreobjects/relationships/{id}` | One relationship |
| `GET` | `/coreobjects/relationships/search?text=` | Search relationships |
| `POST` | `/coreobjects/relationships/multiple` | Several relationships by id, body `{ "ids": [] }` |

!!! warning "One deprecated route"
    `GET /coreobjects/relationships/identity/{identityId}` still works but is deprecated. Use `GET /coreobjects/identities/{id}/relationships` instead.

### Paging

The three list endpoints are paged. Pass `pageSize` — the default is 2000 — and, for anything after the first page, the `nextCursor` returned by the previous response:

```
GET /iamcore/beta/sync/coreobjects/identities?pageSize=500
GET /iamcore/beta/sync/coreobjects/identities?pageSize=500&nextCursor=v1_...
```

**`nextCursor` is absent on the last page**, and that is how you know to stop — not an empty `data` array.

The cursor is an opaque string. Do not parse it or construct one. It is safe to hold on to and replay: sending the same cursor twice returns the same page, and a cursor keeps working across service restarts. A cursor that has been altered causes the request to fail rather than silently restarting from the beginning.

The [PowerShell module](./powershell-module.md) walks the pages for you, so this only matters when calling the API directly.

### Searching

The `search` endpoints take a required `text` parameter, return at most 100 results, and exclude deleted objects. Some attributes are matched exactly and others on a substring:

| Object type | Matched exactly | Matched on a substring |
|-|-|-|
| Identity | `nin`, `entraObjectId`, `entraOnPremisesSamAccountName` | `displayName`, `email`, `entraUserPrincipalName` |
| OrgUnit | `externalId` | `displayName`, `email` |
| Relationship | `employeeId` | `title` |

Substring matching ignores case. There are no wildcards and no field selectors — it is a plain lookup.

### lastUpdated

Core object and connector object responses carry a `lastUpdated` timestamp, which is when the record was last written. It is useful for change detection and cache invalidation.

It reflects any write to the record, including internal ones, so it is not an audit trail of business changes, and it has one-second resolution. It is omitted entirely for records that have never been written since the field was introduced.