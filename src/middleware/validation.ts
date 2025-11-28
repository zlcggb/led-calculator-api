/**
 * Validation Middleware
 * Validates required fields in request body
 * Requirements: 1.2, 2.4
 */

import { Request, Response, NextFunction } from 'express';
import { 
  CabinetSpecs, 
  RoomConfig, 
  DisplayConfig,
  CabinetSelection,
  CalculationResult,
} from '../types';
import { createValidationError } from './errorHandler';

// Maximum cabinet count limit - Requirements: 2.4
const MAX_CABINET_COUNT = 1000;

/**
 * Validation result type
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate cabinet specs has all required fields
 * Requirements: 1.2
 */
const validateCabinetSpecs = (specs: unknown, fieldName = 'cabinetSpecs'): ValidationResult => {
  const errors: string[] = [];
  
  if (!specs || typeof specs !== 'object') {
    return { valid: false, errors: [`${fieldName} is required and must be an object`] };
  }

  const cabinet = specs as Partial<CabinetSpecs>;

  // Check dimensions
  if (!cabinet.dimensions || typeof cabinet.dimensions !== 'object') {
    errors.push(`${fieldName}.dimensions is required`);
  } else {
    if (typeof cabinet.dimensions.width !== 'number' || cabinet.dimensions.width <= 0) {
      errors.push(`${fieldName}.dimensions.width must be a positive number`);
    }
    if (typeof cabinet.dimensions.height !== 'number' || cabinet.dimensions.height <= 0) {
      errors.push(`${fieldName}.dimensions.height must be a positive number`);
    }
  }

  // Check display
  if (!cabinet.display || typeof cabinet.display !== 'object') {
    errors.push(`${fieldName}.display is required`);
  } else {
    if (typeof cabinet.display.pixelPitch !== 'number' || cabinet.display.pixelPitch <= 0) {
      errors.push(`${fieldName}.display.pixelPitch must be a positive number`);
    }
    if (!cabinet.display.resolution || typeof cabinet.display.resolution !== 'object') {
      errors.push(`${fieldName}.display.resolution is required`);
    }
  }

  // Check power
  if (!cabinet.power || typeof cabinet.power !== 'object') {
    errors.push(`${fieldName}.power is required`);
  } else {
    if (typeof cabinet.power.maxPower !== 'number') {
      errors.push(`${fieldName}.power.maxPower must be a number`);
    }
  }

  // Check physical
  if (!cabinet.physical || typeof cabinet.physical !== 'object') {
    errors.push(`${fieldName}.physical is required`);
  } else {
    if (typeof cabinet.physical.weight !== 'number') {
      errors.push(`${fieldName}.physical.weight must be a number`);
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validate room config has all required fields
 * Requirements: 1.2
 */
const validateRoomConfig = (config: unknown): ValidationResult => {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['roomConfig is required and must be an object'] };
  }

  const room = config as Partial<RoomConfig>;

  // Check dimensions
  if (!room.dimensions || typeof room.dimensions !== 'object') {
    errors.push('roomConfig.dimensions is required');
  } else {
    if (typeof room.dimensions.width !== 'number' || room.dimensions.width <= 0) {
      errors.push('roomConfig.dimensions.width must be a positive number');
    }
    if (typeof room.dimensions.height !== 'number' || room.dimensions.height <= 0) {
      errors.push('roomConfig.dimensions.height must be a positive number');
    }
  }

  // Check unit
  if (!room.unit || !['meters', 'feet'].includes(room.unit)) {
    errors.push('roomConfig.unit must be "meters" or "feet"');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validate display config has all required fields
 * Requirements: 1.2
 */
const validateDisplayConfig = (config: unknown): ValidationResult => {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['displayConfig is required and must be an object'] };
  }

  const display = config as Partial<DisplayConfig>;

  // Check layout
  if (!display.layout || typeof display.layout !== 'object') {
    errors.push('displayConfig.layout is required');
  } else {
    if (typeof display.layout.columns !== 'number' || display.layout.columns < 1) {
      errors.push('displayConfig.layout.columns must be a positive integer');
    }
    if (typeof display.layout.rows !== 'number' || display.layout.rows < 1) {
      errors.push('displayConfig.layout.rows must be a positive integer');
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validate cabinet selections array
 * Requirements: 2.4
 */
const validateCabinetSelections = (selections: unknown): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(selections)) {
    return { valid: false, errors: ['cabinetSelections must be an array'] };
  }

  if (selections.length === 0) {
    return { valid: false, errors: ['cabinetSelections must contain at least one cabinet'] };
  }

  let totalCount = 0;

  selections.forEach((selection, index) => {
    const sel = selection as Partial<CabinetSelection>;
    
    if (!sel.id || typeof sel.id !== 'string') {
      errors.push(`cabinetSelections[${index}].id is required`);
    }
    
    if (!sel.specs) {
      errors.push(`cabinetSelections[${index}].specs is required`);
    } else {
      const specsValidation = validateCabinetSpecs(sel.specs, `cabinetSelections[${index}].specs`);
      errors.push(...specsValidation.errors);
    }

    if (typeof sel.count !== 'number' || sel.count < 1) {
      errors.push(`cabinetSelections[${index}].count must be a positive integer`);
    } else {
      totalCount += sel.count;
    }
  });

  // Check total cabinet count limit - Requirements: 2.4
  if (totalCount > MAX_CABINET_COUNT) {
    errors.push(`Total cabinet count (${totalCount}) exceeds maximum limit of ${MAX_CABINET_COUNT}`);
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validate calculation result for preview endpoints
 */
const validateCalculationResult = (result: unknown): ValidationResult => {
  const errors: string[] = [];

  if (!result || typeof result !== 'object') {
    return { valid: false, errors: ['calculationResult is required and must be an object'] };
  }

  const calc = result as Partial<CalculationResult>;

  if (!calc.wallDimensions || typeof calc.wallDimensions !== 'object') {
    errors.push('calculationResult.wallDimensions is required');
  }

  if (!calc.cabinetCount || typeof calc.cabinetCount !== 'object') {
    errors.push('calculationResult.cabinetCount is required');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Middleware factory for validating single cabinet requests
 * Requirements: 1.2, 2.4
 */
export const validateSingleCabinetRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const allErrors: string[] = [];

  const cabinetValidation = validateCabinetSpecs(req.body.cabinetSpecs);
  allErrors.push(...cabinetValidation.errors);

  const roomValidation = validateRoomConfig(req.body.roomConfig);
  allErrors.push(...roomValidation.errors);

  const displayValidation = validateDisplayConfig(req.body.displayConfig);
  allErrors.push(...displayValidation.errors);

  // Check cabinet count limit based on layout - Requirements: 2.4
  if (req.body.displayConfig?.layout) {
    const { columns, rows } = req.body.displayConfig.layout;
    if (typeof columns === 'number' && typeof rows === 'number') {
      const totalCabinets = columns * rows;
      if (totalCabinets > MAX_CABINET_COUNT) {
        allErrors.push(`Total cabinet count (${totalCabinets}) exceeds maximum limit of ${MAX_CABINET_COUNT}`);
      }
    }
  }

  if (allErrors.length > 0) {
    next(createValidationError('Request validation failed', allErrors));
    return;
  }

  next();
};

/**
 * Middleware factory for validating multi-cabinet requests
 * Requirements: 2.4
 */
export const validateMultiCabinetRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const allErrors: string[] = [];

  const selectionsValidation = validateCabinetSelections(req.body.cabinetSelections);
  allErrors.push(...selectionsValidation.errors);

  const roomValidation = validateRoomConfig(req.body.roomConfig);
  allErrors.push(...roomValidation.errors);

  // Validate arrangement direction if provided
  if (req.body.arrangementDirection !== undefined) {
    if (!['left-to-right', 'right-to-left'].includes(req.body.arrangementDirection)) {
      allErrors.push('arrangementDirection must be "left-to-right" or "right-to-left"');
    }
  }

  if (allErrors.length > 0) {
    next(createValidationError('Request validation failed', allErrors));
    return;
  }

  next();
};

/**
 * Middleware for validating smart combination requests
 */
export const validateSmartCombinationRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const allErrors: string[] = [];

  // Validate main cabinet
  if (!req.body.mainCabinet || typeof req.body.mainCabinet !== 'object') {
    allErrors.push('mainCabinet is required');
  } else {
    if (!req.body.mainCabinet.id) {
      allErrors.push('mainCabinet.id is required');
    }
    const specsValidation = validateCabinetSpecs(req.body.mainCabinet.specs, 'mainCabinet.specs');
    allErrors.push(...specsValidation.errors);
  }

  // Validate auxiliary cabinets
  if (!Array.isArray(req.body.auxiliaryCabinets)) {
    allErrors.push('auxiliaryCabinets must be an array');
  } else {
    req.body.auxiliaryCabinets.forEach((cab: unknown, index: number) => {
      const cabinet = cab as { id?: string; specs?: unknown };
      if (!cabinet.id) {
        allErrors.push(`auxiliaryCabinets[${index}].id is required`);
      }
      const specsValidation = validateCabinetSpecs(cabinet.specs, `auxiliaryCabinets[${index}].specs`);
      allErrors.push(...specsValidation.errors);
    });
  }

  // Validate wall dimensions
  if (typeof req.body.wallWidthMm !== 'number' || req.body.wallWidthMm <= 0) {
    allErrors.push('wallWidthMm must be a positive number');
  }
  if (typeof req.body.wallHeightMm !== 'number' || req.body.wallHeightMm <= 0) {
    allErrors.push('wallHeightMm must be a positive number');
  }

  if (allErrors.length > 0) {
    next(createValidationError('Request validation failed', allErrors));
    return;
  }

  next();
};

/**
 * Middleware for validating optimal layout requests
 */
export const validateOptimalLayoutRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const allErrors: string[] = [];

  const cabinetValidation = validateCabinetSpecs(req.body.cabinetSpecs);
  allErrors.push(...cabinetValidation.errors);

  const roomValidation = validateRoomConfig(req.body.roomConfig);
  allErrors.push(...roomValidation.errors);

  if (allErrors.length > 0) {
    next(createValidationError('Request validation failed', allErrors));
    return;
  }

  next();
};

/**
 * Middleware for validating preview requests
 */
export const validatePreviewRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const allErrors: string[] = [];

  const resultValidation = validateCalculationResult(req.body.calculationResult);
  allErrors.push(...resultValidation.errors);

  const roomValidation = validateRoomConfig(req.body.roomConfig);
  allErrors.push(...roomValidation.errors);

  if (allErrors.length > 0) {
    next(createValidationError('Request validation failed', allErrors));
    return;
  }

  next();
};

// Export validation helpers for testing
export {
  validateCabinetSpecs,
  validateRoomConfig,
  validateDisplayConfig,
  validateCabinetSelections,
  validateCalculationResult,
  MAX_CABINET_COUNT,
};
