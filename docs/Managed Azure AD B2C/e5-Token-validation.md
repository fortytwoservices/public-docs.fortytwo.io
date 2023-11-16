# Validate OpenID Connect and OAuth 2.0 tokens

## Table of contents

- [Validate OpenID Connect and OAuth 2.0 tokens](#validate-openid-connect-and-oauth-20-tokens)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Validating OAuth 2.0 / OpenID Connect tokens](#validating-oauth-20--openid-connect-tokens)

## Introduction

This article explain the best practice how to validate tokens issued by the Microsoft Identity platform. There are two types of tokens, an **id_token** an an **access_token**. Access tokens are typically validated by APIs that receive the token as part of the authorization header in the API request, while id tokens are typically validated by the client (web server or native) before granting the user access to application features.

## Validating OAuth 2.0 / OpenID Connect tokens

When receiving an **id_token** the token must be validated before it can be used to authenticate the user. Tokens are not encrypted, only signed, therefore the embedded signature must validated to ensure the authenticity of the **id_token**. Only then can the applications process the required claims according to it's requirement. Claims are packaged and transported in JSON Web Tokens (JWTs) and leverages public key cryptography to sign and verify token validity. Validating the **access_token** is equally important to ensure the authenticity of the token and that it is issued for use to query the resource (API).

There are many open-source libraries that are available for validating JWTs, depending on your language of preference. Consider exploring those options rather than implementing your own validation logic. The information here will be useful in figuring out how to properly use those libraries.

Every custom policy created in the Identity Experience Framework has a dedicated OpenID Connect metadata endpoint. This allows apps to fetch necessary information at runtime, including amongst others endpoints, token contents, and token signing keys. For example the metadata document for the **B2C_1A_v1_signupsignin** policy in the **{tenantName}.onmicrosoft.com** tenant would be located at:

```html
https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_v1_signupsignin
```

One of the properties of this configuration document is the *jwks_uri*, which values for the same policy can be found at:

```html
https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1A_v1_signupsignin
```

>TIP!
>
>When using custom domain, {tenantName}.b2clogin.com, in the examples, can be replaced with the domain name.

In order to determine which policy was used in signing an token (and where to fetch the metadata from), there are two options:

- The easiest and recommended way is to read the policy name included in the **trustFrameworkPolicy** or **tfp** claim in the token. For information on how to parse the claims from an token, see the [Overview of tokens in Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/tokens-overview#claims).
- Your other option is to encode the policy in the value of the **state** parameter when you issue the request, and then decode it to determine which policy was used. Either method is perfectly valid.

After acquiring the metadata document from the OpenID Connect metadata endpoint, use the included RSA 256 public keys to validate the signature of the token. There may be multiple keys listed at this endpoint at any given point in time, each identified by a **kid**. The header of the token also contains a **kid** claim, which indicates which of these keys was used to sign the **id_token**.

See [Validate signature](https://learn.microsoft.com/azure/active-directory-b2c/tokens-overview#validate-signature) for more information.

Also see Microsoft Learn article [Validate the ID token](https://learn.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#validate-the-id-token) to learn more about OpenID Connect on the Microsoft identity platform, token validation and when it's important and less so.

After validating the signature of the token, several claims also require verification, for instance:

- Validate the **nonce** claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
- Validate the **aud** claim to ensure that the **id_token** was issued for your app. It's value should be the application ID of your app.
- Validate the **iat** and **exp** claims to ensure that the **id_token** has not expired.
- [Microsoft recommendation for claims validation](https://learn.microsoft.com/azure/active-directory-b2c/tokens-overview#validate-claims)

There are also several more validations that you should perform, see [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) for details. You might also want to validate additional claims, depending on your scenario. Some common validations include:

- Ensuring that the user has proper authorization / privileges.
- Ensuring that a certain **strength of authentication** has occurred, such as Multi-Factor Authentication.

After you have completely validated the token, you can begin a session with the user and use the claims in the **id_token** to obtain information about the user in your app. This information can be used for display, records, authorization, and so on.
