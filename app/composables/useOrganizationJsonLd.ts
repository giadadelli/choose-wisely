export interface OrganizationJsonLdData {
  name?: string
  url?: string
  logo?: string
}

/**
 * Inietta il JSON-LD schema.org Organization per "Choose Wisely".
 * Pensato per essere chiamato una sola volta, a livello globale
 * (`app.vue`), cosi' che compaia su ogni pagina del sito.
 */
export const useOrganizationJsonLd = (overrides: OrganizationJsonLdData = {}) => {
  const config = useRuntimeConfig()
  const siteUrl = overrides.url ?? config.public.siteUrl

  useHead({
    script: [
      buildJsonLdScriptTag({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': overrides.name ?? 'Choose Wisely',
        'url': siteUrl,
        // Placeholder: non esiste ancora un logo reale, sara' sostituito
        // quando sara' disponibile un asset definitivo.
        'logo': overrides.logo ?? `${siteUrl}/logo-placeholder.png`,
      }),
    ],
  })
}
