---
sidebarTitle: "Minimum permissions"
hidden: true
description: It is supported to limit the CheckID permissions to User.Read.All, CustomSecAttributeAssignment.Read.All and the Authentication Administrator role on an Administrative Unit.
---

# Configuring minimum permissions

To simplify onboarding of CheckID as much as possible, we request the permission **UserAuthenticationMethod.ReadWrite.All**, which grant access to create a Temporary Access Pass for each user (And also reset other authentication methods).

It is supported to limit the CheckID permissions to the following:

| Permission | Why it’s needed |
|------------|------------------|
| [**User.Read.All**](https://learn.microsoft.com/en-us/graph/permissions-reference#userreadall) | Allows CheckID to locate and read user account details in your tenant |
| [**CustomSecAttributeAssignment.Read.All**](https://learn.microsoft.com/en-us/graph/permissions-reference#customsecattributeassignmentreadall) | Enables CheckID to read custom attribute assignments. This permission has no effect unless the CheckID service principal is explicitly assigned the **Attribute assignment reader** role in Microsoft Entra. |
| [**Authentication Administrator role on an Administrative Unit**](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference#authentication-administrator) | Grants CheckID access to manage authentication methods for users, but only the members of an administrative unit, instead of all users in your tenant. |

## Steps

::::steps
### Add CheckID app and consent

:::note
In this situation, you cannot use the default user interface for admin consent.
:::

Instead, you need to add the CheckID app using the below PowerShell:

```powershell
# Connect your PowerShell session
Connect-MgGraph -Scope Application.ReadWrite.All, AppRoleAssignment.ReadWrite.All

$CheckID = Get-MgServicePrincipal -Filter "AppId eq 'b1c6646a-37c6-4a69-ae96-d6468e2c2a89'"

if(!$CheckID) {
    $CheckID = New-MgServicePrincipal -AppId "b1c6646a-37c6-4a69-ae96-d6468e2c2a89"
    Write-Host "Sleeping 20 seconds for Entra ID to replicate"
    Start-Sleep -Seconds 20
}
$MicrosoftGraph = Get-MgServicePrincipal -Filter "AppId eq '00000003-0000-0000-c000-000000000000'"

# Add permission user.read.all
Invoke-MgGraphRequest -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$($MicrosoftGraph.id)/appRoleAssignments" -Method POST -Body @{
    principalId = $CheckID.Id
    resourceId = $MicrosoftGraph.id
    appRoleId = "df021288-bdef-4463-88db-98f22de89214"
} | out-null

# Add permission CustomSecAttributeAssignment.Read.All
Invoke-MgGraphRequest -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$($MicrosoftGraph.id)/appRoleAssignments" -Method POST -Body @{
    principalId = $CheckID.Id
    resourceId = $MicrosoftGraph.id
    appRoleId = "3b37c5a4-1226-493d-bec3-5d6c6b866f3f"
} | out-null
```

At this point, you'll see that CheckID has only two permissions and not currently access to create TAPs:

![CheckID with only two permissions](../media/guides/20251028140731.png)

### Create AU and grant CheckID access

In **Entra ID**, find **Administrative units** and click **+ New administrative unit**.

Name the AU something that makes sense for your environment.

:::warning
Do **not** configure it as a Restricted management administrative unit.
:::

![New administrative unit](../media/guides/20251028140832.png)

Click **Review + create** (It is not currently possible to grant Service principals access during creation)

![Review and create the administrative unit](../media/guides/20251028141007.png)

Open your administrative unit, go to **Roles and administrators** and click on **Authentication Administrator**:

![Roles and administrators in the administrative unit](../media/guides/20251028141105.png)

Locate CheckID as the member:

![Locate CheckID as the member](../media/guides/20251028141154.png)

Input a justification and click **Assign**:

![Input a justification and assign](../media/guides/20251028141247.png)

Your environment should now look something like this:

![CheckID assigned as Authentication Administrator](../media/guides/20251028141321.png)

### Custom security attribute access

Following the [Custom Security Attributes part of the guide](../identity-data/custom-security-attributes.md)
::::
