# IAM Core

The IAM Core, is the heart of the Identity Universe, and is what makes most of the revolving services run. The IAM Core is populated by adding data sources, such as HR systems using [connectors](connectors.md), and synchronizing in data using [sync rules](syncrules.md).

In the IAM Core, there are three different types of objects, which is used to model _everything_:

| Object type | Description |
|-|-|
| [CoreIdentity](objecttypes/coreidentity.md) | An identity, such as an employee, student or agent. |
| [CoreRelationship](objecttypes/corerelationship.md) | A relationship between an identity and an org unit. |
| [CoreOrgUnit](objecttypes/coreorgunit.md) | An organizational unit |

