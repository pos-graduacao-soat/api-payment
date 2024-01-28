import 'reflect-metadata'
import { Payment, Status } from '../../../src/domain/entities/Payment'
import { Status as OrderStatus } from '../../../src/domain/valueObjects/Order'
import { InvalidParamError } from '../../../src/domain/errors/InvalidParam'
import { MissingNecessaryDataError } from '../../../src/domain/errors/MissingNecessaryData'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { IPaymentRepository } from '../../../src/domain/ports/repositories/Payment'
import { ProcessPaymentUseCase } from '../../../src/domain/usecases'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'


describe('ProcessPaymentUseCase', () => {
  let paymentRepository: jest.Mocked<IPaymentRepository>
  let orderRepository: jest.Mocked<IOrderRepository>
  let processPaymentUseCase: ProcessPaymentUseCase

  beforeEach(() => {
    paymentRepository = {
      updateStatus: jest.fn(),
    } as any

    orderRepository = {
      updateStatus: jest.fn(),
    } as any

    processPaymentUseCase = new ProcessPaymentUseCase(paymentRepository, orderRepository)
  })

  it('should throw an error if paymentId or status is missing', async () => {
    await expect(processPaymentUseCase.process({} as any)).rejects.toThrow(MissingNecessaryDataError)
  })

  it('should throw an error if status is invalid', async () => {
    await expect(processPaymentUseCase.process({ paymentId: '1', status: 'INVALID' } as any)).rejects.toThrow(InvalidParamError)
  })

  it('should update the payment status to PAID and order status to SUCCESSFULPAYMENT', async () => {
    paymentRepository.updateStatus.mockResolvedValue(new Payment({ id: '1', status: Status.PAID, orderId: '1' }))
    orderRepository.updateStatus.mockResolvedValue(true)

    const payment = await processPaymentUseCase.process({ paymentId: '1', status: Status.PAID })

    expect(payment).toBeInstanceOf(Payment)
    expect(paymentRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledWith('1', OrderStatus.SUCCESSFULPAYMENT)
  })

  it('should update the payment status to NOTPAID and order status to PAYMENTPROBLEM', async () => {
    paymentRepository.updateStatus.mockResolvedValue(new Payment({ id: '1', status: Status.NOTPAID, orderId: '1' }))
    orderRepository.updateStatus.mockResolvedValue(true)

    const payment = await processPaymentUseCase.process({ paymentId: '1', status: Status.NOTPAID })

    expect(payment).toBeInstanceOf(Payment)
    expect(paymentRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledWith('1', OrderStatus.PAYMENTPROBLEM)
  })
  it('should update the payment status to RECEIVED and order status to WAITINGPAYMENT', async () => {
    paymentRepository.updateStatus.mockResolvedValue(new Payment({ id: '1', status: Status.RECEIVED, orderId: '1' }))
    orderRepository.updateStatus.mockResolvedValue(true)

    const payment = await processPaymentUseCase.process({ paymentId: '1', status: Status.RECEIVED })

    expect(payment).toBeInstanceOf(Payment)
    expect(paymentRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledTimes(1)
    expect(orderRepository.updateStatus).toBeCalledWith('1', OrderStatus.WAITINGPAYMENT)
  })

  it('should throw an error if order is not found', async () => {
    paymentRepository.updateStatus.mockResolvedValue(new Payment({ id: '1', status: Status.PAID, orderId: '1' }))
    orderRepository.updateStatus.mockResolvedValue(false)

    await expect(processPaymentUseCase.process({ paymentId: '1', status: Status.PAID })).rejects.toThrow(NotFoundError)
  })
})