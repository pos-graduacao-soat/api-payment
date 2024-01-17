import { inject, injectable } from 'tsyringe'
import { Order, Status } from '../../../domain/valueObjects/Order'
import { IOrderRepository } from '../../../domain/ports/repositories/Order'
import { HttpService } from '../../http/HttpService'
import { env } from '../../../main/env'
import { IHttpResponseModel } from '../../http/interfaces/IHttpResponseModel'

interface GetOrderByIdResponseModel extends IHttpResponseModel {
  body: Record<string, unknown>
}

@injectable()
export class HttpOrderRepository implements IOrderRepository {
  baseUrl = env.ordersApiUrl

  constructor(
    @inject('HttpService') protected readonly httpService: HttpService
  ) { }

  async getById(id: string): Promise<Order | null> {
    const order = await this.httpService.get<GetOrderByIdResponseModel>(`${this.baseUrl}/orders/${id}`)

    console.log(order)

    if (!order) return null

    return new Order({})
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    return true
  }
}