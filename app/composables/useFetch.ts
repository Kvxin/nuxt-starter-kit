import type { UseFetchOptions } from 'nuxt/app'

// 响应数据接口
interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}

// 自定义错误类
export class ApiError extends Error {
    constructor(
        public code: number,
        public override message: string,
        public data?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

// 响应拦截器类型
interface ResponseInterceptor {
    onResponse?: (response: ApiResponse) => ApiResponse
    onResponseError?: (error: ApiError) => void
}

// 响应拦截器配置
let globalResponseInterceptor: ResponseInterceptor = {}

// 设置全局响应拦截器
export function setResponseInterceptor(interceptor: ResponseInterceptor) {
    globalResponseInterceptor = interceptor
}

export function useCustomFetch<T = any>(
    url: string | (() => string),
    options: UseFetchOptions<ApiResponse<T>> = {}
) {
    const config = useRuntimeConfig()
    
    // 默认配置
    const defaultOptions: UseFetchOptions<ApiResponse<T>> = {
        // 使用环境配置中的 API 基础 URL
        baseURL: config.public.apiBaseUrl,
        
        // 响应拦截器
        onResponse({ response }) {
            const apiResponse = response._data as ApiResponse<T>

            // 检查响应状态码
            if (apiResponse.code !== 200) {
                const error = new ApiError(
                    apiResponse.code,
                    apiResponse.message,
                    apiResponse.data
                )

                // 调用全局错误拦截器
                if (globalResponseInterceptor.onResponseError) {
                    globalResponseInterceptor.onResponseError(error)
                }

                throw error
            }

            // 调用全局响应拦截器
            if (globalResponseInterceptor.onResponse) {
                const processedResponse = globalResponseInterceptor.onResponse(apiResponse)
                response._data = processedResponse
            }

            // 直接返回 data 字段，简化使用
            response._data = apiResponse.data
        },

        // 错误处理
        onResponseError({ response }) {
            const error = new ApiError(
                response.status || 500,
                response.statusText || '网络请求失败',
                response._data
            )

            // 调用全局错误拦截器
            if (globalResponseInterceptor.onResponseError) {
                globalResponseInterceptor.onResponseError(error)
            }

            throw error
        }
    }

    // 合并用户配置和默认配置
    const mergedOptions = {
        ...defaultOptions,
        ...options
    }

    return useFetch<ApiResponse<T>, ApiError>(url, mergedOptions)
}

// 便捷方法：GET 请求
export function useGet<T = any>(
    url: string | (() => string),
    options: Omit<UseFetchOptions<ApiResponse<T>>, 'method'> = {}
) {
    return useCustomFetch<T>(url, { ...options, method: 'GET' })
}

// 便捷方法：POST 请求
export function usePost<T = any>(
    url: string | (() => string),
    body?: any,
    options: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'> = {}
) {
    return useCustomFetch<T>(url, {
        ...options,
        method: 'POST',
        body
    })
}

// 便捷方法：PUT 请求
export function usePut<T = any>(
    url: string | (() => string),
    body?: any,
    options: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'> = {}
) {
    return useCustomFetch<T>(url, {
        ...options,
        method: 'PUT',
        body
    })
}

// 便捷方法：DELETE 请求
export function useDelete<T = any>(
    url: string | (() => string),
    options: Omit<UseFetchOptions<ApiResponse<T>>, 'method'> = {}
) {
    return useCustomFetch<T>(url, { ...options, method: 'DELETE' })
}
