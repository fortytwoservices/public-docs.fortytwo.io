# Microsoft B2C and the Identity Experience Framework

## Table of contents

- [Microsoft B2C and the Identity Experience Framework](#microsoft-b2c-and-the-identity-experience-framework)
  - [Table of contents](#table-of-contents)
  - [Identity Framework Experience, customizable and scalable](#identity-framework-experience-customizable-and-scalable)
  - [Secure identity management](#secure-identity-management)
  - [Integrating](#integrating)
  - [Microsoft Graph API](#microsoft-graph-api)
  - [Going forward](#going-forward)
    - [Find the app type for your app registration](#find-the-app-type-for-your-app-registration)
    - [Authorization and authentication protocols](#authorization-and-authentication-protocols)

## Identity Framework Experience, customizable and scalable

The Microsoft Identity Experience Framework (IEF) is allows for full flexibility of the Microsoft Identity B2C platform.  
The IEF provides you applications secure and reliable identity management and can craft fully customizable User Journeys.  
The service is highly available, it spans globally and is built to scale to millions of identities.  
With a fully operational Identity Platform, application developers can focus on creating core functionality and easily integrate their applications with the B2C platform for secure authentication, while not having to worry about identity management.

## Secure identity management

The user directory of the B2C tenant, in tandem with the IEF, provide secure and scalable identity management.  
The Identity Experience Framework platform supports modern protocols for integration, full claims management flexibility, user tracking and the possibility of extension attributes for extending identity objects.

Single sign-on (SSO) is readily available and delivered out of the box.

## Integrating

There are two types of accounts; **local accounts** and **external (federated) accounts**.

**Local accounts** authenticate with the B2C directory, **external accounts** authenticate with their respective identity providers (IDPs) allowing users to sign in with an existing account.  
When configured, users can select to sign in using an account from a public IDP like Google, LinkedIn and / or a commercial IdP, for example Vipps and ID-porten (Norway only).
The only requirement is that the IdP supports either [OpenID Connect](./e1-AuthN-and-AuthZ.md#openid-connect) or [Security Assertion Markup Language 2.0 (SAML)](./e9a-SAML.md).  
Using SAML is a fully supported alternative, however OpenID Connect is preferred, for both flexibility and ease of use.

## Microsoft Graph API

If an app already has an existing user database and we want to migrate the user accounts, we can use REST API queries.  
Using an App Service or Function App, we can extend the User Journey capability and expand the data exchange flexibility.
This way we can add custom code and configure Just-In-Time (JIT) user migration scenarios, and we can pre-provision users in the B2C directory using the [Microsoft Graph API](https://graph.microsoft.io/).

## Going forward

To integrate an application with the Identity Experience Framework it may be useful to dive into [Authorization and authentication protocols](#authorization-and-authentication-protocols) to better understand the technical requirements.

Integrating an application with the Identity platform requires an app registration, see [find the app type for your app registration](#find-the-app-type-for-your-app-registration)

### Find the app type for your app registration

The first step to getting started with the application and Identity platform integration is to create an app registration (though it may prove useful to read through this documentation first).  
The app registration will be created based on the type of application that you will be integrating. Creating an app registration can be done by anyone holding the Application Developer or Application Administrator (or more privileged) role.

[What type is your app](./c1-Creating-an-app-registration.md#what-type-of-application-are-you-integrating--developing) goes into detail on the mandatory and optional settings needed to be configured for an app integration to function.

[Requesting an application registration](./c1-Creating-an-app-registration.md) explains the app registration process.  
Based on the provided information you will be able create a new app registration, or make a request for an app registration to created on your behalf.

Using an app registration allows your application to integrate with the Identity platform, enabling it to request, manage and validate issued tokens for either user or app authentication and authorization.

### Authorization and authentication protocols

Once an app registration has been created it is important to decide on authentication protocols and authorization used by the application.

Understanding [OAuth 2.0 and OpenID Connect protocols](./e1-AuthN-and-AuthZ.md#which-oauth-20-flow-should-i-use) will provide information on the preferred protocols using a flow chart and explaining and illustrating the available OAuth 2.0 grant types and when they are applicable.
