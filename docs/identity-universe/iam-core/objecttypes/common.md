# Common

Every core object — [CoreIdentity](coreidentity.md), [CoreRelationship](corerelationship.md) and [CoreOrgUnit](coreorgunit.md) — shares the attributes on this page in addition to its own.

## Common attributes

| Type | Attribute | Description |
|-|-|-|
| string | id | The identifier of the core object (Guid) |
| string | joinScope | The join scope used by [sync rules](../syncrules.md) |
| string | anchor1 | Generic anchor useful for synchronizing objects |
| string | anchor2 | Generic anchor useful for synchronizing objects |
| string | anchor3 | Generic anchor useful for synchronizing objects |
| string | anchor4 | Generic anchor useful for synchronizing objects |
| string | anchor5 | Generic anchor useful for synchronizing objects |
| string | anchor6 | Generic anchor useful for synchronizing objects |
| string | anchor7 | Generic anchor useful for synchronizing objects |
| string | anchor8 | Generic anchor useful for synchronizing objects |
| string | anchor9 | Generic anchor useful for synchronizing objects |

### Anchors

The anchors are nine free identifier slots with no meaning of their own. They exist so that each source system can keep its own key on the object without competing for one of the named attributes.

The usual convention is one anchor per authoritative source — the HR system's person id in `anchor1`, the student information system's id in `anchor2`, and so on. Because an anchor holds a stable identifier from a source system, it is normally also what that system's [sync rule](../syncrules.md) joins on.

### id and joinScope

`id` is assigned by IAM Core when the object is created and never changes. A sync rule may join on it, which is how a connector that already knows the IAM Core identifier connects directly, but it can never be given a value.

`joinScope` partitions the core so that a sync rule only matches core objects carrying the same value. It comes from the sync rule that created the object and defaults to `default`. See [join scope](../syncrules.md#join-scope).

## Custom string values

It is possible to flow string data into any core attribute named **custom/_something_***. This means that if you want to store information that does not really belong in any standard attribute, let's say "License plate", you can name it something like **custom/license_plate** and it will be stored.

Custom attributes need no registration — pick a name and start flowing into it. They are always strings, so they can only be targeted by a `string` attribute flow, and they are returned on the object under `customStringAttributeValues`, keyed by the full name including the `custom/` prefix.

## When an object last changed

Every core object is returned with a `lastUpdated` timestamp recording when the record was last written. It is meant for change detection — working out what has moved since you last looked — rather than as an audit trail, since it reflects any write to the object and has one-second resolution. See [lastUpdated](../api.md#lastupdated).

## Where values come from

Every value on a core object records which [sync rule](../syncrules.md) provided it. That is what makes it possible to answer "why does this identity have this value?", and it is also how values are cleaned up: when the rule that provided a value stops providing it — because it was disabled, deleted, changed, or the object fell out of its scope — the value is removed on the next synchronization.

Values that were not set by a sync rule are left alone by this.
