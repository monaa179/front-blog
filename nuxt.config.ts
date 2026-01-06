// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase'
  ],

  css: [
    '~/assets/css/base.css'
  ],

  supabase: {
    redirect: false // We will handle this with our own middleware
  },

  runtimeConfig: {
    public: {
      makeWebhookUrl: process.env.MAKE_WEBHOOK_URL
    }
  },

  app: {
    head: {
      title: 'Blog Writer',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }
      ]
    }
  }
})
