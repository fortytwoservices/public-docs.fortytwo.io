# Pipeline deployment custom branding

## Table of contents

- [Pipeline deployment custom branding](#pipeline-deployment-custom-branding)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Upload files using Azure DevOps pipeline](#upload-files-using-azure-devops-pipeline)
    - [Pipeline execution](#pipeline-execution)
      - [Development pipeline](#development-pipeline)
      - [Test and Production pipelines](#test-and-production-pipelines)
  - [How to work with an Azure DevOps repository](#how-to-work-with-an-azure-devops-repository)
  - [Recommended procedure](#recommended-procedure)
    - [Checking in files to git repository with Visual Studio Code](#checking-in-files-to-git-repository-with-visual-studio-code)
    - [Branch out from the **main** branch](#branch-out-from-the-main-branch)
      - [Branching - graphical user interface](#branching---graphical-user-interface)
      - [Branching - terminal / shell](#branching---terminal--shell)

## Introduction

Identity platform published pages can be fully customized.
Customization enables companies to *brand* their sign-in pages so they share the look and feel of other company pages.

[Custom branding](./d3-Custom-branding.md#custom-branding) explains sign-in page styling.

Management of custom branding files, primarily uploading of files, can be done in two ways:

- [The manual way](./d3-Custom-branding.md#powershell-script-b2c-blobmanagementps1) leverages a PowerShell script.
This will be the fastest way to work with custom branding files in the **development** environment.
- [The automated way](#upload-files-using-azure-devops-pipeline) when working with Azure DevOps repositories and pipelines.

## Upload files using Azure DevOps pipeline

There are pipelines created for uploading / publishing of branding files to all environments.

- Branding - Development
- Branding - Test
- Branding - Production

### Pipeline execution

 The configuration of pipelines triggers can be split into two categories:

- Automatically triggered
- Manually triggered

>NOTE!
>
>All pipelines are configured to require approval before running.  
>Members of project group **Contributors** can all approve runs, ***including*** their own.

#### Development pipeline

Automatic pipeline triggering is configured deployment of branding in the development environment.  
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

#### Test and Production pipelines

For test and production, a manual action is required to trigger pipeline for deployment of branding files to respective environments.  
There are no "Environments/<Test/Production\>/branding" folders, the Development files are generalized so that they can be *promoted* to other environments using environment specific parameters.

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

## How to work with an Azure DevOps repository

Pushing changes to a central source controlled repository usually involves **Git** and an editor.
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
1. Configure **Auto-complete** (*Merge type* **Merge** - **Delete <working branch\> after merging**) for automatic merge or wait for PR to be approved, then select **Complete**
1. Switch back to **main** branch, pull newly applied changes, delete working branch

### Checking in files to git repository with Visual Studio Code

The following procedure is based on **Visual Studio Code**.

Any other editor of choice (often referred to as ISE - integrated scripting environment) can be used as **git** is installed and works independently.

How to [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (and / or download).

### Branch out from the **main** branch

In [Visual Studio Code](https://code.visualstudio.com/) create a new branch by following these steps:

>TIP!
>
>First clone the project repository (this will create a local folder)

#### Branching - graphical user interface

1. Press "F1" and type "create branch"
    1. Select "Git: Create Branch..."
    1. Enter the "working name" of the new branch
1. Make changes
1. Test changes by uploading files (for the **development** environment)
1. Commit changes
1. Push changes
1. Create **pull request** (PR) in Azure DevOps, either yourself or have someone else create one
1. Approve and merge PR
1. Switch to **main** branch, pull changes, delete branch (optional, but recommended)

#### Branching - terminal / shell

By supplying the **-c** parameter the git switch command creates and switches to the branch:

1. git switch -c <new branch name\>
1. Make changes
1. git add **.** (or **git add \***) (adds all changes, single files can be select instead)
1. git commit -m "<commit message\>"
1. git status (see which files are committed)
1. git push -u origin <branch name\>  
(The **-u** == **--set-upstream** and is a one-time operation to create the new branch in Azure DevOps, new commits only need **git push**)
1. Create **pull request** (PR) in Azure DevOps
1. Approve and merge PR
1. git checkout main
1. git pull
1. git branch -d <new branch name\> (deletes local branch, optional, but recommended)
