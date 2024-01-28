import { badRequest, created, ok } from '../../../src/presentation/adapters/HttpResponseAdapter'
describe('HttpResponseAdapter', () => {
  describe('created', () => {
    it('should return a response with status code 201 and the provided body and message', () => {
      const body = { key: 'value' }
      const message = 'Test message'
      const response = created(body, message)
      expect(response).toEqual({
        statusCode: 201,
        body,
        message,
      })
    })
  })

  describe('ok', () => {
    it('should return a response with status code 200 and the provided body and message', () => {
      const body = { key: 'value' }
      const message = 'Test message'
      const response = ok(body, message)
      expect(response).toEqual({
        statusCode: 200,
        body,
        message,
      })
    })
  })

  describe('badRequest', () => {
    it('should return a response with status code 400 and the provided body and message', () => {
      const body = { key: 'value' }
      const message = 'Test message'
      const response = badRequest(body, message)
      expect(response).toEqual({
        statusCode: 400,
        body,
        message,
      })
    })
  })
})