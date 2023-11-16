# Branding policies pipeline configuration

## Table of contents

- [Branding policies pipeline configuration](#branding-policies-pipeline-configuration)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Pipelines](#pipelines)
    - [Pipeline execution](#pipeline-execution)
      - [The automated way](#the-automated-way)
      - [The manual way](#the-manual-way)
    - [Azure DevOps Pipelines Environments](#azure-devops-pipelines-environments)
    - [Azure DevOps Pipelines Library](#azure-devops-pipelines-library)
      - [Azure DevOps Pipelines variable group - content deployment](#azure-devops-pipelines-variable-group---content-deployment)
    - [Branding](#branding)
    - [Upload branding files via Azure DevOps pipeline](#upload-branding-files-via-azure-devops-pipeline)
      - [Development pipeline - branding](#development-pipeline---branding)
      - [Test and Production pipelines - branding](#test-and-production-pipelines---branding)
    - [Policies](#policies)
      - [Polices - Dev](#polices---dev)
      - [Polices - Test](#polices---test)
      - [Polices - Prod](#polices---prod)
    - [Upload policy files via Azure DevOps pipeline](#upload-policy-files-via-azure-devops-pipeline)
      - [Development pipelines - policies](#development-pipelines---policies)
      - [Test and Production pipelines - policies](#test-and-production-pipelines---policies)
  - [How to work with an Azure DevOps repository](#how-to-work-with-an-azure-devops-repository)
  - [Recommended procedure](#recommended-procedure)
    - [Checking in files to git repository with Visual Studio Code](#checking-in-files-to-git-repository-with-visual-studio-code)
    - [Branch out from the **main** branch](#branch-out-from-the-main-branch)
      - [Branching - graphical user interface](#branching---graphical-user-interface)
      - [Branching - terminal / shell](#branching---terminal--shell)

## Introduction

Azure DevOps pipelines are used for deploying the B2C user interface ([branding](./d3-Custom-branding.md#custom-branding)) and policy files ([User Journeys](./d4-Custom-policies.md#introduction)). This increases the trust level for having a controlled and successful deployment across all environments.

## Pipelines

There are two different types of pipelines for handling deployment:

- branding
- polices

For each of these deployment types there are three pipelines to support the various environments:

- dev (development)
- test
- prod (production)

At minimum, there are six pipelines (2x3) registered for deployments dev, test and prod environments (plus for any additional set of policy files).

All these pipelines must use service principals to perform necessary configuration changes.  
The service principals have been created by automation elsewhere, with credentials stored in [DevOps Pipelines Library](#azure-devops-pipelines-library) variable groups.

The variable group (which provides access to, and safe-keeps, credentials):

- Customer b2c content deployment

**Content** refers to management of the branding and policy files.  
Policy file management happens within the [Identity Experience Framework blade](./d4-Custom-policies.md#uploading-policies-to-the-identity-experience-framework), branding files are hosted on an Azure storage account (resource tenant).

### Pipeline execution

The project repository is the place for all Identity Experience Framework files, User Journey code and configuration.

The configuration of pipelines triggers can be split into two categories:

- Automatically triggered
- Manually triggered

>NOTE!
>
>All pipelines are configured to require approval before running.  
>Members of project group **Contributors** can all approve runs, ***including*** their own.

#### The automated way

Using triggers enables automatic execution when working with Azure DevOps repositories and pipelines.

For pipelines used in development they will automatically trigger when uploaded changes are detected.  
The pipelines are triggered but *must be approved* in order to start churning through steps and tasks.

#### The manual way

For pipelines in test and production they must be triggered manually.

This is a security measure, but also a necessary configuration as test and prod don't have their own files.  
The policy and branding files from Environment\Development\policies\v1 are *promoted* and deployed to test and prod.

All pipelines [must be approved](#azure-devops-pipelines-environments) to start running through steps and tasks.

### Azure DevOps Pipelines Environments

There are three **environments** configured:

- dev
- test
- prod

Each of these are referenced when pipelines are triggered.  
Run history is saved to the respective environments, **dev**, **test**, **prod**.

The environments have **Approvals and checks** configured as follows:

- All approvers must approve
- Approvers: \[IdentityPlatform]\Contributors
- Allow approvers to approve their own runs

>NOTE!
>
>*All approvers must approve* does **not** mean that every member of the group must approve.  
>This can be confusing, but when using groups for approval, a single approval is sufficient.

### Azure DevOps Pipelines Library

There are three *variable groups* defined in the library. These credentials are used for b2c policies and branding (*content*):

- Customer b2c content deployment - Dev
- Customer b2c content deployment - Test
- Customer b2c content deployment - Prod

These credentials are loaded during pipeline execution and are necessary to perform the configured pipeline tasks.

#### Azure DevOps Pipelines variable group - content deployment

*Customer b2c content deployment - \<env>* is used for deploying custom policies and custom styling (UI) files.

The ***content*** variable group holds credentials for the app registration used for content deployment for the specified environment.

>IMPORTANT!
>
>Using an app registration client_id and client_secret means that if the secret expires the pipeline will stop working.  
>It is important that secret management (key rotation) is established to avoid deployment disruption.  
>The app registration resides in the **resource** tenant and it is granted permission in the B2C tenant using admin consent.

Variable **CONTENT_DEPLOYMENT_APP_REGISTRATION_CLIENTID** refers to an app registration in the **resource** tenant.  
Variable **CONTENT_DEPLOYMENT_APP_REGISTRATION_CLIENTSECRET** must be provided with the client_id for the pipeline to successfully authenticate with the Graph API and issue a token that must be presented when uploading files.

The app registration **must** be granted the following Graph API **application** permissions in the B2C tenant:

- Policy.Read.All
- Policy.ReadWrite.TrustFramework

The app registration service principal must also be granted requisite permissions on the blob container in the **resource** tenant, for uploading styling files.  
The blob container **branding** is where the styling files used by the sign-in pages are stored and published.

The minimum requirement for managing files in the container is **Reader and Data Access**.

### Branding

The branding pipelines are named **\<Environment> - branding** and uses the variable group **Customer b2c content deployment - \<Environment>**.

### Upload branding files via Azure DevOps pipeline

Azure DevOps pipelines have been configured for uploading and publishing of branding files to the environments:

- Dev - branding
- Test - branding
- Prod - branding

#### Development pipeline - branding

Automatic pipeline triggering is configured for deployment of branding in the development environment.  
When the pipeline discovers changes committed to the branding folder, regardless of branch, the pipeline starts running.

This means that every for **pull request** (PR) merged, that makes modifications to files in the **include** path, triggers the pipeline to run, in the same goes for any branch making changes to these files.

This is the (current) configuration for the development environment:

```yml
trigger:
  batch: true
  paths:
    include:
      - Pipelines/Dev-branding.yml
      - Pipelines/Templates/Template-branding.yml
      - Environments/Development/branding
```

#### Test and Production pipelines - branding

For test and production, a manual action is required to trigger pipeline for deployment of branding files to respective environments.  
There are no **Environments/\<Test/Production>/branding** folders, the Development files are generalized so that they can be *promoted* to other environments using environment specific parameters.

This is the (current) configuration for the test and production environment (replace *Test* with *Prod*):

```yml
trigger:
  paths:
    include:
      - Pipelines/Test-branding.yml
      - Pipelines/Templates/Template-branding.yml
```

Pipelines in all environments are configured with includes to their own yaml pipeline configuration files.  
With pipeline configuration changes, the pipelines will trigger and start (but will require approval to run).

### Policies

The policies pipelines are named **\<Environment> - policies - vX** and uses the variable group **Customer b2c content deployment - \<Environment>**.

#### Polices - Dev

Two (sometimes three) sets of policy files are uploaded to the **Development** environment.

- \* - v1
- \* - v2
- (\* - v3)

Having multiple sets of policy files allows parallel development of custom policies without the risk of breaking the sign-in experience.

When working on different User Journeys working within a single set of policy files can be sufficient.  
When updating a User Journey it is beneficial to be able to test the outcome to avoid disrupting authentication flows.  
Breaking a User Journey can cause developers to get unexpected results and waste time troubleshooting errors that are not theirs.

Only a development environment will invariably have a need for more than two sets of policies.

Any v3 policies are totally experimental and usually only know to Identity Experience developers.  
If present, v3 polices only live in the development environment and will not be *promoted* to neither Test nor Prod.

The v1 and v2 polices may both be used actively by integrated applications that are under development.  
Usually only v1 policies are used, but when testing new User Journey functionality, v2 policies may be useful for developers.  
Only Identity developers will know what v2 (and v3) polices are available, and so these policies will be used more sparsely.

#### Polices - Test

>NOTE!
>
>Policy files in Test and Prod environments are *promoted* from the repository **Development\Policies - vX** folder.

Two DevOps pipelines are configured for uploading two sets of policy files to the **Test** environment.

- \* - v1
- \* - v2

Policies **v1** hold definitions and User Journeys that will be promoted to the Prod environment.  
This is the *stable* set of policy files with User Journeys where developers, testers and end users will mostly interact.

Policies **v2** may be useful to allow testing of new features or quick bugfix testing (without interrupting the existing flows).

#### Polices - Prod

>NOTE!
>
>Policy files in Test and Prod environments are *promoted* from the repository **Development\Policies - vX** folder.

One DevOps pipeline is configured for uploading policy files to the **Prod** environment.

- \* - v1

Policies deployed in production should have been thoroughly tested in other environments before being released here.

### Upload policy files via Azure DevOps pipeline

Azure DevOps pipelines have been configured for uploading custom policy files to environments:

- Dev - policies - v1
- Dev - policies - v2
- (Dev - policies - v3)
- Test - policies - v1
- Test - policies - v2
- Prod - policies - v1

#### Development pipelines - policies

Automatic pipeline triggering is configured for deployment of custom policy files in the development environment.  
When the pipeline discovers changes committed to the respective policy folder, regardless of branch, the pipeline starts running.

This means that every for **pull request** (PR) merged, that makes modifications to files in the **include** path, triggers the pipeline to run, in the same goes for any branch making changes to these files.

Pipelines in all environments are configured with includes to their own yaml pipeline configuration files.  

This is the (current) configuration for the **v1** (for **v2** and **v3**, replace versions, and *dev* with *test*)  policies in the development environment:

```yml
trigger:
  batch: true
  paths:
    include:
      - Pipelines/Policies dev v1.yml
      - Pipelines/Templates/Template-policies.yml
      - Environments/Development/policies/v1
```

#### Test and Production pipelines - policies

For test and production environments, a manual action is required to trigger pipeline for deployment of custom policy files.  
There are no **Environments/\<Test/Production\>/policies** folders, the **Development** files are generalized so that they can be *promoted* to other environments using environment specific parameters.

This is the (current) configuration for the production environment:

```yml
trigger:
  paths:
    include:
      - Pipelines/Policies v1.yml
      - Pipelines/Templates/Template-policies.yml
```

Pipelines in all environments are configured with includes to their own yaml pipeline configuration files.  
With pipeline configuration changes, the pipelines will trigger and start (but will require approval to run).

## How to work with an Azure DevOps repository

Pushing changes to an central source controlled repository usually involves **Git** and an editor.
[Microsoft's Visual Studio Code](#checking-in-files-to-git-repository-with-visual-studio-code) is a good and lightweight alternative, albeit some extensions may improve the user experience.

The procedure for working with online repositories is very similar regardless of vendor.

The following (recommended) [procedure](#recommended-procedure) uses an Azure DevOps repository (other popular alternatives are GitHub and Bitbucket).

## Recommended procedure

1. Branch out from the **main** branch (using [graphical user interface](#branching---graphical-user-interface) or [shell / terminal](#branching---terminal--shell))
1. Make code changes in the new branch
    1. If environment is **Development**, it is convenient to [manually upload files](./d5-Pipeline-branding-policies.md#uploading-custom-branding-files)
    1. Eventually, manual upload files will only be possible in **Development** as all changes to **Test** and **Production** should be fully automated
1. Upload changes and test Azure AD B2C pages to verify that modifications were successful
1. Now the working branch are ready to be merged to the **main** branch, so everyone with a copy of the repository can get the latest version
1. Create a **pull request** that pushes changes from the working branch into **main**
1. Double-check the proposed changes (**Files**), assign (one or more) **Required reviewer** and select **Create**
1. When the PR is created, make sure that there are \***no**\* *Merge conflicts*
1. Inform reviewer(s) of PR (copy and share the web site link in the browser address field)
1. Configure **Auto-complete** (*Merge type* **Merge** - **Delete \<working branch\> after merging**) for automatic merge or wait for PR to be approved, then select **Complete**
1. Switch back to **main** branch, pull newly applied changes, delete working branch

### Checking in files to git repository with Visual Studio Code

The following procedure is based on **Visual Studio Code**.

Any other editor of choice (often referred to as ISE - integrated scripting environment) can be used as **git** is installed and works independently.

How to [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (and / or download).

### Branch out from the **main** branch

In [Visual Studio Code](https://code.visualstudio.com/) create a new branch by following these steps:

>TIP!
>
>First clone the project repository (this will create a local folder).

#### Branching - graphical user interface

1. Press "F1" and type "create branch"
    1. Select "Git: Create Branch..."
    1. Enter the "working name" of the new branch
1. Make changes
1. Test changes by uploading files (for the **Development** environment)
1. Commit changes
1. Push changes
1. Create **pull request** (PR) in Azure DevOps, either yourself or have someone else create one
1. Approve and merge PR
1. Switch to **main** branch, pull changes, delete branch (optional, but recommended)

#### Branching - terminal / shell

By supplying the **-c** parameter the git switch command creates and switches to the branch:

1. git switch -c \<new branch name\>
1. Make changes
1. git add **.** (or **git add \***) (adds all changes, single files can be select instead)
1. git commit -m "\<commit message\>"
1. git status (see which files are committed)
1. git push --set-upstream origin \<branch name\>
(The **-set-upstream** is a one-time operation to create the new branch in Azure DevOps, new commits only need **git push**)
1. Create **pull request** (PR) in Azure DevOps
1. Approve and merge PR
1. git checkout main
1. git pull
1. git branch -d \<new branch name\> (deletes local branch, optional, but recommended)
