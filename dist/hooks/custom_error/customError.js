"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ValidationError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
// export class Unauthorized extends ApiError {
//   constructor(message = "Not Found", statusCode = 401) {
//     super(message, statusCode);
//   }
// }
class ValidationError extends ApiError {
    constructor(errors, statusCode = 400) {
        super("Validation failed", statusCode);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends ApiError {
    constructor(message = "Not Found", statusCode = 404) {
        super(message, statusCode);
    }
}
exports.NotFoundError = NotFoundError;
