# Demo data - SAS

There are two dedicated demo data connectors for a non-existing Norwegian municipality named **Utkanten Kommune**. This connector provides school information system data and [the other provides HR data](./demodatahr.md), and is intended for demonstration purposes. We do not recommend using these data for anything in production, but feel free to play around in your development tenants.

## Configuration inputs

| Input | Description | Example value |
|-|-|-|
| schoolyear | The starting school year of the connector | 2025/2026 |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "SAS" `
    -TemplateId utkantenkommunesas  `
    -Configuration @{
        schoolyear = "2027"
    }

Write-Host "Created with id $($Connector.id)"
```

## Example sync rules