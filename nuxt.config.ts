// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/sitemap'],
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://choosewisely.it',
    name: 'Choose Wisely',
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
