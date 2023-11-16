# The Identity Experience Framework

## Table of contents

- [The Identity Experience Framework](#the-identity-experience-framework)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Custom policies](#custom-policies)
  - [Environments](#environments)
  - [User Journey testing](#user-journey-testing)

## Introduction

The Identity Experience Framework supports [**custom policies**](https://learn.microsoft.com/azure/active-directory-b2c/user-flow-overview).

User flows are getting a new home in [Microsoft Entra External ID for customers](https://learn.microsoft.com/azure/active-directory/external-identities/customers/overview-customers-ciam) and are well-suited for getting started quickly, custom policies provide a far greater flexibility.

## Custom policies

Identity Experience Framework custom policies are developed using Extensible Markup Language (XML).
The custom policies are constructed from a hierarchical chain contained within the [TrustFrameworkPolicy](https://learn.microsoft.com/azure/active-directory-b2c/trustframeworkpolicy) element.

The XML code is usually split into (at least) three files, a base policy file, an extension policy file and a relying party (execution policy) file.
If there is a requirement to support other languages than English, all the [LocalizedResources](https://learn.microsoft.com/azure/active-directory-b2c/language-customization?pivots=b2c-custom-policy#provide-language-specific-labels) references would be organized in a dedicated language file that extends the chain by one member, base, **language**, extension and execution policy.

When a User Journey is triggered, the code from all chained XML-formatted files are merged according to the [inheritance model](https://learn.microsoft.com/azure/active-directory-b2c/custom-policy-overview#inheritance-model).

## Environments

Each environment make out it's own Identity Platform and are configured using CI/CD (continous integration/deployment).

- DEV - [\<tenant>.onmicrosoft.com](./f1-DEV-User-Journeys.md) (placeholder for DEV template)
- TEST - [\<tenant>.onmicrosoft.com](./g1-TEST-User-Journeys.md) (placeholder for TEST template)
- PROD - [\<tenant>.onmicrosoft.com](./h1-PROD-User-Journeys.md) (placeholder for PROD template)

For each environment there are a number of User Journeys.
The policy files behind the User Journeys are identical in name and functionality but contain tenant-specific application identifiers, different keys and other references.

## User Journey testing

Links to trigger the policies in each of B2C tenants can be found in the corresponding environment's document.

The links provided triggers the User Journeys based on the Microsoft [JWT.ms](https://jwt.ms) web application.
This is the URL where the token and user is redirected after completing the User Journey.

The [JWT.ms](./c2-DEV-App-registrations.md#app-registrations-matrix) app is very helpful to get an idea of how User Journeys look visually, test and verify the functionality and see what claims are emitted in the **id_token** once the session successfully concludes.
