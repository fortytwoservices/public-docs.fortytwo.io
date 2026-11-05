---
description: Your AI system register, a tamper-evident change log, and an evidence pack for auditors under the EU AI Act.
icon: scale
---

# Compliance

Open **Reporting** and choose **Compliance**. It holds your AI system register, a tamper-evident record of every change, and the evidence an auditor asks for under the EU AI Act.

![Reporting, Compliance](/screenshots/ai-universe/reporting-compliance.webp)

## Records

| Record | What it holds |
|-|-|
| **AI system register** | Every app, and whether it has been fully assessed. |
| **What changed** | The change log. Every entry is sealed to the one before it, so tampering is detected. The page shows *Intact* when the seal check passes. |
| **What was blocked** | Content stopped by the safety rules. |
| **Check a response** | Look up whether a given AI response came from the platform. |

## Human oversight

Each app's register entry can name one person from your organisation's directory (Microsoft Entra ID) as its human oversight: the person accountable for what the app does. The creator of an app picks this person in the [Create an app](../apps/create-an-app.md) dialog, where it starts as the creator when their sign-in is in the directory, and can add a note on how they review the app.

| What | How it works |
|-|-|
| **Who can be named** | One person, never a group. Naming nobody is also allowed. |
| **Finding someone** | Type at least three characters. A person matches when their name, email or sign-in name begins with what you typed. At most ten matches are shown. |
| **When it is saved** | The person is checked against the directory, and their name and email are stored with the entry. A person the directory does not know is refused. |
| **When the directory cannot be read** | Nothing is saved. Try again shortly. |
| **The note** | *How they review it* is optional free text, such as how often they check the app. |

Changing the register answers later under the app's settings keeps the named person.

## Response records

A fingerprint of every AI response is kept for a retention period you choose under **Settings**, **Reporting & compliance**.

## Evidence pack

**Download as JSON** puts the register, the change log and its seal check, the guardrail settings, blocked content, model usage and retention into one file. Hand it to an auditor or attach it to your records.

**Download printable report** opens the same evidence as a page you can print or save as PDF.

:::info[What the pack does not hold]
The platform does not store each model call itself. Those live in your AI gateway and Foundry logs, in your own subscription.
:::
