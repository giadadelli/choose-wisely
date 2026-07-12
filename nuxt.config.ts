// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css'],
  runtimeConfig: {
    // Sovrascrivibile via env NUXT_PUBLIC_SITE_URL (convenzione Nuxt).
    public: {
      siteUrl: 'https://choose-wisely.example.com',
    },
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
