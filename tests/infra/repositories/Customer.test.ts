import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { CustomerRepository } from '../../../src/infra/repositories/mongo/Payment'
import { MongoDbClient } from '../../../src/infra/database/mongo'
import { Customer } from '../../../src/domain/entities/Customer'

describe('Customer Repository Integration Tests', () => {
  let mongoServer: MongoMemoryServer
  let client: MongoClient
  let mongoDbClient: MongoDbClient

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    await mongoServer.start()

    const mongoUri = mongoServer.getUri()
    client = new MongoClient(mongoUri, {})

    await client.connect()

    mongoDbClient = new MongoDbClient(client)
  })

  afterAll(async () => {
    await client.close()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await client.db().collection('customers').deleteMany({})
  })

  function insertCustomer(customer: Customer) {
    return client.db().collection('customers').insertOne({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      documentNumber: customer.documentNumber,
    })
  }

  describe('create', () => {
    it('should create a new customer', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        documentNumber: '123456789',
      }

      const mockedCustomer = new Customer(customerData)

      const customerRepository = new CustomerRepository(mongoDbClient)
      const created = await customerRepository.create(mockedCustomer)

      expect(created).toBe(true)
    })
  })

  describe('getById', () => {
    it('should get a customer by ID', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        documentNumber: '123456789',
      }

      const mockedCustomer = new Customer(customerData)

      const customerRepository = new CustomerRepository(mongoDbClient)

      await insertCustomer(mockedCustomer)

      const customer = await customerRepository.getById(mockedCustomer.id)

      expect(customer).toBeDefined()
      expect(customer?.name).toBe('John Doe')
    })

    it('should return null if customer is not found', async () => {
      const customerRepository = new CustomerRepository(mongoDbClient)

      const customer = await customerRepository.getById('12345')

      expect(customer).toBeNull()
    })
  })

  describe('getByDocumentNumber', () => {
    it('should get a customer by document number', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        documentNumber: '123456789',
      }

      const mockedCustomer = new Customer(customerData)

      const customerRepository = new CustomerRepository(mongoDbClient)

      await insertCustomer(mockedCustomer)

      const customer = await customerRepository.getByDocumentNumber(mockedCustomer.documentNumber!)

      expect(customer).toBeDefined()
      expect(customer?.name).toBe('John Doe')
      expect(customer?.documentNumber).toBe('123456789')
    })

    it('should return null if customer is not found', async () => {
      const customerRepository = new CustomerRepository(mongoDbClient)

      const customer = await customerRepository.getByDocumentNumber('12345')

      expect(customer).toBeNull()
    })
  })

  describe('getByDocumentNumber', () => {
    it('should get a customer by email', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        documentNumber: '123456789',
      }

      const mockedCustomer = new Customer(customerData)

      const customerRepository = new CustomerRepository(mongoDbClient)

      await insertCustomer(mockedCustomer)

      const customer = await customerRepository.getByEmail(mockedCustomer.email!)

      expect(customer).toBeDefined()
      expect(customer?.name).toBe('John Doe')
      expect(customer?.email).toBe('johndoe@example.com')
    })

    it('should return null if customer is not found', async () => {
      const customerRepository = new CustomerRepository(mongoDbClient)

      const customer = await customerRepository.getByEmail('email')

      expect(customer).toBeNull()
    })
  })
})
