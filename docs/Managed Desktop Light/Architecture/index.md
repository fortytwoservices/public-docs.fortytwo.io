# Architecture

The solution is based on a single Windows 11 multi-session host. The host is joined to Azure AD, and users are authenticated using Azure AD. The host is not joined to any on-prem domain, and is not connected to any on-prem network. The host is not connected to any other Azure network, and is not connected to any other Azure resources.

## Network

* 1x Virtual Network
* 1x Subnet
* 1x Network Security Group

## Azure Virtual Desktop

Consist of the following components:

* 1x Host Pool
* 2x Application Groups
* 1x Workspace

## Virtual Machine

* 1x Virtual Machine
* 1x Managed Disk
* 1x Network Interface

## Log Analytics

* 1x Log Analytics Workspace

## Backup

* 1x Recovery Services Vault

## Automation Account

* 1x Automation Account
* 1x Runbook
* 1x Schedule
* 1x Managed Identity
