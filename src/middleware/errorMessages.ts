/**
 * Error Message Translation Module
 * Provides localized error messages for API responses
 * Requirements: 4.1, 4.2
 */

import { SupportedLanguage, DEFAULT_LANGUAGE } from './i18n';

/**
 * Error message translations
 */
const errorMessages: Record<SupportedLanguage, Record<string, string>> = {
  zh: {
    VALIDATION_ERROR: '请求参数验证失败',
    CABINET_LIMIT_EXCEEDED: '箱体总数超过限制（>1000）',
    SCREEN_SIZE_EXCEEDED: '屏幕尺寸超过限制（>50m）',
    CALCULATION_ERROR: '内部计算错误',
    NOT_FOUND: '资源未找到',
    UNKNOWN_ERROR: '发生未知错误',
    INVALID_JSON: '请求体中的JSON格式无效',
    ROUTE_NOT_FOUND: '路由未找到',
  },
  en: {
    VALIDATION_ERROR: 'Request validation failed',
    CABINET_LIMIT_EXCEEDED: 'Cabinet count exceeds limit (>1000)',
    SCREEN_SIZE_EXCEEDED: 'Screen size exceeds limit (>50m)',
    CALCULATION_ERROR: 'Internal calculation error',
    NOT_FOUND: 'Resource not found',
    UNKNOWN_ERROR: 'An unexpected error occurred',
    INVALID_JSON: 'Invalid JSON in request body',
    ROUTE_NOT_FOUND: 'Route not found',
  },
};

/**
 * Get localized error message by error code
 * @param code - The error code
 * @param lang - The target language
 * @returns The localized error message
 */
export function getLocalizedError(code: string, lang: SupportedLanguage): string {
  const messages = errorMessages[lang] || errorMessages[DEFAULT_LANGUAGE];
  return messages[code] || code;
}

/**
 * Get localized error message with dynamic values
 * @param code - The error code
 * @param lang - The target language
 * @param params - Dynamic parameters to insert into the message
 * @returns The localized error message with parameters
 */
export function getLocalizedErrorWithParams(
  code: string,
  lang: SupportedLanguage,
  params?: Record<string, string | number>
): string {
  let message = getLocalizedError(code, lang);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{{${key}}}`, String(value));
    });
  }
  
  return message;
}

export { errorMessages };
export default getLocalizedError;
