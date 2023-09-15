# Step 1 - Configuring the Virtual Machine Scale Set manually

## Prereqs

- [Terraform installed](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform)
- [Azure CLI installed](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

## Terraform code

We have published [this Terraform module](https://registry.terraform.io/modules/amestofortytwo/selfhostedrunnervmss/azurerm) for simplified deployment, which can be used like this:

```HCL
provider "azurerm" {
  features {}
}

module "vmss" {
  source                         = "amestofortytwo/selfhostedrunnervmss/azurerm"
  operating_system               = "ubuntu"       # windows or ubuntu
  runner_platform                = "azure_devops" # azure_devops or github
}
```

## Connecting to your Azure subscription

```PowerShell
az login
```

[Continue to step 2 - Configuring the Azure DevOps Agent Pool](./azuredevops-vmss-step2.md)