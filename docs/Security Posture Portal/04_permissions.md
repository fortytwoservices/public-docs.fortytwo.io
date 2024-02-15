# Manage access and permissions to the portal

To manage access to the portal, we utilize app role assignments in Entra ID. By default, if you have no roles assigned, the user will be presented with demo data in the portal.

1. Go to the [Enterprise applications blade](https://portal.azure.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview) in the Entra portal.

2. Find the application named **Fortytwo Portal**.

3. In the application pane, find **Users and groups** and click **+ Add user/group**

4. Select the user or group of users you want to assign access to, and select the role you want to assign. The following roles exists.

| Role  | Description   |
|-------------- | -------------- |
| Security Posture Operator    | Provides access to the security posture feature in the portal, with the ability to accept risks     |
| Security Posture Admin    | Currently same as Security Posture Operator, but in the future, more administrative tasks will be available to this role. Give youself this role.     |
| Security Posture Reader    | Provides a read only access to the security posture feature in the portal     |
