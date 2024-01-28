import 'reflect-metadata'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import { Server } from 'http'

import { startHttpServer } from '../../../src/presentation/gateway/httpServer'
import { initializeContainer } from '../../../src/main/factories'
import { Payment, Status } from '../../../src/domain/entities/Payment'
import { HttpService } from '../../../src/infra/http/HttpService'
import { Order, Status as OrderStatus } from '../../../src/domain/valueObjects/Order'
import { container } from 'tsyringe'

jest.mock('../../../src/infra/http/HttpService')

let mongoServer: MongoMemoryServer
let client: MongoClient

describe('Payment Routes', () => {
  let httpService: jest.Mocked<HttpService>
  let server: Server

  beforeAll(async () => {
    httpService = {
      get: jest.fn(),
      patch: jest.fn(),
      axiosInstance: {} as any
    } as unknown as jest.Mocked<HttpService>
    container.register('HttpService', { useValue: httpService })

    mongoServer = new MongoMemoryServer({
      instance: { port: 27017, dbName: 'jest' }
    })
    await mongoServer.start()

    const mongoUri = mongoServer.getUri()
    client = new MongoClient(mongoUri, {})

    await client.connect()

    await initializeContainer()
    server = startHttpServer()
  })

  afterAll((done) => {
    server.close(() => {
      client.close().then(() => {
        mongoServer.stop().then(() => done())
      })
    })
  })

  beforeEach(async () => {
    await client.db().collection('payments').deleteMany({})
  })

  async function createPayment(params: Partial<Payment>) {
    const payment = new Payment({ ...params })

    await client.db().collection('payments').insertOne(payment)

    return payment
  }

  describe('POST /payments', () => {
    it('should respond with a 400 if payment data is missing', async () => {
      const response = await request(server).post('/payment')
      expect(response.status).toBe(400)
    })

    it('should respond with a 409 if payment is already found with email and name', async () => {
      const payment = await createPayment({ orderId: '12345', code: '12345', status: Status.PAID, id: '12345' })

      const response = await request(server).post('/payment').send({ orderId: payment.orderId, code: payment.code, status: payment.status, id: payment.id })
      expect(response.status).toBe(409)
    })

    it.skip('should respond with a 404 if order is not found at orders service', async () => {
      const payment = new Payment({ orderId: '12345', code: '12345', status: Status.PAID, id: '12345' })
      const order = new Order({ id: payment.orderId, totalPrice: 1000, status: OrderStatus.WAITINGPAYMENT, products: [{ id: '123', quantity: 1 }] })

      httpService.get.mockResolvedValue({ status: 404, data: order } as any)
      container.register('HttpService', { useValue: httpService })

      const response = await request(server).post('/payment').send({ orderId: payment.orderId, code: payment.code, status: payment.status, id: payment.id })
      console.log(response.body)
      expect(response.status).toBe(404)
    })

    it.skip('should respond with a 201 and the data if payment is created correctly', async () => {
      const payment = new Payment({ orderId: '12345', code: '12345', status: Status.PAID, id: '12345' })
      const order = new Order({ id: payment.orderId, totalPrice: 1000, status: OrderStatus.WAITINGPAYMENT, products: [{ id: '123', quantity: 1 }] })

      httpService.get.mockResolvedValue({ status: 200, data: order } as any)

      const response = await request(server).post('/payment').send({ orderId: payment.orderId, code: payment.code, status: payment.status, id: payment.id })

      expect(httpService.get).toHaveBeenCalled()

      expect(response.status).toBe(201)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toEqual(payment.id)
    })
  })

  describe('PATCH /payment/process', () => {
    it('should respond with a 400 if order id is missing', async () => {
      const response = await request(server).post('/payment/process').send({ status: Status.PAID })
      expect(response.status).toBe(400)
    })

    it('should respond with a 400 if status is missing', async () => {
      const response = await request(server).post('/payment/process').send({ paymentId: '123' })
      expect(response.status).toBe(400)
    })

    it('should respond with a 400 if status is invalid', async () => {
      const response = await request(server).post('/payment/process').send({ paymentId: '123', status: 'invalid' })
      expect(response.status).toBe(400)
    })
  })
})