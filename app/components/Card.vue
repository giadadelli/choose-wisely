<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
/* Breakpoint md (768px) usato come letterale — vedi nota in tokens.css */
.card {
  background-color: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-300);
  border-radius: 12px;
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}
</style>
