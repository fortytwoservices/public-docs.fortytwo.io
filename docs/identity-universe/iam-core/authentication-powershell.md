# Authenticating PowerShell

This page describes different ways of authenticating PowerShell to the Fortytwo Universe, for different automations, such as [uploading file data](./connectors/fileupload.md), talking to the [connector API](./connector-api.md), etc.

All scripts use the [EntraIDAccessToken PowerShell module](https://www.powershellgallery.com/packages/EntraIDAccessToken), which means that the only thing required to connect is to complete one of the available ```Add-EntraID*AccessTokenProfile``` cmdlets. This is documented [here](https://github.com/fortytwoservices/powershell-module-entraidaccesstoken), but below are the most common scenarios covered.

## Running in an Azure VM

!!! info "Server must be in a subscription in the same tenant as you want to manage Fortytwo Universe for. If you need cross tenant authentication, use the certificate based approach just like alocal server."

### System assigned

![alt text](media/image-1.png)

```PowerShell
Add-EntraIDAzureVMMSIAccessTokenProfile -Scope "https://api.fortytwo.io/.scope" -Name Connector
```

### User assigned

![alt text](media/image-2.png)

```PowerShell
Add-EntraIDAzureVMMSIAccessTokenProfile -Scope "https://api.fortytwo.io/.scope" -Name Connector -UserAssignedIdentityClientId "00000000-0000-0000-0000-000000000000"
```

## Running on a local server

### Azure Arc

```PowerShell
Add-EntraIDAzureArcManagedMSITokenProfile -Resource "https://api.fortytwo.io" -TenantId "00000000-0000-0000-0000-000000000000" -ClientId "00000000-0000-0000-0000-000000000000"
```

### Certificate based authentication

