# Permissions

We have to assign permissions to [administrators](#identity-universe-administrator) and [users](#users) for them to be able to access the portal.

## Identity Universe Administrator

To be an Identity Universe IAM administrator, a user must be assigned specific roles that grant the necessary permissions.

Administrators must hold the following roles to get full Identity Universe access for the organisation data:

| Role | Purpose |
| - | - |
| IAM Core - user | |
| IAM Core - administrator | Enables [core](../../iam-core) administration in the portal and APIs |
| Collections - Administrator | Enables the [collections](../../collections) administration option in the portal and APIs. |
| Events - administrator | |
| Workflows - administrator | Enables the workflows administration option in the portal and APIs. |
| Education - administrator | Enables the education administration option in the portal and APIs.  |

### User assignments

To assign IAM Administrator access a user or group must be assigned both the **IAM Core - user** and **IAM Core - administrator** roles in the **Fortytwo Universe** enterprise application.
To work with Collections the role **Collection Criteria - Administrator** must also be assigned.

We recommend using Entra security groups for assigning these roles to make access management easier.

1. Find the **Fortytwo Universe** enterprise application

    ![Fortytwo Universe enterprise application](media/fortytwouniverseentapp.png)

1. In **User and groups** choose **Add user/group**

    ![Fortytwo Universe assignments](media/fortytwouniverseassignments.png)

1. Click **User and groups** and select a group and choose **Select**. Then click **Select a role** and **Select**. To add the permission click **Assign**. To assign multiple roles repeat the process for the same group and add additional permission.
   
    ![Fortytwo Universe add group/role](media/fortytwouniverseaddrole.png)

### Administration

When assigned the IAM Core Administrator role the **Administration blade** becomes accessible.

![Administration blade](media/administration.png)

The Administration blade enables insight into the core of Identity Universe.

* Identity Hub holds the IAM core data, connector data and sync rules
* Collections is where criteria collections and joinable collections are maintained
* Workflows is where automatic flows can be configured. Workflows work with collections, based on members entering or leaving a collection, and can trigger webhooks.

## Users

Users should also be assigned some groups for them to be able to access the portal.

| Role | Purpose |
| - | - |
| User | Enables self-service in the portal. |
