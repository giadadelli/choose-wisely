/**
 * Focus management SPA: ad ogni cambio route sposta il focus sull'heading
 * principale (<h1>) della nuova pagina, cosi' chi naviga con tastiera o
 * screen reader riparte dal contenuto invece che restare "perso" sul link
 * appena attivato. Pattern standard per SPA/Nuxt (vedi es. gov.uk).
 *
 * Non gestisce la navigazione iniziale (primo caricamento pagina): a quel
 * punto il focus del browser è già in una posizione naturale.
 *
 * Da chiamare una sola volta, nel componente root (app.vue).
 */
export function useFocusOnRouteChange() {
  const router = useRouter()

  router.afterEach(() => {
    nextTick(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1')
      if (!heading) return

      // Un <h1> non è focusabile di default: serve tabindex="-1" per
      // potergli dare focus via JS senza inserirlo nel tab order.
      if (!heading.hasAttribute('tabindex')) {
        heading.setAttribute('tabindex', '-1')
      }

      heading.focus()
    })
  })
}
