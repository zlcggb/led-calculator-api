/**
 * Internationalization (i18n) Middleware
 * Parses Accept-Language header and attaches language preference to request
 * Requirements: 4.1, 4.2
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Supported languages
 */
export type SupportedLanguage = 'zh' | 'en';

/**
 * Default language for backward compatibility
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

/**
 * Supported language codes
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['zh', 'en'];

/**
 * Extended Express Request interface with language property
 */
declare global {
  namespace Express {
    interface Request {
      language: SupportedLanguage;
    }
  }
}

/**
 * Parse Accept-Language header and extract preferred language
 * @param acceptLanguage - The Accept-Language header value
 * @returns The preferred supported language
 */
export function parseAcceptLanguage(acceptLanguage: string | undefined): SupportedLanguage {
  if (!acceptLanguage) {
    return DEFAULT_LANGUAGE;
  }

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,zh-CN;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.toLowerCase().split('-')[0], // Extract primary language code
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang.code as SupportedLanguage)) {
      return lang.code as SupportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * i18n middleware - attaches language preference to request object
 * Requirements: 4.1, 4.2
 */
export function i18nMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const acceptLanguage = req.headers['accept-language'];
  req.language = parseAcceptLanguage(acceptLanguage);
  next();
}

export default i18nMiddleware;
