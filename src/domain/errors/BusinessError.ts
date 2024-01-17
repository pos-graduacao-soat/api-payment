export abstract class BusinessError extends Error {
  type: BusinessErrorType

  constructor(type: BusinessErrorType, message?: string) {
    super(message)

    this.type = type
  }
}

export enum BusinessErrorType {
  MissingNecessaryData = 'MissingNecessaryData',
  InvalidParam = 'InvalidParam',
  NotFound = 'NotFound',
  AlreadyExists = 'AlreadyExists',
  Unexpected = 'Unexpected'
}