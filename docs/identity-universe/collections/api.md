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
| (to come) Collection Criteria - User | collection_criteria_definition-user | Read access to collections |

### Applications

Can only be assigned to applications:

| Role                                        |  Role value | Granted access |
|---------------------------------------------|-------------|----------------|
| collections-criteria.criteria.read.all      | collections-criteria.criteria.read.all | Read all criteria definitions and all results. |
| collections-criteria.criteria.readwrite.all | collections-criteria.criteria.readwrite.all | Read and write all criteria definitions and read all results. |