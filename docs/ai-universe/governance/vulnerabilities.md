---
description: Every app is scanned for known vulnerabilities once a day. See what needs fixing, who should fix it, and what is already on its way.
icon: bug
---

# Vulnerabilities

Open **Reporting** and choose **Security**. It shows the known vulnerabilities in the apps your people have built, what needs fixing and who should fix it.

Every app is scanned once a day. Choose **Scan now** to scan straight away.

![Reporting, Security](/screenshots/ai-universe/reporting-security.webp)

## At a glance

| Tile | Means |
|-|-|
| **Open tasks** | Vulnerabilities that need someone to act, and in how many apps. |
| **Ready to merge** | A Dependabot pull request with the fix is waiting in the app's repository. |
| **Known to be exploited** | On CISA's list of vulnerabilities attackers are using. Fix these first. |
| **Waiting on vendors** | No fix exists yet. Nothing to do for now. |

## Needs action

The list is sorted most urgent first, with the app, its owner, what to do and how far it has come. Open an app to see its steps.

Most fixes are a library update. Dependabot opens the pull request in the app's repository, and the app's team merges it.
