---
description: The checks every pull request in an app's repository runs, whether a person or an AI assistant wrote the change. Type-check, lint, tests, complexity, designsystem rules, secret scan, code scan and dependency scan.
icon: shield-check
---

# Checks on every change

An app's repository checks every pull request the same way, whoever wrote the change. The rules hold even when an AI assistant gets them wrong, because a change that breaks one fails its pull request.

There is no pre-commit hook, so nothing stops a local commit. Run the same checks yourself before you push:

```bash
pnpm check && pnpm lint && pnpm complexity && pnpm test
```

## What runs

| Workflow | Check | Fails when |
|-|-|-|
| **Quality** | Type-check (`pnpm check`) | The code does not compile. |
| | Lint (`pnpm lint`) | A rule below is broken. |
| | Tests (`pnpm test`) | A test fails. |
| | Platform guidance pointer | `AGENTS.md`, `CLAUDE.md` or `.mcp.json` no longer sends the assistant to the platform. |
| | Container image | The app's image does not build. |
| **Security** | Secret scan | The change adds something that looks like a password, key or token. |
| | Code scan | The change adds a serious security finding. |
| | Dependency scan | A package the app uses has a known vulnerability. |

Findings that remain in a running app show on the control panel's [Vulnerabilities](../governance/vulnerabilities.md) page.

## Rules the lint enforces

### Every AI call goes through the platform

AI provider libraries, such as `openai`, `@anthropic-ai/sdk` or `@azure/openai`, cannot be imported in an app. The app holds no provider key either, so there is nothing to call a provider with. Every AI call goes through the [AI gateway](../governance/security-and-data.md#how-every-ai-call-is-governed), where safety rules apply and usage is recorded.

The first question to ask of any AI-written change: does this go through the platform?

### The designsystem first

Every button, field, badge and dialog comes from the designsystem, `@/shared`. The lint refuses the hand-made versions:

| Not allowed | Use instead |
|-|-|
| `<button>`, `<input>`, `<select>`, `<textarea>` | `Button`, `Input` or `SearchInput`, `Select` or `Combobox`, `Textarea` |
| Status colours such as `bg-emerald-…` or `text-amber-…` | The `success`, `warning`, `danger` and `info` variants of `Badge`, `IconBadge` and `Callout` |
| `confirm()`, `alert()`, `prompt()` | `ConfirmModal`, `showToast(...)`, `Modal` |
| A hand-made spinner | The `UniverseLoader` family |

Every app has a **Designsystem** page that shows each component with its options. If a component you need is missing, ask Fortytwo to add it to the designsystem, so every app gets it, rather than building a one-off.

### Complexity under 15

Every function must keep its cyclomatic complexity under 15. At 15 or above, the lint refuses it.

`pnpm complexity` lists the functions between 10 and 14, worst first. It only warns, but that is the moment to simplify: aim for under 10. Pull out a helper, return early, or split a long chain of conditions. Do not cut one piece of logic into fragments only to get under the limit.

## When an assistant repeats a mistake

If an AI assistant makes the same mistake twice, the rule is not written down strongly enough. Add it to your organisation's or the app's [Wisdom](wisdom.md), so every assistant reads it on its next connect.
