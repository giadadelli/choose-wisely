// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Componenti base del design system (Button, Badge, Chip, Card) usano
      // nomi a una parola per design, coerenti coi criteri di accettazione
      // di SCRUM-6 — non rinominarli per questa regola.
      'vue/multi-word-component-names': 'off',
    },
  },
)
