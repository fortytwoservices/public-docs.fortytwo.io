# DEV - tenant.onmicrosoft.com - app registrations

## Table of contents

- [DEV - tenant.onmicrosoft.com - app registrations](#dev---tenantonmicrosoftcom---app-registrations)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Management](#management)
    - [Developers and operators](#developers-and-operators)
    - [Infrastructure as Code](#infrastructure-as-code)
      - [App registrations owned by company IaC](#app-registrations-owned-by-company-iac)
      - [Allow changes to app registrations outside of IaC](#allow-changes-to-app-registrations-outside-of-iac)
      - [App registrations with secrets](#app-registrations-with-secrets)
  - [App registrations matrix](#app-registrations-matrix)
  - [App registration secrets](#app-registration-secrets)

## Introduction

Every tenant will have a list of app registrations that are used in application integrations.  
Even though the app registration names and permissions are set up identically across environments, app id (client_id) and app secret (client_secret) will **NOT** be identical.

Using the below matrix it is possible to see what app registrations exist in an environment at a given time.

A development environment may have app registrations that TEST and PROD does not have, namely as it is an environment used for ongoing development.

## Management

A development environment should be a safe place for developers and operators both, where ideas and creativity can unfold, functionality can be tested.

For resources deployed in DEV there are various options, including the opposites of defining everything in code and not using infrastructure as code (IaC) at all.

### Developers and operators

Developers may need rapid changes and should be self-sufficient when it comes to application development, application integration, application permissions and identity management.

As a pre-requisite; developers must be assigned sufficient permissions, and with this in place they should be able to actively interact with all connected parts of the development environment.

Operators and developers can both hold top permissions in any CIAM tenant, especially if it's a **development environment**.  
This will allow for the most agile development process where changes may occur often and come about quickly.  
Our goal should be to enable developers, rather build guard rails than motes.

### Infrastructure as Code

App registration creation and maintenance can be divided into these categories:

- Defined and owned by company IaC
- Defined and owned by Amesto Fortytwo (managed service provider) IaC
- Manually created and / or maintained by company or Amesto Fortytwo

In a development environment it is not uncommon to find app registrations fitting all these categories.

#### App registrations owned by company IaC

This list of app registrations will include applications developed (or implemented) by the company:

- companyApp - web app - dev
- JWT.ms (owned by Amesto Fortytwo IaC, for User Journey testing and token issuance)

#### Allow changes to app registrations outside of IaC

In the development environment app registrations must be flexible to changes, also those that do not originate in IaC.  
When using IaC tool Terraform (TF), which uses a *state* file to monitor deployed resources, changes made outside of TF are usually reversed (because **state** if owned by TF).  
Terraform supports the setting *lifecycle* which tells the terraform resource provider to ignore changes.

Example for app registrations, to allow manual changes to redirect_uris as they are configured as part of the web block in the Terraform app registration resource definition:

```go
lifecycle {
    ignore_changes [
        web
    ]
}
```

Changes in an app registration that may need to be changed include (but are not limited to):

- redirect_uris
- implicit flow settings
- secrets
- API permissions
- exposed APIs

#### App registrations with secrets

A confidential client (web application), requires a client_secret to securely integrate with the Identity platform.
A public client (single-page application, mobile application) can't be trusted with a client_secret (any secret used would be exposed in the client browser / app).

Applications needing a client_secret:

- companyApp - web app - dev

Look to [app registration secrets](#app-registration-secrets) for details on application secret management.

Secret management is ***imperative*** as secrets need to be cycled regularly to minimize the risk of credential compromise.  
A functioning regular secret change strategy is important because applications must have access to a valid secret at run-time to start the application.

The most common placement for secrets is Azure Key Vault, where access policies and managed identities can be used to restrict and grant access to sensitive data.

## App registrations matrix

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Client ID | Client Secret | Environment | Comments |
| - | - | - | - | - | - | - | - | - | - |
| JWT.ms | Web App | <https://jwt.ms/> | access_token id_token | N/A | Graph: openid+offline_access | \<appId> | N/A | Dev | Any IDP - AzureADandPersonalMicrosoftAccount - User Journey test app |
| companyApp - web app - dev | Web App | \<replyUrl> | N/A | N/A | Graph openid+offline_access | \<appId> | \<appSecret> | Dev | Any IDP |
|   |   |   |   |   |   |   |   |   |   |

## App registration secrets

Creating a streamlined process for the handling of sensitive app registration information both adds security and accessibility.

There will be Azure Key Vaults for applications that require client secrets for interaction.

 Name | Type | Azure Key Vault | Client ID | Environment | Comments |
| - | - | - | - | - | - |
| companyApp - web app - dev | Web App | URIx | \<appId> | Dev | |
| company - iac - identity | N/A | URIx | \<appId> | Dev | Owned by company, service principal for running IaC (may be stored in Key Vault / DevOps library variable group) |
|   |   |   |   |   |   |
