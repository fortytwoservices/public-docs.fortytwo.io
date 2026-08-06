# Authenticating PowerShell

To use PowerShell to connect to the Fortytwo Universe proper authentication must performed.

A valid PowerShell session can be configured in multiple ways, provided the proper authentication.

## PowerShell module EntraIDAccessToken

Authentication is handled using the Fortytwo PowerShell module **EntraIDAccessToken**, available through PowerShell Gallery. Using the Fortytwo [EntraIDAccessToken](https://www.powershellgallery.com/packages/EntraIDAccessToken) PowerShell module is the way all Fortytwo PowerShell modules authenticate with the Fortytwo Universe.

EntraIDAccessToken has multiple ways of creating an **access token profile** using the ```Add-EntraID*AccessTokenProfile``` cmdlets (replace **\*** with preferred method). The available cmdlets are documented [here](https://github.com/fortytwoservices/powershell-module-entraidaccesstoken).

## Ways to issue an Entra ID access_token

To issue an Entra ID access token profile some common methods for an interactive user session are:

* Add-EntraIDClientSecretAccessTokenProfile
* Add-EntraIDClientCertificateAccessTokenProfile
* Add-EntraIDInteractiveUserAccessTokenProfile (here we are using this profile)

## Using EntraIDInteractiveUserAccessTokenProfile

To add an EntraIDAccessToken profile and authenticate to Fortytwo Universe:

```PowerShell
Add-EntraIDInteractiveUserAccessTokenProfile -Name "Default" -TenantId "TENANTID" -ClientId "68bf2f1d-b9e1-4477-8b90-81314861f05f" -Scope "https://api.fortytwo.io/.default"
```

The **TenantId** will be your Entra tenant identifier (GUID) or tenant name.  
The **ClientId** is the enterprise application **Fortytwo Universe - Prod - PowerShell Client**.

## Consent

Enterprise application **Fortytwo Universe - Prod - PowerShell Client** requires consent. This can be provided when using the client id for the first time, or it can be provided by admin consent (this follows the same process as the [consent flow for Identity Universe WebUI](../getting-started/index.md#admin-consent---user-consent)).

Admin consent URL for **Fortytwo Universe - Prod - PowerShell Client**:  
[https://login.microsoftonline.com/common/adminConsent?client_id=68bf2f1d-b9e1-4477-8b90-81314861f05f](https://login.microsoftonline.com/common/adminConsent?client_id=68bf2f1d-b9e1-4477-8b90-81314861f05f)

With these steps completed you will have been issued an access_token that can be used to establish a connection with the collections API.

## More ways to issue an Entra ID access_token

A few common EntraIDAccessToken methods are described in this article. For a more extensive list, using system-assigned identities, or an Azure Arc identity, you may want to take a look [here](../../identity-universe/iam-core/authentication-powershell.md).