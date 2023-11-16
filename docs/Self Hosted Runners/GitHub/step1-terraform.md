# Step 1b - Configuring the Virtual Machine Scale Set using Terraform

## Prereqs

- [Terraform installed](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform)
- [Azure CLI installed](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

## Deployment

We have published [this Terraform module](https://registry.terraform.io/modules/amestofortytwo/selfhostedrunnervmss/azurerm) for simplified deployment. If you are not familiar with using Terraform, consider using the [manual method](./1.md) instead, but it should be fairly easy for most people. 

Start by creating an empty folder with a single file ```main.tf```, with the below content, and running ther ```terraform.ps1``` code line by line:

=== ":octicons-file-code-16: `main.tf`"

    ```hcl
    provider "azurerm" {
      features {}
    }

    module "vmss" {
      source                         = "amestofortytwo/selfhostedrunnervmss/azurerm"
      operating_system               = "ubuntu"       # windows or ubuntu
      runner_platform                = "github"       # azure_devops or github
    }
    ```

=== ":octicons-file-code-16: `terraform.ps1`"

    ```PowerShell
    az login
    az account set --subscription "<your subscription id>"
    az vm image terms accept --offer self_hosted_runner_github --plan ubuntu-latest --publisher amestofortytwoas1653635920536
    az vm image terms accept --offer self_hosted_runner_github --plan windows-latest --publisher amestofortytwoas1653635920536
    terraform init
    terraform apply
    ```

[Continue to step 2 - Configuring the virtual machine scale set for auto registration](./step2.md)
