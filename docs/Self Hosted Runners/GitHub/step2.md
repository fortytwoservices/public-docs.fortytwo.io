# Step 2 - Configuring the virtual machine scale set for auto registration

Now the the VMSS is up and running, we are ready to configure the Azure DevOps side of things. 

On the organization level (not while in a project), go to **Organization settings**

Find **Agent pools** and click **Add pools**

![](media/20230914095252.png)

Select **Azure virtual machine scale set**

![](media/20230914095739.png)

Find you VMSS and name your pool:

![](media/20230914095932.png)

Configure your preferred **Pool options**. We recommend having at least 1 agent on standby, though if cost is an issue, you can set it to 0 (you will have longer wait times for your first run due to provisioning the instance)

![](media/20230914100312.png)

Click **Create**.

You should now be ready to use the VMSS as runners. After configuring the DevOps side of things, you should see the following extension added to your VMSS:

![](media/20230914100432.png)

[Continue to step 3 - Testing the self hosted runner](./step3.md)