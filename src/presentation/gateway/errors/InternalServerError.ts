import { HttpError } from "./HttpError";

export class InternalServerError extends HttpError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 500, details);
  }
}