import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoPaymentRepository } from '../../../../src/infra/repositories/mongo/Payment'
import { MongoDbClient } from '../../../../src/infra/database/mongo'
import { Payment, Status } from '../../../../src/domain/entities/Payment'

describe('Payment Mongo Repository Integration Tests', () => {
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
    await client.db().collection('payments').deleteMany({})
  })

  function insertPayment(payment: Payment) {
    return client.db().collection('payments').insertOne({
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      code: payment.code,
    })
  }

  describe('create', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        id: '1234',
        orderId: '123345',
        status: Status.PAID,
        code: '123352352',
      }

      const mockedPayment = new Payment(paymentData)

      const paymentRepository = new MongoPaymentRepository(mongoDbClient)
      const created = await paymentRepository.create(mockedPayment)

      expect(created).toBe(true)
    })
  })

  describe('getById', () => {
    it('should get a payment by ID', async () => {
      const paymentData = {
        id: '1234',
        orderId: '123345',
        status: Status.PAID,
        code: '123352352',
      }

      const mockedPayment = new Payment(paymentData)

      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      await insertPayment(mockedPayment)

      const payment = await paymentRepository.getById(mockedPayment.id)

      expect(payment).toBeDefined()
      expect(payment?.orderId).toBe(mockedPayment.orderId)
      expect(payment?.status).toBe(mockedPayment.status)
      expect(payment?.code).toBe(mockedPayment.code)
    })

    it('should return null if payment is not found', async () => {
      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      const payment = await paymentRepository.getById('12345')

      expect(payment).toBeNull()
    })
  })

  describe('updateStatus', () => {
    it('should return null if payment is not found', async () => {
      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      const payment = await paymentRepository.updateStatus('12345', Status.PAID)

      expect(payment).toBeNull()
    })

    it('should update existing payment status', async () => {
      const paymentData = {
        id: '1234',
        orderId: '123345',
        status: Status.PAID,
        code: '123352352',
      }

      const mockedPayment = new Payment(paymentData)

      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      await insertPayment(mockedPayment)

      const currentPayment = await mongoDbClient.getCollection('payments').findOne({ id: mockedPayment.id })

      expect(currentPayment?.status).toBe(Status.PAID)

      const updatedPayment = await paymentRepository.updateStatus(mockedPayment.id, Status.NOTPAID)

      expect(updatedPayment).toBeDefined()
      expect(updatedPayment?.status).toBe(Status.NOTPAID)
    })
  })


  describe('getByOrderId', () => {
    it('should get a payment by order ID', async () => {
      const paymentData = {
        id: '1234',
        orderId: '123345',
        status: Status.PAID,
        code: '123352352',
      }

      const mockedPayment = new Payment(paymentData)

      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      await insertPayment(mockedPayment)

      const payment = await paymentRepository.getByOrderId(mockedPayment.orderId)

      expect(payment).toBeDefined()
      expect(payment?.orderId).toBe(mockedPayment.orderId)
      expect(payment?.status).toBe(mockedPayment.status)
      expect(payment?.code).toBe(mockedPayment.code)
    })

    it('should return null if payment is not found', async () => {
      const paymentRepository = new MongoPaymentRepository(mongoDbClient)

      const payment = await paymentRepository.getByOrderId('12345')

      expect(payment).toBeNull()
    })
  })
})
