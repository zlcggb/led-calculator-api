/**
 * Error Handling Middleware
 * Returns structured error responses
 * Requirements: 5.1
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

/**
 * Custom API Error class with error code support
 */
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Predefined error codes as per design document
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CABINET_LIMIT_EXCEEDED: 'CABINET_LIMIT_EXCEEDED',
  SCREEN_SIZE_EXCEEDED: 'SCREEN_SIZE_EXCEEDED',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Factory functions for common errors
 */
export const createValidationError = (message: string, details?: unknown): ApiError => {
  return new ApiError(400, ErrorCodes.VALIDATION_ERROR, message, details);
};

export const createCabinetLimitError = (count: number): ApiError => {
  return new ApiError(
    400,
    ErrorCodes.CABINET_LIMIT_EXCEEDED,
    `Total cabinet count (${count}) exceeds maximum limit of 1000`,
    { count, limit: 1000 }
  );
};

export const createScreenSizeError = (dimension: string, value: number): ApiError => {
  return new ApiError(
    400,
    ErrorCodes.SCREEN_SIZE_EXCEEDED,
    `Screen ${dimension} (${value}m) exceeds maximum limit of 50m`,
    { dimension, value, limit: 50 }
  );
};

export const createCalculationError = (message: string, details?: unknown): ApiError => {
  return new ApiError(500, ErrorCodes.CALCULATION_ERROR, message, details);
};

export const createNotFoundError = (resource: string): ApiError => {
  return new ApiError(404, ErrorCodes.NOT_FOUND, `${resource} not found`);
};

/**
 * Format error response according to API specification
 */
const formatErrorResponse = (
  code: string,
  message: string,
  details?: unknown
): ErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details !== undefined && { details }),
  },
  timestamp: new Date().toISOString(),
});

/**
 * Global error handling middleware
 * Requirements: 5.1 - Return structured error responses
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Handle ApiError instances
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      formatErrorResponse(err.code, err.message, err.details)
    );
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(
      formatErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid JSON in request body'
      )
    );
    return;
  }

  // Handle unknown errors
  res.status(500).json(
    formatErrorResponse(
      ErrorCodes.UNKNOWN_ERROR,
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message
    )
  );
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json(
    formatErrorResponse(
      ErrorCodes.NOT_FOUND,
      `Route ${req.method} ${req.path} not found`
    )
  );
};

export default errorHandler;
