# Group Link troubleshooting

## Troubleshooting scenarios

### A member is missing from the Entra ID group

Check the following:

1. Is the identity a member of the source collection?
2. Does the final access collection include the expected component collection?
3. Is the correct collection connected to the correct Entra ID group?
4. Is the target group writable and supported?
5. Is membership alignment reporting an error?
6. Has the target application processed the group membership change?

### An unexpected member is added to the Entra ID group

Check the following:

1. Is the identity present in the source collection?
2. Is the identity included through another component collection?
3. Is the identity present in an exception or migration collection?
4. Does the criteria expression include a broader scope than intended?
5. Is another process also managing the group?

### A direct group change is reverted

This is expected when the direct change differs from the desired membership in the source collection.

Make the required change in the appropriate source collection or membership path instead of directly changing the Entra ID group.

### The Entra ID group is correct, but application access is not

Confirm that:

- the correct Entra ID group is assigned to the application or service;
- the application has processed the membership change;
- existing sessions or tokens do not preserve previous access;
- no application-specific role or provisioning rule is missing.

This scenario does not by itself indicate a Group Link failure.
