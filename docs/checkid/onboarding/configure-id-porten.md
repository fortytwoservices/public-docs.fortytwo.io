---
sidebarTitle: "Configure ID-porten"
hidden: true
description: For å sette opp kobling mot ID-porten trenger CheckID en applikasjon registrert i Digitaliseringsdirektoratet sin Samarbeidsportalen.
---

# Configure-ID-porten

:::note
Written in Norwegian, as this is only relevant for Norwegians.
:::

For å sette opp kobling mot ID-porten trenger CheckID en applikasjon registrert i Digitaliseringsdirektoratet sin [Samarbeidsportalen](https://samarbeid.digdir.no/).

## Kortvarianten

Følgende må fylles ut og/eller endres fra standardverdier:

| Innstilling | Verdi |
| -- | -- |
| Applikasjonstype | web |
| Autentiseringsmetode | client_secret_post |
| Redirect URI-er | <https://kundenavn.checkid.no/signin-oidc><br><https://onboarding.ditt-selskap.no/signin-oidc> |
| Post logout redirect URI-er | <https://kundenavn.checkid.no/><br><https://kundenavn.checkid.no/logout><br><https://kundenavn.checkid.no/logout/idporten-callback><br><https://onboarding.domenenavn.no/><br><https://onboarding.domenenavn.no/logout><br><https://onboarding.domenenavn.no/logout/idporten-callback> |

Det vi trenger tilbake:

- Client id
- Client secret

## Detaljert bruksanvisning

::::steps
### Logg inn på Samarbeidsportalen

Velg **Logg inn** på [Samarbeidsportalen](https://samarbeid.digdir.no/)

![Logg inn i Samarbeidsportalen](../media/identity-providers/samarbinnlogg.png)

Logg inn med en Digdir konto.

![Logg inn DigDir](../media/identity-providers/digdirinnloggmini.png)

### Selvbetjening

Utvid **Integrasjoner**, velg **Selvbetjening** og deretter miljø.

![Minside selvbetjening](../media/identity-providers/minside.png)

### Legg til klient

Velg **Legg til klient**.

![Selvbetjening - legg til klient](../media/identity-providers/image.png)

### Navngi applikasjon

Navngi applikasjon, eksempelvis **Onboarding med CheckID**, og benytt følgende konfigurasjon:

| Applikasjonstype | Autentiseringsmetode |
|-|-|
| web | client_secret_post |

![Legg til ID-porten klient](../media/identity-providers/image-1.png)

:::warning
Per april 2025 så fungerer ikke knappen **Generer client secret** før du har laget, og **lagret**, applikasjonen.

![Generer client secret](../media/identity-providers/image-2.png)
:::

### Levetid & Tokens

Under **Levetid & Tokens**, la alt stå som standard.

![Levetid & Tokens](../media/identity-providers/image-3.png)

### URI

Under **URI**, tilpass redirect URI-er så det matcher med CheckID bestillingen:

| Redirect URI-er |
|-|
| <https://kundenavn.checkid.no/signin-oidc> |
| <https://onboarding.ditt-selskap.no/signin-oidc> |

| Post logout redirect URI-er |
|-|
| <https://kundenavn.checkid.no/> |
| <https://kundenavn.checkid.no/logout> |
| <https://kundenavn.checkid.no/logout/idporten-callback> |
| <https://onboarding.domenenavn.no/> |
| <https://onboarding.domenenavn.no/logout> |
| <https://onboarding.domenenavn.no/logout/idporten-callback> |

![URI-er](../media/identity-providers/image-4.png)

### Lagre klienten

**Lagre klienten**. Etter at klienten er laget kan du opprette client secret ved å trykke **Generer client secret**:

![Lagre og generer secret](../media/identity-providers/image-5.png)

### Oversend client id og client secret

Oversend, på en sikker måte, client id og client secret for applikasjonen til din CheckID-kontakt.
::::
