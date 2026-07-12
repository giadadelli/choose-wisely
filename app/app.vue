<script setup lang="ts">
// Focus management SPA (SCRUM-7): ad ogni cambio route, sposta il focus
// sull'<h1> della pagina appena caricata.
useFocusOnRouteChange()

useOrganizationJsonLd()

const site = useSiteConfig()
const defaultDescription
  = 'Choose Wisely è la directory che ti aiuta a trovare la professionista giusta per il tuo problema specifico.'
const defaultImage = `${site.url}/og-default.png`

useHead({
  titleTemplate: title => (title ? `${title} · Choose Wisely` : 'Choose Wisely'),
})

useSeoMeta({
  description: defaultDescription,
  ogType: 'website',
  ogSiteName: 'Choose Wisely',
  ogTitle: 'Choose Wisely',
  ogDescription: defaultDescription,
  ogImage: defaultImage,
  ogUrl: site.url,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Choose Wisely',
  twitterDescription: defaultDescription,
  twitterImage: defaultImage,
})
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
