import { inject, injectable } from 'tsyringe'
import { ICreatePaymentUseCase } from './ICreatePayment'
import { CreatePaymentDTO } from './CreatePaymentDTO'
import { Payment } from '../../entities/Payment'
import { IOrderRepository } from '../../ports/repositories/Order'
import { NotFoundError } from '../../errors/NotFoundError'
import { Order } from '../../valueObjects/Order'
import { IPaymentRepository } from '../../ports/repositories/Payment'

@injectable()
export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  constructor(
    @inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async create(params: CreatePaymentDTO): Promise<Payment> {
    const { orderId } = params

    await this.doesOrderExists(orderId)

    const payment = this.createPaymentObject(orderId)

    const isCreated = await this.paymentRepository.create(payment)

    if (!isCreated) throw new Error('Payment not created')

    const createdPayment = await this.paymentRepository.getById(payment.id)

    return createdPayment!
  }

  private async doesOrderExists(orderId: string): Promise<Order> {
    const foundOrder = await this.orderRepository.getById(orderId)

    if (!foundOrder) throw new NotFoundError('Order not found.')

    return foundOrder
  }

  private createPaymentObject(orderId: string): Payment {
    const payment = new Payment({ orderId })

    payment.code = this.generatePaymentCode()

    return payment
  }

  private generatePaymentCode(): string {
    const length = 10
    let paymentCode = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      paymentCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return paymentCode
  }
}