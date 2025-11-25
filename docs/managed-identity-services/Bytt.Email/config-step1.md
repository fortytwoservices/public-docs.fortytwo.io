# Step 1 - Consenting access

As the first step of getting access to the Bytt.Email service, you need to consent two enterprise applications in your Entra ID. The Fortytwo Universe app, which is our API hub, and the Bytt.Email application, which is used to sign into the frontend and accessing group information in your tenant.

!!! NOTE
    In order to consent access in your tenant, you need one of the following roles active:
    
    - Global Administrator
    - Cloud Application Administrator
    - Application Administrator

1. Consent to Fortytwo Universe, our API hub:

    [https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408)
    <!-- Development: https://login.microsoftonline.com/common/adminconsent?client_id=c61cb4dd-35bf-4db9-b152-58e223782c11 -->

2. Consent to the Bytt.Email application:

    [https://login.microsoftonline.com/common/adminconsent?client_id=34ee8edb-d2ff-4ee9-bac3-73b53303e00f](https://login.microsoftonline.com/common/adminconsent?client_id=34ee8edb-d2ff-4ee9-bac3-73b53303e00f)
    <!-- Development: https://login.microsoftonline.com/common/adminconsent?client_id=5a0b1107-0774-4bd4-a2fd-cf343ce79c56 -->

## Required graph permissions

Bytt.Email requires certain read permissions in your tenant in order to generate email addresses.

| Required permission | Why? |
|-|-|
| User.Read.All | The solution needs to get the details of the user account that signs in, such as firstname, lastname, mailNickname, userPrincipalName and proxyAddresses |
| GroupMember.Read.All | Because we need to find email pattern groups as documented below |

## Next step

[Go to next step](config-step2.md)