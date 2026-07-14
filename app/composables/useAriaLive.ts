export type AriaLivePoliteness = 'polite' | 'assertive'

interface AriaLiveState {
  message: string
  politeness: AriaLivePoliteness
}

/**
 * Composable per annunci screen-reader riutilizzabili tramite un'unica
 * aria-live region condivisa (renderizzata dal componente
 * <VisuallyHiddenLive>, montato una volta in app.vue).
 *
 * Verrà riusato da SCRUM-52 per annunciare i risultati dell'autocomplete.
 *
 * Uso:
 *   const { announce } = useAriaLive()
 *   announce('3 risultati trovati')
 *   announce('Errore nel salvataggio', 'assertive')
 */
export function useAriaLive() {
  const state = useState<AriaLiveState>('aria-live-region', () => ({
    message: '',
    politeness: 'polite',
  }))

  function announce(message: string, politeness: AriaLivePoliteness = 'polite') {
    // Gli screen reader annunciano solo le *variazioni* del contenuto della
    // live region: si azzera prima, cosi' anche messaggi identici a quello
    // precedente vengono ri-annunciati.
    state.value = { message: '', politeness }
    nextTick(() => {
      state.value = { message, politeness }
    })
  }

  return { state, announce }
}
