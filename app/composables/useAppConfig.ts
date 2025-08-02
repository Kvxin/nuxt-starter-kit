// 环境配置 composable
export const useEnvironmentConfig = () => {
  const config = useRuntimeConfig()
  
  return {
    env: {
      isDevelopment: config.public.nodeEnv === 'development',
      isProduction: config.public.nodeEnv === 'production',
      isTest: config.public.nodeEnv === 'test',
      current: config.public.nodeEnv
    },
    
    api: {
      baseUrl: config.public.apiBaseUrl,
      timeout: config.apiTimeout
    },
    
    app: {
      name: config.public.appName,
      version: config.public.appVersion
    },
    
    debug: {
      enabled: config.public.debug,
      logLevel: config.public.logLevel
    },
    
    server: {
      port: config.public.nitroPort,
      host: config.public.nitroHost
    }
  }
}

export interface EnvironmentConfig {
  env: {
    isDevelopment: boolean
    isProduction: boolean
    isTest: boolean
    current: string
  }
  api: {
    baseUrl: string
    timeout: number
  }
  app: {
    name: string
    version: string
  }
  debug: {
    enabled: boolean
    logLevel: string
  }
  server: {
    port: number
    host: string
  }
} 