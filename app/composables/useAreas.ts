export interface MacroArea {
  id: number
  slug: string
  name: string
  shortDescription: string | null
}

export interface SubArea {
  id: number
  slug: string
  name: string
  keywords: string[]
}

interface AreasResponse {
  macroAreas: MacroArea[]
  subAreas: SubArea[]
}

/**
 * Fetcha macro-aree e sotto-aree una sola volta per la sessione di navigazione
 * (SCRUM-20/21/22): la key condivisa fa sì che AreaSearch e AreaGrid, pur
 * chiamando entrambi questo composable, riusino lo stesso risultato invece
 * di fare due richieste di rete.
 */
export const useAreas = () => {
  return useFetch<AreasResponse>('/api/areas', {
    key: 'areas',
    default: () => ({ macroAreas: [], subAreas: [] }),
  })
}
