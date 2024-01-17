import { HttpError } from "./HttpError";

export class BadRequest extends HttpError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, details);
  }
}
