---
sidebarTitle: "How the flow works"
---

# User Journey with technical details

## Step 1 - User chooses method of authentication

::::screen{src="../media/guides/step-1.webp" side}
The user opens the CheckID page and chooses which identity provider to sign in with.
::::

## Step 2 - Choose between returning or new hire

::::screen{src="../media/guides/step-2.webp" side}
Depending on whether the user is a returning employee or a new hire, they choose the appropriate selection.
::::

## Step 3 - Select account to onboard

::::screen{src="../media/guides/step-3.webp" side}
A value from the authentication session is used to determine which user accounts the person has. These are shown as a list and the user can choose which account to onboard.
::::

## Step 4 - Install Microsoft Authenticator

::::screen{src="../media/guides/step-4.webp" side}
The first step that the user needs to do is to install the Microsoft Authenticator app. Here, the option to the Google Play Store or Apple App store is shown. If the user signs in from another device than their phone, the user can show the QR code in order to navigate with those.

At the same time this step is shown, a [Temporary Access Pass (TAP)](https://learn.microsoft.com/entra/identity/authentication/howto-authentication-temporary-access-pass) is created for the user account. This allows some time for the TAP to be replicated in Entra ID.
::::

## Step 5 - Sign into Microsoft Authenticator

::::screen{src="../media/guides/step-5.webp" side}
The user is told to sign into the Microsoft Authenticator app with the userPrincipalName and the generated TAP.

During this step, when following our [Getting Started guide](../onboarding/first-time-setup.md), the user will end up with an Authenticator app that both support [notification based MFA](https://learn.microsoft.com/entra/identity/authentication/concept-authentication-authenticator-app#passwordless-sign-in-via-notifications) and [passkey based MFA](https://learn.microsoft.com/entra/identity/authentication/concept-authentication-authenticator-app#passkey-sign-in). They will also be told to register their device, if you have configured this policy.
::::

## Step 5 (OPTIONAL) - Set a password

:::note
It is possible to choose whether this step is shown or not. If you do not need passwords, this can be hidden.
:::

::::screen{src="../media/guides/set-password.webp" side}
The user will be told to click the set password button, and clicking it will open a dialogue where the user sets a password.
::::

::::screen{src="../media/guides/set-password-dialog.webp" side}
In the dialogue the user will be prompted to set a password. Note that the user will be able to see whether they meet all the password requirements.
::::

## Step 6 - The process is complete

::::screen{src="../media/guides/step-6.webp" side}
Once the above steps have been completed, the user is shown a screen that confirms that the account is now set up and optionally a set of useful links and FAQ.
::::

## So what about the computer?

Signing into the computer is the next step, and the phone is now used for this operation - at least when the computer is Entra Joined. For Entra Joined devices, the [Web sign-in for Windows](https://learn.microsoft.com/windows/security/identity-protection/web-sign-in) is recommended. Here, the user can use the passkey they got in Step 4 for signing passwordlessly into their computer. The computer will then enroll with Windows Hello for Business, which will take over as the users normal method of authentication on that device.

## But we have Macs?

:::note
Documentation not complete yet. We are working on it. In the mean time, have a look at these:
:::

<https://learn.microsoft.com/entra/identity/devices/device-join-microsoft-entra-company-portal?tabs=secure-enclave>

<https://learn.microsoft.com/entra/identity/devices/device-join-macos-platform-single-sign-on?tabs=secure-enclave>
