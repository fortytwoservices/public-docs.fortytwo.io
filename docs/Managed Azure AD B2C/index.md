---
description: Documentation for the Managed Azure AD B2C solution that is available in the Azure Marketplace.
---

# Getting started

## Introduction

Here lies the documentation for the Managed Azure AD B2C solution that is available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/amestofortytwoas1653635920536.b2c?tab=overview).

## Where to start

::::cards{cols=3}
:::card{title="B2C and the Identity Experience Framework" icon="book-open" href="./a-CIAM-IEF-introduction.md"}
The Microsoft Identity Experience Framework (IEF) allows for full flexibility of the Microsoft Identity B2C platform.
:::
:::card{title="Application integration" icon="plug" href="./b-Application-integration.md"}
How to integrate an application with the Identity platform, from app registrations and custom policies to authentication and integration examples.
:::
:::card{title="Authorization code grant" icon="network" href="./e2-OAuth-AuthZ-code-grant.md"}
The authorization code grant enables apps to securely acquire access_tokens, which can be used to access resources that are secured by an authorization server.
:::
:::card{title="Custom branding" icon="palette" href="./d3-Custom-branding.md"}
The sign-in pages can be maintained in an Azure storage account container.
:::
:::card{title="App registrations" icon="flask-conical" href="./c2-DEV-App-registrations.md"}
Template listing the app registrations that are used in application integrations in the DEV environment.
:::
::::

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

:::tip[Remember]
For a successful integration, the tenant specific settings must be used, which should be safely stored in your environment.
:::

The integration documentation is recommended to keep close to the Identity platform code, preferably in the same repository. This ensures that all relevant information is easy to find and that it (hopefully) gets continuously updated.

## Templates

To make it easy to find the necessary information for performing an app integration we use templates to store the parameters.

For every environment there will be a unique set of parameters and configuration.

There are templates for app registrations, User Journeys and custom policy files.

Fill in the templates and store the documents with the code (best practice). This documentation is a vital part of each Identity Platform.

The tenant specific configuration is required for users that are about to integrate an application with the Identity Platform.

## What are you waiting for?

Go to [Customer Identity Access Management and the Identity Experience Framework](./a-CIAM-IEF-introduction.md) and start the Journey of making your application a part of the new Identity Platform.

If you do not already have a B2C tenant or simply wish to try out our offering, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/amestofortytwoas1653635920536.b2c?tab=overview), select **Get It Now**, configure delegation details and send us an email at helloATfortytwo.io and we will provision you a complete B2C environment using our pipelines.
