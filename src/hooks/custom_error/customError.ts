export class ApiError extends Error {
  constructor(public message: string, public statusCode = 500) {
    super(message);
  }
}

export class ValidationError extends ApiError {
  constructor(public errors: string, statusCode = 400) {
    super("Validation failed", statusCode);
  }
}

export class Unauthorized extends ApiError {
  constructor(message = "Unauthorized ", statusCode = 401) {
    super(message, statusCode);
  }
}
export class NotFoundError extends ApiError {
  constructor(message = "Not Found", statusCode = 404) {
    super(message, statusCode);
  }
}
