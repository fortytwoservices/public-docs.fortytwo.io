# PROD - tenant.onmicrosoft.com - user journeys

## Table of contents

- [PROD - tenant.onmicrosoft.com - user journeys](#prod---tenantonmicrosoftcom---user-journeys)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Execution policies (User Journeys)](#execution-policies-user-journeys)
  - [Single Sign-On](#single-sign-on)
  - [Localization](#localization)
  - [User Journey - signupsignin](#user-journey---signupsignin)

## Introduction

User Journey is the term used to define the flow that users go through when signing in.  
Through the Identity Experience Framework we craft **User Journeys** using custom policies.

When authentication is required, a redirect to the Identity platform happens and a User Journey is triggered.

User Journeys are flexible and can be customized to interact with APIs, they can be configured to perform progressive profiling, require the user to sign in using multi-factor authentication and much more, with few limitations.

User Journeys does not have to be advanced, nor complex, and best practice is to keep them as simple as possible, while keeping the user experience in mind.

The Amesto Fortytwo Managed B2C offering leverages custom policies as the building blocks for our User Journeys.  

When naming a User Journey it is good practice to use descriptive names, taking into consideration the flow, and potentially also language support.

## Execution policies (User Journeys)

Policies commonly used by applications:

- v1
  - [b2c_1a_v1_signupsignin](#user-journey---signupsignin)

## Single Sign-On

User Journeys can be configured for Single Sign-On support using the **Scope="Tenant"** parameter.

## Localization

English language is default, multi-language support is not configured.

Localization is configured in the execution policy files, and not represented by claims emitted in issued tokens.

Multi-language can be configured in the execution policy file for the User Journey.  
Localization, meaning supported languages, is decided by configuration policy parameter *SupportedLanguages*.

## User Journey - signupsignin

Policy file **b2c_1a_v1_signupsignin** triggers the primary User Journey, **signupsignin**.

When triggered the **signupsignin** User Journey directs the user to a branded landing page. On the page the user has two options: *sign in with email* or *password reset*.

There are two themes available through the [custom branding](./d3-Custom-branding.md) feature, Slate Gray and Ocean Blue.
Schema content definition configuration says which is applied to the User Journeys, which includes custom html, css and javascript files that shape the B2C pages.

Once the user provides a matching username, the Identity Platform issues a token, which is returned to the application, along with the user which is now signed in.
