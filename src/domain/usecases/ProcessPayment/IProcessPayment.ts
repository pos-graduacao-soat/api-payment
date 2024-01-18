import { Payment } from '../../entities/Payment'
import { ProcessPaymentDTO } from './ProcessPaymentDTO'

export interface IProcessPaymentUseCase {
  process: (params: ProcessPaymentDTO) => Promise<Payment>
}