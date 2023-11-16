# PROD - tenant.onmicrosoft.com - app registrations

## Table of contents

- [PROD - tenant.onmicrosoft.com - app registrations](#prod---tenantonmicrosoftcom---app-registrations)
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

A production environment will have the exact same app registrations, and app registration configuration, as test.  
All processes related to the production environment should be automated, as far as possible, to reduce the chance of errors being introduced due to manual processes.

The *goal* is for TEST and PROD environments to be identically configured, this way changes can flow from one environment to the other without requiring any additional changes or manual customization.

Adequate testing should be made before releasing changes to production.  
It is important to build an efficient, but solid, testing regime.  
This trust can then be leveraged to enable and ensure that changes, and new features, can quickly flow from TEST to PROD.

## Management

The B2C PROD environment should have strict change management.  
Changes should go through an approval gate where **at least** one person, not including the author, must approve deployment of changes.

If new features will be released, all involved parties, including support, should to be informed, because information sharing is key in a successful organization.

Changes coming to PROD will have been verified in the TEST environment, and as for TEST, (if possible) all changes in PROD will be made using infrastructure as code (IaC).  

Even though making changes and adding features in PROD has the most risk attached to it, it's important to build a trust system where changes are welcome, and not feared.  
Ideally, changes will come quickly and often, and during normal work hours.

Amounts of releases and release schedule is something that each Platform team, and organization, must figure out for themselves, depending on their situation.

The goal should be to **not** become risk-averse and rather **welcome** changes!

### Developers and operators

Any change being made to PROD environment must be discussed in the Platform team.

Operators hold top permissions in all environments, and more often than not, developers only need read permissions in a **production environment**.

However, all parties in a Platform team should be able to participate in the approval process for code being committed to PROD as well as any changes being rolled out in PROD.  

Changes to PROD environment must either be done on a schedule, or be well-informed in advance, to maintain the highest level of confidence of a successful deployment.  

The number of approvals to deploy changes to PROD must be decided.

As for TEST environment, it may be possible to reach a state where *all changes* that pass approvals in the test environment, are automatically deployed to PROD, to adhere to the idea of small, incremental changes being introduced continuously.

### Infrastructure as Code

App registration creation and maintenance *should* only fit this category:

- Defined and owned by company IaC

App registrations *must* be defined by IaC in a production environment (except on very rare occasions).

#### App registrations owned by company IaC

This list of app registrations will include applications developed (or implemented) by the company:

- companyApp - web app - prod
- JWT.ms (owned by Amesto Fortytwo IaC, for User Journey testing and token issuance)

#### App registrations with secrets

A confidential client (web application), requires a client_secret to securely integrate with the Identity platform.
A public client (single-page application, mobile application) can't be trusted with a client_secret (any secret used would be exposed in the client browser / app).

Applications needing a client_secret:

- companyApp - web app - prod

Look to [app registration secrets](#app-registration-secrets) for details on application secret management.

Secret management is ***imperative*** as secrets need to be cycled regularly to minimize the risk of credential compromise.  
A functioning regular secret change strategy is important because applications must have access to a valid secret at run-time to start the application.

The most common placement for secrets is Azure Key Vault, where access policies and managed identities can be used to restrict and grant access to sensitive data.

## App registrations matrix

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Client ID | Client Secret | Environment | Comments |
| - | - | - | - | - | - | - | - | - | - |
| JWT.ms | Web App | <https://jwt.ms/> | access_token id_token | N/A | Graph: openid+offline_access | \<appId> | N/A | Prod | Any IDP - AzureADandPersonalMicrosoftAccount - User Journey test app |
| companyApp - web app - prod | Web App | \<replyUrl> | N/A | N/A | Graph: openid+offline_access | \<appId> | \<appSecret> | Prod | Any IDP |
|   |   |   |   |   |   |   |   |   |   |

## App registration secrets

Creating a streamlined process for the handling of sensitive app registration information both adds security and accessibility.

There will be Azure Key Vaults for applications that require client secrets for interaction.

 Name | Type | Azure Key Vault | Client ID | Environment | Comments |
| - | - | - | - | - | - |
| companyApp - web app - prod | Web App | URIx | \<appId> | Prod | |
| company - iac - identity | N/A | URIx | \<appId> | Prod | Owned by company, service principal for running IaC (may be stored in Key Vault / DevOps library variable group) |
|   |   |   |   |   |   |
