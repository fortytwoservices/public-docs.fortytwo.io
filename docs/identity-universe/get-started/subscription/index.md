---
description: The Identity Universe plans, what an active core identity is, how the count is taken and billed, and what the Subscription page in Universe shows.
---

# Subscription

Identity Universe is bought in Azure Marketplace, and the **Subscription** page in Universe shows what your organization has bought and, when the plan has a price per identity, what was counted and billed. You find it under **Administration** at `/subscription`, and it is visible to users with the **Subscription - administrator** role. See [Permissions](../permissions/index.md#user-roles) for how to assign it.

Until your organization has an active plan, Universe shows the notice "No active license for this organization". See [Get started](../index.md) for buying a plan.

## Plans

| Plan | Price |
|-|-|
| `fixed` | A flat fee |
| `fixed-plus-identities` | A flat fee plus a price per active core identity |

## What is an active core identity

An active core identity is a core identity that is not deleted and has at least one relationship that is not deleted, has started and has not ended.

- A relationship has started when it has no start date, or its start date is today or earlier.
- A relationship has not ended when it has no end date, or its end date is today or later.
- Any relationship type counts.

A person with no relationship, or only relationships that have ended or have not started yet, is not counted.

## How the count is taken and billed

The number of active core identities is counted every day, for every plan.

On the plan with a price per active core identity, the count from the 1st of each month is what is billed for that month. There is no proration: a person who joins in the middle of the month is not billed until the next month's count, and a person who leaves is billed for the month the count included them. If the count of the 1st is missing or is zero, the first count of the month that is above zero is used. A month in which every count is zero is not billed.

The flat fee is billed from the moment of purchase. In the month of the purchase, the price per active core identity is billed on the first count above zero that is taken after the purchase, also with no proration.

## What the page shows

- **Plan in use**: The plan your organization has bought, its status, its term and renewal, and whether it was bought through Azure or from Fortytwo.
- **Latest and highest count this month**: The latest count and the highest count of the current month, with the days they were counted on, followed by the count of each day.
- **Billed months**: The months that were billed, with the count each was billed for and the day it was counted. This is shown only on the plan with a price per identity.

## Change or cancel a plan

A plan bought in Azure Marketplace is changed or cancelled in the Azure portal, not in Universe.
