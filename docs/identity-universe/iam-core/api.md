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