import type { JsonLdPostalAddress } from '../utils/jsonLd'

export interface ProfessionalServiceJsonLdData {
  name: string
  description?: string
  url?: string
  image?: string
  telephone?: string
  email?: string
  address?: JsonLdPostalAddress
  areaServed?: string | string[]
  priceRange?: string
  sameAs?: string[]
}

/**
 * Composable tipizzato per il JSON-LD schema.org ProfessionalService.
 *
 * Solo infrastruttura: non e' ancora invocato da nessuna pagina, perche'
 * non esiste ancora un modello Professionista con dati reali (SCRUM-34).
 * Chi implementera' il profilo professionista potra' chiamarlo passando i
 * dati reali del servizio.
 */
export const useProfessionalServiceJsonLd = (data: ProfessionalServiceJsonLdData) => {
  useHead({
    script: [
      buildJsonLdScriptTag({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        ...data,
        'address': toJsonLdPostalAddress(data.address),
      }),
    ],
  })
}
