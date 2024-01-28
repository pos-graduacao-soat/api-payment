import 'reflect-metadata'
import { Payment } from '../../../src/domain/entities/Payment'
import { AlreadyExistsError } from '../../../src/domain/errors/AlreadyExists'
import { MissingNecessaryDataError } from '../../../src/domain/errors/MissingNecessaryData'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { IPaymentRepository } from '../../../src/domain/ports/repositories/Payment'
import { CreatePaymentUseCase } from '../../../src/domain/usecases'

describe('CreatePaymentUseCase', () => {
  let paymentRepository: jest.Mocked<IPaymentRepository>
  let orderRepository: jest.Mocked<IOrderRepository>
  let createPaymentUseCase: CreatePaymentUseCase

  beforeEach(() => {
    paymentRepository = {
      create: jest.fn(),
      getById: jest.fn(),
      getByOrderId: jest.fn(),
    } as any

    orderRepository = {
      getById: jest.fn(),
    } as any

    createPaymentUseCase = new CreatePaymentUseCase(paymentRepository, orderRepository)
  })

  it('should throw an error if orderId is missing', async () => {
    await expect(createPaymentUseCase.create({} as any)).rejects.toThrow(MissingNecessaryDataError)
  })

  it('should throw an error if payment already exists for the order', async () => {
    paymentRepository.getByOrderId.mockResolvedValue(new Payment({ orderId: '1' }))

    await expect(createPaymentUseCase.create({ orderId: '1' })).rejects.toThrow(AlreadyExistsError)
  })

  it('should throw an error if order does not exist', async () => {
    paymentRepository.getByOrderId.mockResolvedValue(null)
    orderRepository.getById.mockResolvedValue(null)

    await expect(createPaymentUseCase.create({ orderId: '1' })).rejects.toThrow(NotFoundError)
  })

  it('should create a new payment for the order', async () => {
    paymentRepository.getByOrderId.mockResolvedValue(null)
    orderRepository.getById.mockResolvedValue({} as any)
    paymentRepository.create.mockResolvedValue(true)
    paymentRepository.getById.mockResolvedValue(new Payment({ orderId: '1' }))

    const payment = await createPaymentUseCase.create({ orderId: '1' })

    expect(payment).toBeInstanceOf(Payment)
    expect(paymentRepository.create).toBeCalledTimes(1)
  })
})