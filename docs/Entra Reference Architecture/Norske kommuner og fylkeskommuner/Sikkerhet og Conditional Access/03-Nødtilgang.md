# Nødtilgang

Nødtilgangskontoer (Også kalt Break Glass Account) i Entra ID gir et ekstra sikkerhetslag ved å tillate autoriserte personer å få tilgang til kritiske Entra ID-ressurser i tilfelle en uventet hendelse, for eksempel når alle normale administratorer er utilgjengelige. Dette kan være svært nyttig i nødstilfeller eller hvis det oppstår problemer med å få tilgang til Entra ID og Microsoft 365. Erfaring tilsier at det kan ta flere dager å re-etablere tilgang til en tenant hvis man mister all ting og har behov for hjelp av Microsoft for å få tilbake tilgang.

!!! success "Designvalg SEC.01"
    En brukerkonto etableres med hensikt å være brukt kun ved nødstilfeller.

For å sikre en robust og pålitelig nødtilgangsløsning, etableres nødtilgangskontoen med et ekstremt sterkt, tilfeldig generert passord som ikke lagres i noen databaser eller systemer. Denne tilnærmingen minimerer potensielle sikkerhetsrisikoer knyttet til passordets lagring og reduserer risikoen for uautorisert tilgang. Videre blir én eller flere device-bound passkeys, som for eksempel FIDO2 USB- eller NFC-enheter, registrert på kontoen som den eneste gyldige påloggingsmetoden. Dette sikrer at tilgangen kun er tilgjengelig via disse fysiske enhetene og legger til et ekstra lag av autentisering for å sikre at bare autoriserte personer kan bruke nødtilgangskontoen i kritiske situasjoner.

!!! success "Designvalg SEC.02"
    Nødtilgangskontoen etableres med et tilfeldig satt langt passord som ikke lagres noe sted. Én eller flere device-bound passkeys (Feks. FIDO2 USB/NFC-enhet) registeres på kontoen som eneste gyldige pålogging.

For å opprettholde kontroll og overvåking av nødtilgangssituasjoner, implementeres det en automatisert varslingssystem når nødtilgangskontoen benyttes. Dette systemet gir umiddelbar og kontinuerlig informasjon til definerte ansvarlige personer eller grupper hver gang nødtilgangskontoen tas i bruk. Denne varslingen sikrer øyeblikkelig respons og tilsyn ved nødtilfeller, og tillater rask identifisering og håndtering av situasjonen, samtidig som det gir transparens og dokumentasjon om bruk av nødtilgang for fremtidig gjennomgang og evaluering.

!!! success "Designvalg SEC.03"
    Det etableres automatisk varsling når nødtilgangskontoen benyttes.

For å sikre tilgjengelighet og effektivitet i nødssituasjoner, tildeles nødtilgangskontoen en permanent Global Administrator-rolle. Dette valget sikrer at i tilfelle en feil konfigurasjon eller utilgjengelighet av Priviliged Identity Management (PIM), forblir nødtilgangsløsningen intakt og tilgjengelig. Ved å ha permanent Global Administrator-tilgang sikres det at nødtilgangskontoen alltid har de nødvendige tillatelsene til å håndtere kritiske situasjoner uavhengig av eventuelle endringer eller begrensninger i PIM-systemet.

!!! success "Designvalg SEC.04"
    Nødtilgangskontoen legges som permanent Global Administrator

    * Unngår at eksempelvis feilkonfigurasjon av Priviliged Identity Management (PIM) ødelegger nødtilgangsløsningen

For å sikre at nødtilgangskontoen alltid er tilgjengelig i kritiske situasjoner, blir den eksplisitt ekskludert fra alle Conditional Access-regler. Dette designvalget sikrer at feilkonfigurasjoner eller endringer i Conditional Access policies ikke påvirker nødtilgangsløsningen. Ved å unnta nødtilgangskontoen fra slike regler reduseres risikoen for utilsiktet blokkering av tilgangen til nødtilgangsmekanismen, og sikrer at den forblir tilgjengelig når den trengs mest.

!!! success "Designvalg SEC.05"
    Nødtilgangskontoen legges som unntak fra alle Conditional Access-regler.

    * Reduserer sjansen for at feilkonfigurasjon av Conditional Access policies ødelegger nødtilgangsløsningen

For å ytterligere sikre Conditional Access-miljøet og minimere risikoen for utilsiktet blokkering av tilgang, gir man samtykke til Fortytwo sin nødtilgangsapp. Denne appen får kun tilgang til å endre Conditional Access policies, og dens rolle begrenses til kun å håndtere disse spesifikke policyendringene. Dette gir et ekstra sikkerhetslag ved å tillate rask tilgang i tilfelle utilsiktet selvforskyldt utestengelse fra systemet på grunn av feilkonfigurasjon av Conditional Access. Appen sikrer at kun nødvendige endringer kan utføres, og at de gjøres på en kontrollert måte for å gjenopprette nødvendig tilgang uten å kompromittere systemets sikkerhet.

!!! success "Designvalg SEC.06"
    Som ekstra tiltak for å unngå uhell med Conditional Access gjøres et consent av [Fortytwo sin nødtilgangsapp](https://login.microsoftonline.com/common/adminconsent?client_id=f5df81e5-34ae-43ca-bc87-3b254e42a4b0).

    * Har kun tilgang til å endre på Conditional Access policies
    * Kan benyttes for rask tilgang om man skulle stenge seg selv ute grunnet feilkonfigurasjon av Conditional Access
