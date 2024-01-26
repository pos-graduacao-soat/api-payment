import { MongoClient } from 'mongodb'
export class MongoDbClient {
  private connection: MongoClient

  constructor(connection: MongoClient) {
    this.connection = connection
  }

  static async connect(url: string): Promise<MongoDbClient> {
    return MongoClient.connect(url)
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