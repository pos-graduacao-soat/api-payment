import { BusinessError, BusinessErrorType } from './BusinessError'

export class AlreadyExistsError extends BusinessError {
  constructor(message?: string) {
    super(BusinessErrorType.AlreadyExists)

    this.name = 'AlreadyExistsError'
    this.message = message ?? 'Entity already exists'
  }
}