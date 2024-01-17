import { MongoClient } from 'mongodb'
import { env } from '../../main/env'

export class MongoDbClient {
  private connection: MongoClient

  constructor(connection: MongoClient) {
    this.connection = connection
  }

  static async connect(): Promise<MongoDbClient> {
    return MongoClient.connect(env.mongoUrl)
      .then(connection => {
        console.log('MongoDB connected successfully')
        return new MongoDbClient(connection)
      })
      .catch((err) => {
        throw new Error(`Failed to connect to MongoDB: ${err}`)
      })
  }

  getCollection(collectionName: string) {
    return this.connection.db().collection(collectionName)
  }
}