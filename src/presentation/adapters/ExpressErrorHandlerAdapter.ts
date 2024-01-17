import { Response, NextFunction } from 'express'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { IHttpResponse } from '../interfaces/IHttpResponse'

const adaptErrorHandler = (httpResponse: IHttpResponse) => {
  return (req: IHttpRequest, res: Response, next: NextFunction) => {

    const envelop = {
      data: httpResponse.body,
      message: httpResponse.message,
    }

    return res.status(httpResponse.statusCode).json(envelop)
  }
}

export { adaptErrorHandler }
