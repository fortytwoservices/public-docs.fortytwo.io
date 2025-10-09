# Bytt.Email

[Bytt.Email](https://bytt.email) is our service for allowing end users to change their own email address and UPN, both in Entra ID and Active Directory.

![](media/20250923153114.png)

The service is payed for through Azure Marketplace (Coming soon).

## Consenting access

!!! NOTE
    The following operations must be done as one of the following roles:
    
    - Global Administrator
    - Cloud Application Administrator
    - Application Administrator

1. Consent to Fortytwo Universe, our API hub:

    [https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408)
    <!-- Development: https://login.microsoftonline.com/common/adminconsent?client_id=c61cb4dd-35bf-4db9-b152-58e223782c11 -->

2. Consent to the Bytt.Email application:

    [https://login.microsoftonline.com/common/adminconsent?client_id=34ee8edb-d2ff-4ee9-bac3-73b53303e00f](https://login.microsoftonline.com/common/adminconsent?client_id=34ee8edb-d2ff-4ee9-bac3-73b53303e00f)
    <!-- Development: https://login.microsoftonline.com/common/adminconsent?client_id=5a0b1107-0774-4bd4-a2fd-cf343ce79c56 -->

### Required graph permissions

| Required permission | Why? |
|-|-|
| User.Read.All | The solution needs to get the details of the user account that signs in, such as firstname, lastname, userPrincipalName and proxyAddresses |
| GroupMember.Read.All | Because we need to find email pattern groups as documented below |

## Grant users access

Locate the **Fortytwo Universe** app under Entra ID and Enterprise Apps:

![](media/20250918122839.png)

Under **Users and groups**, click **Add user/group**.

![](media/20250918122924.png)

Assign any relevant user or group of users. These will be allowed to use the Bytt.Email service to change their email.

![](media/20250918123012.png)

The assignments should now look like this. Notice that if you utilize other Fortytwo services, these role assignments are also managed here.

![](media/20250918123036.png)

## Configure write permissions / fulfillment

> **Note:** It is possible to test the service without granting write permissions, in that case simply skip this section

If you have users in Active Directory synced to Entra ID, you need to [configure the AD agent](./ad-agent.md).

If you have cloud users, you need to [create an Administrative Unit](./au.md) and assign Bytt.Email permissions.

## Configure email patterns

Email patterns for Bytt.Email are configured through Entra ID groups with extension properties in your tenant.

By consenting to Bytt.Email, you now have three new multivalued string attributes available for groups in your tenant:

| Attribute | Description 
|-|-|
| extension_34ee8edbd2ff4ee9bac373b53303e00f_aliaspatterns | Patterns available as email alias only |
| extension_34ee8edbd2ff4ee9bac373b53303e00f_signinnamepatterns | Patterns available as sign-in name only |
| extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns | Patterns available both as sign-in name and alias |

In order to override the default email patterns available to your users, you can add users as member of group with one or more of these attributes set.

These attributes can be set by using [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) and sending a PATCH request to https://graph.microsoft.com/v1.0/groups/OBJECTID-OF-GROUP

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns": [
        "{firstname1}.{lastname-1}@yourdomain.com",
        "{firstname1}.{firstname2}.{lastname-1}@yourdomain.com",
        "{firstname1}.{lastname-2}.{lastname-1}@yourdomain.com",
        "{firstnamewd1}.{lastnamewd-1}@yourdomain.com",
        "{firstnamewd1}.{firstnamewd2}.{lastnamewd-1}@yourdomain.com",
        "{firstnamewd1}.{lastnamewd-2}.{lastnamewd-1}@yourdomain.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@yourdomain.com",
        "{firstname1}.{lastname-1}2@yourdomain.com"
    ]
}
```

### Create email pattern group using PowerShell

This will create a group for a domain, with some sample patterns. The patterns will be available both as a sign-in name and as an email alias.

```PowerShell
connect-mggraph -scopes group.readwrite.all
$domain = "yourdomain.com"
New-MgGroup -DisplayName "Email patterns - $domain" -MailEnabled:$false -SecurityEnabled:$true -MailNickname "$(new-guid)".Substring(0,8) -AdditionalProperties @{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns" = @(
        "{firstname1}.{lastname-1}@$domain"
        "{firstname1}.{firstname2}.{lastname-1}@$domain"
        "{firstname1}.{lastname-2}.{lastname-1}@$domain"
        "{firstnamewd1}.{lastnamewd-1}@$domain"
        "{firstnamewd1}.{firstnamewd2}.{lastnamewd-1}@$domain"
        "{firstnamewd1}.{lastnamewd-2}.{lastnamewd-1}@$domain"
        "{firstname1}.{firstname2,1}.{lastname-1}@$domain"
        "{firstname1}.{lastname-1}2@$domain"
    )
}
```

### Create email pattern group using Microsoft Graph

This will create a group with patterns only available as sign-in name / primary email address.

```
POST https://graph.microsoft.com/v1.0/groups/
```

```JSON
{
    "displayName": "Email pattern - 1",
    "securityEnabled": true,
    "mailEnabled": false,
    "mailNickname": "emailpattern1",
    "extension_5a0b110707744bd4a2fdcf343ce79c56_signinnamepatterns": [
        "{firstname1}.{lastname-1}@{currentsuffix}",
        "{firstname1}.{lastname-2}@{currentsuffix}",
        "{firstname1,1}{firstname2,1}.{lastname-1}@{currentsuffix}",
        "{firstname1,1}{firstname2,1}{firstname3,1}.{lastname-1}@{currentsuffix}",
        "{firstname1,3}{lastname-1,3}@{currentsuffix}",
        "{firstname2}.{lastname-1}@{currentsuffix}",
        "{firstname2}.{lastname-2}@{currentsuffix}",
        "{firstname1}.{lastname-1}2@{currentsuffix}",
        "{firstname1,1}.{lastname-1}@{currentsuffix}"     
    ]
}
```

### Placeholders

| Placeholder | Replaced with |
|-|-|
| {firstname1} | First firstname |
| {firstname2} | Second firstname |
| {firstname3} | Third firstname |
| {firstname-1} | Last firstname |
| {firstname-2} | Second last firstname |
| {firstname-3} | Third last firstname |
| {lastname1} | First lastname |
| {lastname2} | Second lastname |
| {lastname3} | Third lastname |
| {lastname-1} | Last lastname |
| {lastname-2} | Second last lastname |
| {lastname-3} | Third last lastname |
| {firstnamewd1} | First firstname, with dashes included |
| {firstnamewd2} | Second firstname, with dashes included |
| {firstnamewd3} | Third firstname, with dashes included |
| {firstnamewd-1} | Last firstname, with dashes included |
| {firstnamewd-2} | Second last firstname, with dashes included |
| {firstnamewd-3} | Third last firstname, with dashes included |
| {lastnamewd1} | First lastname, with dashes included |
| {lastnamewd2} | Second lastname, with dashes included |
| {lastnamewd3} | Third lastname, with dashes included |
| {lastnamewd-1} | Last lastname, with dashes included |
| {lastnamewd-2} | Second last lastname |
| {lastnamewd-3} | Third last lastname |
| {onpremisessamaccountname} | The onpremisessamaccountname attribute of the user |
| {mailnickname} | The mailNickname attribute of the user |
| {currentsuffix} | The current UPN suffix of the user |

We also allow for extracing the first *n* characters of the placeholders:

| Placeholder | Replaced with |
|-|-|
| {firstname1,1} | First character of first firstname |
| {lastnamewd-1,3} | First three characters of the last lastname, with dashes included |

### Example usage

A user that is a member of *Example Group 1* and *Example Group 2*, with the configurations shown below, will get the following options available to them:

| Option | Alias | Sign-in name |
|-|-|-|
| {firstname1}.{lastname-1}@contoso.com | ✅ | ✅ |
| {firstname1}.{firstname2,1}.{lastname-1}@contoso.com | ✅ | ✅ |
| {firstname1}.{lastname-1}@nwtraders.com | ✅ | ✅ |
| {firstname1}.{firstname2,1}.{lastname-1}@nwtraders.com | ✅ | ✅ |

A user that is a member of only *Example Group 1* will get these options:

| Option | Alias | Sign-in name |
|-|-|-|
| {firstname1}.{lastname-1}@contoso.com | ✅ | ✅ |
| {firstname1}.{firstname2,1}.{lastname-1}@contoso.com | ✅ | ✅ |

A user that is member of only *Example Group 3* will get these options:

| Option | Alias | Sign-in name |
|-|-|-|
| {firstname1}.{lastname-1}@test.com | ✅ | |
| {firstname1}.{firstname2,1}.{lastname-1}@test.com | ✅ | |

A user that is member of *Example Group 1* and *Example Group 3* will get these options:

| Option | Alias | Sign-in name |
|-|-|-|
| {firstname1}.{lastname-1}@contoso.com | ✅ | ✅ |
| {firstname1}.{firstname2,1}.{lastname-1}@contoso.com | ✅ | ✅ |
| {firstname1}.{lastname-1}@test.com | ✅ | |
| {firstname1}.{firstname2,1}.{lastname-1}@test.com | ✅ | |

#### Example Group 1

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns": [
        "{firstname1}.{lastname-1}@contoso.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@contoso.com"
    ]
}
```

#### Example Group 2

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns": [
        "{firstname1}.{lastname-1}@nwtraders.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@nwtraders.com"
    ]
}
```

#### Example Group 3

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_aliaspatterns": [
        "{firstname1}.{lastname-1}@test.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@test.com"
    ]
}
```