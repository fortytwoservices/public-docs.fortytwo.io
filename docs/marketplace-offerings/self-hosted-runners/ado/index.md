# Configuring Azure DevOps self hosted runners using VMSS

This documentation shows you how to configure an Azure Virtual Machine Scale Set (VMSS) that will always be running the latest Self Hosted Runner image, and connecting the VMSS as an agent pool in Azure DevOps. Using a VMSS in Azure DevOps gives you the ability to automatically increase and decrease the number of active runners dynamically based on pipeline demand. Additionally, the VMSS will always create instances based on the latest runner image published to the Azure Marketplace, so you will never need to worry about updating the operating system and toolkit - just like the Microsoft Hosted Runners!

To configure, you need to follow the three steps below:

1. Configuring the Virtual Machine Scale Set
2. Adding the VMSS as an Azure DevOps Agent Pool
3. Testing the self hosted runner (Not really required)

## Select your deployment option:

- [Manual configuration in the Azure Portal](./step1-manual.md)
- [Deploy using Terraform](./step1-terraform.md)
