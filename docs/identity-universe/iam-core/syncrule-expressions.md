# Sync rule expressions

Expressions are the small building blocks that compute values inside a [sync rule](./syncrules.md). They appear in two places: in a rule's `scope`, where they must produce a boolean, and as the `value` of an attribute flow, where they must produce a value of the flow's type.

Expressions nest. Most of them take one or more `input` expressions, so you compose small pieces into whatever transformation the source data needs.

## How expressions are written

Every expression is an object with a `$type` property naming the expression, plus that expression's own properties:

```json
{
  "$type": "toupper",
  "input": {
    "$type": "attribute",
    "attribute": "names/lastname"
  }
}
```

In PowerShell the same expression is a hashtable. `$type` must be in single quotes so PowerShell does not try to expand it:

```powershell
@{
    '$type' = "toupper"
    input   = @{
        '$type'   = "attribute"
        attribute = "names/lastname"
    }
}
```

### Value types

Each expression produces one or more of the following types, and can only be used where that type is expected. A `datetime` attribute flow needs an expression that produces a date/time; a `scope` entry needs one that produces a boolean.

| Type | Used by |
|-|-|
| String | `string` attribute flows |
| Boolean | `scope`, `boolean` attribute flows |
| Date/time | `datetime` attribute flows |
| Reference | `reference` attribute flows |
| Multi-valued string | `multivaluedstring` attribute flows |
| Object, multi-valued object | Only as input to other expressions |

A few expressions produce more than one type — `attribute` is the important one, and can be used as a string, a boolean or a multi-valued string depending on the source data.

### Attribute paths

Expressions that read from the connector object address nested data with `/`:

```json
{ "$type": "attribute", "attribute": "names/firstname" }
```

This works for arbitrarily deep nesting, and also for source attribute names that themselves contain a dot:

```json
{ "$type": "attribute", "attribute": "metadata/onedhub.groupType" }
```

!!! note "Two exceptions"
    [`asreference`](#asreference) uses `.` as its separator (though `/` is accepted and converted), and [`whereattribute`](#whereattribute) takes a plain property name with no nesting at all.

### Missing values

When a source attribute is missing, or holds a type the expression cannot use, the expression produces no value rather than failing. That null then propagates: most expressions given a null input produce null themselves.

What happens next depends on where the expression sits. In an attribute flow, a null means the attribute is not written unless the flow sets `nullFlow`. In `scope`, anything that is not exactly `true` puts the object out of scope — so a misspelled attribute name in a scope expression looks like "nothing synchronizes" rather than an error.

---

## String expressions

### attribute

Reads an attribute from the connector object. The most commonly used expression by far.

Produces: **string**, **boolean** or **multi-valued string**.

| Property | Type | Required | Description |
|-|-|-|-|
| `attribute` | string | Yes | Attribute path, `/`-separated for nested data. |

```json
{ "$type": "attribute", "attribute": "names/firstname" }
```

How the source value is converted depends on how the expression is used:

- **As a string** — text is returned as-is; numbers are converted to text; booleans become `True` or `False`. Objects and arrays produce no value.
- **As a boolean** — only a real JSON boolean is accepted. The _strings_ `"true"` and `"false"` do not count.
- **As a multi-valued string** — an array is converted element by element, skipping any element that is not text, a number or a boolean. A single value becomes a one-element list.

!!! warning "Attribute names are case sensitive"
    `firstName` and `firstname` are different attributes. If a flow silently produces nothing, check the casing against the connector space first.

### constant

A fixed value, ignoring the connector object entirely. Used for classification, and for separators inside [`join`](#join).

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `value` | string | Yes |

```json
{ "$type": "constant", "value": "Employee" }
```

### externalid

The connector object's external id — the identifier the source system knows the object by. For the [Entra ID SCIM connector](./connectors/entraidscim.md) this is the Entra object id.

Produces: **string**. No properties.

```json
{ "$type": "externalid" }
```

### null

Produces no value, always. Useful as an explicit "no value here" branch in [`regexswitch`](#regexswitch), or combined with `nullFlow` to deliberately clear an attribute.

Produces: **string**. No properties.

### join

Concatenates several string expressions into one.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `inputs` | expression[] | Yes |

```json
{
  "$type": "join",
  "inputs": [
    { "$type": "attribute", "attribute": "names/firstname" },
    { "$type": "constant", "value": " " },
    { "$type": "attribute", "attribute": "names/lastname" }
  ]
}
```

!!! note "No separator, and never null"
    `join` concatenates directly — put a [`constant`](#constant) between the parts if you need a space or comma. Inputs that produce no value are treated as empty text, so `join` always produces a string, even if that string is empty. It is therefore not a good fit for a flow where you want "no value" to mean "leave the attribute alone".

### coalesce

Returns the first input that produces a value. The standard way to express a fallback.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `inputs` | expression[] | Yes |

```json
{
  "$type": "coalesce",
  "inputs": [
    { "$type": "attribute", "attribute": "workEmail" },
    { "$type": "attribute", "attribute": "privateEmail" },
    { "$type": "constant", "value": "unknown" }
  ]
}
```

!!! note "Empty text counts as a value"
    Only a missing value moves on to the next input. An attribute that exists but is an empty string stops the chain and yields that empty string.

### mvjoin

Flattens a multi-valued string into a single string.

Produces: **string**.

| Property | Type | Required | Default |
|-|-|-|-|
| `input` | multi-valued string expression | Yes | |
| `separator` | string | No | Empty |

```json
{
  "$type": "mvjoin",
  "input": { "$type": "attribute", "attribute": "entitlements" },
  "separator": "|||"
}
```

Given `["ent1", "ent2", "ent3"]` this produces `ent1|||ent2|||ent3`. The default separator is empty, so set one explicitly unless you really want the values run together.

### word

Splits a string and returns one part of it.

Produces: **string**.

| Property | Type | Required | Default |
|-|-|-|-|
| `input` | string expression | Yes | |
| `index` | integer | Yes | |
| `separator` | string | No | A single space |
| `stringsplitoptions` | string | No | `TrimEntries` |

```json
{
  "$type": "word",
  "input": { "$type": "attribute", "attribute": "fullName" },
  "index": 0
}
```

`index` is zero-based, and an index past the end produces no value rather than an error. `separator` is a whole string, not a set of characters, so `", "` splits on that exact two-character sequence.

`stringsplitoptions` accepts `None`, `RemoveEmptyEntries`, `TrimEntries`, or a comma-separated combination such as `"RemoveEmptyEntries, TrimEntries"`. The default trims whitespace around each part but keeps empty parts, so consecutive separators produce empty entries — use `RemoveEmptyEntries` if that matters.

### substring

Extracts part of a string by position.

Produces: **string**.

| Property | Type | Required | Default |
|-|-|-|-|
| `input` | string expression | Yes | |
| `startIndex` | integer | Yes | |
| `length` | integer | No | To the end of the string |

```json
{
  "$type": "substring",
  "input": { "$type": "attribute", "attribute": "nin" },
  "startIndex": 0,
  "length": 6
}
```

`startIndex` is zero-based. A `length` that runs past the end of the string is clamped rather than failing, and a `startIndex` past the end produces no value.

### tolower / toupper

Changes the case of a string.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `input` | string expression | Yes |

```json
{
  "$type": "tolower",
  "input": { "$type": "attribute", "attribute": "userName" }
}
```

### trim

Removes leading and trailing whitespace.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `input` | string expression | Yes |

```json
{
  "$type": "trim",
  "input": { "$type": "attribute", "attribute": "names/firstname" }
}
```

Source systems frequently carry stray spaces in free-text fields, and those spaces survive into display names and email addresses if nothing removes them. `trim` only touches the ends of the value — to remove whitespace inside it, use [`regexreplace`](#regexreplace).

### regexreplace

Applies a regular expression replacement. All matches are replaced.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `input` | string expression | Yes |
| `pattern` | string | Yes |
| `replacement` | string | Yes |

Capture groups are referenced as `$1`, `$2`, and a literal dollar sign is written `$$`. Nesting `regexreplace` inside itself is the usual way to run several cleanups in sequence — here stripping whitespace, converting a `00` prefix to `+`, then adding a Norwegian country code to a bare number:

```json
{
  "$type": "regexreplace",
  "pattern": "^([0-9])",
  "replacement": "+47$1",
  "input": {
    "$type": "regexreplace",
    "pattern": "^00",
    "replacement": "+",
    "input": {
      "$type": "regexreplace",
      "pattern": "\\s",
      "replacement": "",
      "input": { "$type": "attribute", "attribute": "mobile" }
    }
  }
}
```

!!! warning "Regular expressions are case sensitive"
    All regex expressions match case sensitively. Prefix the pattern with `(?i)` for a case-insensitive match.

### regexswitch

Chooses between values by matching a string against a series of patterns. The equivalent of a switch statement.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `value` | string expression | Yes |
| `cases` | case[] | Yes |
| `default` | string expression | No |

Each entry in `cases` has a `pattern` and a `value` expression:

```json
{
  "$type": "regexswitch",
  "value": { "$type": "attribute", "attribute": "employmentType" },
  "cases": [
    { "pattern": "^(FAST|PERM)$", "value": { "$type": "constant", "value": "Employee" } },
    { "pattern": "^VIKAR$",       "value": { "$type": "constant", "value": "Substitute" } }
  ],
  "default": { "$type": "constant", "value": "Other" }
}
```

The first matching case wins. Patterns match anywhere in the value unless anchored, so use `^` and `$` when you mean the whole string. If nothing matches and there is no `default`, the expression produces no value.

### tojson

Returns the raw JSON text of an attribute, whatever its shape — useful for stashing a whole sub-object into a `custom/` attribute.

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `attribute` | string | Yes |

!!! note "Strings keep their quotes"
    Because this returns raw JSON, a text attribute comes back wrapped in quotes. Use [`attribute`](#attribute) when you want the plain text.

### tostring

Reads a string out of a single object produced by [`selectindex`](#selectindex).

Produces: **string**.

| Property | Type | Required |
|-|-|-|
| `input` | object expression | Yes |
| `attribute` | string | Yes |

Only text values are returned — numbers and booleans inside the object produce no value.

### followreferenceforstring

Follows a pointer held by the current object, and evaluates an expression against whatever it points at. Use it to copy a value from a related object, such as putting the manager's name onto an employee.

Produces: **string**.

| Property | Type | Required | Description |
|-|-|-|-|
| `referencingattribute` | string | Yes | The attribute _on the current object_ holding the pointer. |
| `referredattribute` | string | Yes | The attribute to match on the target object. |
| `subrule` | string expression | Yes | Evaluated against the target object. |

```json
{
  "$type": "followreferenceforstring",
  "referencingattribute": "manager",
  "referredattribute": "id",
  "subrule": {
    "$type": "join",
    "inputs": [
      { "$type": "attribute", "attribute": "names/lastname" },
      { "$type": "constant", "value": ", " },
      { "$type": "attribute", "attribute": "names/firstname" }
    ]
  }
}
```

If no object matches, or more than one does, the expression produces no value.

### findreferencingobjectforstring

The reverse lookup: finds the object that points _at_ the current one. Use it to pull in data held in a satellite record, such as an "additional info" object keyed by person id.

Produces: **string**.

| Property | Type | Required | Description |
|-|-|-|-|
| `referredattribute` | string | Yes | The attribute _on the current object_ that others point at. |
| `referencingattribute` | string | Yes | The attribute on the other object holding the pointer. |
| `objecttype` | string | Yes | The connector object type to search. |
| `subrule` | string expression | Yes | Evaluated against the object that was found. |

```json
{
  "$type": "findreferencingobjectforstring",
  "referredattribute": "id",
  "referencingattribute": "personid",
  "objecttype": "additionalinfo",
  "subrule": { "$type": "attribute", "attribute": "nin" }
}
```

!!! warning "The two attribute names are mirrored"
    Compared with [`followreferenceforstring`](#followreferenceforstring), the roles are swapped: here `referredattribute` is read from the current object and `referencingattribute` is searched on the candidates. Getting these the wrong way round is the most common mistake with these two expressions.

---

## Boolean expressions

### true / false

Constant booleans. `{ "$type": "true" }` is the standard "apply to everything" scope.

Produces: **boolean**. No properties.

### and

True when every input is true.

Produces: **boolean**.

| Property | Type | Required |
|-|-|-|
| `inputs` | boolean expression[] | Yes |

An input that produces no value counts as false. An empty `inputs` list is true.

### or

True when at least one input is true.

Produces: **boolean**.

| Property | Type | Required |
|-|-|-|
| `inputs` | boolean expression[] | Yes |

```json
{
  "$type": "or",
  "inputs": [
    {
      "$type": "stringequals",
      "left": { "$type": "attribute", "attribute": "type" },
      "right": { "$type": "constant", "value": "employee" }
    },
    {
      "$type": "stringequals",
      "left": { "$type": "attribute", "attribute": "type" },
      "right": { "$type": "constant", "value": "consultant" }
    }
  ]
}
```

An input that produces no value counts as false. An empty `inputs` list is false.

### not

Inverts a boolean.

Produces: **boolean**.

| Property | Type | Required |
|-|-|-|
| `input` | boolean expression | Yes |

!!! warning "`not` of a missing value is not `true`"
    If the input produces no value — a missing attribute, say — then `not` also produces no value, which in `scope` means "not in scope". To treat a missing attribute as a match, combine it with [`coalesce`](#coalesce) so there is always a value to compare.

### stringequals

Compares two strings.

Produces: **boolean**.

| Property | Type | Required | Default |
|-|-|-|-|
| `left` | string expression | Yes | |
| `right` | string expression | Yes | |
| `stringComparison` | string | No | `OrdinalIgnoreCase` |

```json
{
  "$type": "stringequals",
  "left": { "$type": "attribute", "attribute": "status" },
  "right": { "$type": "constant", "value": "active" }
}
```

`stringComparison` accepts `Ordinal`, `OrdinalIgnoreCase`, `InvariantCulture`, `InvariantCultureIgnoreCase`, `CurrentCulture` and `CurrentCultureIgnoreCase`.

!!! note "Case insensitive by default, and two missing values are equal"
    The default comparison ignores case — set `Ordinal` for an exact match. Also note that if both sides produce no value the result is `true`, so comparing two missing attributes matches. An empty string and a missing value are _not_ equal.

### isdatetimeafter

True when `input` is strictly later than `after`.

Produces: **boolean**.

| Property | Type | Required |
|-|-|-|
| `input` | date/time expression | Yes |
| `after` | date/time expression | Yes |

### isdatetimebefore

True when `input` is strictly earlier than `before`.

Produces: **boolean**.

| Property | Type | Required |
|-|-|-|
| `input` | date/time expression | Yes |
| `before` | date/time expression | Yes |

Together these are how you scope a rule to currently-valid employments:

```json
[
  {
    "$type": "isdatetimebefore",
    "input": { "$type": "todatetime", "input": { "$type": "attribute", "attribute": "startdate" }, "format": "yyyy-MM-dd" },
    "before": { "$type": "datetimeutcnow" }
  }
]
```

If either side produces no value the result is `false`, and equal instants are `false` in both directions.

---

## Date and time expressions

### datetimeutcnow

The current UTC time. No properties.

Produces: **date/time**.

### todatetime

Parses a string into a date/time.

Produces: **date/time**.

| Property | Type | Required | Default |
|-|-|-|-|
| `input` | string expression | Yes | |
| `format` | string | No | Flexible parsing |

```json
{
  "$type": "todatetime",
  "input": { "$type": "attribute", "attribute": "startdate" },
  "format": "yyyy-MM-dd"
}
```

A value that cannot be parsed produces no value rather than failing.

!!! tip "Pin the format when you can"
    Without `format` the parser accepts many layouts, which makes an ambiguous date such as `03.04.2026` a gamble. Supply an explicit `format` matching the source system, using culture-neutral patterns like `yyyy-MM-dd` or `dd.MM.yyyy HH:mm:ss`.

### adddays

Shifts a date/time by a whole number of days.

Produces: **date/time**.

| Property | Type | Required |
|-|-|-|
| `input` | date/time expression | Yes |
| `days` | integer | Yes |

`days` may be negative to subtract — there is no separate subtract expression. This is how you build a grace period, for example keeping an employment in scope until seven days after it ended:

```json
{
  "$type": "isdatetimeafter",
  "input": {
    "$type": "adddays",
    "days": 7,
    "input": { "$type": "todatetime", "input": { "$type": "attribute", "attribute": "enddate" }, "format": "yyyy-MM-dd" }
  },
  "after": { "$type": "datetimeutcnow" }
}
```

---

## Reference expressions

### asreference

Resolves a pointer in the connector space to a core object, for use in a `reference` attribute flow. This is the only expression that produces a reference.

Produces: **reference**.

| Property | Type | Required | Description |
|-|-|-|-|
| `objectType` | string | Yes | The connector object type to look in. |
| `referencedAttribute` | string | Yes | The attribute to match on that object. |
| `input` | string expression | Yes | The value to match. |

```json
{
  "$type": "asreference",
  "objectType": "department",
  "referencedAttribute": "id",
  "input": { "$type": "attribute", "attribute": "department" }
}
```

Reading this literally: take the current object's `department` value, find the connector object of type `department` whose `id` equals it, and reference the core object that object is joined to.

!!! note "This one uses dots"
    `referencedAttribute` is dot-separated rather than slash-separated for nested attributes, and may only contain letters, digits and separators. Slashes are accepted and converted, so `a/b` and `a.b` both work.

If more than one connector object matches, the sync fails for that object with an error — the reference is ambiguous and the source data needs correcting. If the input produces no value, or nothing matches, no reference is set.

---

## Multi-valued expressions

### tostrings

Pulls one attribute out of every object in a collection, producing a list of strings.

Produces: **multi-valued string**.

| Property | Type | Required |
|-|-|-|
| `input` | multi-valued object expression | Yes |
| `attribute` | string | Yes |

```json
{
  "$type": "tostrings",
  "input": {
    "$type": "multivaluedobjectattribute",
    "attribute": "metadata/1edtech.grepGroups"
  },
  "attribute": "1edtech.code"
}
```

Given a collection of group objects this yields something like `["SAF0004", "aarstrinn4"]`. Only text values are collected; objects whose attribute is missing or is not text contribute nothing. Order is preserved and duplicates are kept.

### multivalueregexreplace

Applies a regular expression replacement to every value in a multi-valued string.

Produces: **multi-valued string**.

| Property | Type | Required |
|-|-|-|
| `input` | multi-valued string expression | Yes |
| `pattern` | string | Yes |
| `replacement` | string | Yes |

The list always keeps the same number of values — this transforms, it never filters. Nesting is the way to apply different rules to different values, here turning subject codes and year-level codes into their respective Feide GREP URNs:

```json
{
  "$type": "multivalueregexreplace",
  "pattern": "^([A-Z]{3}\\d{4})$",
  "replacement": "urn:mace:feide.no:go:grep:http://psi.udir.no/kl06/$1",
  "input": {
    "$type": "multivalueregexreplace",
    "pattern": "^aarstrinn",
    "replacement": "urn:mace:feide.no:go:grep:http://psi.udir.no/laereplan/aarstrinn/aarstrinn",
    "input": {
      "$type": "tostrings",
      "input": {
        "$type": "multivaluedobjectattribute",
        "attribute": "metadata/1edtech.grepGroups"
      },
      "attribute": "1edtech.code"
    }
  }
}
```

### multivaluedobjectattribute

Reads an array of objects from the connector object, as input to the expressions below.

Produces: **multi-valued object**.

| Property | Type | Required |
|-|-|-|
| `attribute` | string | Yes |

```json
{ "$type": "multivaluedobjectattribute", "attribute": "metadata/1edtech.grepGroups" }
```

If the attribute is missing or is not an array, the expression produces no value.

### whereattribute

Filters a collection of objects down to those where one property matches a fixed value.

Produces: **multi-valued object**.

| Property | Type | Required | Description |
|-|-|-|-|
| `input` | multi-valued object expression | Yes | |
| `attribute` | string | Yes | A single property name. |
| `value` | string | Yes | The exact value to match. |

```json
{
  "$type": "whereattribute",
  "input": { "$type": "multivaluedobjectattribute", "attribute": "phoneNumbers" },
  "attribute": "type",
  "value": "mobile"
}
```

!!! warning "No nested paths, and case sensitive"
    Unlike every other attribute-reading expression, `attribute` here is a plain property name — a `/` in it will simply never match. The comparison is exact and case sensitive, and only text properties can be matched.

### selectindex

Picks a single object out of a collection by position, for use with [`tostring`](#tostring).

Produces: **object**.

| Property | Type | Required |
|-|-|-|
| `input` | multi-valued object expression | Yes |
| `index` | integer | Yes |

`index` is zero-based, and an index past the end produces no value. Combined with `whereattribute` and `tostring`, this is the standard "pick the first matching sub-object and read a field from it" pattern:

```json
{
  "$type": "tostring",
  "attribute": "number",
  "input": {
    "$type": "selectindex",
    "index": 0,
    "input": {
      "$type": "whereattribute",
      "input": { "$type": "multivaluedobjectattribute", "attribute": "phoneNumbers" },
      "attribute": "type",
      "value": "mobile"
    }
  }
}
```

---

## Quick reference

| `$type` | Produces | Summary |
|-|-|-|
| [`attribute`](#attribute) | String, boolean, multi-valued string | Read an attribute from the connector object |
| [`constant`](#constant) | String | A fixed value |
| [`externalid`](#externalid) | String | The connector object's external id |
| [`null`](#null) | String | No value |
| [`join`](#join) | String | Concatenate strings |
| [`coalesce`](#coalesce) | String | First input that has a value |
| [`mvjoin`](#mvjoin) | String | Flatten a multi-valued string |
| [`word`](#word) | String | Split and take one part |
| [`substring`](#substring) | String | Extract by position |
| [`tolower`](#tolower-toupper) | String | Lower case |
| [`toupper`](#tolower-toupper) | String | Upper case |
| [`trim`](#trim) | String | Remove surrounding whitespace |
| [`regexreplace`](#regexreplace) | String | Regular expression replace |
| [`regexswitch`](#regexswitch) | String | Choose a value by pattern |
| [`tojson`](#tojson) | String | Raw JSON of an attribute |
| [`tostring`](#tostring) | String | Read a string from an object |
| [`followreferenceforstring`](#followreferenceforstring) | String | Read from the object this one points at |
| [`findreferencingobjectforstring`](#findreferencingobjectforstring) | String | Read from the object pointing at this one |
| [`true`](#true-false) | Boolean | Always true |
| [`false`](#true-false) | Boolean | Always false |
| [`and`](#and) | Boolean | All inputs true |
| [`or`](#or) | Boolean | Any input true |
| [`not`](#not) | Boolean | Invert |
| [`stringequals`](#stringequals) | Boolean | Compare two strings |
| [`isdatetimeafter`](#isdatetimeafter) | Boolean | Later than |
| [`isdatetimebefore`](#isdatetimebefore) | Boolean | Earlier than |
| [`datetimeutcnow`](#datetimeutcnow) | Date/time | Current UTC time |
| [`todatetime`](#todatetime) | Date/time | Parse a string |
| [`adddays`](#adddays) | Date/time | Shift by days |
| [`asreference`](#asreference) | Reference | Resolve a reference to a core object |
| [`tostrings`](#tostrings) | Multi-valued string | One attribute from each object |
| [`multivalueregexreplace`](#multivalueregexreplace) | Multi-valued string | Regex replace on each value |
| [`multivaluedobjectattribute`](#multivaluedobjectattribute) | Multi-valued object | Read an array of objects |
| [`whereattribute`](#whereattribute) | Multi-valued object | Filter a collection |
| [`selectindex`](#selectindex) | Object | Pick one object by position |

## Testing your expressions

Any expression can be evaluated against a real connector object before you put it in a rule. See [testing expressions](./syncrules.md#testing-expressions).
