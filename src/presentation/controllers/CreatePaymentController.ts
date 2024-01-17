import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { CreatePaymentUseCase } from '../../domain/usecases'

@injectable()
export class CreatePaymentController implements IController {
  constructor(
    @inject('ICreatePaymentUseCase')
    readonly createPaymentUseCase: CreatePaymentUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { orderId } = httpRequest.body

    const result = await this.createPaymentUseCase.create({ orderId })

    return ok(result)
  }
} 