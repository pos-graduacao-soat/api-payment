import 'reflect-metadata'
import { ProcessPaymentController } from '../../../src/presentation/controllers/ProcessPaymentController'
import { IProcessPaymentUseCase } from '../../../src/domain/usecases'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'
import { Payment, Status } from '../../../src/domain/entities/Payment'

describe('ProcessPaymentßController', () => {
  let processPaymentUseCaseMock: jest.Mocked<IProcessPaymentUseCase>
  let controller: ProcessPaymentController

  beforeEach(() => {
    processPaymentUseCaseMock = {
      process: jest.fn(),
    }

    controller = new ProcessPaymentController(processPaymentUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    params: {},
    body: {
      paymentId: '123',
      status: 'PAID'
    },
    query: {},
    headers: {},
    method: 'POST',
    url: ''
  }

  it('should return 200 and the payment data with a correct processed payment', async () => {
    processPaymentUseCaseMock.process.mockResolvedValue(new Payment({ id: mockedHttpRequestParams.body.paymentId, status: Status.PAID }))

    const response = await controller.handle(mockedHttpRequestParams)

    expect(response.statusCode).toBe(200)
    expect(processPaymentUseCaseMock.process).toHaveBeenCalledWith({ paymentId: mockedHttpRequestParams.body.paymentId, status: Status.PAID })

    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toEqual(mockedHttpRequestParams.body.paymentId)
    expect(response.body.status).toEqual(Status.PAID)
  })
})