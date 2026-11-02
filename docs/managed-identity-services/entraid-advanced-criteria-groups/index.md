---
description: Entra ID dynamic membership rules for groups are awesome, but let's face it, they are simply way too limited. That's why we built a simple open source solution that enables you to build as advanced scenarios as you'd like.
---

# Entra ID Advanced Criteria Groups

:::note
Documentation in progress
:::

Entra ID dynamic membership rules for groups are awesome, but let's face it, they are simply way too limited. That's why we built a simple open source solution that enables you to build as advanced scenarios as you'd like, while maintaining the lowest complexity possible, and the least amount of code possible.

Our solution runs as an [Azure Application](automation-account.md) in your Azure subscription, that contains an Automation Account and an identity that enables you to define your criteria groups [in a simple manner](examples.md). **We do not have any access to your environment**.

This magic is all powered by [our open source PowerShell module](https://www.powershellgallery.com/packages/AdvancedCriteriaBasedGroups), that you can also use on your own.

## Why use this solution

Let's have a look at why you would want to use this solution:

| You want to have a group with | Entra ID? | This solution |
|-|-|-|
| Active users | Yes | Yes |
| Users with company equals Contoso | Yes | Yes |
| Users member of another group | Yes | Yes |
| Users with an attribute that ends with a value | | Yes |
| Users with an attribute that matches a regular expression | | Yes |
| Users member of another group, and having company equals Contoso | | Yes |
| Users member of three groups at the same time | | Yes |
| Users member of another group, but not member of a second group | | Yes |
| Users that has not signed in the last 90 days | | Yes |
