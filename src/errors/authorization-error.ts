import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized.",
    public statusCode = 401,
  ) {
    super(message, statusCode);
  }
}
