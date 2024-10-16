# API-Basert Integrasjon

**Populering av applikasjon via API-basert integrasjon**

Det finnes mange applikasjoner som har API-baserte grensesnitt for å populere brukere, eller andre objekttyper (organisasjonshierarki, stillinger, osv.), men hvor APIet ikke er basert på SCIM-standarden. Entra ID har ingen native integrasjonsmulighet mot denne typen APIer, men i stedet benyttes en Azure-basert automasjonsløsning som leser fra Microsoft Graph og skriver til applikasjons-APIet.

For å sørge for at Entra ID fortsatt styrer hvilke brukerkontoer som er en del av integrasjonen, benyttes en enterprise app med app role assignments. På denne måten kan de forskjellige metodene for å styre tildeling av applikasjonsroller, bla. access packages, benyttes. 

Fortytwo har god erfaring med å kjøre automasjonsløsninger i alle følgende systemer:

- Azure DevOps Pipelines
- GitHub Actions
- Azure Automation Accounts
- Azure Functions

![](media/20231116110003.png)

I noen tilfeller vil det være behov for provisjonering av data som av ulike årsaker ikke befinner seg i Entra ID. Dette kan for eksempel være mer sensitive personopplysninger, organisasjonshierarki eller stillingsinformasjon. I disse tilfellene benytte automasjonsløsnigen data fra HR- og Skoleadministrattivt system direkte, og sammenkobler dataene med brukerinformasjon fra Entra ID.

**Som en tjeneste**

Vi i Fortytwo tilbyr applikasjonsprovisjonering som en tjeneste, som innebærer av vi sørger for at:

- Brukerinformasjon blir synkronisert til applikasjonen kontinuerlig
- Monitorering av løsningen
- Alt av sertifikater, skjema-oppdatering, API-versjoner og liknende håndteres

Ta kontakt med <a href="mailto:hello@fortytwo.io">hello@fortytwo.io</a> for mer informasjon og pris.