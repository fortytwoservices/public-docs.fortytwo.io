# API

[Swagger](https://api.fortytwo.io/iamcore/swagger)

## Authentication

All API endpoints are authenticated with the customer's own Entra ID, through our multi tenant application [Fortytwo Universe](https://login.microsoftonline.com/common/adminconsent?client_id=2808f963-7bba-4e66-9eee-82d0b178f408). This means that you can use any kind of identity to talk to our API! Users, Agents, Service Principals, Managed Service Identities, you name it. As long as you can get a token for the scope ```https://api.fortytwo.io/.default``` or the resource ```2808f963-7bba-4e66-9eee-82d0b178f408``` you are good.

## Authorization

