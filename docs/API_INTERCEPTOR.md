# Nuxt API 响应拦截器使用指南

## 概述

这个响应拦截器专门为处理后端固定的数据格式而设计：

```json
{
  "code": 200,
  "message": "请求成功",
  "data": "xxxxxxxxx"
}
```

## 特性

- ✅ 自动处理后端统一响应格式
- ✅ 全局错误处理
- ✅ TypeScript 类型支持
- ✅ 便捷的 HTTP 方法封装
- ✅ 自动提取 `data` 字段
- ✅ 自定义错误类

## 安装和配置

### 1. 响应拦截器已包含在 `app/composables/useFetch.ts`

### 2. 配置全局拦截器

在 `app/plugins/api.ts` 中配置全局响应拦截器：

```typescript
import { setResponseInterceptor } from '~/composables/useFetch'

export default defineNuxtPlugin(() => {
  setResponseInterceptor({
    onResponse(response) {
      console.log('API 响应成功:', response)
      return response
    },
    
    onResponseError(error) {
      console.error('API 响应错误:', error)
      
      switch (error.code) {
        case 401:
          navigateTo('/login')
          break
        case 403:
          console.error('权限不足')
          break
        default:
          console.error(`请求失败: ${error.message}`)
      }
    }
  })
})
```

## 使用方法

### 基本使用

```typescript
import { useGet, usePost, usePut, useDelete } from '~/composables/useFetch'

// 定义数据类型
interface User {
  id: number
  name: string
  email: string
}

// GET 请求
const { data, pending, error, refresh } = useGet<User>('/api/users/1')

// POST 请求
const { data, pending, error, refresh } = usePost<User>('/api/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// PUT 请求
const { data, pending, error, refresh } = usePut<User>('/api/users/1', {
  name: '李四',
  email: 'lisi@example.com'
})

// DELETE 请求
const { data, pending, error, refresh } = useDelete('/api/users/1')
```

### 在 Vue 组件中使用

```vue
<template>
  <div>
    <button @click="fetchData" :disabled="pending">
      {{ pending ? '加载中...' : '获取数据' }}
    </button>
    
    <div v-if="data">
      <h3>{{ data.name }}</h3>
      <p>{{ data.email }}</p>
    </div>
    
    <div v-if="error" class="text-red-500">
      错误: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGet } from '~/composables/useFetch'

interface User {
  id: number
  name: string
  email: string
}

const { data, pending, error, refresh } = useGet<User>('/api/users/1')

const fetchData = () => {
  refresh()
}
</script>
```

### 高级配置

```typescript
// 自定义配置
const { data, pending, error } = useGet<User>('/api/users/1', {
  // 请求头
  headers: {
    'Authorization': 'Bearer token'
  },
  
  // 查询参数
  query: {
    page: 1,
    limit: 10
  },
  
  // 自定义响应处理
  onResponse({ response }) {
    console.log('自定义响应处理:', response)
  },
  
  // 自定义错误处理
  onResponseError({ response }) {
    console.error('自定义错误处理:', response)
  }
})
```

## 错误处理

### 自动错误处理

响应拦截器会自动检查 `code` 字段：

- `code === 200`: 请求成功，返回 `data` 字段
- `code !== 200`: 抛出 `ApiError` 异常

### 自定义错误类

```typescript
import { ApiError } from '~/composables/useFetch'

try {
  const { data } = useGet('/api/users/1')
} catch (error) {
  if (error instanceof ApiError) {
    console.error('错误码:', error.code)
    console.error('错误信息:', error.message)
    console.error('错误数据:', error.data)
  }
}
```

## 类型定义

### ApiResponse 接口

```typescript
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
```

### ApiError 类

```typescript
class ApiError extends Error {
  constructor(
    public code: number,
    public override message: string,
    public data?: any
  )
}
```

## 可用的方法

- `useCustomFetch<T>()` - 通用请求方法
- `useGet<T>()` - GET 请求
- `usePost<T>()` - POST 请求
- `usePut<T>()` - PUT 请求
- `useDelete<T>()` - DELETE 请求
- `setResponseInterceptor()` - 设置全局响应拦截器

## 示例页面

访问 `/api-example` 页面查看完整的使用示例。

## 注意事项

1. 确保后端返回的数据格式符合 `ApiResponse` 接口
2. 全局拦截器在应用启动时自动配置
3. 所有请求都会自动提取 `data` 字段
4. 错误会自动转换为 `ApiError` 类型
5. 支持 TypeScript 类型推断 