import { Payment } from '../../entities/Payment'
import { CreatePaymentDTO } from './CreatePaymentDTO'

export interface ICreatePaymentUseCase {
  create: (params: CreatePaymentDTO) => Promise<Payment>
}