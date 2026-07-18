<script setup lang="ts">
// Font icone Tabler caricato solo qui (non in nuxt.config.ts): è l'unica
// pagina che usa icone, tenerlo globale avrebbe appesantito ogni altra route
// (impatto misurato: performance Lighthouse di /design-system sotto la soglia CI).
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
</script>

<template>
  <div class="index-page">
    <AreaSearch />
    <AreaGrid />
    <TrustTeaser />
  </div>
</template>

<style scoped>
.index-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
