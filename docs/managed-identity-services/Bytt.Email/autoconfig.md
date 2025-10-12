# Automatically configure everything

The following can be run as a global administrator. The script will do the following:

- Consent to applications as in [configuration step 1](config-step1.md)
- Create an Entra ID group for email patterns for all domains in the tenant (as per [configuration step 2](config-step2.md))
- Grant the created groups access to Bytt.Email (as per [configuration step 3](config-step3.md))
- Create an administrative unit named **Bytt.email**, with all members of all the email pattern groups as members (as per [configuration step 4](config-step4.md))
- Grant Bytt.Email the user administrator role of the administrative unit

```PowerShell
Install-Module Microsoft.Graph.Authentication, Microsoft.Graph.Applications, Microsoft.Graph.Groups, Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Identity.DirectoryManagement, Fortytwo.ByttEmail.Installation -Scope CurrentUser

Install-ByttEmail
```

After this, the service should work as intended, except for Active Directory synchronized user. For these users, [the AD agent must be configured](config-step5.md).