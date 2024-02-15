# Getting started

## Table of contents

- [Getting started](#getting-started)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Quickstart](#quickstart)
  - [The intent](#the-intent)
  - [Modern authentication](#modern-authentication)
  - [The pieces of the puzzle](#the-pieces-of-the-puzzle)
  - [The magic is in the making](#the-magic-is-in-the-making)
  - [Templates](#templates)
  - [What are you waiting for?](#what-are-you-waiting-for)

## Introduction

Here lies the documentation for the Managed Azure AD B2C solution that is available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/amestofortytwoas1653635920536.b2c?tab=overview).

## Quickstart

 Go to [Customer Identity Access Management and the Identity Experience Framework](./a-CIAM-IEF-introduction.md) to go through the B2C Identity Platform documentation.

## The intent

The intention is to improve the understanding of the Microsoft Identity Platform and the Identity Experience Framework, which we use as our building blocks for the Fortytwo Managed AD B2C Azure Marketplace offering.

## Modern authentication

The section on modern authentication protocols, OpenID Connect (preferred) and SAML, will provide insight into how these protocols work and how to leverage them when integrating your application with the Microsoft Identity Platform.

## The pieces of the puzzle

For a complete integration there are various parts that must be in place:

- App registrations
  - With necessary configuration
- User Journeys
  - **Sign Up Sign In User Journey** is included (\_v2_)
- Authentication libraries for the app integration code (MSAL, MSAL.x)

## The magic is in the making

Putting all of this together usually takes some time and past experience always helps. So, in order to speed up this process we have here gathered and organized the essential information in one place.  
This tells the complete integration story, from start to finish. However, the tenant specific details such as User Journeys, app registration identifiers, secrets, and more, is found in the tenant of the Identity Platform.

***Remember***, for a successful integration, the tenant specific settings must be used, which should be safely stored in your environment.
The integration documentation is recommended to keep close to the Identity platform code, preferably in the same repository. This ensures that all relevant information is easy to find and that it (hopefully) gets continously updated.

## Templates

To make it easy to find the necessary information for performing an app integration we use templates to store the parameters.

For every environment there will be a unique set of parameters and configuration.

There are templates for app registrations, User Journeys and custom policy files.

Fill in the templates and store the documents with the code (best practice).  
This documentation is a vital part of each Identity Platform.

The tenant specific configuration is required for users that are about to integrate an application with the Identity Platform.

## What are you waiting for?

Go to [Customer Identity Access Management and the Identity Experience Framework](./a-CIAM-IEF-introduction.md) and start the Journey of making your application a part of the new Identity Platform.

If you do not already have a B2C tenant or simply wish to try out our offering, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/amestofortytwoas1653635920536.b2c?tab=overview), select **Get It Now**, configure delegation details and send us an email at helloATfortytwo.io and we will provision you a complete B2C environment using our pipelines.
