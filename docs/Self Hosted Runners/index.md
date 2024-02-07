# Self Hosted Runners

Do you need self hosted runners for Azure DevOps og GitHub, and simply want to have the same runners as Microsoft's Hosted Runners without any more fuzz? Look no further. This solution uses an image that is continuously updated with the same cadence as the Microsoft Hosted Runners, with the same application versions installed.

## Possibilities

### Access any cloud platform from your runners

You can choose to allow the self hosted runners to access any internet connected service for deployment.

![](media/20240207152318.png)

### Enable private access to Azure resources

You can enable private access to Azure resources through either [service endpoints](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview) or [private endpoints / Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview).

![](media/20240207152351.png)

### Enable access to on-premises

You can connect your self hosted runners to on-premises, other landing zones or privately to other cloud services through several methods. An example cloud by Virtual WAN, but of course network peering, VPN gateways and other methods are also available:

![](media/20240207152412.png)

## Can you see my data?

No, this is simply a configuration of a Virtual machine scale set using published VM images and contains no call home functionality or similar.

## Can you access my virtual machines?

No, you control everything yourself.

## Why do you recommend using a Virtual Machine Scale Set?

We recommend using a Virtual Machine Scale Set because it can continuously grab the latest image from Azure Marketplace, ensuring that you always have the latest runner, and because it can be used to automatically scale up and down the number of agents you have available, without you needing to worry about it. It is also cheaper, as you do not need to run many idle agents.

## How do I configure this?

Follow one of these:

- [Azure DevOps](Azure%20DevOps/index.md)
- [GitHub](GitHub/index.md)
