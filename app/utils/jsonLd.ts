/**
 * Indirizzo postale schema.org (PostalAddress), riutilizzabile dai vari
 * tipi JSON-LD (Person, ProfessionalService, ...).
 */
export interface JsonLdPostalAddress {
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

type JsonLdValue = Record<string, unknown>

/**
 * Rimuove le chiavi con valore `undefined` da un oggetto JSON-LD, per non
 * emettere proprieta' vuote nello script generato.
 */
const cleanJsonLd = <T extends JsonLdValue>(data: T): T => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T
}

/**
 * Converte un indirizzo in un nodo schema.org PostalAddress, oppure
 * `undefined` se non e' stato fornito nessun indirizzo.
 */
export const toJsonLdPostalAddress = (address?: JsonLdPostalAddress) => {
  if (!address) return undefined

  return cleanJsonLd({
    '@type': 'PostalAddress',
    ...address,
  })
}

/**
 * Costruisce il tag script (per `useHead({ script: [...] })`) che inietta
 * un blocco JSON-LD schema.org nella pagina.
 */
export const buildJsonLdScriptTag = (data: JsonLdValue) => ({
  type: 'application/ld+json' as const,
  innerHTML: JSON.stringify(cleanJsonLd(data)),
})
