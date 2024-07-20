import { NextFunction, Request, Response } from "express";
import { ApiError } from "../hooks/custom_error/customError";
export default function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
