import { IHttpResponse } from '../../../src/presentation/interfaces/IHttpResponse'
import { adaptErrorHandler } from '../../../src/presentation/adapters/ExpressErrorHandlerAdapter'

describe('ExpressErrorHandlerAdapter', () => {
  let httpResponse: IHttpResponse
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    httpResponse = {
      statusCode: 200,
      body: { key: 'value' },
      message: 'Success'
    }

    req = {}

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    next = jest.fn()
  })

  it('should call res.status with the correct status code', () => {
    adaptErrorHandler(httpResponse)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
  })

  it('should call res.json with the correct body', () => {
    adaptErrorHandler(httpResponse)(req, res, next)

    const expectedBody = {
      data: httpResponse.body,
      message: httpResponse.message,
    }

    expect(res.json).toHaveBeenCalledWith(expectedBody)
  })
})