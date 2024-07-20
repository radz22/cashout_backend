"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const customError_1 = require("../hooks/custom_error/customError");
function errorHandler(err, // Handle both built-in and custom errors
req, res, next) {
    console.error(err.stack); // Log the error for debugging
    // Check for specific error types and handle them accordingly
    if (err instanceof customError_1.ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else if (err.name === "UnauthorizedError") {
        // Handle authentication errors
        res.status(401).json({ error: "Unauthorized" });
    }
    else {
        // Fallback for unhandled errors
        res.status(500).json({ error: "Internal Server Error" });
    }
}
