import 'reflect-metadata'
import { Customer } from '../../../src/domain/entities/Customer'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'
import { ICustomerRepository } from '../../../src/domain/ports/repositories/Customer'
import { GetCustomerByIdUseCase } from '../../../src/domain/usecases/GetCustomerById/GetCustomerById'

describe('GetCustomerByIdUseCase', () => {
  let customerRepositoryMock: jest.Mocked<ICustomerRepository>
  let useCase: GetCustomerByIdUseCase

  beforeEach(() => {
    customerRepositoryMock = {
      getById: jest.fn(),
      create: jest.fn(),
      getByDocumentNumber: jest.fn(),
      getByEmail: jest.fn(),
    }

    useCase = new GetCustomerByIdUseCase(customerRepositoryMock)
  })

  it('should return a customer if it exists', async () => {
    const customer = new Customer({ id: '123', name: 'John Doe', email: 'fake@email.com' })

    customerRepositoryMock.getById.mockResolvedValue(customer)

    const result = await useCase.get({ customerId: '123' })

    expect(result).toBe(customer)
    expect(customerRepositoryMock.getById).toHaveBeenCalledWith('123')
  })

  it('should throw a NotFoundError if the customer does not exist', async () => {
    customerRepositoryMock.getById.mockResolvedValue(null)

    await expect(useCase.get({ customerId: '123' })).rejects.toThrow(NotFoundError)
    expect(customerRepositoryMock.getById).toHaveBeenCalledWith('123')
  })
})