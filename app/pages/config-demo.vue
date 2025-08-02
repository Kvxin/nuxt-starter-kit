<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">环境配置演示</h1>
    
    <!-- 环境信息 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 环境状态 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">环境信息</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">当前环境:</span>
            <span :class="getEnvBadgeClass(config.env.current)">
              {{ config.env.current }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">开发环境:</span>
            <span :class="config.env.isDevelopment ? 'text-green-600' : 'text-gray-400'">
              {{ config.env.isDevelopment ? '是' : '否' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">生产环境:</span>
            <span :class="config.env.isProduction ? 'text-red-600' : 'text-gray-400'">
              {{ config.env.isProduction ? '是' : '否' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">测试环境:</span>
            <span :class="config.env.isTest ? 'text-blue-600' : 'text-gray-400'">
              {{ config.env.isTest ? '是' : '否' }}
            </span>
          </div>
        </div>
      </div>

      <!-- API 配置 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">API 配置</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">基础 URL:</span>
            <span class="text-blue-600 font-mono text-sm">{{ config.api.baseUrl }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">超时时间:</span>
            <span class="text-gray-600">{{ config.api.timeout }}ms</span>
          </div>
        </div>
      </div>

      <!-- 应用信息 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">应用信息</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">应用名称:</span>
            <span class="text-gray-600">{{ config.app.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">版本号:</span>
            <span class="text-gray-600">{{ config.app.version }}</span>
          </div>
        </div>
      </div>

      <!-- 调试配置 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">调试配置</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">调试模式:</span>
            <span :class="config.debug.enabled ? 'text-green-600' : 'text-red-600'">
              {{ config.debug.enabled ? '启用' : '禁用' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">日志级别:</span>
            <span class="text-gray-600">{{ config.debug.logLevel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- API 测试 -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">API 连接测试</h2>
      <div class="space-y-4">
        <button 
          @click="testApiConnection"
          :disabled="isTesting"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isTesting ? '测试中...' : '测试 API 连接' }}
        </button>
        
        <div v-if="testResult" class="mt-4">
          <div :class="testResult.success ? 'text-green-600' : 'text-red-600'">
            <strong>测试结果:</strong> {{ testResult.message }}
          </div>
          <div v-if="testResult.details" class="mt-2 text-sm text-gray-600">
            <pre class="bg-gray-100 p-2 rounded">{{ testResult.details }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 环境变量列表 -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">环境变量</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2 px-4">变量名</th>
              <th class="text-left py-2 px-4">值</th>
              <th class="text-left py-2 px-4">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in envVars" :key="key" class="border-b">
              <td class="py-2 px-4 font-mono text-sm">{{ key }}</td>
              <td class="py-2 px-4 font-mono text-sm text-blue-600">{{ value }}</td>
              <td class="py-2 px-4 text-sm text-gray-600">{{ getEnvVarDescription(key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEnvironmentConfig } from '~/composables/useAppConfig'
import { useGet } from '~/composables/useFetch'

// 使用环境配置
const config = useEnvironmentConfig()

// 测试状态
const isTesting = ref(false)
const testResult = ref<{
  success: boolean
  message: string
  details?: string
} | null>(null)

// 环境变量
const envVars = computed(() => ({
  NODE_ENV: config.env.current,
  API_BASE_URL: config.api.baseUrl,
  API_TIMEOUT: config.api.timeout,
  APP_NAME: config.app.name,
  APP_VERSION: config.app.version,
  DEBUG: config.debug.enabled,
  LOG_LEVEL: config.debug.logLevel,
  NITRO_PORT: config.server.port,
  NITRO_HOST: config.server.host,
}))

// 获取环境徽章样式
const getEnvBadgeClass = (env: string) => {
  switch (env) {
    case 'development':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded text-sm'
    case 'production':
      return 'bg-red-100 text-red-800 px-2 py-1 rounded text-sm'
    case 'test':
      return 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm'
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm'
  }
}

// 获取环境变量说明
const getEnvVarDescription = (key: string) => {
  const descriptions: Record<string, string> = {
    NODE_ENV: '当前运行环境',
    API_BASE_URL: '后端 API 基础地址',
    API_TIMEOUT: 'API 请求超时时间（毫秒）',
    APP_NAME: '应用名称',
    APP_VERSION: '应用版本号',
    DEBUG: '是否启用调试模式',
    LOG_LEVEL: '日志级别',
    NITRO_PORT: 'Nitro 服务器端口',
    NITRO_HOST: 'Nitro 服务器主机',
  }
  return descriptions[key] || '未定义'
}

// 测试 API 连接
const testApiConnection = async () => {
  isTesting.value = true
  testResult.value = null
  
  try {
    // 使用我们的自定义 useFetch 测试连接
    const { data, error } = await useGet('/api/health')
    
    if (error.value) {
      testResult.value = {
        success: false,
        message: 'API 连接失败',
        details: `错误: ${error.value.message}`
      }
    } else {
      testResult.value = {
        success: true,
        message: 'API 连接成功',
        details: JSON.stringify(data.value, null, 2)
      }
    }
  } catch (err) {
    testResult.value = {
      success: false,
      message: 'API 连接异常',
      details: err instanceof Error ? err.message : String(err)
    }
  } finally {
    isTesting.value = false
  }
}
</script> 