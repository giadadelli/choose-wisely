<script setup lang="ts">
// Focus management SPA (SCRUM-7): ad ogni cambio route, sposta il focus
// sull'<h1> della pagina appena caricata.
useFocusOnRouteChange()
</script>

<template>
  <div>
    <SkipLink />
    <NuxtRouteAnnouncer />
    <main
      id="main-content"
      tabindex="-1"
    >
      <NuxtPage />
    </main>
    <VisuallyHiddenLive />
  </div>
</template>
