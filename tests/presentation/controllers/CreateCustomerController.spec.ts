import 'reflect-metadata'
import { CreateCustomerController } from '../../../src/presentation/controllers/CreateCustomerController'
import { ICreateCustomerUseCase } from '../../../src/domain/usecases'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'
import { Customer } from '../../../src/domain/entities/Customer'

describe('CreateCustomerController', () => {
  let createCustomerUseCaseMock: jest.Mocked<ICreateCustomerUseCase>
  let controller: CreateCustomerController

  beforeEach(() => {
    createCustomerUseCaseMock = {
      create: jest.fn(),
    }

    controller = new CreateCustomerController(createCustomerUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    url: ''
  }
  it('should return 201 and the customer data when creation is successful', async () => {
    const mockedCustomerData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      documentNumber: '123456789',
    }

    mockedHttpRequestParams.body = mockedCustomerData

    createCustomerUseCaseMock.create.mockResolvedValue(new Customer(mockedCustomerData))

    const response = await controller.handle(mockedHttpRequestParams)

    expect(response.statusCode).toBe(201)
    expect(createCustomerUseCaseMock.create).toHaveBeenCalledWith(mockedCustomerData)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
    expect(response.body.name).toEqual(mockedCustomerData.name)
    expect(response.body.email).toEqual(mockedCustomerData.email)
    expect(response.body.documentNumber).toEqual(mockedCustomerData.documentNumber)
  })
})