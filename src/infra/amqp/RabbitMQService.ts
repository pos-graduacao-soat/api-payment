import * as amqp from 'amqplib'

class RabbitMQService {
  private connection: amqp.Connection
  private channel: amqp.Channel

  constructor(private url: string) { }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url)
      console.log('RabbitMQ connected')
    } catch (err) {
      console.error('Error connecting to RabbitMQ', err)
      throw err
    }
    this.channel = await this.connection.createChannel()
  }

  async publish(exchange: string, routingKey: string, message: string): Promise<void> {
    await this.channel.assertExchange(exchange, 'direct', { durable: true })
    await this.channel.publish(exchange, routingKey, Buffer.from(message))
  }

  async consume(queue: string, callback: (message: amqp.ConsumeMessage | null) => void): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true })
    await this.channel.consume(queue, callback)
  }

  async disconnect(): Promise<void> {
    await this.channel.close()
    await this.connection.close()
  }
}

export default RabbitMQService