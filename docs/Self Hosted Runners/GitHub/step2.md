# Step 2 - Configuring the virtual machine scale set for auto registration

Now the the VMSS is up and running, we are ready to configure the Github runner.

## Get a PAT from Github for either repo or organization

If you are registering the runners for a private repo, the PAT needs to have access to "repo". If you are registering the runners for an organization, the PAT needs to have access to "admin:org".
To register a PAT, go to "Settings" -> "Developer settings" -> "Personal access tokens" -> "Tokens (classic) and click "Generate new token".

### Organization runners

![Alt text](media/step2.png)

### Organization runners on private repo

![Alt text](media/step2-1.png)

### Personal repository runners

![](media/2023-09-15_13-50-27.png)

## Configure the VMSS to auto register

Run the following with az-cli to configure an extension on the VMSS that will auto register the runner with Github. Replace the variables with your correct information.

```bash
VMSS=vmss-test-noeast
RG=rg-test-noeast
PAT=ghp_xxx
ORG=amesfortytwo
USER=runneradmin
LABEL=label1,label2
RGROUP=test # Runner Group. Optional and can be left out/blank.
az vmss extension set --vmss-name $VMSS --name customScript --resource-group $RG \
    --version 2.1 --publisher Microsoft.Azure.Extensions \
    --protected-settings "{\"fileUris\": [\"https://raw.githubusercontent.com/amestofortytwo/terraform-azurerm-selfhostedrunnervmss/main/scripts/script.sh\"],\"commandToExecute\": \"sh script.sh $ORG $PAT $USER $LABEL $RGROUP\"}"
```

Scale up the VMSS to at least 1 instance. This can be done in the Azure Portal or with az-cli. Currently you would need to manually scale the number of instances of the VMSS to the number you want.

![](media/2023-09-15_13-53-43.png)

## Verify that the runner is registered

After the previous has been done, you should be able to verify within the organization or the repository that the runner is registered.

![](media/2023-09-15_14-12-59.png)

[Continue to step 3 - Testing the self hosted runner](./step3.md)