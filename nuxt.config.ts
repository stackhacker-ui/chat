import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/mdc',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'nuxt-charts',
    'shadcn-nuxt'
  ],

  components: [
    { path: '~/components/prose', pathPrefix: false, global: true },
    '~/components'
  ],

  devtools: {
    enabled: true
  },

  css: [
    'vue-sonner/style.css',
    '~/assets/css/main.css'
  ],

  colorMode: {
    classSuffix: '',
    disableTransition: true
  },

  mdc: {
    headings: {
      anchorLinks: false
    },
    highlight: {
      // noApiRoute: true
      shikiEngine: 'javascript'
    },
    components: {
      map: {
        root: 'span'
      }
    }
  },

  sourcemap: {
    server: false,
    client: false
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2025-04-01',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: 'a56dcbdf-7730-4f2b-ade9-26feb9461aba' },
      applyMigrationsDuringBuild: false
    },
    blob: {
      driver: 'cloudflare-r2',
      binding: 'BLOB',
      bucketName: 'stackhacker-ui-chat'
    }
  },

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
    build: {
      chunkSizeWarningLimit: 1500
    },
    css: {
      devSourcemap: false
    },
    optimizeDeps: {
      include: [
        'striptags',
        '@ai-sdk/vue',
        'ai',
        'shiki-stream/vue',
        'shiki',
        'shiki/engine-javascript.mjs'
      ]
    }
  },

  hooks: {
    // Suppress sourcemap warnings from upstream plugins (nuxt:module-preload-polyfill,
    // @tailwindcss/vite) that do not generate sourcemaps for their transformations.
    'vite:extendConfig'(config) {
      const customLogger = config.customLogger as
        { warn: (...args: unknown[]) => void } | undefined
      if (customLogger) {
        const originalWarn = customLogger.warn.bind(customLogger)
        customLogger.warn = (msg: unknown, ...args: unknown[]) => {
          if (typeof msg === 'string' && msg.includes('Sourcemap is likely to be incorrect')) return
          originalWarn(msg, ...args)
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  }
})
