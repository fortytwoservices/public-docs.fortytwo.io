# OAuth 2.0 authorization code grant

- [OAuth 2.0 authorization code grant](#oauth-20-authorization-code-grant)
  - [Introduction](#introduction)
  - [1. Get an authorization code](#1-get-an-authorization-code)
    - [Use a policy](#use-a-policy)
  - [2. Get a token](#2-get-a-token)
    - [Validating the id\_token](#validating-the-id_token)
  - [3. Use the access\_token](#3-use-the-access_token)
  - [4. Refresh the token](#4-refresh-the-token)
  - [5. Authorization code grant extension Proof Key for Code Exchange (PKCE)](#5-authorization-code-grant-extension-proof-key-for-code-exchange-pkce)

## Introduction

The OAuth 2.0 authorization code grant is described in [section 4.1](https://tools.ietf.org/html/rfc6749#section-4) of the OAuth 2.0 specification.
You can use it to perform authentication and authorization in the majority of app types, including web apps and native (mobile / desktop) apps.

The authorization code grant enables apps to securely acquire **access_tokens**, which can be used to access resources that are secured by an authorization server.

This article will focus on a particular flavour of the OAuth 2.0 authorization code grant (also referred to as **code flow**) where the OAuth client is a web app.

This is a high level illustration of the flow:

![Authorization code flow](media/OAuthCodeGrant.png)

## 1. Get an authorization code

The authorization code flow begins with the client directing the user to the endpoint. This is the interactive part of the flow, where the user is required to take action. In this request, the client indicates the permissions that it needs to acquire from the user in the **scope** parameter and the policy to execute in the **p** parameter.

>NOTE!
>
>Microsoft recommends using [Proof Key for Code Exchange (PKCE)](#5-authorization-code-grant-extension-proof-key-for-code-exchange-pkce) for the authorization code grant also.
>
>The code_challenge and code_challenge_method parameters are displayed and explain in section [*Get an authorization code*](https://learn.microsoft.com/azure/active-directory-b2c/authorization-code-flow#1-get-an-authorization-code).

 The example uses policy **p=b2c_1a_v1_signupsignin** (line breaks for legibility).

### Use a policy

```xml
GET:
https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/oauth2/v2.0/authorize
?client_id={clientId}
&response_type=code
&redirect_uri={redirectUri}
&response_mode=query
&scope={scope}
&state={state}
&nonce= {nonce}
&p=b2c_1a_v1_signupsignin
```

| Parameter | Required | Description |
| -         | :-:      | -           |
| client_id | Yes | The application ID that the Azure portal assigned to your application. |
| response_type | Yes | The response type, which must include **code** for the authorization grant flow. |
| redirect_uri | Yes | The **redirect_uri** of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris that you registered in the portal, except that it must be URL encoded. |
| scope | Yes | A space-separated (URL encoded) list of scopes. You must always specify **openid** as one of the scope values as this will initiate a OpenID Connect authentication process. If you only specify **openid**, you will only get an **id_token** when the returned **code** is exchanged at server side (see further down in this article). If you in addition to **openid** specify a resource URL or AppID, then you will also get an **access_token** (**Note! You can only specify 1 resource in the scope list. Multiple resources can only be attained by performing separate authorization grant flows**). If you also include the **offline_access** scope then your app will also get a **refresh_token** for long-lived access to resources. Example shown below grid. |
| response_mode | Recommended | The method that should be used to send the resulting **authorization_code** back to your app. It can be one of **query**, **form_post**, or **fragment**. |
| state | Recommended | A value included in the request that will also be returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on or the policy being executed. |
| p | Yes | The policy that will be executed. It is the name of a policy that is developed in the AAD B2C tenant. The policy name value begins with **b2c_1a_**.|
| prompt | Optional | The type of user interaction that is required. The standard value is **login**, which forces the user to enter their credentials on that request. Single sign-on will not take effect. However, if **prompt=none** is used SSO will take effect, given that a session already exists. |
| nonce | Yes | A value included in the request (generated by the app) that will be included in the resulting **id_token** as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized, unique string that can be used to identify the origin of the request. Read the following article on how to [generate the nonce](./e6-Nonce.md). |

> TIP!
>
>How to ask for an **id_token**, **refresh_token** and **access_token** to an API in the B2C tenant (the scope parameter *MUST* be URL encoded) with appID  **9993ca2f-6cc4-4d47-b0ac-c10811ad43e3** and permissions (scopes) **read** and **write**:
>
>**openid+offline_access+https%3a%2f%2f87{tenantName}.onmicrosoft.com%2f9993ca2f-6cc4-4d47-b0ac-c10811ad43e330%2Fread+https%3a%2f%2f87{tenantName}.onmicrosoft.com%2f9993ca2f-6cc4-4d47-b0ac-c10811ad43e330%2Fwrite**

At this point, the user will be asked to complete the policy's workflow. This may involve the user entering their user name and password in addition to any other number of steps, depending on how the policy is defined.

After the user completes the policy, the Identity platform will return a response to your app at the indicated **redirect_uri**, by using the method specified in the **response_mode** parameter. The response will be exactly the same regardless of which policy that is executed.

A successful response that uses **response_mode=query** looks like:

```PowerShell
Name                           Value
----                           -----
state                          myState
code                           eyJraWQiOiJIUTB6ZERpTlhmWHZyTWJ5cVpJQy10ZUZpbEV6ZVd5TUxHTUFIVTBmVVd3IiwidmVyIjoiMS4wIiwiemlwIjoiRGVmbGF0ZSIsInNlciI6IjEuMCJ916HgvyoBl4SSnOGud7YKPt0BUIo......
```

This preview is generated from PowerShell for better legibility. The actual values are appended as parameters in the redirection URL from B2C. The code format differs from the v1.0 endpoint, and should only be redeemed from the v2.0 **/token** endpoint.

| Parameter | Description   |
| -         | -             |
| code | The authorization_code that the app requested. The app can use the authorization code to request an **access_token** for a target resource. Authorization codes are very short lived. Typically, they expire after 5-10 minutes. |
| state | See the full description in the previous table. If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and the response are identical. |

Error responses will look like:

```json
{
  "error": "access_denied",
  "error_description": "The user revoked access to the app."
}
```

| Parameter | Description   |
|   -       |    -          |
| error | An error code string that can be used to classify the types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer to identify the root cause of an authentication error. |
|   |   |

## 2. Get a token

Now that you've acquired an authorization code, you can redeem the **code** for a token (hence the name *code flow*) to the desired resource by sending a **POST** request to the **/token** endpoint:

>NOTE!
>
>The **scope** parameter from the initial request to the **/authorize** endpoint must be exactly the same as the one to the **/token** endpoint.

```http
POST: https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1a_v1_signupsignin HTTP/1.1
Host: https://{tenantName].b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id={clientId}
$client_secret={clientSecret}
&scope={clientId} offline_access
&code=eyJraWQiOiJIUTB6ZERpTlhmWHZ$...
&redirect_uri={redirectUri}
```

| Parameter | Required  | Description   |
| -         | :-:       | -             |
| p | Yes | The policy that was used to acquire the authorization code. You cannot use a different policy in this request. Note that you add this parameter to the query string, not in the POST body. |
| grant_type | Yes | The type of grant, which must be **authorization_code** for the authorization code grant flow. |
| client_id | Yes | The application ID that the Azure portal assigned to your app. |
| client_secret | Yes | The application secret. |
| scope | Recommended | A space separated list of scopes (in this case the scope is **not** URL encoded). If you do not include the scope parameter, then the initial request determine the tokens you get in return (see description of the initial request above). If you include the scope parameter, then the scope parameters you specify determine what tokens are returned. The scope values **can not** include any resource or parameter that was not included in the first request that generated the code, but the scope values can be fewer then the first request (smaller scope). |
| code | Yes | The authorization_code that you acquired in the first leg of the flow. |
| redirect_uri | Yes | The redirect_uri of the application where you received the authorization_code. |

A successful response will look like:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkktZDdMQy1TQkltdUtZemNNQlg0WjhDYk10dU84YU9mSjJEZWJyTjM0M3cifQ.eyJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZ...",
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkktZDdMQy1TQkltdUtZemNNQlg0WjhDYk10dU84YU9mSjJEZWJyTjM0M3cifQ.eyJleHAiOjE0OTYwNTk0OTMsIm5iZiI6MTQ5NjA1ODA1MywidmVyIjoiMS4wIiwiaX...",
  "token_type": "Bearer",
  "not_before": "1585051428",
  "expires_in": "86400",
  "expires_on": "1585051728",
  "resource": "c8412f8b-d7a2-6e1a-810e-d61fc5d0d6b3",
  "id_token_expires_in": "3600",
  "profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiI1YmFmZTQwMC0yYTI1LTRmOTctOTE4NS1lMjgwYzdkY2JiMTUiLCJzdWIiOm51bGwsIm5hbWUiOiJSw7hzYmVyZywgTGFycy1K...",
  "refresh_token": "eyJraWQiOiIySlBBbU9EOHVYLTExY2d2U0gtR0FEM05WRU1HSFpsUlB3TUhsWXJ3VEgwIiwidmVyIjoiMS4wIiwiemlwIjoiRGVmbGF0ZSIsInNlciI6IjEuMCJ9.mVIsQu_yMHK7WiNCXUey7VCutoHUFsCT...",
  "refresh_token_expires_in": "7776000"
}

```

| Parameter | Description   |
| -         | -             |
| not_before | The time at which the token is considered valid, in epoch time. |
| token_type | The token type value. The only type supported is Bearer. |
| access_token | The signed JSON Web Token (JWT) token that you requested. |
| scope | The scopes that the token is valid for, which can be used for caching tokens for later use. |
| expires_in | The length of time that the token is valid (in seconds). This value is controlled by the B2C policy configuration |
| refresh_token | An OAuth 2.0 **refresh_token**. The app can use this token to acquire additional tokens after the current token expires. Refresh_tokens are long lived, and can be used to retain access to resources for extended periods of time. For more detail, refer to the [Overview of tokens in Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/tokens-overview#token-types). |

>TIP!
>
>The token claims can be inspected using [jwt.ms](https://jwt.ms) which is Microsoft's neat, online JSON Web Token decoder.
>
>As an alternative, use the SDK Libraries to view them programmatically. For more information on JWT, please refer to the standard [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Validating the id_token

Just receiving an **id_token** is not enough to authenticate the user. You must validate the signature of the **id_token** and verify the claims in the token as per your app's requirements. The Microsoft Identity Platform uses JSON Web Tokens (JWTs) and public key cryptography to sign tokens and verify that they are valid. See article [Validating OAuth 2.0 / OpenID Connect tokens](./e5-Token-validation.md#validating-oauth-20--openid-connect-tokens) for best practice on how to validate a token. The **access_token** must be validated by the service (API) that the application is calling.

## 3. Use the access_token

Now that you've successfully acquired an **access_token**, you can use the token in requests to your backend web APIs by including it in the **Authorization** header:

```xml
GET /tasks
Host: https://myapi.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTU...
```

## 4. Refresh the token

Both **access_tokens** and **id_tokens** short lived. You must refresh them after they expire to continue being able to access resources. You can do so by submitting another **POST** request to the **/token** endpoint. This time provide the **refresh_token** instead of the **code**:

```xml
POST https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1a_v1_signupsignin HTTP/1.1
Host: https://{tenantName}.b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&client_id={clientId} offline_access
&refresh_token=eyJraWQiOiJIUTB6ZERpTlhmWHZyTWJ5cVpJQy10ZUZpbEV6ZVd5TUxHTUFIVTBmV...
&redirect_uri={redirectUri}
&client_secret={clientSecret}
```

A successful token response will look like:

```json
{
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkktZDdMQy1TQkltdUtZemNNQlg0WjhDYk10dU84YU9mSjJEZWJyTjM0M3cifQ.eyJleHAiOjE0OTYwNjY...",
  "token_type": "Bearer",
  "not_before": "1585051428",
  "id_token_expires_in": "3600",
  "profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiI1YmFmZTQwMC0yYTI1LTRmOTctOTE4NS1lMjgwYzdkY2JiMTUiLCJzdWIjpudWxsfQ...",
  "refresh_token": "eyJraWQiOiIySlBBbU9EOHVYLTExY2d2U0gtR0FEM05WRU1HSFpsUlB3TUhsWXJ3VEgwIiwidmVyIjoiMS4wIiwiemlwIjoiRGVmbGF0ZSIsInNlciI6IjEuMCJ9.NcoK57fqPBZeLk3hY52KRQ...",
  "refresh_token_expires_in": "7776000"
}
```

## 5. Authorization code grant extension Proof Key for Code Exchange (PKCE)

With PKCE support for native apps and Single-page apps (SPA) there is no longer any reason to use the implicit grant.

Microsoft now recommends the use of PKCE for all application types.

For more information, see the [PKCE RFC](https://tools.ietf.org/html/rfc7636). PKCE is now recommended for all application types - also for confidential clients like web apps as well as native apps and Single Page Apps (SPAs).

Reference: [OAuth 2.0 authorization code flow in Azure Active Directory B2C](https://learn.microsoft.com/azure/active-directory-b2c/authorization-code-flow)

For JavaScript single-page apps Microsoft has developed the authentication library MSAL.js.
When using MSAL.js, make sure you are using MSAL.js 2.x to be able to work with PKCE.
MSAL.js 1.x does **NO**T support PKCE, and accordingly, MSAL.js 2.x does **NOT** support the *Implicit grant* flow.

These two Microsoft docs articles give some insights into [Single-page apps (JavaScript)](https://learn.microsoft.com/azure/active-directory/develop/v2-app-types#single-page-apps-javascript) and some examples of how to use MSAL.js 2.x.

Setting up a test app: [Use Microsoft Authentication Library for JavaScript to work with Azure AD B2C](https://learn.microsoft.com/azure/active-directory/develop/msal-b2c-overview).
Calling the Graph API: [Tutorial: Sign in users and call the Microsoft Graph API from a JavaScript single-page app (SPA) using auth code flow](https://learn.microsoft.com/azure/active-directory/develop/tutorial-v2-javascript-auth-code).