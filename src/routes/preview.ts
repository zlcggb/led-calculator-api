/**
 * Preview Routes
 * API endpoints for generating LED display wall preview images
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3
 */

import { Router, Request, Response, NextFunction } from 'express';
import { generateSVGPreview, SVGGeneratorOptions } from '../utils/svg-generator';
import {
  SVGPreviewRequest,
  PNGPreviewRequest,
  SuccessResponse,
} from '../types';
import { createValidationError, createCalculationError } from '../middleware/errorHandler';

const router = Router();

/**
 * Helper to create success response
 */
function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate SVG preview request
 */
function validateSVGPreviewRequest(req: Request, _res: Response, next: NextFunction): void {
  const { calculationResult, roomConfig } = req.body as SVGPreviewRequest;
  
  const errors: string[] = [];
  
  if (!calculationResult) {
    errors.push('calculationResult is required');
  } else {
    if (!calculationResult.wallDimensions) {
      errors.push('calculationResult.wallDimensions is required');
    }
    if (!calculationResult.cabinetCount) {
      errors.push('calculationResult.cabinetCount is required');
    }
  }
  
  if (!roomConfig) {
    errors.push('roomConfig is required');
  } else {
    if (!roomConfig.dimensions) {
      errors.push('roomConfig.dimensions is required');
    } else {
      if (typeof roomConfig.dimensions.width !== 'number' || roomConfig.dimensions.width <= 0) {
        errors.push('roomConfig.dimensions.width must be a positive number');
      }
      if (typeof roomConfig.dimensions.height !== 'number' || roomConfig.dimensions.height <= 0) {
        errors.push('roomConfig.dimensions.height must be a positive number');
      }
    }
    if (!roomConfig.unit || !['meters', 'feet'].includes(roomConfig.unit)) {
      errors.push('roomConfig.unit must be "meters" or "feet"');
    }
  }
  
  if (errors.length > 0) {
    next(createValidationError(errors.join('; ')));
    return;
  }
  
  next();
}

/**
 * Validate PNG preview request
 */
function validatePNGPreviewRequest(req: Request, _res: Response, next: NextFunction): void {
  const { calculationResult, roomConfig, options } = req.body as PNGPreviewRequest;
  
  const errors: string[] = [];
  
  if (!calculationResult) {
    errors.push('calculationResult is required');
  } else {
    if (!calculationResult.wallDimensions) {
      errors.push('calculationResult.wallDimensions is required');
    }
    if (!calculationResult.cabinetCount) {
      errors.push('calculationResult.cabinetCount is required');
    }
  }
  
  if (!roomConfig) {
    errors.push('roomConfig is required');
  } else {
    if (!roomConfig.dimensions) {
      errors.push('roomConfig.dimensions is required');
    } else {
      if (typeof roomConfig.dimensions.width !== 'number' || roomConfig.dimensions.width <= 0) {
        errors.push('roomConfig.dimensions.width must be a positive number');
      }
      if (typeof roomConfig.dimensions.height !== 'number' || roomConfig.dimensions.height <= 0) {
        errors.push('roomConfig.dimensions.height must be a positive number');
      }
    }
    if (!roomConfig.unit || !['meters', 'feet'].includes(roomConfig.unit)) {
      errors.push('roomConfig.unit must be "meters" or "feet"');
    }
  }
  
  // Validate optional dimensions
  if (options) {
    if (options.width !== undefined && (typeof options.width !== 'number' || options.width <= 0)) {
      errors.push('options.width must be a positive number');
    }
    if (options.height !== undefined && (typeof options.height !== 'number' || options.height <= 0)) {
      errors.push('options.height must be a positive number');
    }
  }
  
  if (errors.length > 0) {
    next(createValidationError(errors.join('; ')));
    return;
  }
  
  next();
}

/**
 * POST /api/preview/svg
 * Generate SVG preview of LED display wall configuration
 * Requirements: 7.1, 7.4, 7.5
 */
router.post(
  '/svg',
  validateSVGPreviewRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { calculationResult, roomConfig, options } = req.body as SVGPreviewRequest;
      
      // Build SVG generator options
      const svgOptions: SVGGeneratorOptions = {
        showDimensions: options?.showDimensions ?? true,
        showPerson: options?.showPerson ?? true,
        canvasWidth: options?.canvasWidth ?? 800,
        canvasHeight: options?.canvasHeight ?? 500,
        language: (options as any)?.language ?? 'en',
        personImageUrl: (options as any)?.personImageUrl,
        embedPersonImage: (options as any)?.embedPersonImage ?? true,
      };
      
      // Generate SVG
      const svgString = generateSVGPreview(calculationResult, roomConfig, svgOptions);
      
      // Return based on format option
      const format = options?.format ?? 'svg';
      
      if (format === 'json') {
        // Return SVG wrapped in JSON response - Requirements: 7.5
        res.json(createSuccessResponse({
          svg: svgString,
          width: svgOptions.canvasWidth,
          height: svgOptions.canvasHeight,
        }));
      } else {
        // Return raw SVG with appropriate Content-Type - Requirements: 7.4
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgString);
      }
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * POST /api/preview/png
 * Generate PNG preview of LED display wall configuration
 * Requirements: 8.1, 8.2, 8.3
 * 
 * Note: This endpoint requires the 'sharp' library for SVG to PNG conversion.
 * If sharp is not available, it will return an error with instructions.
 */
router.post(
  '/png',
  validatePNGPreviewRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { calculationResult, roomConfig, options } = req.body as PNGPreviewRequest;
      
      // Default dimensions - Requirements: 8.3
      const width = options?.width ?? 800;
      const height = options?.height ?? 500;
      
      // Build SVG generator options
      const svgOptions: SVGGeneratorOptions = {
        showDimensions: options?.showDimensions ?? true,
        showPerson: options?.showPerson ?? true,
        canvasWidth: width,
        canvasHeight: height,
        language: (options as any)?.language ?? 'en',
        embedPersonImage: true, // Always embed for PNG conversion
      };
      
      // Generate SVG first
      const svgString = generateSVGPreview(calculationResult, roomConfig, svgOptions);
      
      // Try to convert SVG to PNG using sharp
      try {
        // Dynamic import to handle cases where sharp is not installed
        const sharp = await import('sharp');
        
        // Convert SVG to PNG - Requirements: 8.1, 8.2
        const pngBuffer = await sharp.default(Buffer.from(svgString))
          .resize(width, height)
          .png()
          .toBuffer();
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', pngBuffer.length);
        res.send(pngBuffer);
      } catch (sharpError) {
        // Sharp not available, return error with instructions
        next(createCalculationError(
          'PNG generation requires the "sharp" library. Please install it with: npm install sharp'
        ));
      }
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

export default router;
