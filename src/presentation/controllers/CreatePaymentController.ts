import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { created } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { ICreatePaymentUseCase } from '../../domain/usecases'

@injectable()
export class CreatePaymentController implements IController {
  constructor(
    @inject('ICreatePaymentUseCase')
    readonly createPaymentUseCase: ICreatePaymentUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { orderId } = httpRequest.body

    const result = await this.createPaymentUseCase.create({ orderId })

    return created(result)
  }
} 