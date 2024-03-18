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
import { UpdateOrderPublisher } from '../../../infra/amqp/producers/OrdersPublisher'

@injectable()
export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
  constructor(
    @inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    @inject('UpdateOrderPublisher')
    private readonly updateOrderPublisher: UpdateOrderPublisher
  ) { }

  async process(params: ProcessPaymentDTO): Promise<Payment> {
    const { paymentId, status } = params

    if (!paymentId || !status) throw new MissingNecessaryDataError('Missing necessary params paymentId or status')
    if (!Object.values(Status).includes(status as Status)) throw new InvalidParamError('Invalid status')

    const paymentStatus = status as Status

    const updatedPayment = await this.paymentRepository.updateStatus(paymentId, paymentStatus)

    if (!updatedPayment) throw new Error('Payment not updated')

    const orderNewStatus = this.convertPaymentStatusToOrderStatus(updatedPayment.status)

    const updatedOrder = new Order({ id: updatedPayment.orderId, status: orderNewStatus })

    await this.updateOrderPublisher.publish(JSON.stringify(updatedOrder))

    return updatedPayment
  }

  private convertPaymentStatusToOrderStatus(paymentStatus: Status): OrderStatus {
    switch (paymentStatus) {
      case Status.PAID:
        return OrderStatus.SUCCESSFULPAYMENT
      case Status.NOTPAID:
        return OrderStatus.PAYMENTPROBLEM
      case Status.RECEIVED:
        return OrderStatus.WAITINGPAYMENT
    }
  }
}