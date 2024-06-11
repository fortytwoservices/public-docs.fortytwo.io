# Entra ID Advanced Criteria Groups

!!! note Documentation in progress

Entra ID dynamic membership rules for groups are awesome, but let's face it, they are simply way too limited. That's why we built a simple open source solution that enables you to build as advanced scenarios as you'd like, while maintaining the lowest complexity possible, and the least amount of code possible.

Our solution runs as an [Azure Application](automation-account.md) in your Azure subscription, that contains an Automation Account and an identity that enables you to define your criteria groups [in a simple manner](examples.md). **We do not have any access to your environment**.

This magic is all powered by [our open source PowerShell module](https://www.powershellgallery.com/packages/AdvancedCriteriaBasedGroups), that you can also use on your own.

Let's have a look at why you would want to use this solution:

You want to have a group with | Entra ID? | This solution
-|-|-
Active users | ✅ | ✅
Users with company equals Contoso | ✅ | ✅
Users member of another group | ✅ | ✅
Users with an attribute that ends with a value | | ✅
Users with an attribute that matches a regular expression | | ✅
Users member of another group, and having company equals Contoso | | ✅
Users member of three groups at the same time | | ✅
Users member of another group, but not member of a second group | | ✅
Users that has not signed in the last 90 days | | ✅
