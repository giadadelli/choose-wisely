import type { JsonLdPostalAddress } from '../utils/jsonLd'

export interface PersonJsonLdData {
  name: string
  jobTitle?: string
  url?: string
  image?: string
  telephone?: string
  email?: string
  address?: JsonLdPostalAddress
  sameAs?: string[]
}

/**
 * Composable tipizzato per il JSON-LD schema.org Person.
 *
 * Solo infrastruttura: non e' ancora invocato da nessuna pagina, perche'
 * non esiste ancora un modello Professionista con dati reali (SCRUM-34).
 * Chi implementera' il profilo professionista potra' chiamarlo passando i
 * dati reali della persona.
 */
export const usePersonJsonLd = (data: PersonJsonLdData) => {
  useHead({
    script: [
      buildJsonLdScriptTag({
        '@context': 'https://schema.org',
        '@type': 'Person',
        ...data,
        'address': toJsonLdPostalAddress(data.address),
      }),
    ],
  })
}
