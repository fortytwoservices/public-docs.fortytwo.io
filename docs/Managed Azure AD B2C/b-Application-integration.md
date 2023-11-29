# Application integration

## Table of contents

- [Application integration](#application-integration)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Getting started with application integration](#getting-started-with-application-integration)
  - [App registrations](#app-registrations)
  - [Identity Experience Framework - custom policies](#identity-experience-framework---custom-policies)
  - [Authentication and authorization](#authentication-and-authorization)
  - [Application integration examples](#application-integration-examples)
  - [Other](#other)

## Introduction

A good place to start is the Microsoft Learn page [Technical and feature overview of Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/technical-overview).

When reading the section [Identity experiences: user flow or custom policies](https://learn.microsoft.com/azure/active-directory-b2c/technical-overview#identity-experiences-user-flows-or-custom-policies) know that in the current implementation we are leveraging **custom policies** for the User Journeys.

In [Protocols and tokens](https://learn.microsoft.com/azure/active-directory-b2c/technical-overview#protocols-and-tokens) the you will find the supported modern authentication protocols.

## Getting started with application integration

As a developer it is beneficial to understand the Identity platform, how to perform integration with your application, and what is to be expected from a successful integration.

First step; register a new app registration.

Create an app registration or request one to be provisioned, if that is the process.
The app registration details, including secret (if applicable), are required for the application to be able to communicate with the Identity platform.

See [Creating or requesting an app registration](./c1-Creating-an-app-registration.md) to find out what information you must provide.

App registrations must be created by a privileged user (Application Developer, Application Administrator or more privileged role admin).  
Usually, an app is either created in the Azure Portal or declared in infrastructure as code (IaC), using Terraform or Bicep, as a couple of examples.

>NOTE!
>
>The recommended way to manage app registrations is through infrastructure as code.  
>The IaC approach reduces the chance of configuration drift across environments.  
>Additionally, it may serve as an added backup as any manual change can be reverted back by running the pipeline again.  
>When using Terraform, for DEV environments, consider allowing manual changes (lifecycle -> ignore_changes) for redirect_uri, api and required_resource_access

## App registrations

These pages contain lists of the available application registrations for the various environments:

- [DEV app registrations](./c2-DEV-App-registrations.md)
- [TEST app registrations](./c3-TEST-App-registrations.md)
- [PROD app registrations](./c4-PROD-App-registrations.md)

## Identity Experience Framework - custom policies

>NOTE!
>
>*The Microsoft Identity platform introduces the policy parameter.*
>*With the policy parameter, you can use OAuth 2.0 to add policies to your app, such as sign-up, sign-in, and profile management user flows.*
>
>**Source:** [Single-page application sign-in using the OAuth 2.0 implicit flow in Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/implicit-flow-single-page-application)

When integrating an application with the B2C environment the [**policy** parameter](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-sample-web-app?tabs=visual-studio#step-4-configure-the-sample-web-app) (SignUpSignInPolicyId) must be provided. This is a parameter that enables a user flow / custom policy (often called **User Journey**) to be executed by an application depending on the user initiated scenario.

For each environment these are the available custom policies:

- [DEV custom polices](./f2-DEV-Custom-policy-files.md#v1-policies)
- [TEST custom policies](./g2-TEST-Custom-policy-files.md#v1-policies)
- [PROD custom policies](./h2-PROD-Custom-policy-files.md#v1-policies)

Built-in policies (as opposed to **custom policies**) are also referred to as User flows, these are not used.

[Custom policies](https://learn.microsoft.com/azure/active-directory-b2c/custom-policy-overview) are what the Identity Experience Framework use to define **User Journeys**. Custom policies support everything from easy to the most complex authentication and migration scenarios.

Here are some templates, one per environment, as an example of how to list the available User Journeys:

- [User Journeys in DEV](./f1-DEV-User-Journeys.md#UserJourneys)
- [User Journeys in TEST](./g1-TEST-User-Journeys.md#UserJourneys)
- [User Journeys in PROD](./h1-PROD-User-Journeys.md#UserJourneys)

## Authentication and authorization

With a policy in place and ready to be tested it is time to integrate your application with the Identity platform.  
To update yourself, read through [Identity platform: Authentication and Authorization](./e1-AuthN-and-AuthZ.md).  
This section describes the supported authentication protocols and also goes into the available OAuth2 grant flows that can be used.

In the sub-pages of this section, among other things, [token validation](./e5-Token-validation.md) is mentioned.  
This is important to read and understand as security is always important to consider, and paramount for integrations like these.

## Application integration examples

A quite common scenario, is to integrate (JavaScript) Single-Page architecture (SPA) applications.

These Microsoft Learn articles explain how to configure and integrate a web app and a web API:

- [Configure authentication in a sample single-page application by using Azure AD B2C](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-sample-spa-app)
- [Configure authentication in a sample Node.js web API by using Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-in-sample-node-web-app-with-api)

There are also tutorials for integrating using other languages like Python and C# (ASP.NET / WPF app):

- [Configure authentication in a sample web app by using Azure AD B2C](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-sample-web-app)
- [Configure authentication in a sample Python web app by using Azure AD B2C](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-sample-python-web-app)
- [Configure authentication in a sample WPF desktop app by using Azure AD B2C](https://learn.microsoft.com/azure/active-directory-b2c/configure-authentication-sample-wpf-desktop-app)

A common prerequisite, all samples must have an app registration. This is a re-occurring theme early on in the mentioned articles.

When using web APIs an application registration is also required for these. The APIs must be configured to expose one or more scopes and the web application must be granted appropriate delegated permissions (OAuth delegation).

## Other

Be aware of [unsupported application types](https://learn.microsoft.com/azure/active-directory-b2c/application-types#unsupported-application-types).

Finally, [Recommendations and best practices for Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/best-practices).
