# Getting started

This is an detailed description of how to setup our Fortify Portal from Azure Marketplace. The steps are pritty much easy to understand but we have documented every step here in this guide.

!!! note

    From April 2024 the name of the portal changed from "Security Posture Portal" to "Fortify Portal". It´s the same product.

## Setup through Azure Marketplace

### Install the app from Azure marketplace

1. Go to our [Azure Marketplace Product page](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/amestofortytwoas1653635920536.securityposture-2023?tab=Overview)
2. Click ``Get it now``

![Click get it now](./media/setup_step1.png)
3. Fill out contact details and click ``Continue``

![Fill out contact details](./media/setup_step2.png)
4. You are now taken to the Azure portal. Choose ``Standard`` on the Plan dropdown and click ``Subscribe``

![Choose plan and subscribe](./media/setup_step3.png)
5. Now take the appropiate actions on the following:

### Configure your Azure environment

!!! note

    To be able to add the Fortify Portal to your tenant you need at least ``Contributor`` access 

1. Configure your tenant environment.
    - Choose which Azure subscription you would like to add the app to.
    - Choose which Resource group the app should live in. Choose "New" if you dont have any.
    - Give the app an appropiate name ``Fortytwo Fortify Portal``
    - Choose ``On`` on Recurring billing.

![Choose subscription and resource group](./media/setup_step4.png)
2. When you are ready click ``Review + subscribe`` to start the setup of the portal.

![Review and subscribe when ready](./media/setup_step5.png)
3. The setup will take a couple of minutes. When its done you will be asked to ``Go to the publisher site to finish setup``. You are now being redirected to our onboarding page

### Run through our onboarding wizard

After you have finished in the Azure Portal you are redirected to <https://portal.fortytwo.io/onboarding-msp> - Follow the onboarding wizard to connect your tenants data.

!!! note

    If you have any issues contact us on support@fortytwo.io

## Setup through Stripe/Visa card

Navigate directly to <https://portal.fortytwo.io> and select "Try it for free". Signup with your Corporate email account and follow the wizard to buy an subscription.
