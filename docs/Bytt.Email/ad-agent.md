# AD agent installation guide

The ChangeEmail agent module is a simple module made for listening to change requests from Bytt.Email / ChangeEmail by Fortytwo, updating the user account in Active Directory and reporting back the status of the change. There are a few steps required to install the module and run it:

## Requirements

- The agent must be running on a domain joined windows server
- [PowerShell 7.5 or newer installed](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows#msi)
- AD PowerShell installed (```Install-WindowsFeature -Name RSAT-AD-Tools -IncludeAllSubFeature```)

## Step 1 - Install PowerShell modules

Run the below as administrator in order to install the required modules from PowerShell Gallery:

```PowerShell
Install-Module Fortytwo.ChangeEmail.Agent -Scope AllUsers
Install-Module EntraIDAccessToken -Scope AllUsers
```

## Step 2 - Configure ChangeEmailAgent requirements

Run the following as administrator:

```PowerShell
New-EventLog -LogName "Application" -Source "ChangeEmailAgent"
$Certificate = New-SelfSignedCertificate -Subject "ChangeEmailAgent" -NotAfter (Get-Date).AddYears(100)
[System.Convert]::ToBase64String($Certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert), "InsertLineBreaks") | Set-Content -Path "ChangeEmailAgent-$($env:COMPUTERNAME).cer"
"","Thumbprint:       $($Certificate.ThumbPrint)", "Certificate file: ChangeEmailAgent-$($env:COMPUTERNAME).cer"","" | Write-Host
```

## Step 3 - Consent to Fortytwo Universe (Our API) and create app registration for agent

1. As a global administrator, go to: https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408

2. In **Entra ID**, go to **App registrations** and click **New registration**

3. Give it a name and create **Register**

4. Note down the **Client ID** and **Tenant ID**:

![](media/20250905140155.png)

5. Under **Certificates & secrets** upload the certificate file created in Step 2

![](media/20250905140307.png)

6. Under **API permissions**, click **Add a permission**, select **APIs my organization uses** and locate **Fortytwo Universe**

![](media/20250905140407.png)

7. Under **Application permissions** check **changeemail.changerequest.readwrite.all** and click *Add permissions**.

8. Click **Grant admin consent**

## Step 4 - Create the run file for the ChangeEmail Agent

Create ```C:\changeemail\run.ps1``` with the following contents:

```PowerShell
Import-Module EntraIDAccessToken -force
Import-Module Fortytwo.ChangeEmail.Agent -force

Add-EntraIDClientCertificateAccessTokenProfile `
    -Scope "https://api.fortytwo.io/.default" `
    -Thumbprint "THUMBPRINT_FROM_STEP2" `
    -ClientId "CLIENT_ID_FROM_STEP3" `
    -TenantId "TENANT_ID_FROM_STEP3" `
    -V2Token:$true

Start-ChangeEmailAgentListener -Sleep 5 -Verbose -Debug
```

## Step 5 - Try to run the ChangeEmail agent manually

1. Open a PowerShell and run ```cd c:\changeemail ; . c:\changeemail\run.ps1```

At this point, you can test out ChangeEmail and see that requests are received and processed by the agent.

## Step 6 - Run the ChangeEmail agent as a scheduled task

1. Create a gMSA for the scheduled task
2. Delegate the gMSA the ability to update the attributes **userPrincipalName**, **mail** and **proxyAddresses** in AD
3. Create a scheduled task running as the gMSA that:
    - Runs the action ```pwsh -file c:\changeemail\run.ps1```
    - Every 2 minutes (Just in order to restart the task if it fails)
    - Do not run multiple instances