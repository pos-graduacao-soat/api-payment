import { BusinessError, BusinessErrorType } from "../../../domain/errors/BusinessError"
import { BadRequest } from "./BadRequest"
import { Conflict } from "./Conflict"
import { HttpError } from "./HttpError"
import { InternalServerError } from "./InternalServerError"
import { NotFound } from "./NotFound"

export function BusinessToHttpError(error: BusinessError): HttpError {
  switch (error.type) {
    case BusinessErrorType.AlreadyExists:
      return new Conflict(error.message)

    case BusinessErrorType.InvalidParam:
    case BusinessErrorType.MissingNecessaryData:
      return new BadRequest(error.message)

    case BusinessErrorType.NotFound:
      return new NotFound(error.message)

    case BusinessErrorType.Unexpected:
    default:
      return new InternalServerError(error.message)
  }
}