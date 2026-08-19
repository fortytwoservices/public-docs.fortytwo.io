# Connector API

The Connector API is how an [API based connector](./connectors/index.md#api-based-connector) populates its own connector space. It lets you bring data from any system into IAM Core, whether or not Fortytwo has a first party connector for it.

If you are working in PowerShell, the [Connector PowerShell Module](./connector-powershell-module.md) wraps this API and handles the full-import bookkeeping for you. This page describes what it does underneath.

All routes below are relative to `https://api.fortytwo.io/iamcore/beta`.

## Setting up

An API based connector is tied to exactly one Entra ID application registration, and can only be written to by that application.

1. **Create an app registration** in your own Entra ID.
2. **Grant it the `iam-core.connector-data.readwrite.self` application permission** on the Fortytwo Universe enterprise application, and have an administrator consent to it. This is the only permission a connector needs.
3. **Create the connector** from the `API` template, giving it the application's client id:

    ```PowerShell
    $Connector = New-IAMCoreConnector `
        -Name "My HR system" `
        -TemplateId "API" `
        -Configuration @{
            clientid = "<the app registration client id>"
        }
    ```

The connector will only accept writes from that exact application. If a call is rejected with `403`, it is almost always one of:

- the token belongs to a signed-in user rather than an application — a connector must authenticate as an application, using client credentials
- the client id on the token does not match the `clientid` on the connector
- the connector is disabled

## Authentication

Get a token for the scope `https://api.fortytwo.io/.default` using the client credentials flow, and send it as a bearer token. See [authentication with PowerShell](./authentication-powershell.md) for the easiest way to do this.

## The connector object

Everything in a connector space is a connector object:

```json
{
  "externalId": "12345",
  "objectType": "person",
  "data": {
    "id": "12345",
    "names": { "firstname": "Ola", "lastname": "Nordmann" },
    "nin": "01019012345",
    "entitlements": ["ent1", "ent2"]
  }
}
```

| Field | Description |
|-|-|
| `externalId` | The identifier this object has in the source system. Required. |
| `objectType` | The kind of object, for example `person`, `position` or `department`. Required, and freely chosen by you. |
| `data` | Arbitrary JSON. Nested objects and arrays are preserved exactly as you send them. |

An object is identified by the **pair** of `externalId` and `objectType`. Two objects of different types may share an external id, but two `person` objects may not.

!!! tip "Keep the data close to the source"
    Resist the urge to clean up or rename fields on the way in. The connector space is meant to look like the source system, so that changes there are easy to recognise, and so that [sync rules](./syncrules.md) remain the single place where mapping happens. If the HR system calls it `given`, call it `given`.

Two constraints matter when choosing property names in `data`:

- **Do not use `/` in property names.** Sync rules address nested data with slash-separated paths, so `names/firstname` reaches into `names`. A property with a slash in its own name cannot be addressed.
- **Casing must be stable.** Attribute lookup is case sensitive, so a source that alternates between `firstName` and `firstname` between imports will break flows.

## Endpoints

| Method | Route | Description |
|-|-|-|
| `GET` | `/sync/connectors/{connectorId}/data` | Everything currently in the connector space |
| `POST` | `/sync/connectors/{connectorId}/data` | Create an object |
| `GET` | `/sync/connectors/{connectorId}/data/{objectType}/{externalId}` | One object, by the identifiers you gave it |
| `PUT` | `/sync/connectors/{connectorId}/data/{connectorObjectId}` | Replace an object |
| `DELETE` | `/sync/connectors/{connectorId}/data/{connectorObjectId}` | Delete an object |
| `GET` | `/sync/connectors/{connectorId}/data/configuration` | The connector's own configuration |

Responses are wrapped in an envelope:

```json
{ "data": [ ... ], "isSuccess": true, "statusCode": 200, "errors": [] }
```

A few behaviours worth knowing:

- A successful create returns **201**, with a `Location` header pointing at the new object.
- Creating an object whose `externalId` and `objectType` already exist returns **409**.
- On a `PUT`, the `id` in the body must either be omitted or match the id in the route.
- A `PUT` whose `data` is identical to what is already stored is a no-op, so re-sending unchanged objects is cheap and does not register as a change.

Looking an object up by the identifiers you already have avoids keeping a map of your own ids to IAM Core ids:

```
GET /iamcore/beta/sync/connectors/{connectorId}/data/person/12345
```

Objects also carry a `lastUpdated` timestamp recording when they were last written. See [lastUpdated](./api.md#lastupdated).

## Deleting, and how full imports work

There is no server-side notion of a full import. **Leaving an object out of an import does not delete it** — the connector space keeps whatever it was last told, so deletions have to be explicit.

A full import is therefore a diff performed by the connector:

1. `GET` the current contents of the connector space.
2. Compare against the source system.
3. `POST` what is new, `PUT` what changed, and `DELETE` what is no longer in the source.

The [Connector PowerShell Module](./connector-powershell-module.md) implements exactly this, which is the main reason to use it rather than calling the API directly.

Deletion is not immediate. A deleted object is retained for a period so it can come back if it reappears in the source — controlled per connector by `softDeletionDays`, which defaults to 90. Within that window, re-creating an object with the same `externalId` and `objectType` restores it, **keeping its link to the core object**. That means a person who briefly disappears from an HR export does not get a brand new identity when they return. After the retention period the object is removed permanently.

## Synchronizing

Writing to the connector space does not by itself change any core objects. Once an import has finished, run a synchronization so the [sync rules](./syncrules.md) are evaluated:

```PowerShell
New-IAMCoreSyncJob | Wait-IAMCoreSyncJob
```

!!! note "Use a full sync for API connectors"
    The `ConnectorImport` job type is for Fortytwo-hosted first party connectors, which fetch their own data. For an API based connector you have already done the importing, so what you want is `FullSyncTenant` — the default.

## Checking what arrived

```PowerShell
# Object counts per type
Get-IAMCoreConnectorDataStatistics -Id $Connector.id

# Look at an individual object
Find-IAMCoreConnectorDataObject -ConnectorId $Connector.id -ConnectorObjectType "person" |
    Select-Object -First 1
```
