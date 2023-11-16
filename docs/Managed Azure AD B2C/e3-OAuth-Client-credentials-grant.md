# OAuth 2.0 client credentials grant

## Table of contents

- [OAuth 2.0 client credentials grant](#oauth-20-client-credentials-grant)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Get direct authorization](#get-direct-authorization)
    - [Access control lists](#access-control-lists)
    - [Application permission](#application-permission)
  - [Get a token](#get-a-token)
    - [Successful response](#successful-response)
  - [Use a token](#use-a-token)

## Introduction

You can use the [OAuth 2.0 client credentials grant](http://tools.ietf.org/html/rfc6749#section-4.4), sometimes called two-legged OAuth, to access web-hosted resources by using the identity of an application.
This type of grant commonly is used for server-to-server interactions that must run in the background, without immediate interaction with a user. These types of applications often are referred to as daemons or service accounts.

With the client credentials grant, permissions are granted directly to the application itself.
When the app presents a token to a resource, the resource enforces that the app itself has authorization to perform an action, and not that the user has authorization.

The entire client credentials grant flow is shown in the figure below:

![Client credentials grant flow](media/OAuthClientCredGrant.png)

The picture illustrates the OAuth consent process in the first request and the response.
When using **admin consent**, the first step is not relevant as this is performed by the B2C tenant administrator when configuring the app registration.

## Get direct authorization

An app typically receives direct authorization to access a resource in one of two ways:

- Through an access control list (ACL) at the resource
- Through application permission assignment

These two methods are the most common, and we recommend them for clients and resources that perform the client credential grant flow.  
A resource can choose to authorize its clients in other ways, however.  
Each resource server can choose the method that makes the most sense for its application.

### Access control lists

For data owned by organizations, we recommend that you get the necessary authorization through application permissions (see below).

### Application permission

Instead of using ACLs, you can use APIs to expose a set of application permissions.
An application permission is granted to an application by a tenant administrator, and can be used only to access data owned by that organization and its employees.

For example, Microsoft Graph exposes several application permissions to do the following:

- Read.All : Allow the application to use Read functions in this API
- Write.All : Allow the application to use Write functions in this API
- ReadWrite.All : Allow the application full access to this API

The above application roles are configured for each API. Additional roles can be configured on request. The access token will contain a roles claim that present the app roles granted to the calling application. The API must do authorization and verify that the access token contains the roles expected (e.g Read.All).

An example of a token is shown below:

```json
{
  "aud": "https://{tenantName}.onmicrosoft.com/2cbfa495-bb7b-48ac-8977-f2c88fc84cd9",
  "iss": "https://sts.windows.net/ed815121-cdfa-4097-b524-e2b23cd36eb6/",
  "iat": 1585051428,
  "nbf": 1585051428,
  "exp": 1585051728,
  "aio": "Y2VgYHAN2v5u05L2Pd+qXl6s27zlIQA=",
  "appid": "d9c1a607-2766-4a8e-bc08-4856fcf3ce11",
  "appidacr": "1",
  "idp": "https://sts.windows.net/ed815121-cdfa-4097-b524-e2b23cd36eb6/",
  "oid": "30102cd8-12ee-40f9-bb4c-7b0493fc80bb",
  "roles": [
    "Write.All","Read.All"
  ],
  "sub": "30102cd8-12ee-40f9-bb4c-7b0493fc80bb",
  "tid": "ed815121-cdfa-4097-b524-e2b23cd36eb6",
  "ver": "1.0"
}
```

## Get a token

To get a token by using the client credential grant flow, send a POST request to the /token v2.0 endpoint:

```http
POST: https://{tenantName}.b2clogin.com/{tenantName}.onmicrosoft.com/oauth2/v2.0/token HTTP/1.1
Host: https://{tenantName].b2clogin.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={clientId}
&client_secret={clientSecret}
&scope={resource}
```

| Parameter | Required | Description |
| -         | :-:      | -           |
| grant_type | Yes | Must be **client_credentials**. |
| client_id | Yes | The app ID. |
| client_secret | Yes | The app secret that you generated for your app in the app registration blade. |
| scope | Yes | The value passed for the scope parameter in this request should be the resource identifier (app ID URI of the resource you want <https://{tenantName}.onmicrosoft.com/4e0b562a-64aa-4f66-80a3-0f83bbeb6b48>). This value informs the v2.0 endpoint that of all the direct application permissions you have configured for your app, it should issue a token for the ones associated with the resource you want to use. |

### Successful response

A successful response looks like this:

```json
{
  "access_token":"eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9....",
  "token_type":"Bearer",
  "expires_in":"3599",
  "ext_expires_in":"0",
  "expires_on":"1585051728",
  "not_before":"1585051428",
  "resource":"https://{tenantName}.onmicrosoft.com/4e0b562a-64aa-4f66-80a3-0f83bbeb6b48"
}
```

## Use a token

Now that you’ve acquired a token, use the **access_token** to make requests to the resource.
When the token expires, repeat the request to the /token endpoint to acquire a fresh access_token.
The example below show how the Authorization header is set when sending request to the graph API:

```http
GET /v1.0/me/messages
Host: https://graph.microsoft.com
Content-Type: application/x-www-form-urlencoded
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```
