/**
 * Logging Middleware
 * Logs request method, path, and response time
 * Requirements: 5.2
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Logger middleware that logs request details and response time
 * Requirements: 5.2 - Log request method, path, and response time
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const { method, path, originalUrl } = req;

  // Log request start
  console.log(`[${new Date().toISOString()}] --> ${method} ${originalUrl || path}`);

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    
    // Determine log level based on status code
    const logLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';
    
    console.log(
      `[${new Date().toISOString()}] <-- ${method} ${originalUrl || path} ${statusCode} ${duration}ms [${logLevel}]`
    );
  });

  next();
};

export default loggerMiddleware;
