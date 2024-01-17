import { HttpError } from "./HttpError";

export class NotFound extends HttpError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 404, details);
  }
}