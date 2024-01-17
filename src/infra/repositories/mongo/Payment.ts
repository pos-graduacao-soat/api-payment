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
      status: payment.status
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

  async updateStatus(id: string, status: Status): Promise<boolean> {
    const isUpdated = await this.collection.findOneAndUpdate({ id }, { $set: { status, updated_at: new Date() } })

    return isUpdated?._id ? true : false
  }
}