import { inject, injectable } from 'tsyringe'
import { IProcessPaymentUseCase } from './IProcessPayment'
import { Payment, Status } from '../../entities/Payment'
import { IOrderRepository } from '../../ports/repositories/Order'
import { NotFoundError } from '../../errors/NotFoundError'
import { Order, Status as OrderStatus } from '../../valueObjects/Order'
import { IPaymentRepository } from '../../ports/repositories/Payment'
import { MissingNecessaryDataError } from '../../errors/MissingNecessaryData'
import { ProcessPaymentDTO } from './ProcessPaymentDTO'
import { InvalidParamError } from '../../errors/InvalidParam'

@injectable()
export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
  constructor(
    @inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async process(params: ProcessPaymentDTO): Promise<Payment> {
    const { paymentId, status } = params

    if (!paymentId || !status) throw new MissingNecessaryDataError('Missing necessary params paymentId or status')
    if (!Object.values(Status).includes(status as Status)) throw new InvalidParamError('Invalid status')

    const paymentStatus = status as Status

    const updatedPayment = await this.paymentRepository.updateStatus(paymentId, paymentStatus)

    if (!updatedPayment) throw new Error('Payment not updated')

    await this.updateOrderStatus(updatedPayment.orderId, updatedPayment.status)

    return updatedPayment
  }

  private async updateOrderStatus(orderId: string, updatedPaymentStatus: Status): Promise<void> {
    const updatedOrderStatus = this.convertPaymentStatusToOrderStatus(updatedPaymentStatus)

    const isUpdated = await this.orderRepository.updateStatus(orderId, updatedOrderStatus)

    if (!isUpdated) throw new NotFoundError('Order not found.')
  }

  private convertPaymentStatusToOrderStatus(paymentStatus: Status): OrderStatus {
    switch (paymentStatus) {
      case Status.PAID:
        return OrderStatus.SUCCESSFULPAYMENT
      case Status.NOTPAID:
        return OrderStatus.PAYMENTPROBLEM
      case Status.RECEIVED:
        return OrderStatus.WAITINGPAYMENT
      default:
        throw new Error('Invalid payment status')
    }
  }
}