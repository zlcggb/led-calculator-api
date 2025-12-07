/**
 * Middleware Index
 * Central export for all middleware modules
 */

// Logger middleware
export { loggerMiddleware } from './logger';

// i18n middleware - Requirements: 4.1, 4.2
export {
  i18nMiddleware,
  parseAcceptLanguage,
  SupportedLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from './i18n';

// Error message translations - Requirements: 4.1, 4.2
export {
  getLocalizedError,
  getLocalizedErrorWithParams,
  errorMessages,
} from './errorMessages';

// Error handling middleware
export {
  errorHandler,
  notFoundHandler,
  ApiError,
  ErrorCodes,
  createValidationError,
  createCabinetLimitError,
  createScreenSizeError,
  createCalculationError,
  createNotFoundError,
} from './errorHandler';

// Validation middleware
export {
  validateSingleCabinetRequest,
  validateMultiCabinetRequest,
  validateSmartCombinationRequest,
  validateOptimalLayoutRequest,
  validatePreviewRequest,
  validateCabinetSpecs,
  validateRoomConfig,
  validateDisplayConfig,
  validateCabinetSelections,
  validateCalculationResult,
  MAX_CABINET_COUNT,
} from './validation';

// CORS middleware - Requirements: 6.1, 6.2
export {
  createCorsMiddleware,
  createCorsConfig,
  createCorsOptions,
  createDynamicCorsOptions,
  manualCorsMiddleware,
  parseCorsOrigins,
  getCorsConfig,
  CorsConfig,
} from './cors';
