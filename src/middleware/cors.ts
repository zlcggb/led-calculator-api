/**
 * CORS Middleware Configuration
 * Configurable Cross-Origin Resource Sharing support
 * Requirements: 6.1, 6.2
 */

import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * CORS configuration interface
 */
export interface CorsConfig {
  origins: string | string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

/**
 * Default CORS configuration
 */
const DEFAULT_CORS_CONFIG: CorsConfig = {
  origins: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-API-Key',
  ],
  exposedHeaders: [
    'Content-Length',
    'X-Request-Id',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours in seconds
};

/**
 * Parse CORS origins from environment variable
 * Supports comma-separated list of origins or '*' for all
 * @param envValue - Environment variable value
 * @returns Parsed origins
 */
export const parseCorsOrigins = (envValue?: string): string | string[] => {
  if (!envValue || envValue === '*') {
    return '*';
  }
  
  const origins = envValue.split(',').map(origin => origin.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
};

/**
 * Create CORS configuration from environment variables
 * @returns CorsConfig object
 */
export const createCorsConfig = (): CorsConfig => {
  const envOrigins = process.env.CORS_ORIGINS;
  const envMethods = process.env.CORS_METHODS;
  const envHeaders = process.env.CORS_ALLOWED_HEADERS;
  const envMaxAge = process.env.CORS_MAX_AGE;

  return {
    ...DEFAULT_CORS_CONFIG,
    origins: parseCorsOrigins(envOrigins),
    methods: envMethods 
      ? envMethods.split(',').map(m => m.trim().toUpperCase()) 
      : DEFAULT_CORS_CONFIG.methods,
    allowedHeaders: envHeaders 
      ? envHeaders.split(',').map(h => h.trim()) 
      : DEFAULT_CORS_CONFIG.allowedHeaders,
    maxAge: envMaxAge ? parseInt(envMaxAge, 10) : DEFAULT_CORS_CONFIG.maxAge,
  };
};

/**
 * Create CORS options for the cors middleware
 * Requirements: 6.1 - Include appropriate CORS headers in response
 * Requirements: 6.2 - Handle preflight OPTIONS requests
 * @param config - CORS configuration
 * @returns CorsOptions object
 */
export const createCorsOptions = (config: CorsConfig): CorsOptions => {
  return {
    origin: config.origins,
    methods: config.methods,
    allowedHeaders: config.allowedHeaders,
    exposedHeaders: config.exposedHeaders,
    credentials: config.credentials,
    maxAge: config.maxAge,
    optionsSuccessStatus: 200, // For legacy browser support (IE11, SmartTVs)
    preflightContinue: false, // Pass preflight response to next handler
  };
};

/**
 * Create dynamic CORS options delegate for more complex origin validation
 * Useful when you need to validate origins against a database or external service
 * @param allowedOrigins - List of allowed origins or '*'
 * @returns CorsOptionsDelegate function
 */
export const createDynamicCorsOptions = (
  allowedOrigins: string | string[]
): CorsOptionsDelegate<Request> => {
  return (req: Request, callback: (err: Error | null, options?: CorsOptions) => void) => {
    const origin = req.header('Origin');
    let corsOptions: CorsOptions;

    if (allowedOrigins === '*') {
      // Allow all origins
      corsOptions = { origin: true };
    } else if (Array.isArray(allowedOrigins)) {
      // Check if origin is in the allowed list
      const isAllowed = origin ? allowedOrigins.includes(origin) : false;
      corsOptions = { origin: isAllowed };
    } else {
      // Single origin check
      corsOptions = { origin: allowedOrigins === origin };
    }

    callback(null, {
      ...corsOptions,
      methods: DEFAULT_CORS_CONFIG.methods,
      allowedHeaders: DEFAULT_CORS_CONFIG.allowedHeaders,
      exposedHeaders: DEFAULT_CORS_CONFIG.exposedHeaders,
      credentials: DEFAULT_CORS_CONFIG.credentials,
      maxAge: DEFAULT_CORS_CONFIG.maxAge,
      optionsSuccessStatus: 200,
    });
  };
};

/**
 * Create the CORS middleware with configuration from environment
 * Requirements: 6.1, 6.2
 * @returns Express middleware function
 */
export const createCorsMiddleware = (): RequestHandler => {
  const config = createCorsConfig();
  const options = createCorsOptions(config);
  return cors(options);
};

/**
 * Manual CORS headers middleware
 * Use this for more control over CORS headers or when cors package is not available
 * Requirements: 6.1 - Include appropriate CORS headers in response
 * Requirements: 6.2 - Handle preflight OPTIONS requests
 */
export const manualCorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const config = createCorsConfig();
  const origin = req.header('Origin');

  // Set CORS headers based on origin
  if (origin) {
    if (config.origins === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (Array.isArray(config.origins)) {
      if (config.origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
      }
    } else if (config.origins === origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  }

  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', config.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
  res.setHeader('Access-Control-Max-Age', config.maxAge.toString());

  if (config.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight OPTIONS request - Requirements: 6.2
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
};

/**
 * Get current CORS configuration (for logging/debugging)
 * @returns Current CORS configuration
 */
export const getCorsConfig = (): CorsConfig => {
  return createCorsConfig();
};

export default createCorsMiddleware;
