# Creating or requesting an app registration

## Table of contents

- [Creating or requesting an app registration](#creating-or-requesting-an-app-registration)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Platform app registrations](#platform-app-registrations)
    - [What type of application are you integrating / developing](#what-type-of-application-are-you-integrating--developing)
      - [If the application is a *Web app* the following information must be provided](#if-the-application-is-a-web-app-the-following-information-must-be-provided)
      - [If the app is a single-page application please provide the following](#if-the-app-is-a-single-page-application-please-provide-the-following)
      - [If is is a Web API this information is required](#if-is-is-a-web-api-this-information-is-required)
      - [And if it is a **Native client** this information is required](#and-if-it-is-a-native-client-this-information-is-required)
  - [Application registration form](#application-registration-form)
    - [Create / request app registration form](#create--request-app-registration-form)
    - [App registration answer form with information to configured in the application](#app-registration-answer-form-with-information-to-configured-in-the-application)
    - [Example with two sample apps - create / request app registration](#example-with-two-sample-apps---create--request-app-registration)
    - [Example with two sample apps - response after app registrations have been created](#example-with-two-sample-apps---response-after-app-registrations-have-been-created)

## Introduction

To create an app registration some information about the app must be provided.

This information is essential to configure the app registration and provide it with API permissions (OAuth delegation), if necessary.

As a rule of thumb, all environments should have the same app registrations, with the exception of DEV where applications that are under development may have their own development-only app registrations.

- [DEV app registrations](./c2-DEV-App-registrations.md)
- [TEST app registrations](./c3-TEST-App-registrations.md)
- [PROD app registrations](./c4-PROD-App-registrations.md)

## Platform app registrations

Below are the four main application types and what properties they need configured:

### What type of application are you integrating / developing

- [Web app](https://learn.microsoft.com/azure/active-directory-b2c/application-types#web-applications)
- [Single-page app](https://learn.microsoft.com/azure/active-directory-b2c/application-types#single-page-applications)
- [Web API](https://learn.microsoft.com/azure/active-directory-b2c/application-types#web-apis)
- [Native client (mobile app / desktop app)](https://learn.microsoft.com/azure/active-directory-b2c/application-types#mobile-and-native-applications)

#### If the application is a *Web app* the following information must be provided

- What is the **name** of your application
- What **environment** will the application be integrated with (DEV / TEST / PROD)
- Is it an **OpenID Connect** integration
- What **redirect_uri** (reply URL) should be allowed for returning tokens
- What **API permissions** (resources), if any, and scopes does the application need access to

Once an app registration is created a **secret** (client_secret) will be provisioned, which must be provided by the application when calling the Microsoft Identity Platform **/authorize** endpoint.

>IMPORTANT!
>
>If using Infrastructure-as-Code (IaC) principles the app registration **client_secret** can be put into an Azure Key Vault for safe keeping.  
>App registration secrets can only be viewed (once) and must be copied ***immediately*** after resource creation.

The implementation of **Proof Key for Code Exchange (PKCE)** is supported (and recommended to use) for single-page apps (SPA), which are often JavaScript-based.
However, mobile, desktop and now also web apps (confidential clients), as described in [Application types for Microsoft identity platform](https://learn.microsoft.com/azure/active-directory/develop/v2-app-types#single-page-apps-javascript) are recommended to implement PKCE.

#### If the app is a single-page application please provide the following

- What is the **name** of your application
- What **environment** will the application be integrated with (DEV / TEST / PROD)
- What **redirect_uri** (reply URL) should be allowed for returning tokens
- What **API permissions** (resources), if any, and scopes does the application need access to

>IMPORTANT!
>
>For single-page apps, **avoid** using **Implicit flow**.  
>This authentication method should not be used in production (nor any) environments.  
>It's highly recommended to also [avoid enabling it in DEV](https://learn.microsoft.com/azure/active-directory/develop/v2-app-types#authorization-code-flow-vs-implicit-flow) as [authorization code flow with PKCE](https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow) is the secure and recommended approach.

When developing in JavaScript, make sure to use MSAL.js **2.x** (at a minimum) package as versions prior to 2.x ONLY support the implicit code flow.

The quote below is from the Microsoft Docs article [Tutorial: Sign in users and call the Microsoft Graph API from a JavaScript SPA using auth code flow](https://learn.microsoft.com/azure/active-directory/develop/tutorial-v2-javascript-auth-code):

>*MSAL.js 2.x improves on MSAL.js 1.0 by supporting the authorization code flow in the browser instead of the implicit grant flow.*  
>*MSAL.js 2.x does NOT support the implicit flow.*

See [here](https://tools.ietf.org/html/rfc7636) for detailed information on the **Proof Key for Code Exchange by OAuth Public Clients** standard.

#### If is is a Web API this information is required

- What is the **name** of your application
- What **environment** will the application be integrated with (DEV / TEST / PROD)
- The name of **scopes** the API *exposes / publishes* for consumption by other applications (e.g. read, write, user_impersonation)

#### And if it is a **Native client** this information is required

- What is the **name** of your application
- What **environment** will the application be integrated with (DEV / TEST / PROD)
- What **API permissions** (resource) and scopes does the application need access to
- What **redirect_uri** (reply URL) should be allowed for returning tokens

A redirect_uri for native apps using **Microsoft Authentication Library** may look like

- msal**APPID**://auth
- urn:ieft:wg.oauth:2.0:oob
- <https://{tenantName}.b2clogin.com/oauth2/nativeclient>

## Application registration form

### Create / request app registration form

This is a template that can be used when creating or requesting an app registration:

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Environment|
| -    | -    | -          | -                   | -     | -               | -          |
|      |      |            |                     |       |                 |            |
|      |      |            |                     |       |                 |            |

### App registration answer form with information to configured in the application

This is a template that can be used once an app registration has been created:

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Client ID | Client Secret | Environment |
| -    | -    | -          | -                   | -     | -               | -         | -            | -            |
|      |      |            |                     |       |                 |           |              |              |
|      |      |            |                     |       |                 |           |              |              |

### Example with two sample apps - create / request app registration

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Environment|
| -    | -    | -          | -                   | -     | -               | -          |
|  Mirage Web | Web App | <https://localhost/web/auth> <https://mydev.environment.net/auth> | false | N/A | Mirage API (user_impersonation) | Dev |
|  Mirage API | API | <https://localhost/api/auth> | false | user_impersonation | N/A | Dev |
|      |      |            |                     |       |                 |            |

### Example with two sample apps - response after app registrations have been created

| Name | Type | Reply URLs | Allow implicit flow | Scope | API Permissions | Client ID | Client Secret | Environment |
| -    | -    | -          | -                   | -     | -               | -         | -            | -            |
|  Mirage Web | Web App | <https://localhost/web/auth> <https://mydev.environment.net/auth> | false | N/A | Mirage API (user_impersonation) | <appId\> | <appSecret\> | Dev |
|  Mirage API | API | <https://localhost/api/auth> | false | user_impersonation | N/A | <appId\> | N/A | Dev |
|      |      |            |                     |       |                 |           |              |              |
