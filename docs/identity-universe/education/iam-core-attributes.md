# IAM Core attributes

In order to use the education features, [IAM Core](./../iam-core/index.md) must be populated with data from the school information system(s) you have through [connectors](../iam-core/connectors/index.md). The connectors all come with pre made synchronization rules that will support the education features, but if you  in case, here all required attributes:

## Student -> Core Identity

Each student need to be created as an identity in IAM Core, with the below attributes:

| Attribute | Description | Example value |
|-|-|-|
| displayName | To display human friendly in the user interface | John Doe |
| entraObjectId | Required by both student password and internet policy features in order to locate the Entra user account of the student | 09964771-f29e-48c5-9754-78bfa9e603e7 |
| entraOnPremisesSyncEnabled | Required by the student password feature, if you need to use the AD Agent | true |
| entraOnPremisesUserPrincipalName | Displayed in the user interface, as the username of the student | john.doe@test.com |

It is also recommended to populate these attributes:

- nin
- firstName
- lastName
- entraOnPremisesSamAccountName
- dateOfBirth

## Teacher -> Core Identity

Each teacher need to be created as an identity in IAM Core, usually connected with HR data as well, but that is techincally not a requirement. The below attributes are required:

| Attribute | Description | Example value |
|-|-|-|
| entraObjectId | Required by the Universe Portal and API in order to map the Entra signed in session (JWT) to Core Identity | 09964771-f29e-48c5-9754-78bfa9e603e7 |

It is also recommended to populate these attributes:

- nin
- firstName
- lastName
- entraOnPremisesSamAccountName
- dateOfBirth

## Teacher and student relationship -> Core Relationship

The relationship between a teacher / student and the different educational groups they are member of are mapped as Core Relationships with the following attributes:

| Attribute | Description | Example value |
|-|-|-|
| identity | A reference to the Core Identity of the teacher or student | 035e4651-afd6-4ddb-964f-405bc0e3fa89 |
| orgUnit | A reference to the Core OrgUnit for the education group | e6345196-084d-43d3-905f-19d3810a468b |
| type | Always set to 'education' in order to tell the education services that this is an education relationship  | education |
| subType | Always set to 'teacher' for teachers and 'student' for students, which tells the education services that the identity of this relationship is a teacher/student for the org unit of the relationship in question | teacher |

There are also some optional attributes:

| Attribute | Description | Example value |
|-|-|-|
| startDate | The start date of the relationship, if ommited, the relationship is considered as having a start date in the past | 2026-08-01 |
| endDate | The end date of the relationship, if ommited, the relationship is considered as having an end date in the future | 2026-08-01 |

## OrgUnit

| Attribute | Description | Example value |
|-|-|-|
| displayName | The name displayed in the Universe portal | 1st grade |
| parent | A reference to the parent Core OrgUnit for the education group. See separate note on the org unit structure. | d6052f2e-c130-4893-ac85-cbe2d2bb7e9b |
| type | Always set to 'education' in order to tell the education services that this is an education org unit  | education |
| subType | The OneRoster type of the org unit. The values that have special uses are: **schoolowner**, **school**, **ext:municipality**, **scheduled**, **ghost course** and **homeroom**, but any other value may be used | teacher |

### Structure

In general, the following structure is used:

- School owner or ext:muncipality
    - School
        - Scheduled
        - Homeroom
        - other types

## FEIDE

For Norway only, there are some required attributes for populating the FEIDE catalog:

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