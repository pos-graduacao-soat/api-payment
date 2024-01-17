import 'reflect-metadata'
import { GetCustomerByIdController } from '../../../src/presentation/controllers/GetCustomerByIdController'
import { IGetCustomerByIdUseCase } from '../../../src/domain/usecases/GetCustomerById/IGetCustomer'
import { Customer } from '../../../src/domain/entities/Customer'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'

describe('GetCustomerByIdController', () => {
  let getCustomerByIdUseCaseMock: jest.Mocked<IGetCustomerByIdUseCase>
  let controller: GetCustomerByIdController

  beforeEach(() => {
    getCustomerByIdUseCaseMock = {
      get: jest.fn(),
    }

    controller = new GetCustomerByIdController(getCustomerByIdUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    body: {},
    params: {
      customerId: '123'
    },
    query: {},
    headers: {},
    method: 'GET',
    url: ''
  }

  it('should return a customer if it exists', async () => {
    const customer = new Customer({ id: '123', name: 'John Doe', email: 'fake@email.com' })

    getCustomerByIdUseCaseMock.get.mockResolvedValue(customer)

    const result = await controller.handle(mockedHttpRequestParams)

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(customer)
  })
})