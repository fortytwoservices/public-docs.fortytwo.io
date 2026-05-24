# Connectors

## Connector types

Connectors are the one and only way to get data into the IAM Core. There are a few general types of connectors:

### First party connector

A first party connector is connector where Fortytwo maintains the integration, such as for [Visma Enterprise Plus](./connectors/vismaenterpriseplus.md), and you as a customer only provides the required input configuration, such as a username and password, client id and secret, certificate, etc.

After a first party connector is created, it has the state "Created", until the first party connector runtime of the IAM Core picks it up and creates a job for it, after which it becomes "Provisioned".

### API based connector

AN API based connector, is a connector where you as the customer can populate data from any system, using our [Connector API](./connector-api.md) or our [Connector PowerShell Module](./connector-powershell-module.md).


### Entra ID SCIM connector

