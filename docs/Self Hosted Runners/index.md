# Self Hosted Runners

Do you need self hosted runners for Azure DevOps og GitHub, and simply want to have the same runners as Microsoft's Hosted Runners without any more fuzz? Look no further. This solution uses an image that is continuously updated with the same cadence as the Microsoft Hosted Runners, with the same application versions installed.

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
