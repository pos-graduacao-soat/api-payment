import * as amqp from 'amqplib'
import RabbitMQService from '../../../src/infra/amqp/RabbitMQService'

jest.mock('amqplib', () => {
  const mockChannel = {
    assertExchange: jest.fn(),
    publish: jest.fn(),
    assertQueue: jest.fn(),
    consume: jest.fn(),
    close: jest.fn(),
    ack: jest.fn(),
    nack: jest.fn(),
  }
  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
    close: jest.fn(),
  }
  return {
    connect: jest.fn().mockResolvedValue(mockConnection),
  }
})

describe('RabbitMQService', () => {
  const url = 'amqp://localhost'
  let service: RabbitMQService

  beforeEach(() => {
    service = new RabbitMQService(url)
  })

  it('should connect to RabbitMQ', async () => {
    await service.connect()
    expect(amqp.connect).toHaveBeenCalledWith(url)
  })

  it('should publish a message', async () => {
    await service.connect()

    const exchange = 'exchange'
    const routingKey = 'routingKey'
    const message = 'message'
    await service.publish(exchange, routingKey, message)
    expect(service['channel'].assertExchange).toHaveBeenCalledWith(exchange, 'direct', { durable: true })
    expect(service['channel'].publish).toHaveBeenCalledWith(exchange, routingKey, Buffer.from(message))
  })

  it('should consume a queue', async () => {
    await service.connect()

    const queue = 'queue'
    const callback = jest.fn()
    await service.consume(queue, callback)
    expect(service['channel'].assertQueue).toHaveBeenCalledWith(queue, { durable: true })
    expect(service['channel'].consume).toHaveBeenCalledWith(queue, callback)
  })

  it('should disconnect from RabbitMQ', async () => {
    await service.connect()
    await service.disconnect()
    expect(service['channel'].close).toHaveBeenCalled()
    expect(service['connection'].close).toHaveBeenCalled()
  })
})