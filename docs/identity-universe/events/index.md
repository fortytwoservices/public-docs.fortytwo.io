# Events

There are plenty of events being issued by the different Fortytwo Universe services, where you can create workflows that starts when the events occur:

![alt text](media/image-7.png)

## Workflow steps

The following workflow steps are available:

| | |
|-|-|
| [Webhook](./webhook.md) | Starts a LogicApp, Function app, Lambda, etc. |
| [Teams message](./teams.md) | Sends a message in Microsoft Teams to a person, a channel or both, through the Fortytwo Universe app |
| [Slack message](./slack.md) | Sends a message in Slack to a channel, to people or both, in a workspace you have connected |
| [Email](./email.md) | Sends an email from a mailbox in your own Microsoft 365, to typed addresses or to the people the event is about |
| [SMS](./sms.md) | Sends an SMS through the account you have at Twilio, LINK Mobility or Sveve, to typed numbers or to the people the event is about |

Every step can have [conditions](./conditions.md), so it runs only when a value from the event is empty, is not empty, or is one of the values you list.

Fortytwo Universe do not provide a full generic workflow builder, as we instead recommend invoking LogicApps through a Webhook.