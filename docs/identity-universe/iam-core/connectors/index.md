# Connectors

Connectors are one of the most essential part of IAM Core, as it is the only way for data to flow into it. There is no way to modify a [core object](../objecttypes/common.md) without the information being flown through a [sync rule](../syncrules.md) from a connector.

Each connector has its own space for data, where no other connector can touch. This space is called the _connector space_. One connector does not know about other connectors.

In order to make the [sync rules](../syncrules.md) as powerfull as possible, while also providing you as the IAM Admin insight into connector data, changes that have happened, etc. the goal of connectors is that the connector space is as similar to the originating data as possible. This means that if the first name of a person record in the HR system is named _given_, it should also be named _given_ in that connector's connector space. This way it is much easier to understand what was actually changed in the HR system, and it is up to the [sync rules](../syncrules.md) to map the information from _given_ in the connector space to the _firstName_ attribute of a [CoreIdentity](../objecttypes/coreidentity.md).

For organizations with multiple source systems, [sync rules](../syncrules.md) have join functionality to ensure that certain objects, such as the [CoreIdentity](../objecttypes/coreidentity.md) of an employee exists only once, even though that employee is registered in multiple HR systems, with multiple part time positions. 

## Connector types

There are a few general types of connectors:

### First party connector

A first party connector is connector where Fortytwo maintains the integration, such as for [Visma Enterprise Plus](./vismaenterpriseplus.md) and [Simployer](./alexishr.md), and you as a customer only provides the required input configuration, such as a username and password, client id and secret, certificate, etc.

After a first party connector is created, it has the state "Created", until the first party connector runtime of the IAM Core picks it up and creates a job for it, after which it becomes "Provisioned".

### API based connector

An API based connector is a connector where you as the customer can populate data from any system, using our [Connector API](../connector-api.md) or our [Connector PowerShell Module](../connector-powershell-module.md) (Which uses the API...). From a [syncrule](../syncrules.md) standpoint, these connectors work as any first party connector. It is only the way the connector space is actually populated that differs from the first party connectors.

### Entra ID SCIM connector

An [Entra ID SCIM connector](./entraidscim.md) is a connector where Entra ID can send data about users, in order to populate certain attributes on [CoreIdentities](../objecttypes/coreidentity.md), such as ```EntraObjectId```, which is required for users to access most features (used to identity the link between a signed in session and the [CoreIdentity](../objecttypes/coreidentity.md)).

From a [syncrule](../syncrules.md) standpoint, these connectors work as any other connector.

