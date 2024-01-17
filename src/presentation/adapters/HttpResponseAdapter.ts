import { IHttpResponse } from '../interfaces/IHttpResponse'

const created = (body: Record<string, any>, message?: string): IHttpResponse => ({
  statusCode: 201,
  body: body,
  message: message || 'success'
})

const ok = (body?: Record<string, any>, message?: any, pagination?: any): IHttpResponse => ({
  statusCode: 200,
  body: body || {},
  message: message || 'success'
})

const badRequest = (body: Record<string, any>, message?: any): IHttpResponse => ({
  statusCode: 400,
  body: body,
  message: message || 'invalid_params'
})

export { created, ok, badRequest }