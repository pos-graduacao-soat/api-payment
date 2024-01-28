import { IController } from '../../../src/presentation/interfaces/IController'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'
import { adaptRoute } from '../../../src/presentation/adapters/ExpressRouteAdapter'
import { IHttpResponse } from '../../../src/presentation/interfaces/IHttpResponse'
import { NextFunction, Response } from 'express'

describe('ExpressRouteAdapter', () => {
  let controller: jest.Mocked<IController>
  let req: Partial<IHttpRequest>
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

    controller = {
      handle: jest.fn(),
    }

    req = {
      url: '/test',
      method: 'GET',
      headers: {},
      params: {},
      query: {},
      body: {},
    }

    next = jest.fn()
  })

  it('should call controller.handle with the correct request', async () => {
    const httpResponse: IHttpResponse = {
      statusCode: 200,
      body: { key: 'value' },
      message: 'Success',
    }

    controller.handle.mockResolvedValueOnce(httpResponse)

    const route = adaptRoute(controller)

    await route(req as IHttpRequest, res, next)

    expect(controller.handle).toHaveBeenCalledWith(req)
  })

  it('should call res.status and res.json with the correct response', async () => {
    const httpResponse: IHttpResponse = {
      statusCode: 200,
      body: { key: 'value' },
      message: 'Success',
    }

    controller.handle.mockResolvedValueOnce(httpResponse)

    const route = adaptRoute(controller)

    await route(req as IHttpRequest, res, next)

    expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
    expect(res.json).toHaveBeenCalledWith({
      data: httpResponse.body,
      message: httpResponse.message,
    })
  })

  it.skip('should call next with the error if controller.handle throws', async () => {
    const error = new Error('Test error')

    controller.handle.mockRejectedValueOnce(error)

    const route = adaptRoute(controller)

    await route(req as IHttpRequest, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})