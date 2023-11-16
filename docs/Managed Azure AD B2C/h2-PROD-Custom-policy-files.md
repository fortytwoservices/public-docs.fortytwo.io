# PROD - tenantname.onmicrosoft.com - custom policy files

## Table of contents

- [PROD - tenantname.onmicrosoft.com - custom policy files](#prod---tenantnameonmicrosoftcom---custom-policy-files)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [v1 policies](#v1-policies)
  - [Foundational policy files](#foundational-policy-files)

## Introduction

The Identity Experience Framework uses custom policies, which are very flexible and configurable building blocks. Current User Journeys were designed, developed and implemented with custom policies and they are the foundation of the Identity platform.

All User Journeys have been configured for **tenant-wide** Single Sign-On support.

>TIP!
>
>All implementations use the [**custom domain**](https://learn.microsoft.com/azure/active-directory-b2c/custom-domain?pivots=b2c-custom-policy) functionality.
>>When using custom domain, {tenantName}.b2clogin.com, in the examples, can be replaced with the domain name.
>Both domains are active and functioning, but use one at a time as Single Sign-On does not work across different domains.

## v1 policies

Ony policies in the v1 file set are available in production.

| Policy file | User Journey | Description | Metadata endpoint | User Journey test link | Custom domain |
| -           | -            | -           | -                 | -                      | -                     |
| b2c_1a_v1_signupsignin | Sign in | The primary (default) User Journey, sign in with email and password reset | <https://custom.domain.com/tenantname.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1a_v1_signupsignin> <https://tenantname.b2clogin.com/tenantname.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1a_v1_signupsignin> | [Sign In](https://custom.domain.com/tenantname.onmicrosoft.com/oauth2/v2.0/authorize?p=b2c_1a_v1_signupsignin&client_id=<jwtms-application-id>&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token) | custom.domain.com tenantname.b2clogin.com |
| -           | -            | -           | -                 | -                      | -                     |

## Foundational policy files

| Policy file | Description |
| -           | -           |
| b2c_1a_v1_base | Trust Framework Policy **base** containing all building blocks and definitions necessary for the User Journeys |
| b2c_1a_v1_base_extensions | Trust Framework Policy **base extensions** holding all the User Journeys |
|             |              |             |                   |                        |                       |
