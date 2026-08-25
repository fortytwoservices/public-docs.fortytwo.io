# Dottie

## Configuration inputs

| Input | Description | Example value |
|-|-|-|
| clientid | Client ID of the API token created by following the [Dottie API docs](https://github.com/meetdottie/dottie-api-docs) | NABfNzX |
| apikey | The key of the client created | N/A |

## Creating a connector using PowerShell

!!! note "You must first ```Connect-IAMCore```, as per [the documentation](../powershell-module.md)"

```PowerShell
$Connector = New-IAMCoreConnector `
    -Name "Dottie" `
    -TemplateId dottie `
    -Configuration @{
        clientid = "your-client-id"
    } `
    -Secrets @{
        apikey = "your-client-secret"
    }
```

## External documentation

- [Dottie API docs](https://github.com/meetdottie/dottie-api-docs)
- [Dottie API swagger](https://api.dottie.no/swagger/index.html)
