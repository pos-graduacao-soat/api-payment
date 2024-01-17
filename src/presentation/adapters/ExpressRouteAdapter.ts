import { Response, NextFunction } from 'express'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'

const adaptRoute = (controller: IController) => {
  return (req: IHttpRequest, res: Response, next: NextFunction) => {
    const httpRequest: IHttpRequest = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
      files: req.files,
      file: req.file,
      token: req.token
    }
    controller
      .handle(httpRequest)
      .then(httpResponse => {
        const envelop = {
          data: httpResponse.body,
          message: httpResponse.message,
        }

        res.status(httpResponse.statusCode).json(envelop)
      })
      .catch(error => {
        next(error)
      })
  }
}

export { adaptRoute }
