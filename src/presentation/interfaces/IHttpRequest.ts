export interface IHttpRequest {
  url: string
  headers: Record<string, any>
  method: string
  params: Record<string, any>
  query: Record<string, any>
  body: Record<string, any>
  files?: any
  file?: any
  token?: any
}