import { BusinessError, BusinessErrorType } from "./BusinessError"

export class MissingNecessaryDataError extends BusinessError {
  constructor(message?: string) {
    super(BusinessErrorType.MissingNecessaryData)

    this.name = 'MissingNecessaryDataError'
    this.message = message ?? 'Missing necessary data'
  }
}