# Install Active Directory Agent

:::note
If you do not have Active Directory users that will be using Change Email, or want to test out the service without granting access, then skip this step.
:::

The ChangeEmail agent module is a simple module made for listening to change requests from Bytt.Email / ChangeEmail by Fortytwo, updating the user account in Active Directory and reporting back the status of the change. There are a few steps required to install the module and run it.

## Server requirements

- The agent must be running on a domain joined windows server (You can run the agent on the Entra ID Connect or Entra ID Cloud sync server)
- [PowerShell 7.6](https://learn.microsoft.com/en-us/powershell/scripting/install/install-powershell-on-windows?view=powershell-7.6#msi)
- [EntraIDAccessToken PowerShell module](../../iam-core/api/authentication-powershell.md)
- AD PowerShell installed:

  ```powershell
  Install-WindowsFeature -Name RSAT-AD-Tools -IncludeAllSubFeature
  ```

## Install the agent

::::steps
### Create a certificate

Run the following as administrator:

```powershell
New-EventLog -LogName "Application" -Source "ChangeEmailAgent"
$Certificate = New-SelfSignedCertificate -Subject "changeemail" -NotAfter (Get-Date).AddYears(100)

[System.Convert]::ToBase64String(
    $Certificate.Export(
        [System.Security.Cryptography.X509Certificates.X509ContentType]::Cert
    ),
    [System.Base64FormattingOptions]::InsertLineBreaks
) | Set-Content -Path "changeemail-$($env:COMPUTERNAME).cer"

Write-Host "" "Thumbprint:       $($Certificate.ThumbPrint)" "Certificate file: changeemail-$($env:COMPUTERNAME).cer" "" -Separator "`n"
```

### Create app registration for agent

1. In **Entra ID**, go to **App registrations** and click **New registration**

1. Give it a name and create **Register**

1. Note down the **Client ID** and **Tenant ID**:

    ![Client ID and Tenant ID of the app registration](../media/appreg-1.png)

1. Under **Certificates & secrets** upload the certificate file created in Step 1

    ![Certificates & secrets with the uploaded certificate](../media/appreg-2.png)

1. Under **API permissions**, click **Add a permission**, select **APIs my organization uses** and locate **Fortytwo Universe**

    ![Fortytwo Universe under APIs my organization uses](../media/appreg-3.png)

1. Under **Application permissions** check **changeemail.changerequest.readwrite.all** and click **Add permissions**.

    ![Request API permissions](../media/appreg-4.png)

1. Click **Grant admin consent**

### Create the run file for the ChangeEmail Agent

Create `C:\changeemail\run.ps1` with the following contents:

```powershell
# Install and auto update the agent module
Install-Module Fortytwo.ChangeEmail.Agent -Confirm:$false -Force -Verbose -Scope CurrentUser
Import-Module Fortytwo.ChangeEmail.Agent -force

Add-EntraIDClientCertificateAccessTokenProfile `
    -Scope "https://api.fortytwo.io/.default" `
    -Thumbprint "THUMBPRINT_FROM_STEP1" `
    -ClientId "CLIENT_ID_FROM_STEP2" `
    -TenantId "TENANT_ID_FROM_STEP2"

Start-ChangeEmailAgentActiveDirectoryListener -Sleep 60 -Verbose
```

If you are running Entra ID Connect Sync and the script is running on this server, we recommend granting the account that will be running the agent the "ADSyncAdmins" role (local group on the server) and replace the last line in the previous script with this, in order to allow it to trigger sync whenever there are email address changes:

```powershell
Start-ChangeEmailAgentActiveDirectoryListener -Sleep 60 -Verbose -RunBlockAfterChange {
    start-sleep 5
    powershell -command 'start-adsyncsynccycle'
}
```

You can also run the connect sync on another server, if you use Invoke-Command like below, replacing the SERVERNAME with your Entra Connect server. In this configuration, your gMSA must be added to the "Remote Management Users" group locally on your Entra Connect server, as well as the ADSyncAdmins group.

```powershell
Start-ChangeEmailAgentActiveDirectoryListener -Sleep 60 -Verbose -RunBlockAfterChange {
    start-sleep 5
    Invoke-Command -ScriptBlock {start-adsyncsynccycle} -ComputerName SERVERNAME
}
```

### Try to run the ChangeEmail agent manually

Open a PowerShell and run:

```powershell
cd c:\changeemail ; . c:\changeemail\run.ps1
```

At this point, you can test out ChangeEmail and see that requests are received and processed by the agent.

### Run the ChangeEmail agent as a scheduled task

#### Create a gMSA for the scheduled task

Run the below PowerShell in order to create a gMSA:

```powershell
New-ADServiceAccount -Name "changeemail" -PrincipalsAllowedToRetrieveManagedPassword "$($env:COMPUTERNAME)$" -DNSHostName "changeemail"
```

#### Delegate the gMSA permissions to three attributes in AD

For each OU where the agent should be able to handle email addresses, run the following three PowerShell lines (with the correct OU path and domain name):

```powershell
dsacls "OU=Users,DC=contoso,DC=com" /I:S /G '"contoso.com\changeemail$:rpwp;mail";user'
dsacls "OU=Users,DC=contoso,DC=com" /I:S /G '"contoso.com\changeemail$:rpwp;userPrincipalName";user'
dsacls "OU=Users,DC=contoso,DC=com" /I:S /G '"contoso.com\changeemail$:rpwp;proxyAddresses";user'
```

#### Grant permission to certificate

Run **certlm.msc**, locate the **changeemail** certificate under **Personal** certificates, and **Manage private keys**

![Manage private keys on the changeemail certificate](../media/perm-1.png)

Locate the gMSA you created, and grant **Full control**. Make sure you select **Service Account** as on object type when you search.

![Full control granted to the gMSA](../media/perm-2.png)

#### Grant permission to Log on as a batch job

![Log on as a batch job permission for the gMSA](../media/perm-3.png)

#### Create scheduled task for the agent

Create a scheduled task running as the gMSA that:

- Runs the action `pwsh` with the arguments `-file c:\changeemail\run.ps1`
- Trigger at startup
    - Delay 1 minute
    - Repeat every 5 minutes indefinitely (in order to restart the agent if it fails)
    - Do not stop task if it runs longer than anything
- Do not run multiple instances
- Never stop the task if running for a long time

Typical configuration:

![Scheduled task configuration](../media/sct-1.png)

![Scheduled task configuration](../media/sct-2.png)

![Scheduled task configuration](../media/sct-3.png)

![Scheduled task configuration](../media/sct-4.png)

![Scheduled task configuration](../media/sct-5.png)

:::tip[Having trouble with adding the task as a gMSA?]
Create the task running as your own user account first, and update the task using PowerShell:

```powershell
$task = Get-ScheduledTask -TaskName "ChangeEmailAgent"
 
$principal = New-ScheduledTaskPrincipal -UserId "contoso.com\changeemail$" -LogonType ServiceAccount
 
$task.Principal = $principal
Set-ScheduledTask -InputObject $task
```
:::
::::
