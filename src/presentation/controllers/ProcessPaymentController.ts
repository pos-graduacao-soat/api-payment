import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { IProcessPaymentUseCase } from '../../domain/usecases'

@injectable()
export class ProcessPaymentController implements IController {
  constructor(
    @inject('IProcessPaymentUseCase')
    readonly processPaymentUseCase: IProcessPaymentUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { paymentId, status } = httpRequest.body

    const result = await this.processPaymentUseCase.process({ paymentId, status })

    return ok(result)
  }
} 