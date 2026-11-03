---
description: How to connect to Managed Desktop Light with Windows App.
---

# End user Documentation for Managed Desktop Light

## Pre-requisites

You connect to Managed Desktop Light with [Windows App](https://learn.microsoft.com/en-us/windows-app/overview), which replaces the Remote Desktop app. Windows App is available for Windows, macOS, iOS/iPadOS, Android/Chrome OS and web browsers.

- **Windows:** [Windows App from the Microsoft Store](https://apps.microsoft.com/detail/9N1F85V9T8BN)
- **macOS, iOS/iPadOS and Android/Chrome OS:** see [Get started with Windows App](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps?pivots=azure-virtual-desktop)
- **Web browser:** [windows.cloud.microsoft](https://windows.cloud.microsoft/)

:::warning[NB!]
Printing is **_NOT_** supported in the web browser version of Windows App.
:::

## Introduction

Connecting with Windows App is quite simple: you sign in with your Entra ID account (if MFA is required this will also pop up), and then you will see the available resources.

### Connecting

::::tabs
:::tab[Windows App]
1. Open Windows App and select **Sign in**. If you are signed in to a managed Windows device with your work account, you are signed in automatically.
2. The first time, go through the tour and select **Done**, or select **Skip**.
3. Select the **Devices** tab to see the sessionDesktop.
4. Select **Connect** on the sessionDesktop.
:::
:::tab[Web browser]
1. Go to [windows.cloud.microsoft](https://windows.cloud.microsoft/) and sign in with your Entra ID account.
2. The first time, go through the tour and select **Done**, or select **Skip**.
3. Select the **Devices** tab to see the sessionDesktop.
4. Select **Connect** on the sessionDesktop. It opens in a new browser tab.
5. Choose which local devices and features to use in **In Session Settings**, then select **Connect**.
:::
::::

The first time you login to the sessionDesktop, you will be asked to authenticate again. You will also be asked to allow the remote desktop connection to the sessionDesktop. This is needed to be able to login to the sessionDesktop.

### Settings

In Windows App on Windows, you can adjust the settings for the sessionDesktop: select the ellipses (**...**) on the sessionDesktop card, then select **Settings**, and toggle **Use default settings** to off.

If you ie. want to have the sessionDesktop in just a window, and not full screen, select **Single display** under **Display configuration** and turn off **Start in full screen**.

For the other platforms, see [Configure display settings in Windows App](https://learn.microsoft.com/en-us/windows-app/display-settings).
