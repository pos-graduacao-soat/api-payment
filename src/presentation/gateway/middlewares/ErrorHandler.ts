import { singleton } from 'tsyringe'
import { BusinessError } from '../../../domain/errors/BusinessError'
import { IHttpResponse } from '../../interfaces/IHttpResponse'
import { BusinessToHttpError } from '../errors/BusinessToHttpError'

@singleton()
export class HttpErrorHandler {
  handle(error: Error): IHttpResponse {
    if (error instanceof BusinessError) {
      const parsedError = BusinessToHttpError(error)

      return {
        statusCode: parsedError.statusCode,
        message: parsedError.message,
        body: {
          details: parsedError.details,
          //stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        }
      }
    }

    return {
      statusCode: 500,
      message: 'Internal server error',
      body: { stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
    }
  }
}