import ApiError from "../utils/ApiError.js";

// Catches any request that didn't match a route and forwards a 404
export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler — must be the LAST middleware in app.js
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : "Duplicate value";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired session. Please log in again.";
  }

  const isOperational = err instanceof ApiError || statusCode < 500;

  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (process.env.NODE_ENV === "production" && !isOperational) {
    statusCode = 500;
    message = "Something went wrong. Please try again later.";
    errors = [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}