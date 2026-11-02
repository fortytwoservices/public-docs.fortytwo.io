---
description: CheckID lets new employees sign in for the first time with an identity provider they already use, such as BankID, and get their Microsoft Entra ID account without temporary passwords.
icon: scan-face
---

# CheckID

**CheckID** is a secure and user-friendly onboarding solution that simplifies the first-time sign-in experience for new employees in your organization.

Instead of relying on distributing temporary passwords, manual user setup, and IT bottlenecks, CheckID allows users to authenticate themselves using familiar and secure [identity providers that they already use for online banking or similar](./onboarding/identity-providers.md).

Once signed in, users are automatically provided with access to their Microsoft Entra ID account: fast, secure, and fully compliant.

## Key Benefits

::::cards{cols=3}
:::card{title="Zero IT stress" icon="smile"}
No need to manually create and distribute temporary passwords.
:::
:::card{title="Frictionless for the user" icon="fingerprint"}
Uses an authentication method they already know.
:::
:::card{title="Secure by design" icon="shield-check"}
Integrates natively with Microsoft Entra ID and follows all best practices for Zero Trust implementation.
:::
::::

## How It Works

1. The new employee goes to `yourorg.checkid.no` (optional custom domain) on their phone or laptop.
2. They choose their [preferred authentication method](./onboarding/identity-providers.md).
3. After secure authentication, CheckID:
   - Connects to your Microsoft Entra ID tenant
   - Creates a [Temporary Access Pass (TAP)](https://learn.microsoft.com/entra/identity/authentication/howto-authentication-temporary-access-pass)
   - Guides the user in adding the account to Microsoft Authenticator
4. The user can use Microsoft Authenticator to enroll additional devices, such as their PC.

## Where to start

:::::cards{cols=3}
::::card{title="What is CheckID?" icon="info" href="./get-started/what-is-checkid.md"}
The features, and what problem it solves.
::::
::::card{title="First-time setup" icon="rocket" href="./onboarding/first-time-setup.md"}
Consent and Entra ID settings for your tenant.
::::
::::card{title="Identity providers" icon="fingerprint" href="./onboarding/identity-providers.md"}
Which IDs your employees can sign in with.
::::
:::::

Read more on [checkid.no](https://checkid.no). CheckID is developed by [fortytwo.io](https://fortytwo.io)
