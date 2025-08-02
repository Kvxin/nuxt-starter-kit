import { setResponseInterceptor } from '~/composables/useFetch'

export default defineNuxtPlugin(() => {
  // 配置全局响应拦截器
  setResponseInterceptor({
    // 响应成功时的处理
    onResponse(response) {
      console.log('API 响应成功:', response)
      return response
    },
    
    // 响应错误时的处理
    onResponseError(error) {
      console.error('API 响应错误:', error)
      
      // 可以根据错误码进行不同的处理
      switch (error.code) {
        case 401:
          // 未授权，跳转到登录页
          navigateTo('/login')
          break
        case 403:
          // 权限不足
          console.error('权限不足')
          break
        case 500:
          // 服务器错误
          console.error('服务器内部错误')
          break
        default:
          // 其他错误
          console.error(`请求失败: ${error.message}`)
      }
    }
  })
}) 