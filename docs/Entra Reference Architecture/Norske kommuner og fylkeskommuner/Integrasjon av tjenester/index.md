# Integrasjon av tjenester

Designet legger opp til at alle applikasjoner og tjenester integreres mot Entra ID, både for Single Sign-On, Autorisasjon og brukerprovisjonering der det er behov for det. 

!!! info "Brukerprovisjonering?"
    Brukerprovisjonering vil si at IAM-plattformen populerer en brukerdatabase i applikasjonen direkte på forhånd før brukeren logger inn i applikasjonen.

![](../media/20231116095039.png)

Det er ofte mulig å integrere en applikasjon på flere måter, og for å sørge for at man alltid velger den "beste", er det etablert en del faste integrasjonsmønstre, som alltid skal benyttes, og man velger alltid den første på listen som lar seg benytte:

## Brukerprovisjonering

- [SCIM-basert integrasjon](./brukerprovisjonering1.md)
- [Populering av applikasjon via API-basert integrasjon](./brukerprovisjonering2.md)
- [Filuttrekk](./brukerprovisjonering3.md)
- [Applikasjon leser selv via Microsoft Graph](./brukerprovisjonering4.md)

