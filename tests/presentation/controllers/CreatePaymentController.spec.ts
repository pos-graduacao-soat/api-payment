import 'reflect-metadata'
import { CreatePaymentController } from '../../../src/presentation/controllers/CreatePaymentController'
import { ICreatePaymentUseCase } from '../../../src/domain/usecases/index'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'
import { Payment, Status } from '../../../src/domain/entities/Payment'

describe('CreatePaymentController', () => {
  let createPaymentUseCaseMock: jest.Mocked<ICreatePaymentUseCase>
  let controller: CreatePaymentController

  beforeEach(() => {
    createPaymentUseCaseMock = {
      create: jest.fn(),
    }

    controller = new CreatePaymentController(createPaymentUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    url: ''
  }
  it('should return 201 and the payment data when creation is successful', async () => {
    const paymentData = {
      id: '1234',
      orderId: '123345',
      status: Status.PAID,
      code: '123352352',
    }

    mockedHttpRequestParams.body = paymentData

    createPaymentUseCaseMock.create.mockResolvedValue(new Payment(paymentData))

    const response = await controller.handle(mockedHttpRequestParams)

    expect(response.statusCode).toBe(201)
    expect(createPaymentUseCaseMock.create).toHaveBeenCalledWith(paymentData)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
    expect(response.body.orderId).toEqual(paymentData.orderId)
    expect(response.body.status).toEqual(paymentData.status)
    expect(response.body.code).toEqual(paymentData.code)
  })
})