import { Request, Response, NextFunction } from "express";

/**
 * Custom app error to control status codes + messages
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global error handler (must be the LAST middleware in app)
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If headers already sent, let Express handle it
  if (res.headersSent) {
    return next(err);
  }

  // Default values
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Internal Server Error";
  let errors: Record<string, string> | undefined;

  // Mongoose: invalid ObjectId, cast errors etc.
  if (err?.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose validation errors (required, minlength etc.)
  if (err?.name === "ValidationError" && err?.errors) {
    statusCode = 400;
    message = "Validation failed";
    errors = {};
    for (const key of Object.keys(err.errors)) {
      errors[key] = err.errors[key]?.message || "Invalid value";
    }
  }

  // Mongo duplicate key errors (unique fields)
  // Usually err.code === 11000
  if (err?.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {});
    message = `Duplicate value for: ${fields.join(", ")}`;
    errors = {};
    for (const field of fields) {
      errors[field] = `${field} already exists`;
    }
  }

  // Optional: log server errors
  if (statusCode >= 500) {
    console.error("🔥 Server Error:", {
      message,
      stack: err?.stack,
      path: req.path,
      method: req.method,
    });
  }

  return res.status(statusCode).json({
    message,
    statusCode,
    ...(errors ? { errors } : {}),
  });
}
