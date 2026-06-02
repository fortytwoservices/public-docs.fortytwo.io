# Demo data - HR

There are two dedicated demo data connectors for a non-existing Norwegian municipality named **Utkanten Kommune**. This connector provides HR data and [the other provides school information system data](./demodatasas.md), and is intended for demonstration purposes. We do not recommend using these data for anything in production, but feel free to play around in your development tenants.

## Configuration inputs

| Input | Description | Example value |
|-|-|-|
| relativedate | A relative date for all start and end dates | 2026-08-01 |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "SAS" `
    -TemplateId relativedate  `
    -Configuration @{
        schoolyear = "2026-09-01"
    }

Write-Host "Created with id $($Connector.id)"
```

## Example sync rules