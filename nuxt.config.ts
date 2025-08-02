// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // 模块配置
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  // UI 配置
  ui: {
    fonts: false
  },

  // 国际化配置
  i18n: {
    locales: [
      {
        code: 'en',
        language: 'English',
        file: 'en.json'
      },
      {
        code: 'zh',
        language: 'Chinese',
        file: 'zh.json'
      }
    ],
    defaultLocale: 'zh',
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅在服务端可用）
    apiTimeout: parseInt(process.env.API_TIMEOUT || '10000'),
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // 公共配置（客户端和服务端都可用）
    public: {
      nodeEnv: process.env.NODE_ENV || 'development',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
      appName: process.env.APP_NAME || 'Nuxt App',
      appVersion: process.env.APP_VERSION || '1.0.0',
      debug: process.env.DEBUG === 'true',
      logLevel: process.env.LOG_LEVEL || 'info',
      nitroPort: parseInt(process.env.NITRO_PORT || '3000'),
      nitroHost: process.env.NITRO_HOST || 'localhost',
    }
  },

  // Nitro 配置（服务器配置）
  nitro: {
    // 开发环境配置
    devProxy: {
      '/api': {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
        prependPath: true,
      }
    },

    // 生产环境配置
    routeRules: {
      '/api/**': {
        proxy: process.env.API_BASE_URL
      }
    }
  },

  // 应用配置
  app: {
    head: {
      title: process.env.APP_NAME || 'Nuxt App',
      meta: [
        { name: 'description', content: 'Nuxt 4 Application' },
        { name: 'version', content: process.env.APP_VERSION || '1.0.0' }
      ]
    }
  },

  // 开发工具配置
  devtools: {
    enabled: process.env.NODE_ENV === 'development'
  },

  // 构建配置
  build: {
    // 生产环境优化
    transpile: process.env.NODE_ENV === 'production' ? [] : []
  },
})