import { container } from 'tsyringe'
import { MongoDbClient } from '../infra/database/mongo'
import { MongoPaymentRepository } from '../infra/repositories/mongo/Payment'
import { CreatePaymentUseCase, ICreatePaymentUseCase } from '../domain/usecases'
import { HttpOrderRepository } from '../infra/repositories'
import { HttpService } from '../infra/http/HttpService'
import { IProcessPaymentUseCase } from '../domain/usecases/ProcessPayment/IProcessPayment'
import { ProcessPaymentUseCase } from '../domain/usecases/ProcessPayment/ProcessPayment'
import { env } from './env'

export async function initializeContainer() {
  const mongoDbClientInstance = await MongoDbClient.connect(env.mongoUrl)

  container.registerInstance('MongoDbClient', mongoDbClientInstance)

  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))

  container.registerSingleton('IPaymentRepository', MongoPaymentRepository)
  container.registerSingleton('IOrderRepository', HttpOrderRepository)

  container.register<ICreatePaymentUseCase>('ICreatePaymentUseCase', CreatePaymentUseCase)
  container.register<IProcessPaymentUseCase>('IProcessPaymentUseCase', ProcessPaymentUseCase)
}