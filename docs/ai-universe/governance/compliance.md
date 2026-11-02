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

## Response records

A fingerprint of every AI response is kept for a retention period you choose under **Settings**, **Reporting & compliance**.

## Evidence pack

**Download as JSON** puts the register, the change log and its seal check, the guardrail settings, blocked content, model usage and retention into one file. Hand it to an auditor or attach it to your records.

**Download printable report** opens the same evidence as a page you can print or save as PDF.

:::info[What the pack does not hold]
The platform does not store each model call itself. Those live in your AI gateway and Foundry logs, in your own subscription.
:::
