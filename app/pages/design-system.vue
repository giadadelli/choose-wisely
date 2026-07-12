<script setup>
// Pagina di riferimento persistente per il design system.
// Non linkata da header/footer pubblici (SCRUM-6): raggiungibile solo
// navigando direttamente a /design-system.
const selectedChip = ref('nutrizionista')

const chipExamples = ['nutrizionista', 'osteopata', 'psicologa', 'estetista']

function toggleChip(value) {
  selectedChip.value = selectedChip.value === value ? '' : value
}

const colorSwatches = [
  { label: 'primary-50', bg: 'var(--color-primary-50)', text: 'var(--color-primary-700)' },
  { label: 'primary-600', bg: 'var(--color-primary-600)', text: 'var(--color-neutral-0)' },
  { label: 'secondary-50', bg: 'var(--color-secondary-50)', text: 'var(--color-secondary-700)' },
  { label: 'secondary-500', bg: 'var(--color-secondary-500)', text: 'var(--color-neutral-0)' },
  { label: 'neutral-50', bg: 'var(--color-neutral-50)', text: 'var(--color-neutral-900)' },
  { label: 'neutral-900', bg: 'var(--color-neutral-900)', text: 'var(--color-neutral-0)' },
  { label: 'success', bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' },
  { label: 'attenzione', bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)' },
  { label: 'errore', bg: 'var(--color-error-bg)', text: 'var(--color-error-text)' }
]
</script>

<template>
  <div class="design-system">
    <header class="design-system__header">
      <h1>Design system — Choose Wisely</h1>
      <p>
        Pagina di riferimento persistente per i design token e i componenti
        Vue di base. Non collegata dalla navigazione pubblica.
      </p>
    </header>

    <section class="design-system__section">
      <h2>Tipografia</h2>
      <h1>Titolo H1</h1>
      <h2>Titolo H2</h2>
      <h3>Titolo H3</h3>
      <p>
        Testo body standard, usato per paragrafi e contenuti descrittivi
        nelle pagine dell'applicazione.
      </p>
    </section>

    <section class="design-system__section">
      <h2>Colori</h2>
      <div class="swatch-grid">
        <div
          v-for="swatch in colorSwatches"
          :key="swatch.label"
          class="swatch"
          :style="{ backgroundColor: swatch.bg, color: swatch.text }"
        >
          {{ swatch.label }}
        </div>
      </div>
    </section>

    <section class="design-system__section">
      <h2>Button</h2>
      <div class="row">
        <Button variant="primary">Primario</Button>
        <Button variant="secondary">Secondario</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="primary" disabled>Disabilitato</Button>
      </div>
    </section>

    <section class="design-system__section">
      <h2>Badge</h2>
      <div class="row">
        <Badge>Founder</Badge>
      </div>
    </section>

    <section class="design-system__section">
      <h2>Chip</h2>
      <div class="row">
        <Chip
          v-for="chip in chipExamples"
          :key="chip"
          :selected="selectedChip === chip"
          @click="toggleChip(chip)"
        >
          {{ chip }}
        </Chip>
      </div>
    </section>

    <section class="design-system__section">
      <h2>Card</h2>
      <div class="row">
        <Card class="card-example">
          <h3>Nome professionista</h3>
          <p>Breve descrizione di esempio del contenuto di una card.</p>
          <Badge>Founder</Badge>
        </Card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.design-system {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.design-system__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.design-system__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.swatch {
  padding: var(--space-4);
  border-radius: 8px;
  font-family: var(--font-family-base);
  font-size: 0.875rem;
  font-weight: 600;
}

.card-example {
  max-width: 320px;
}

/* Breakpoint md (768px) usato come letterale — vedi nota in tokens.css */
@media (min-width: 768px) {
  .design-system {
    padding: var(--space-8);
  }

  .swatch-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
