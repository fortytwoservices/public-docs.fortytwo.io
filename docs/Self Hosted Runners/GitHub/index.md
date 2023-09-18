# Configuring GitHub self hosted runners using VMSS

This documentation shows you how to configure an Azure Virtual Machine Scale Set (VMSS) that will always be running the latest Self Hosted Runner image, as well as configuring the VMSS instances to automatically register as self hosted runners in your GitHub organization or repository. Using a VMSS gives you the ability easily increase and decrease the number of active runners whenever you want, manually for now, but it is possible to automate. Additionally, the VMSS will always create instances based on the latest runner image published to the Azure Marketplace, so you will never need to worry about updating the operating system and toolkit - just like the hosted runners!

To configure, you need to follow the three steps below:

1. Configuring the Virtual Machine Scale Set
2. Configuring the VMSS instances to automatically register to GitHub
3. Testing the self hosted runner (Not really required)

## Select your deployment option:

- [Manual configuration in the Azure Portal](./step1-manual.md)
- [Deploy using Terraform](./step1-terraform.md)
