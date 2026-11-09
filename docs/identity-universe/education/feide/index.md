# FEIDE

Fortytwo offers FEIDE provisioning in two ways:

| | |
|-|-|
| **As a service** | Fortytwo delivers FEIDE LDAP servers as a service, which Fortytwo Universe populates |
| **Self hosted**  | Customers brings their own LDAP server, which Fortytwo Universe populates |

## Passwords

:::tip[Password synchronization]
Fortytwo Universe _can_ provide password synchronization features, but we do not recommend this. Passwords are going away, and there is no need to implement systems that still require passwords. 
:::

Our recommended approach is to utilize [Feide's Entra ID federation feature](https://docs.feide.no/home_organizations/feide_login_with_entra_id.html), which enables single sign-on from Entra ID. This completely eliminates the need to do password synchronization.

## Required attributes

Along with the default required [IAM Core attributes](../iam-core-attributes.md), the following describes the required attributes for FEIDE provisioning:

### Org units

| Attribute | Description | Example value |
|-|-|-|
| educationGrades | The grade of the **homeroom** (basisgruppe) | 6 |
| educationSourcedId | The id from the school information system | 383938 |
| educationCodes | The UDIR education codes of the **scheduled** group (faggruppe) | NOR1234 |
| educationStartDate | The start date of the group from the school information system, required for **homeroom** and **scheduled** | 2026-08-01 |
| educationEndDate | The end date of the group from the school information system, required for **homeroom** and **scheduled** | 2026-07-31 |
| legalIdentifier | Required for **school** and **schoolowner** to be the identifier from Brreg | NO123123123 |

### Students and teachers

| Attribute | Description | Example value |
|-|-|-|
| nin | The national identifier number of the person | 12345678910 |