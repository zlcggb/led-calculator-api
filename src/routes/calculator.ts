/**
 * Calculator Routes
 * API endpoints for LED display wall calculations
 * Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 3.1, 3.3, 4.1, 4.2, 4.3
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  validateSingleCabinetRequest,
  validateMultiCabinetRequest,
  validateSmartCombinationRequest,
  validateOptimalLayoutRequest,
} from '../middleware/validation';
import {
  calculateDisplayWallSpecs,
  calculateMultiCabinetDisplayWall,
  calculateOptimalLayout,
  enhancedProgressiveCabinetCombination,
} from '../utils/configurator-calculator';
import {
  SingleCabinetRequest,
  MultiCabinetRequest,
  SmartCombinationRequest,
  OptimalLayoutRequest,
  SuccessResponse,
  CalculationResult,
} from '../types';
import { createCalculationError, createValidationError } from '../middleware/errorHandler';
import { generateSVGPreview, SVGGeneratorOptions } from '../utils/svg-generator';

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
 * POST /api/calculate/single
 * Calculate display wall specifications for single cabinet mode
 * Requirements: 1.1, 1.3
 */
router.post(
  '/single',
  validateSingleCabinetRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cabinetSpecs, roomConfig, displayConfig } = req.body as SingleCabinetRequest;

      const result = await calculateDisplayWallSpecs(cabinetSpecs, roomConfig, displayConfig);

      res.json(createSuccessResponse<CalculationResult>(result));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * POST /api/calculate/multi
 * Calculate display wall specifications for multi-cabinet mode
 * Requirements: 2.1, 2.2, 2.3
 */
router.post(
  '/multi',
  validateMultiCabinetRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cabinetSelections, roomConfig, displayConfig, arrangementDirection } = req.body as MultiCabinetRequest;

      const result = await calculateMultiCabinetDisplayWall(
        cabinetSelections,
        roomConfig,
        displayConfig,
        arrangementDirection
      );

      res.json(createSuccessResponse<CalculationResult>(result));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * POST /api/calculate/smart-combination
 * Find optimal cabinet combination for wall coverage
 * Requirements: 3.1, 3.3
 */
router.post(
  '/smart-combination',
  validateSmartCombinationRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mainCabinet, auxiliaryCabinets, wallWidthMm, wallHeightMm } = req.body as SmartCombinationRequest;

      // Use enhanced algorithm with precision optimization
      const result = await enhancedProgressiveCabinetCombination(
        mainCabinet,
        auxiliaryCabinets,
        wallWidthMm,
        wallHeightMm
      );

      // Get adjusted size or use original
      const finalWidthMm = (result as any).adjustedSize?.width || wallWidthMm;
      const finalHeightMm = (result as any).adjustedSize?.height || wallHeightMm;

      // 🎯 使用与前端相同的guillotine算法进行排列
      // 构建临时roomConfig和displayConfig用于调用calculateMultiCabinetDisplayWall
      const tempRoomConfig = {
        dimensions: {
          width: finalWidthMm / 1000,  // 转换为米
          height: finalHeightMm / 1000
        },
        unit: 'meters' as const,
        wallType: 'flat' as const
      };
      
      const tempDisplayConfig = {
        layout: { rows: 1, columns: 1 },
        resolution: 'FHD' as const,
        configuration: 'multi-cabinet' as const,
        redundancy: {
          power: false,
          data: false,
          noRedundancy: true
        }
      };

      // 使用guillotine算法计算排列（与前端一致）
      const calculationResult = await calculateMultiCabinetDisplayWall(
        result.bestCombination,
        tempRoomConfig,
        tempDisplayConfig,
        'left-to-right'  // 默认从左到右排列
      );
      
      const arrangementResult = calculationResult.arrangement;

      // calculationResult 已经由 calculateMultiCabinetDisplayWall 生成，包含完整的排列信息

      // Format response with coverage percentage
      const response = {
        bestCombination: result.bestCombination,
        coverage: result.coverage,
        coveragePercentage: `${(result.coverage * 100).toFixed(2)}%`,
        isFullyFilled: result.isFullyFilled,
        adjustedSize: (result as any).adjustedSize,
        testResultsCount: result.testResults.length,
        optimizationApplied: result.proximityOptimization?.wasApplied ? 'proximity' : 'none',
        calculationResult: calculationResult
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * Smart Combination with Preview request interface
 */
interface SmartCombinationWithPreviewRequest extends SmartCombinationRequest {
  previewOptions?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    language?: 'en' | 'zh';
  };
}

/**
 * Validate smart combination with preview request
 */
function validateSmartCombinationWithPreviewRequest(req: Request, _res: Response, next: NextFunction): void {
  const { mainCabinet, auxiliaryCabinets, wallWidthMm, wallHeightMm } = req.body as SmartCombinationWithPreviewRequest;
  
  const errors: string[] = [];
  
  if (!mainCabinet) {
    errors.push('mainCabinet is required');
  } else {
    if (!mainCabinet.id) errors.push('mainCabinet.id is required');
    if (!mainCabinet.specs) errors.push('mainCabinet.specs is required');
  }
  
  if (!auxiliaryCabinets || !Array.isArray(auxiliaryCabinets) || auxiliaryCabinets.length === 0) {
    errors.push('auxiliaryCabinets must be a non-empty array');
  }
  
  if (typeof wallWidthMm !== 'number' || wallWidthMm <= 0) {
    errors.push('wallWidthMm must be a positive number');
  }
  
  if (typeof wallHeightMm !== 'number' || wallHeightMm <= 0) {
    errors.push('wallHeightMm must be a positive number');
  }
  
  if (errors.length > 0) {
    next(createValidationError(errors.join('; ')));
    return;
  }
  
  next();
}

/**
 * POST /api/calculate/smart-combination-with-preview
 * Find optimal cabinet combination and generate SVG preview in one request
 * Returns both calculation result and SVG preview
 */
router.post(
  '/smart-combination-with-preview',
  validateSmartCombinationWithPreviewRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mainCabinet, auxiliaryCabinets, wallWidthMm, wallHeightMm, previewOptions } = req.body as SmartCombinationWithPreviewRequest;

      // Step 1: Calculate optimal combination
      const result = await enhancedProgressiveCabinetCombination(
        mainCabinet,
        auxiliaryCabinets,
        wallWidthMm,
        wallHeightMm
      );

      const finalWidthMm = (result as any).adjustedSize?.width || wallWidthMm;
      const finalHeightMm = (result as any).adjustedSize?.height || wallHeightMm;

      const tempRoomConfig = {
        dimensions: {
          width: finalWidthMm / 1000,
          height: finalHeightMm / 1000
        },
        unit: 'meters' as const,
        wallType: 'flat' as const
      };
      
      const tempDisplayConfig = {
        layout: { rows: 1, columns: 1 },
        resolution: 'FHD' as const,
        configuration: 'multi-cabinet' as const,
        redundancy: {
          power: false,
          data: false,
          noRedundancy: true
        }
      };

      const calculationResult = await calculateMultiCabinetDisplayWall(
        result.bestCombination,
        tempRoomConfig,
        tempDisplayConfig,
        'left-to-right'
      );

      // Step 2: Generate SVG preview
      const roomConfigForPreview = {
        dimensions: {
          width: wallWidthMm / 1000,  // 用户输入的可用墙面尺寸
          height: wallHeightMm / 1000
        },
        unit: 'meters' as const,
        wallType: 'flat' as const
      };

      const svgOptions: SVGGeneratorOptions = {
        showDimensions: previewOptions?.showDimensions ?? true,
        showPerson: previewOptions?.showPerson ?? true,
        canvasWidth: previewOptions?.canvasWidth ?? 800,
        canvasHeight: previewOptions?.canvasHeight ?? 500,
        language: previewOptions?.language ?? 'en',
        embedPersonImage: true,
      };

      const svgString = generateSVGPreview(calculationResult, roomConfigForPreview, svgOptions);

      // Format combined response
      const response = {
        // Calculation results
        bestCombination: result.bestCombination,
        coverage: result.coverage,
        coveragePercentage: `${(result.coverage * 100).toFixed(2)}%`,
        isFullyFilled: result.isFullyFilled,
        adjustedSize: (result as any).adjustedSize,
        testResultsCount: result.testResults.length,
        optimizationApplied: result.proximityOptimization?.wasApplied ? 'proximity' : 'none',
        calculationResult: calculationResult,
        // SVG preview
        preview: {
          svg: svgString,
          width: svgOptions.canvasWidth,
          height: svgOptions.canvasHeight
        }
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * Optimal Layout with Preview request interface
 */
interface OptimalLayoutWithPreviewRequest extends OptimalLayoutRequest {
  previewOptions?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    language?: 'en' | 'zh';
  };
}

/**
 * Validate optimal layout with preview request
 */
function validateOptimalLayoutWithPreviewRequest(req: Request, _res: Response, next: NextFunction): void {
  const { cabinetSpecs, roomConfig } = req.body as OptimalLayoutWithPreviewRequest;
  
  const errors: string[] = [];
  
  if (!cabinetSpecs) {
    errors.push('cabinetSpecs is required');
  } else {
    if (!cabinetSpecs.dimensions) errors.push('cabinetSpecs.dimensions is required');
    if (!cabinetSpecs.display) errors.push('cabinetSpecs.display is required');
  }
  
  if (!roomConfig) {
    errors.push('roomConfig is required');
  } else {
    if (!roomConfig.dimensions) errors.push('roomConfig.dimensions is required');
    if (!roomConfig.unit) errors.push('roomConfig.unit is required');
  }
  
  if (errors.length > 0) {
    next(createValidationError(errors.join('; ')));
    return;
  }
  
  next();
}

/**
 * POST /api/calculate/optimal-layout-with-preview
 * Calculate optimal single cabinet layout and generate SVG preview in one request
 * Returns both calculation result and SVG preview
 */
router.post(
  '/optimal-layout-with-preview',
  validateOptimalLayoutWithPreviewRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cabinetSpecs, roomConfig, previewOptions } = req.body as OptimalLayoutWithPreviewRequest;

      // Convert feet to meters if needed
      let roomWidthM = roomConfig.dimensions.width;
      let roomHeightM = roomConfig.dimensions.height;

      if (roomConfig.unit === 'feet') {
        roomWidthM = roomConfig.dimensions.width * 0.3048;
        roomHeightM = roomConfig.dimensions.height * 0.3048;
      }

      // Step 1: Calculate optimal layout
      const normalizedRoomConfig = {
        ...roomConfig,
        dimensions: { width: roomWidthM, height: roomHeightM },
        unit: 'meters' as const,
      };

      const layoutResult = calculateOptimalLayout(cabinetSpecs, normalizedRoomConfig);
      const columns = Math.max(1, layoutResult.columns);
      const rows = Math.max(1, layoutResult.rows);
      const totalCabinets = columns * rows;

      // Calculate screen dimensions
      const screenWidthM = (cabinetSpecs.dimensions.width * columns) / 1000;
      const screenHeightM = (cabinetSpecs.dimensions.height * rows) / 1000;
      const screenArea = screenWidthM * screenHeightM;

      // Build cabinet arrangement for SVG
      const cabinets = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          cabinets.push({
            cabinetId: 'single-cabinet',
            position: { 
              x: col * cabinetSpecs.dimensions.width, 
              y: row * cabinetSpecs.dimensions.height 
            },
            size: { 
              width: cabinetSpecs.dimensions.width, 
              height: cabinetSpecs.dimensions.height 
            },
            specs: { dimensions: cabinetSpecs.dimensions }
          });
        }
      }

      // Build calculation result for SVG generator
      const calculationResult: CalculationResult = {
        wallDimensions: {
          width: screenWidthM,
          height: screenHeightM,
          area: screenArea,
          diagonal: Math.sqrt(screenWidthM * screenWidthM + screenHeightM * screenHeightM) * 39.37
        },
        cabinetCount: {
          total: totalCabinets,
          horizontal: columns,
          vertical: rows
        },
        arrangement: {
          cabinets: cabinets,
          strategy: 'single_cabinet',
          coverage: 1.0
        },
        pixels: {
          totalWidth: (cabinetSpecs.display.resolution?.width || 320) * columns,
          totalHeight: (cabinetSpecs.display.resolution?.height || 640) * rows,
          totalPixels: (cabinetSpecs.display.resolution?.width || 320) * columns * (cabinetSpecs.display.resolution?.height || 640) * rows,
          pixelDensity: ((cabinetSpecs.display.resolution?.width || 320) * columns * (cabinetSpecs.display.resolution?.height || 640) * rows) / screenArea
        },
        powerConsumption: {
          maximum: (cabinetSpecs.power?.maxPower || 180) * totalCabinets,
          typical: (cabinetSpecs.power?.typicalPower || 60) * totalCabinets,
          standby: (cabinetSpecs.power?.standbyPower || 5) * totalCabinets
        },
        physical: {
          totalWeight: (cabinetSpecs.physical?.weight || 10) * totalCabinets,
          structuralLoad: ((cabinetSpecs.physical?.weight || 10) * totalCabinets) / screenArea
        }
      };

      // Step 2: Generate SVG preview
      const roomConfigForPreview = {
        dimensions: { width: roomWidthM, height: roomHeightM },
        unit: 'meters' as const,
        wallType: 'flat' as const
      };

      const svgOptions: SVGGeneratorOptions = {
        showDimensions: previewOptions?.showDimensions ?? true,
        showPerson: previewOptions?.showPerson ?? true,
        canvasWidth: previewOptions?.canvasWidth ?? 800,
        canvasHeight: previewOptions?.canvasHeight ?? 500,
        language: previewOptions?.language ?? 'en',
        embedPersonImage: true,
      };

      const svgString = generateSVGPreview(calculationResult, roomConfigForPreview, svgOptions);

      // Format combined response
      const response = {
        // Layout results
        columns,
        rows,
        totalCabinets,
        cabinetDimensions: {
          widthMm: cabinetSpecs.dimensions.width,
          heightMm: cabinetSpecs.dimensions.height,
        },
        screenDimensions: {
          widthM: screenWidthM,
          heightM: screenHeightM,
          areaM2: screenArea
        },
        roomDimensions: {
          widthM: roomWidthM,
          heightM: roomHeightM,
          originalUnit: roomConfig.unit,
        },
        calculationResult,
        // SVG preview
        preview: {
          svg: svgString,
          width: svgOptions.canvasWidth,
          height: svgOptions.canvasHeight
        }
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

/**
 * POST /api/calculate/optimal-layout
 * Calculate optimal layout based on room dimensions
 * Requirements: 4.1, 4.2, 4.3
 */
router.post(
  '/optimal-layout',
  validateOptimalLayoutRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cabinetSpecs, roomConfig } = req.body as OptimalLayoutRequest;

      // Convert feet to meters if needed - Requirements: 4.2
      let roomWidthM = roomConfig.dimensions.width;
      let roomHeightM = roomConfig.dimensions.height;

      if (roomConfig.unit === 'feet') {
        roomWidthM = roomConfig.dimensions.width * 0.3048;
        roomHeightM = roomConfig.dimensions.height * 0.3048;
      }

      // Create normalized room config with meters
      const normalizedRoomConfig = {
        ...roomConfig,
        dimensions: {
          ...roomConfig.dimensions,
          width: roomWidthM,
          height: roomHeightM,
        },
        unit: 'meters' as const,
      };

      const result = calculateOptimalLayout(cabinetSpecs, normalizedRoomConfig);

      // Ensure minimum values of 1 - Requirements: 4.3
      const response = {
        columns: Math.max(1, result.columns),
        rows: Math.max(1, result.rows),
        cabinetDimensions: {
          widthMm: cabinetSpecs.dimensions.width,
          heightMm: cabinetSpecs.dimensions.height,
        },
        roomDimensions: {
          widthM: roomWidthM,
          heightM: roomHeightM,
          originalUnit: roomConfig.unit,
        },
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(createCalculationError((error as Error).message));
    }
  }
);

export default router;
