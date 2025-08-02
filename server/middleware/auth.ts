import { defineEventHandler, getRequestHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const token = getRequestHeader(event, 'authorization')

    if (!token || token !== 'Bearer valid-token') {
        console.log('未授权访问')
    }
})
