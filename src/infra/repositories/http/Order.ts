import { inject, injectable } from 'tsyringe'
import { Order, Status } from '../../../domain/valueObjects/Order'
import { IOrderRepository } from '../../../domain/ports/repositories/Order'
import { HttpService } from '../../http/HttpService'
import { env } from '../../../main/env'
import { IHttpResponseModel } from '../../http/interfaces/IHttpResponseModel'

interface GetOrderByIdResponseModel extends IHttpResponseModel {
  data: {
    id: string
    status: string
    totalPrice: number
    products: {
      id: string
      quantity: number
    }[]
  }
}

@injectable()
export class HttpOrderRepository implements IOrderRepository {
  baseUrl = env.ordersApiUrl

  constructor(
    @inject('HttpService') protected readonly httpService: HttpService
  ) { }

  async getById(id: string): Promise<Order | null> {
    const orderResponse = await this.httpService.get<GetOrderByIdResponseModel>(`${this.baseUrl}/orders/${id}`)

    if (orderResponse.status !== 200) return null

    const { data } = orderResponse

    return new Order({
      id: data.data.id,
      status: data.data.status as Status,
      totalPrice: data.data.totalPrice,
      products: data.data.products.map(product => ({
        id: product.id,
        quantity: product.quantity
      }))
    })
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    return true
  }
}