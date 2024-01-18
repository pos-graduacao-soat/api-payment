import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { IHttpResponseModel } from './interfaces/IHttpResponseModel'

export class HttpService {
  private axiosInstance: AxiosInstance

  constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config)
  }

  async get<T extends IHttpResponseModel>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config)
  }

  async patch<T extends IHttpResponseModel>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config)
  }
}