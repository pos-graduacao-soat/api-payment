import { BusinessError, BusinessErrorType } from './BusinessError'

export class NotFoundError extends BusinessError {
  constructor(message?: string) {
    super(BusinessErrorType.NotFound)

    this.name = 'NotFoundError'
    this.message = message ?? 'Entity not found'
  }
}