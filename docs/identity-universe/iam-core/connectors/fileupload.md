# File upload

This describes common steps for any file upload based connector. 


## Example run.ps1

```PowerShell
[CmdletBinding()]
Param(
    [Parameter(Mandatory = $false)]
    [ValidateScript({ Test-Path $_ -PathType Leaf })]
    [string] $Path = "flyvodata.xml",
    
    [Parameter(Mandatory = $false)]
    [ValidatePattern({ $_ -match "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" })]
    [string] $ConnectorId = "b995377c-76c8-4f0d-972c-7c3d074299e3",

    [Parameter(Mandatory = $false)]
    [ValidatePattern({ $_ -like "*.zip" })]
    [string] $Tempfile = "connectordata.zip"
)

#region Use latest version of the Fortytwo.IAM.Core.Connector module
$_available = Get-Module -ListAvailable | Where-Object Name -eq 'Fortytwo.IAM.Core.Connector'
if (!$_available) {
    Install-Module Fortytwo.IAM.Core.Connector -Scope CurrentUser -Force -Confirm:$false
}
else {
    $_find = Find-Module Fortytwo.IAM.Core.Connector -Verbose
    if (!($_available | Where-Object Version -ge $_find.Version)) {
        Update-Module Fortytwo.IAM.Core.Connector -Verbose -Confirm:$false -Force
    }    
}
#endregion

#region Connect the module using an available method (Might need to be updated)
Add-EntraIDAzureVMMSIAccessTokenProfile -Scope "https://api.fortytwo.io/.scope" -Name Connector
Connect-Connector -ConnectorId $ConnectorId -AccessTokenProfile Connector
#endregion

#region Upload file
Write-ConnectorVerbose -Text "$($ENV:COMPUTERNAME): Creating connectordata.zip"
try {
    Compress-Archive -Path $Path -DestinationPath connectordata.zip
}
catch {
    Write-ConnectorError -Text "$($ENV:COMPUTERNAME): Failure during zip creation: $_" -InnerException $_ -Throw
}

Write-ConnectorVerbose -Text "$($ENV:COMPUTERNAME): Uploading connectordata.zip"
try {
    Send-ConnectorFile -Path connectordata.zip -Verbose 
    Write-ConnectorVerbose -Text "$($ENV:COMPUTERNAME): Successfully uploaded connectordata.zip"
}
catch {
    Write-ConnectorError -Text "$($ENV:COMPUTERNAME): Failure during upload: $_" -InnerException $_ -Throw
}

Remove-Item connectordata.zip
#endregion
```