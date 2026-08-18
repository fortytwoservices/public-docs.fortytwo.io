# Collections

## Introduction

Collections is a logical grouping of objects. Collection membership is evaluated using either one of two approaches, or a combination of both:

* Criteria
* Request to join (joinable)
* Criteria and request to join

**Criteria** uses filter conditions and will hold members based on data attributes available to the Identity Universe IAM Core.

**Request to join** is a manual flow and performed by the user or their manager. If the manager requests access for a direct report the "request on behalf of" flow is triggered.

There are two types of collections in the Identity Universe:

* [Criteria collections](#criteria-collections)
* [Joinable collections](#joinable-collections)

## Criteria collections

![Criteria collections blade](media/criteriacollections.png)

Criteria collections are configured using conditions and will hold members based on data attributes. As long as the criteria is valid the object will stay a member of the collection. When the matching criteria no longer is valid the object will automatically be removed from the collection.

A criteria could be `identityLastname equals Taylor` or `relationshipType equals Contractor`.

Criteria collection is an important building block for the Identity Universe state-driven model.

## Joinable collections

![Joinable collections blade](media/joinablecollections.png)

There are two types of joinable collections:

* Open to join
* Requires approval (most used)

To attain membership in a joinable collection the user must request access. Collections that the user is eligible to join is configured using scoping (filtering) settings.

If the collection is *open to join* the user is automatically added to the collection.

When a collection is configured with an approval gate the approval flow is triggered. An approver could be members of a collection, one or more identities or "manager". For "manager" the closest manager will be able to approve. This is usually the manager the user reports to, or the manager of the organisational unit the user is member of.

Both collection types *open to join* and *requires approval* require the user to be *in scope* in order to see them and request to join. To be *in scope* the user must be a member of a collection, for example a criteria collection which contains users with `relationshipType equals employee`. The criteria collection is then applied as a filter to enable anyone with a relationshipType (position in this case) **employee** to request access to the said collection.

## Object types

A collection holds one kind of object, fixed when it is created:

| Object type | Holds |
|-|-|
| `Identity` | [CoreIdentities](../iam-core/objecttypes/coreidentity.md) — people |
| `Relationship` | [CoreRelationships](../iam-core/objecttypes/corerelationship.md) — a person in a particular position |
| `OrgUnit` | [CoreOrgUnits](../iam-core/objecttypes/coreorgunit.md) — parts of the organisation |
| `User` | Entra ID users |
| `Group` | Entra ID groups |

Choosing between `Identity` and `Relationship` is the decision worth thinking about. A collection of identities is about the person, so it is right for something like "has completed security training". A collection of relationships is about a particular job, so it is right for anything tied to a position — a licence that belongs to a role, or access that should follow one of someone's two part-time jobs and not the other.

## Tags and attributes

Collections can carry `metadata` with `tags` and free-form `attributes`, and both can be searched on. With a few dozen collections this is the difference between finding the one you want and scrolling. There are [limits](./criteria.md#metadata-limits) on how many you can set and how long they can be.

## Working with collections

You can work with the [Identity Universe collections blade](https://universe.fortytwo.io/access/collections), the [PowerShell module](./powershell-module.md) or the [API](./api.md).

- [Criteria reference](./criteria.md) — the condition syntax, operators and filterable attributes
- [Joinable collections reference](./joinable.md) — join policies, approval gates and the request lifecycle