import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoDbClient } from '../../../src/infra/database/mongo'

describe('MongoDbClient', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    await mongoServer.start()
  })

  afterAll(async () => {
    await mongoServer.stop()
  })

  describe('connect', () => {
    it('should connect to the database', async () => {
      const client = await MongoDbClient.connect(mongoServer.getUri())

      expect(client).toBeInstanceOf(MongoDbClient)
    })

    it('should throw an error if connection is not established', async () => {
      await expect(MongoDbClient.connect('invalid-url')).rejects.toThrow()
    })
  })

  describe('getCollection', () => {
    it('should get a collection from the database', async () => {
      const mongoDbClient = await MongoDbClient.connect(mongoServer.getUri())
      const collection = mongoDbClient.getCollection('test')
      expect(collection).toBeDefined()
    })
  })
})