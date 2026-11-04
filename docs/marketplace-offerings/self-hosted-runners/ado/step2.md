---
description: Add the Virtual Machine Scale Set as an agent pool in Azure DevOps.
---

# Step 2 - Configuring the Azure DevOps Agent Pool

Now the VMSS is up and running, we are ready to configure the Azure DevOps side of things.

## Add the agent pool

::::steps
### Open Organization settings

On the organization level (not while in a project), go to **Organization settings**

### Add a pool

Find **Agent pools** and click **Add pools**

![Agent pools in Organization settings](media/20230914095252.png)

Select **Azure virtual machine scale set**

![Selecting Azure virtual machine scale set as the pool type](media/20230914095739.png)

Find your VMSS and name your pool:

![Choosing the VMSS and naming the pool](media/20230914095932.png)

### Configure the pool options

Configure your preferred **Pool options**. We recommend having at least 1 agent on standby, though if cost is an issue, you can set it to 0 (you will have longer wait times for your first run due to provisioning the instance)

![The Pool options](media/20230914100312.png)

### Create the pool

Click **Create**.
::::

You should now be ready to use the VMSS as runners. After configuring the DevOps side of things, you should see the following extension added to your VMSS:

![The extension added to the VMSS](media/20230914100432.png)

[Continue to step 3 - Testing the self hosted runner](./step3.md)
