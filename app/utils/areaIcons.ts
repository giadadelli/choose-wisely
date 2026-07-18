/**
 * Mappa slug macro-area -> classe icona Tabler (font locale, vedi nuxt.config.ts).
 * Dato statico hardcoded (SCRUM-22): le macro-aree non cambiano a runtime.
 */
const AREA_ICONS: Record<string, string> = {
  salute: 'ti-heartbeat',
  casa: 'ti-home',
  lavoro: 'ti-briefcase',
}

const DEFAULT_ICON = 'ti-sparkles'

export function getAreaIcon(slug: string): string {
  return AREA_ICONS[slug] ?? DEFAULT_ICON
}
