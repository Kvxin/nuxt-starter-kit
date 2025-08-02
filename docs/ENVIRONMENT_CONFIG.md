# Nuxt 4 多环境配置指南

## 概述

本项目已配置完整的多环境支持，包括开发环境、生产环境和测试环境。所有配置都通过环境变量进行管理，确保不同环境之间的配置隔离。

## 环境文件结构

```
项目根目录/
├── .env                 # 开发环境配置（本地开发）
├── .env.production      # 生产环境配置
├── .env.test           # 测试环境配置（可选）
└── .env.example        # 环境配置示例文件
```

## 环境变量配置

### 基础环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `development` | `development`, `production`, `test` |
| `API_BASE_URL` | 后端 API 地址 | `http://localhost:4000` | `https://api.example.com` |
| `API_TIMEOUT` | API 请求超时时间 | `10000` | `5000` |
| `APP_NAME` | 应用名称 | `Nuxt App` | `我的应用` |
| `APP_VERSION` | 应用版本 | `1.0.0` | `2.1.0` |
| `DEBUG` | 调试模式 | `true` | `false` |
| `LOG_LEVEL` | 日志级别 | `info` | `debug`, `warn`, `error` |
| `NITRO_PORT` | 服务器端口 | `3000` | `8080` |
| `NITRO_HOST` | 服务器主机 | `localhost` | `0.0.0.0` |

### 私有环境变量（仅服务端）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `JWT_SECRET` | JWT 密钥 | - |
| `DATABASE_URL` | 数据库连接字符串 | - |

## 环境配置示例

### 开发环境 (.env)

```bash
# 开发环境配置
NODE_ENV=development
API_BASE_URL=http://localhost:4000
API_TIMEOUT=10000
APP_NAME=Nuxt App (Dev)
APP_VERSION=1.0.0
DEBUG=true
LOG_LEVEL=debug
NITRO_PORT=3000
NITRO_HOST=localhost

# 私有配置
JWT_SECRET=dev-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dev_db
```

### 生产环境 (.env.production)

```bash
# 生产环境配置
NODE_ENV=production
API_BASE_URL=https://api.example.com
API_TIMEOUT=5000
APP_NAME=Nuxt App
APP_VERSION=1.0.0
DEBUG=false
LOG_LEVEL=warn
NITRO_PORT=8080
NITRO_HOST=0.0.0.0

# 私有配置
JWT_SECRET=production-secret-key
DATABASE_URL=postgresql://user:password@prod-server:5432/prod_db
```

## 使用方法

### 1. 在组件中使用环境配置

```vue
<template>
  <div>
    <h1>{{ config.app.name }} v{{ config.app.version }}</h1>
    <p>当前环境: {{ config.env.current }}</p>
    <p>API 地址: {{ config.api.baseUrl }}</p>
  </div>
</template>

<script setup lang="ts">
import { useEnvironmentConfig } from '~/composables/useAppConfig'

const config = useEnvironmentConfig()

// 根据环境执行不同逻辑
if (config.env.isDevelopment) {
  console.log('开发环境调试信息')
}

if (config.env.isProduction) {
  // 生产环境特定逻辑
}
</script>
```

### 2. 在 API 请求中使用

```typescript
import { useGet, usePost } from '~/composables/useFetch'

// 自动使用配置的 API 基础地址
const { data, error } = useGet('/api/users')

// POST 请求
const { data: user } = usePost('/api/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})
```

### 3. 在服务端使用

```typescript
// server/api/users.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 访问私有配置
  const dbUrl = config.databaseUrl
  const jwtSecret = config.jwtSecret
  
  // 访问公共配置
  const apiTimeout = config.apiTimeout
  
  // 业务逻辑...
})
```

## 环境切换

### 开发环境

```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev
```

### 生产环境

```bash
# 构建生产版本
npm run build
# 启动生产服务器
npm run start
```

### 测试环境

```bash
# 使用测试环境配置
NODE_ENV=test npm run dev
```

## API 代理配置

项目已配置 API 代理，支持开发和生产环境：

### 开发环境代理

```typescript
// nuxt.config.ts
nitro: {
  devProxy: {
    '/api': {
      target: process.env.API_BASE_URL || 'http://localhost:4000',
      changeOrigin: true,
      prependPath: true,
    }
  }
}
```

### 生产环境代理

```typescript
// nuxt.config.ts
nitro: {
  routeRules: {
    '/api/**': {
      proxy: process.env.API_BASE_URL || 'http://localhost:4000'
    }
  }
}
```

## 环境配置演示

访问 `/config-demo` 页面查看完整的环境配置演示，包括：

- 当前环境状态
- API 配置信息
- 应用信息
- 调试配置
- API 连接测试
- 环境变量列表

## 最佳实践

### 1. 环境变量管理

- 敏感信息使用私有配置（`runtimeConfig`）
- 公共信息使用公共配置（`runtimeConfig.public`）
- 始终提供默认值

### 2. 环境隔离

- 不同环境使用不同的配置文件
- 生产环境禁用调试功能
- 使用环境特定的 API 地址

### 3. 安全考虑

- 不要将敏感信息提交到版本控制
- 使用环境变量管理密钥和连接字符串
- 生产环境使用强密钥

### 4. 调试和日志

- 开发环境启用详细日志
- 生产环境使用适当的日志级别
- 根据环境调整超时时间

## 故障排除

### 常见问题

1. **环境变量未生效**
   - 检查环境文件是否正确命名
   - 重启开发服务器
   - 确认变量名拼写正确

2. **API 连接失败**
   - 检查 `API_BASE_URL` 配置
   - 确认后端服务正在运行
   - 检查网络连接和防火墙设置

3. **配置类型错误**
   - 确保数值类型变量使用 `parseInt()` 转换
   - 检查布尔值变量的格式

### 调试技巧

```typescript
// 在组件中调试配置
const config = useEnvironmentConfig()
console.log('当前配置:', config)

// 在服务端调试
const config = useRuntimeConfig()
console.log('服务端配置:', config)
```

## 相关文件

- `nuxt.config.ts` - 主配置文件
- `app/composables/useAppConfig.ts` - 配置 composable
- `app/composables/useFetch.ts` - API 请求配置
- `app/plugins/api.ts` - API 插件配置
- `app/pages/config-demo.vue` - 配置演示页面 