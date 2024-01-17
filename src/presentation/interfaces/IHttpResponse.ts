export interface IHttpResponse {
  statusCode: number
  body: Record<string, any>
  message?: string
}