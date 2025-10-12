# Step 2 - Configuring email patterns

Email patterns for Bytt.Email are configured through Entra ID groups with extension properties in your tenant.

By consenting to Bytt.Email, you now have three new multivalued string attributes available for cloud managed groups in your tenant:

| Attribute | Description 
|-|-|
| extension_34ee8edbd2ff4ee9bac373b53303e00f_aliaspatterns | Patterns available as email alias only |
| extension_34ee8edbd2ff4ee9bac373b53303e00f_signinnamepatterns | Patterns available as sign-in name only |
| extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns | Patterns available both as sign-in name and alias |

In order to override the default email patterns available to your users, you can add users as member of a group with one or more of these attributes set. If a user is a memer of multilpe email pattern groups, they are merged. When displayed to the user, the resulting email addresses are sorted in order of length, with any address with a number before the @ is sorted last.

Microsoft does not provide a user interface for these types of properties. The attributes can be set by using [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) or by using the Microsoft Graph PowerShell module.

## Create email pattern group using PowerShell

This will create a group for a domain in the ```$domain``` variable, with some example patterns. The patterns will be available both as a sign-in name and as an email alias.

```PowerShell
Connect-MgGraph -scopes group.readwrite.all
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

## Create email pattern group using Microsoft Graph

This will create a group with patterns only available as sign-in name / primary email address. A simple way to configure groups in this manner, is to use the [Microsoft Graph explorer](https://developer.microsoft.com/en-us/graph/graph-explorer). Remember to sign in, instead of using the sample tenant for Graph Explorer.

```
POST https://graph.microsoft.com/v1.0/groups/
```

```JSON
{
    "displayName": "Email pattern - 1",
    "securityEnabled": true,
    "mailEnabled": false,
    "mailNickname": "emailpattern1",
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_signinnamepatterns": [
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

## Placeholders

| Placeholder                | Replaced with                                      |
|----------------------------|----------------------------------------------------|
| {firstname1}               | First firstname                                    |
| {firstname2}               | Second firstname                                   |
| {firstname3}               | Third firstname                                    |
| {firstname-1}              | Last firstname                                     |
| {firstname-2}              | Second last firstname                              |
| {firstname-3}              | Third last firstname                               |
| {lastname1}                | First lastname                                     |
| {lastname2}                | Second lastname                                    |
| {lastname3}                | Third lastname                                     |
| {lastname-1}               | Last lastname                                      |
| {lastname-2}               | Second last lastname                               |
| {lastname-3}               | Third last lastname                                |
| {firstnamewd1}             | First firstname, with dashes included              |
| {firstnamewd2}             | Second firstname, with dashes included             |
| {firstnamewd3}             | Third firstname, with dashes included              |
| {firstnamewd-1}            | Last firstname, with dashes included               |
| {firstnamewd-2}            | Second last firstname, with dashes included        |
| {firstnamewd-3}            | Third last firstname, with dashes included         |
| {lastnamewd1}              | First lastname, with dashes included               |
| {lastnamewd2}              | Second lastname, with dashes included              |
| {lastnamewd3}              | Third lastname, with dashes included               |
| {lastnamewd-1}             | Last lastname, with dashes included                |
| {lastnamewd-2}             | Second last lastname                               |
| {lastnamewd-3}             | Third last lastname                                |
| {onpremisessamaccountname} | The onpremisessamaccountname attribute of the user |
| {mailnickname}             | The mailNickname attribute of the user             |
| {currentsuffix}            | The current UPN suffix of the user                 |

We also allow for extracing the first *n* characters of the placeholders, through the {&lt;placeholder&gt;,*n*} pattern:

| Placeholder       | Replaced with                                                     |
|-------------------|-------------------------------------------------------------------|
| {firstname1,1}    | First character of first firstname                                |
| {lastnamewd-1,3}  | First three characters of the last lastname, with dashes included |

## Example usage

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

A user that is member of only *Example Group 3* will get these options (will only be able to add aliases):

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

### Example Group 1

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns": [
        "{firstname1}.{lastname-1}@contoso.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@contoso.com"
    ]
}
```

### Example Group 2

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_patterns": [
        "{firstname1}.{lastname-1}@nwtraders.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@nwtraders.com"
    ]
}
```

### Example Group 3

```JSON
{
    "extension_34ee8edbd2ff4ee9bac373b53303e00f_aliaspatterns": [
        "{firstname1}.{lastname-1}@test.com",
        "{firstname1}.{firstname2,1}.{lastname-1}@test.com"
    ]
}
```

## Next step

[Go to next step](config-step3.md)