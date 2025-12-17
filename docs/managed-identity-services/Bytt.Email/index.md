# Bytt.Email

[Bytt.Email](https://bytt.email) is a service that allows end users to change their own email address and UPN, both in Entra ID and Active Directory, based on [predefined patterns](./config-step2.md). The service also has [an API](https://api.fortytwo.io/changeemail/swagger/index.html), that can be used for [generating email addresses for your IAM solution](./using-the-api-in-your-automations.md).

The portal is branded using the tenant branding you have in Entra ID:

<img src="media/20251009225713.png" style="max-width: 50%" />

The user can be show option for changing their sign-in name and adding aliases, depending on configuration:

<img src="media/20251009225656.png" style="max-width: 50%" />

## Start using the service

In order to start using the service, you have two options for installation:

- [Automated configuration using PowerShell (Recommended)](autoconfig.md)
- [Configure everything manually](config-step1.md)

After the service is installed, you can test out the service and create a subscription in [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/fortytwoio.changeemail).