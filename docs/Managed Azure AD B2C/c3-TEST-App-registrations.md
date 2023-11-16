# TEST - tenant.onmicrosoft.com - app registrations

## Table of contents

- [TEST - tenant.onmicrosoft.com - app registrations](#test---tenantonmicrosoftcom---app-registrations)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Management](#management)
    - [Developers and operators](#developers-and-operators)
    - [Infrastructure as Code](#infrastructure-as-code)
      - [App registrations owned by company IaC](#app-registrations-owned-by-company-iac)
      - [App registrations with secrets](#app-registrations-with-secrets)
  - [App registrations matrix](#app-registrations-matrix)
  - [App registration secrets](#app-registration-secrets)

## Introduction

Every tenant will have a list of app registrations that are used in application integrations.  
Even though the app registration names and permissions are set up identically across environments, app id (client_id) and app secret (client_secret) will **NOT** be identical.

Using the below matrix it is possible to see what app registrations exist in an environment at a given time.

A test environment (often referred to as pre-prod) has the exact same app registrations, and app registration configuration, as production.  
It is a staging environment where all changes are deployed and tested thoroughly before they are released to PROD.

## Management

The B2C TEST environment should have *reasonably* strict change management.  
Changes *should* go through an approval gate where **at least** one person, not including the author, must approve deployment of changes.

Developers should not need to interact much with this environment, with the exception of approving changes or perform system testing.

Operators should make sure that the TEST environment is primarily changed via infrastructure as code (Iac).  
This will ensure the highest probability of functionality remaining operational in TEST, while also working when released to PROD.

Resources in a TEST environment *should preferably* be deployed using IaC.  
Situations may occur where it is sensible to perform temporary, manual, changes to the environment.  
For example when a test fails and a quick fix can be manually implemented to try to (bug)fix the issue.

The primary reason for avoiding manual configuration is the increased risk of configuration drift between environments, especially TEST and PROD.

### Developers and operators

Unlike in the development environment, developers will usually not need to hold high privilege permissions in TEST (pre-prod).  
App registrations should be configured with fully qualified domain name redirect uris (reply urls) to mimic the production environment.

Changes made to TEST environment *should* be discussed before deployment, to avoid *temporary-permanent* changes being made.

Operators hold top permissions in all environments, and for a **test environment**, where (ideally) all resources are defined in code, developers should not need to be highly privileged.

However, all parties in a Platform team should be able to participate in the approval process for code being committed and changes being rolled out in the environment.  
To maintain a flowing process, multiple approvers must be appointed to quickly get changes introduced to the TEST environment, to avoid bottleneck approval gates.

How many approvals a change requires before being merged, or the number of approvals to deploy a change, needs to be decided.

Also worth noting, in some situations the ideal flow is for *all changes* that pass approvals in the development environment, to be automatically deployed to TEST, to adhere to the idea of small, incremental changes being introduced continuously.

### Infrastructure as Code

App registration creation and maintenance can be divided into these categories:

- Defined and owned by company IaC
- Defined and owned by Amesto Fortytwo (managed service provider) IaC
- Manually created and / or maintained by company or Amesto Fortytwo

App registrations *should* only be defined by IaC in a test environment (exceptions should be few).

#### App registrations owned by company IaC

This list of app registrations will include applications developed (or implemented) by the company:

- companyApp - web app - test
- JWT.ms (owned by Amesto Fortytwo IaC, for User Journey testing and token issuance)

#### App registrations with secrets

A confidential client (web application), requires a client_secret to securely integrate with the Identity platform.
A public client (single-page application, mobile application) can't be trusted with a client_secret (any secret used would be exposed in the client browser / app).

Applications needing a client_secret:

- companyApp - web app - test

Look to [app registration secrets](#app-registration-secrets) for details on application secret management.

Secret management is ***imperative*** as secrets need to be cycled regularly to minimize the risk of credential compromise.  
A functioning regular secret change strategy is important because applications must have access to a valid secret at run-time to start the application.

The most common placement for secrets is Azure Key Vault, where access policies and managed identities can be used to restrict and grant access to sensitive data.

## App registrations matrix

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Client ID | Client Secret | Environment | Comments |
| - | - | - | - | - | - | - | - | - | - |
| JWT.ms | Web App | <https://jwt.ms/> | access_token id_token | N/A | Graph: openid+offline_access | \<appId> | N/A | Test | Any IDP - AzureADandPersonalMicrosoftAccount - User Journey test app |
| companyApp - web app - test | Web App | \<replyUrl> | N/A | N/A | Graph: openid+offline_access | \<appId> | \<appSecret> | Test | Any IDP |
|   |   |   |   |   |   |   |   |   |   |

## App registration secrets

Creating a streamlined process for the handling of sensitive app registration information both adds security and accessibility.

There will be Azure Key Vaults for applications that require client secrets for interaction.

 Name | Type | Azure Key Vault | Client ID | Environment | Comments |
| - | - | - | - | - | - |
| companyApp - web app - test | Web App | URIx | \<appId> | Test | |
| company - iac - identity | N/A | URIx | \<appId> | Test | Owned by company, service principal for running IaC (may be stored in Key Vault / DevOps library variable group) |
|   |   |   |   |   |   |
