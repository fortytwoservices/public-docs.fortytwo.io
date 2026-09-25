# Helsepersonellregisteret

!!! note "This documentation is in Norwegian, as this system is only relevant for Norwegian customers"

Connectoren mot Helsepersonellregisteret benytter Maskinporten-autentisering, slik at for å konfigurere tilgang må du følge [Maskinporten-dokumentasjonen](./maskinporten.md). Her må det konfigureres en klient med tilgangen **nhn:hpr/basic**.

## Konfigurasjon av connector

| Input | Verdi |
|-|-|
| Client ID | Maskinporten-klient-ID for applikasjonen du oppretter ved å følge [Maskinporten-dokumentasjonen](./maskinporten.md). |
| Scoping collection | En collection av identiter som vi skal hente HPR-informasjon for. |

Oppslag mot Helsepersonellregisteret krever at identitetene har satt **etternavn** og enten norsk personnummer i **nin**-attributtet eller bursdag i **dateOfBirth**-attributtet.

## Connector-data og sync-regel

Alle data leses inn in connectoren som object-typen **person**, hvor **externalId** er satt til ID'en på [Core Identity](../objecttypes/coreidentity.md) til brukeren.

En typisk sync-regel gjør følgende:

- Flyter **externalId** til **id** med join priority 1
- Flyter attributtet **hprNummer** til **custom/hprnummer**
- Har **disableProvideCoreObjectExistence** satt til **true** og **provisioningEnabled** satt til **false** for å sørge for at vi kun samler inn verdier og ikke lar Core Identities eksistere kun med HPR-data.

```PowerShell
New-IAMCoreSyncRule `
    -Name "HPR" `
    -ConnectorId "00000000-0000-0000-0000-000000000000" `
    -ProvisioningEnabled:$false `
    -CoreObjectType Identity `
    -ConnectorObjectType person `
    -DisableProvideCoreObjectExistence $true `
    -Priority 47373 `
    -InboundAttributeFlows @(
        @{
            '$type' = "string"
            targetAttributeName = "id"
            value = @{
                '$type' = 'externalid'
            }
            joinPriority = 1
        }
        @{
            '$type' = "string"
            targetAttributeName = "custom/hprnummer"
            value = @{
                '$type' = 'attribute'
                attribute ="hprNummer"
            }
        }
    )
```