import { container } from 'tsyringe'
import { MongoDbClient } from '../infra/database/mongo'
import { MongoPaymentRepository } from '../infra/repositories/mongo/Payment'
import { CreatePaymentUseCase, ICreatePaymentUseCase } from '../domain/usecases'
import { HttpOrderRepository } from '../infra/repositories'
import { HttpService } from '../infra/http/HttpService'
import { IProcessPaymentUseCase } from '../domain/usecases/ProcessPayment/IProcessPayment'
import { ProcessPaymentUseCase } from '../domain/usecases/ProcessPayment/ProcessPayment'
import { env } from './env'
import RabbitMQService from '../infra/amqp/RabbitMQService'
import { UpdateOrderPublisher } from '../infra/amqp/producers/OrdersPublisher'

export async function initializeContainer() {
  const mongoDbClientInstance = await MongoDbClient.connect(env.mongoUrl)
  const rabbitMQService = new RabbitMQService(env.rabbitMQUrl)

  await rabbitMQService.connect()

  container.registerInstance('MongoDbClient', mongoDbClientInstance)
  container.registerInstance('RabbitMQService', rabbitMQService)

  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))

  container.registerSingleton('IPaymentRepository', MongoPaymentRepository)
  container.registerSingleton('IOrderRepository', HttpOrderRepository)

  container.registerSingleton('UpdateOrderPublisher', UpdateOrderPublisher)

  container.register<ICreatePaymentUseCase>('ICreatePaymentUseCase', CreatePaymentUseCase)
  container.register<IProcessPaymentUseCase>('IProcessPaymentUseCase', ProcessPaymentUseCase)
}