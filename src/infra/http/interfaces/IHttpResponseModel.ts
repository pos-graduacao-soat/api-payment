export interface IHttpResponseModel {
  statusCode: number
  body: Record<string, unknown>
  message?: string
}