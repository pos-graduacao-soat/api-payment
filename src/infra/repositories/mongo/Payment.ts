import { inject, injectable } from 'tsyringe'
import { MongoDbClient } from '../../database/mongo'
import { Collection } from 'mongodb'
import { Payment, Status } from '../../../domain/entities/Payment'
import { IPaymentRepository } from '../../../domain/ports/repositories/Payment'

@injectable()
export class MongoPaymentRepository implements IPaymentRepository {
  private readonly collection: Collection

  constructor(
    @inject('MongoDbClient') protected readonly mongoDbClient: MongoDbClient
  ) {
    this.collection = this.mongoDbClient.getCollection('payments')
  }
  async create(payment: Payment): Promise<boolean> {
    const createdPayment = await this.collection.insertOne({
      id: payment.id,
      orderId: payment.orderId,
      code: payment.code,
      status: payment.status,
      createdAt: payment.createdAt,
    })

    return createdPayment.acknowledged
  }

  async getById(id: string): Promise<Payment | null> {
    const payment = await this.collection.findOne({ id })

    if (!payment) return null

    return new Payment({
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      id: payment.id,
      code: payment.code,
      status: payment.status,
      orderId: payment.orderId
    })
  }

  async updateStatus(id: string, status: Status): Promise<Payment | null> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) return null

    return new Payment({
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      id: result.id,
      code: result.code,
      status: result.status,
      orderId: result.orderId
    })
  }

  async getByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.collection.findOne({ orderId })

    if (!payment) return null

    return new Payment({
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      id: payment.id,
      code: payment.code,
      status: payment.status,
      orderId: payment.orderId
    })
  }
}