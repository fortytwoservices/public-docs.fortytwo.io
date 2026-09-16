# API

!!! note "Unfinished, this will be expanded"

All education API endpoints are documented in the [swagger](https://api.fortytwo.io/education/swagger).

## Authentication

The API uses bearer token based authentication, with Entra ID as the identity provider. 

### PowerShell

```PowerShell
# Install the required module
Install-Module Fortytwo.Universe -Scope CurrentUser

# Connect to the Universe using interactive sign-in
Connect-Universe

# Get the access token to the Universe API
Get-UniverseToken | Set-Clipboard
```

### Get it from the portal


