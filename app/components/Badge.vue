<template>
  <span class="badge">
    <slot>Founder</slot>
  </span>
</template>

<style scoped>
/*
 * Badge "Founder": usa la tinta primaria (sfondo primario-50, testo
 * primario-700) invece di un colore dedicato, per restare coerente col
 * brand — vedi flussi-utente-e-task.md §0.1.
 */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: 999px;
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  font-family: var(--font-family-base);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}
</style>
