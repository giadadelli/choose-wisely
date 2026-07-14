<script setup lang="ts">
// Skip-link accessibile: invisibile finché non riceve focus da tastiera,
// punta a #main-content — convenzione da rispettare in tutti i layout
// futuri (il landmark <main id="main-content"> è definito in app.vue).
</script>

<template>
  <a
    href="#main-content"
    class="skip-link"
  >
    Salta al contenuto principale
  </a>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: var(--space-2) var(--space-4);
  transform: translateY(-100%);
  background-color: var(--color-primary-600);
  color: var(--color-neutral-0);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 8px;
  transition: transform 0.15s ease;
}

.skip-link:focus {
  transform: translateY(0%);
}
</style>
