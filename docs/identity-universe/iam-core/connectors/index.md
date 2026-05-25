# Connectors

## Connector types

Connectors are the one and only way to get data into the IAM Core. There are a few general types of connectors:

### First party connector

A first party connector is connector where Fortytwo maintains the integration, such as for [Visma Enterprise Plus](./vismaenterpriseplus.md) and [Simployer](./alexishr.md), and you as a customer only provides the required input configuration, such as a username and password, client id and secret, certificate, etc.

After a first party connector is created, it has the state "Created", until the first party connector runtime of the IAM Core picks it up and creates a job for it, after which it becomes "Provisioned".

### API based connector

An API based connector is a connector where you as the customer can populate data from any system, using our [Connector API](../connector-api.md) or our [Connector PowerShell Module](../connector-powershell-module.md) (Which uses the API...). From a [syncrule](../syncrules.md) standpoint, these connectors work as any first party connector. It is only the way the connector space is actually populated that differs from the first party connectors.

### Entra ID SCIM connector

An [Entra ID SCIM connector](./entraidscim.md) is a connector where Entra ID can send data about users, in order to populate certain attributes on [CoreIdentities](../objecttypes/coreidentity.md), such as ```EntraObjectId```, which is required for users to access most features (used to identity the link between a signed in session and the [CoreIdentity](../objecttypes/coreidentity.md)).

From a [syncrule](../syncrules.md) standpoint, these connectors work as any other connector.

