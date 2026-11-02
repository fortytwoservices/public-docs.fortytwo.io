---
description: An easily deployable solution template on Microsoft Marketplace, that will make Maester run in your own environment, giving you control over the setup.
---

# Maester my Microsoft365

This is an easily deployable solution template on Microsoft Marketplace, that will make Maester run in your own environment, giving you control over the setup.

## How to install the solution

This will provide you with a step-by-step to have the solution running in your environment.

1. First find the solution in Microsoft Marketplace and start the wizard. Then fill in the required information about resource group and name.

    ![The Marketplace wizard with resource group and name](media/image.png)

2. Then connect it to an App Registration in your tenant, that will be used for SSO. You can choose to use an existing, or create a new one.

    ![Choosing an App Registration for SSO](media/image-1.png)

3. This example shows creating a new App Registration.

    ![Creating a new App Registration](media/image-2.png)

4. This will bring you into the App Registration window, where you can create a new client secret.

    ![The App Registration window](media/image-3.png)

    ![Creating a new client secret](media/image-4.png)

    ![The new client secret](media/image-5.png)

5. Press the x to go back to the Wizard, and paste the new client secret into the client secret box.

    ![The client secret box in the wizard](media/image-6.png)

6. If you need to tag the resources, you can do so.

    ![Tagging the resources](media/image-7.png)

7. Now you can click 'Create' to deploy the app.

    ![The Create button in the wizard](media/image-8.png)

    ![The deployment in progress](media/image-9.png)

8. When the deployment is done, you can go to 'Outputs' and copy the redirectUri.

    ![The redirectUri under Outputs](media/image-10.png)

9. Then go back to the App Registration, under 'Authentication'.

    ![Authentication in the App Registration](media/image-11.png)

10. Then go to 'Add a platform', and choose 'Web'.

    ![Add a platform, Web](media/image-12.png)

11. Paste the redirect uri in the text field, and check the box for 'ID Tokens', and press 'Configure'.

    ![The redirect URI and the ID Tokens box](media/image-13.png)

    ![The configured Web platform](media/image-14.png)

12. When you now open the webpage URL, you should be redirected to sign in to your organization, and then to approve the permissions requested to read your profile.

    ![The permissions requested to read your profile](media/image-15.png)

13. After that, you should be signed in. You will now have to add some roles to the application to be able to read Tenant settings. There is a script to do that ready under "Help" in the menu. After that is done reports will be gathered once a day.

    ![The script under Help in the menu](media/image-16.png)
