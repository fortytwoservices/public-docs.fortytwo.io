---
description: How to connect to Managed Desktop Light with Windows App.
---

# End user Documentation for Managed Desktop Light

## Pre-requisites

You connect to Managed Desktop Light with [Windows App](https://learn.microsoft.com/en-us/windows-app/overview), which replaces the Remote Desktop app. Windows App is available for Windows, macOS, iOS/iPadOS, Android/Chrome OS and web browsers.

You sign in with your Entra ID work account. A personal Microsoft account does not work.

## Introduction

Connecting with Windows App is quite simple: you sign in with your Entra ID account (if MFA is required this will also pop up), and then you will see the available resources.

### Connecting

::::tabs
:::tab[Windows]
1. Install [Windows App from the Microsoft Store](https://apps.microsoft.com/detail/9N1F85V9T8BN) and open it.
2. Select **Sign in**. If you are signed in to a managed Windows device with your work account, you are signed in automatically.
3. The first time, go through the tour and select **Done**, or select **Skip**.
4. Select the **Devices** tab to see the sessionDesktop.
5. Select **Connect** on the sessionDesktop.
:::
:::tab[macOS]
1. Install [Windows App from the Mac App Store](https://aka.ms/macOSWindowsApp) and open it.
2. The first time, go through the tour and select **Done**, or select **Skip**.
3. On the **Devices** tab, select the plus (**+**) icon, then **Add Work or School Account**, and sign in.
4. Double-click the sessionDesktop to connect.
:::
:::tab[iOS/iPadOS]
1. Install [Windows App from the App Store](https://aka.ms/iOSWindowsApp) and open it.
2. The first time, go through the tour and select **Done**, or select **Skip**.
3. Tap the plus (**+**) icon, then **Work or School Account**, and sign in.
4. On the **Devices** tab, tap the sessionDesktop to connect.
:::
:::tab[Android/Chrome OS]
1. Install [Windows App from Google Play](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx) and open it.
2. The first time, go through the tour and select **Got it**, or select **Skip**.
3. Tap the plus (**+**) icon, then **Sign in**, and sign in.
4. On the **Devices** tab, tap the sessionDesktop.
5. Choose which local devices and features to use in the session, then tap **Connect**.
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

:::tip
Pin the sessionDesktop to the **Favorites** tab to find it faster next time.
:::

### Settings

In Windows App on Windows, you can adjust the settings for the sessionDesktop: select the ellipses (**...**) on the sessionDesktop card, then select **Settings**, and toggle **Use default settings** to off.

If you ie. want to have the sessionDesktop in just a window, and not full screen, select **Single display** under **Display configuration** and turn off **Start in full screen**.

To use more than one monitor, select **All displays** to use every monitor, or **Select displays** to choose which ones.

For the other platforms, see [Configure display settings in Windows App](https://learn.microsoft.com/en-us/windows-app/display-settings).

### Clipboard, drives and printers

You can use your local clipboard, drives and printers in the sessionDesktop:

- **Clipboard:** copy and paste text, images and files between your own device and the sessionDesktop.
- **Drives:** your local drives show up as network drives in File Explorer in the sessionDesktop. In the web browser, you get a virtual drive with an **Uploads** and a **Downloads** folder instead, and you can drag files into the session window to upload them.
- **Printers:** print to your local printer from the sessionDesktop. In the web browser, printing opens the print dialog of your browser.

See [Redirect local devices, audio, and folders in Windows App](https://learn.microsoft.com/en-us/windows-app/device-audio-folder-redirection-teams) for details per platform.

### Disconnecting

When you are done, close the sessionDesktop window (or browser tab) to disconnect. Your apps keep running, and you continue where you left off the next time you connect.

## Troubleshooting

:::details[The sessionDesktop does not show up]
Check that you signed in with your work account, not a personal Microsoft account. If you have more than one work account, make sure you use the one that has access to Managed Desktop Light.
:::

:::details[I cannot connect from a company network]
Some networks block the addresses Windows App needs. Ask your network administrator to allow the [required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint#end-user-devices).
:::
