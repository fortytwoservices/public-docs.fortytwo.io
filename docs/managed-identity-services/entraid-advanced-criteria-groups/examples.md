# Examples

## Users with an attribute that ends with a value

```PowerShell
# Connect to the Microsoft Graph using Automation Account user assigned identity
Connect-AdvancedCriteriaBasedGroups

# Start working on a group
Start-AdvancedCriteriaBasedGroup -ObjectId "404c71ff-bb33-4434-85e1-2e6c9863d33c"

# Add uers with userPrincipalname ending with @test.com
Add-AdvancedCriteriaBasedGroupMembers -Criteria { $_.UserPrincipalName -like "*@test.com"}

# Add this point we have told the module which users should be a member of the group, now we are ready to actually complete the operations in Entra ID.
Complete-AdvancedCriteriaBasedGroup
```

## Users with an attribute that matches a regular expression

```PowerShell
# Connect to the Microsoft Graph using Automation Account user assigned identity
Connect-AdvancedCriteriaBasedGroups

# Start working on a group
Start-AdvancedCriteriaBasedGroup -ObjectId "404c71ff-bb33-4434-85e1-2e6c9863d33c"

# Add uers with jobTitle matching a regular expression
Add-AdvancedCriteriaBasedGroupMembers -Criteria { $_.jobTitle -match '^(lead|principal) engineer$'}

# Let's also add users with a few other jobTitle values
Add-AdvancedCriteriaBasedGroupMembers -Criteria { $_.jobTitle -in 'project manager', 'key account manager'}

# Add this point we have told the module which users should be a member of the group, now we are ready to actually complete the operations in Entra ID.
Complete-AdvancedCriteriaBasedGroup -Verbose
```

## Users member of another group, and having company equals Contoso

```PowerShell
# Connect to the Microsoft Graph using Automation Account user assigned identity
Connect-AdvancedCriteriaBasedGroups

# Start working on a group
Start-AdvancedCriteriaBasedGroup -ObjectId "404c71ff-bb33-4434-85e1-2e6c9863d33c" -Verbose

# Get all members of another group, but only users having usageLocation 'NO', and add as members of the group we are working on
Get-AdvancedCriteriaBasedGroupUsers -MembersOfGroupObjectId "20a2a612-fbd5-4fd6-a94a-1edefcdf48a9" | 
Where-Object usageLocation -in "NO" |
Add-AdvancedCriteriaBasedGroupMember -Debug

# Add this point we have told the module which users should be a member of the group, now we are ready to actually complete the operations in Entra ID.
Complete-AdvancedCriteriaBasedGroup
```

## Users member of three groups at the same time

Todo

## Users member of another group, but not member of a second group

```PowerShell
# Connect to the Microsoft Graph using Automation Account user assigned identity, but we can actually disable the user cache, as we have a special cmdlet for this member of one group but not another group scenario - which is way faster. :)
Connect-AdvancedCriteriaBasedGroups -DoNotCacheAllUsers

# Start working on a group
Start-AdvancedCriteriaBasedGroup -ObjectId "404c71ff-bb33-4434-85e1-2e6c9863d33c" -Verbose

# Writes members of group A22222222-2222-2222-2222-222222222222 and 33333333-3333-3333-3333-333333333333 to group 11111111-1111-11111-1111-111111111111, but only if they are not member of group 44444444-4444-4444-4444-444444444444
Write-AdvancedCriteriaBasedGroupMemberOfButNotMemberOfGroup `
    -DestinationGroup "11111111-1111-1111-1111-111111111111" `
    -MemberOfGroups "22222222-2222-2222-2222-222222222222", "33333333-3333-3333-3333-333333333333" `
    -ButNotMemberOfGroups "44444444-4444-4444-4444-444444444444"
```

## Users that has not signed in the last 90 days

```PowerShell
# Connect to the Microsoft Graph using Automation Account user assigned identity. In order to get the signInActivity property, we need to tell the module to fetch it into the cache. This requires the auditlog.read.all permission.
Connect-AdvancedCriteriaBasedGroups -Properties signInActivity

# Start working on a group
Start-AdvancedCriteriaBasedGroup -ObjectId "404c71ff-bb33-4434-85e1-2e6c9863d33c"

# Add users that has not successfully signed in within the last 90 days
Add-AdvancedCriteriaBasedGroupMembers -Criteria { $_.signInActivity.lastSuccessfulSignInDateTime -lt (Get-Date).AddDays(-90)}

# Add this point we have told the module which users should be a member of the group, now we are ready to actually complete the operations in Entra ID. Here we actually want to trigger a logicapp through a url when users are added to this group:
Complete-AdvancedCriteriaBasedGroup `
    -TransitionInUrls "https://prod-253.westeurope.logic.azure.com:443/workflows/6826bb7ba2d24e3bb90b75469ab4012f/triggers....." 
```