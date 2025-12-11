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
      const { mainCabinet, auxiliaryCabinets, wallWidthMm, wallHeightMm, arrangementDirection } = req.body as SmartCombinationRequest;

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
        arrangementDirection || 'left-to-right'  // 🎯 支持排列方向参数
      );
      
      const arrangementResult = calculationResult.arrangement;

      // calculationResult 已经由 calculateMultiCabinetDisplayWall 生成，包含完整的排列信息

      // 🎯 过滤掉数量为0的箱体，只返回实际使用的箱体
      const filteredBestCombination = result.bestCombination.filter((cabinet: any) => cabinet.count > 0);

      // Format response with coverage percentage
      const response = {
        bestCombination: filteredBestCombination,
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
  arrangementDirection?: 'left-to-right' | 'right-to-left';
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
      const { mainCabinet, auxiliaryCabinets, wallWidthMm, wallHeightMm, arrangementDirection, previewOptions } = req.body as SmartCombinationWithPreviewRequest;

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
        arrangementDirection || 'left-to-right'  // 🎯 支持排列方向参数
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

      // 🎯 过滤掉数量为0的箱体，只返回实际使用的箱体
      const filteredBestCombination = result.bestCombination.filter((cabinet: any) => cabinet.count > 0);

      // Format combined response
      const response = {
        // Calculation results
        bestCombination: filteredBestCombination,
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
  targetResolution?: 'FHD' | 'UHD' | '8K' | 'Custom';  // 目标分辨率预设
  previewOptions?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    language?: 'en' | 'zh';
  };
}

/**
 * Resolution presets definition
 */
const RESOLUTION_PRESETS: Record<'FHD' | 'UHD' | '8K', { width: number; height: number; name: string }> = {
  'FHD': { width: 1920, height: 1080, name: 'Full HD (1080p)' },
  'UHD': { width: 3840, height: 2160, name: '4K Ultra HD' },
  '8K': { width: 7680, height: 4320, name: '8K Ultra HD' },
};

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
 * 
 * Supports targetResolution parameter for resolution-based calculation:
 * - 'FHD': 1920×1080 (Full HD)
 * - 'UHD': 3840×2160 (4K)
 * - '8K': 7680×4320 (8K)
 * - 'Custom': Use wall dimensions (default behavior)
 */
router.post(
  '/optimal-layout-with-preview',
  validateOptimalLayoutWithPreviewRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cabinetSpecs, roomConfig, targetResolution, previewOptions } = req.body as OptimalLayoutWithPreviewRequest;

      // Convert feet to meters if needed
      let roomWidthM = roomConfig.dimensions.width;
      let roomHeightM = roomConfig.dimensions.height;

      if (roomConfig.unit === 'feet') {
        roomWidthM = roomConfig.dimensions.width * 0.3048;
        roomHeightM = roomConfig.dimensions.height * 0.3048;
      }

      let columns: number;
      let rows: number;
      let targetPixels: { width: number; height: number } | undefined;
      let actualPixels: { width: number; height: number };
      let calculatedWallWidth: number;
      let calculatedWallHeight: number;

      // Check if resolution-based calculation is requested
      if (targetResolution && targetResolution !== 'Custom' && RESOLUTION_PRESETS[targetResolution]) {
        // Resolution-based calculation: calculate columns/rows from target resolution
        targetPixels = RESOLUTION_PRESETS[targetResolution];
        const cabinetResolution = cabinetSpecs.display.resolution || { width: 320, height: 640 };
        
        // Calculate required columns and rows to achieve target resolution
        columns = Math.ceil(targetPixels.width / cabinetResolution.width);
        rows = Math.ceil(targetPixels.height / cabinetResolution.height);
        
        // Calculate actual resolution (may be slightly larger than target)
        actualPixels = {
          width: cabinetResolution.width * columns,
          height: cabinetResolution.height * rows
        };
        
        // Calculate wall dimensions based on cabinet count
        calculatedWallWidth = (cabinetSpecs.dimensions.width * columns) / 1000;
        calculatedWallHeight = (cabinetSpecs.dimensions.height * rows) / 1000;
        
        // Update room dimensions to match calculated wall size
        roomWidthM = calculatedWallWidth;
        roomHeightM = calculatedWallHeight;
      } else {
        // Traditional wall-based calculation
        const normalizedRoomConfig = {
          ...roomConfig,
          dimensions: { width: roomWidthM, height: roomHeightM },
          unit: 'meters' as const,
        };

        const layoutResult = calculateOptimalLayout(cabinetSpecs, normalizedRoomConfig);
        columns = Math.max(1, layoutResult.columns);
        rows = Math.max(1, layoutResult.rows);
        
        const cabinetResolution = cabinetSpecs.display.resolution || { width: 320, height: 640 };
        actualPixels = {
          width: cabinetResolution.width * columns,
          height: cabinetResolution.height * rows
        };
        
        calculatedWallWidth = (cabinetSpecs.dimensions.width * columns) / 1000;
        calculatedWallHeight = (cabinetSpecs.dimensions.height * rows) / 1000;
      }
      const totalCabinets = columns * rows;

      // Calculate screen dimensions
      const screenWidthM = calculatedWallWidth;
      const screenHeightM = calculatedWallHeight;
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
            specs: cabinetSpecs
          });
        }
      }

      // Build calculation result for SVG generator
      // powerConsumption and physical are only included if the input data provides them
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
          totalArea: screenArea,
          screenArea: screenArea,
          coverage: 1.0,
          isFullyFilled: true,
          strategy: 'row_wise'
        },
        pixels: {
          totalWidth: (cabinetSpecs.display.resolution?.width || 320) * columns,
          totalHeight: (cabinetSpecs.display.resolution?.height || 640) * rows,
          totalPixels: (cabinetSpecs.display.resolution?.width || 320) * columns * (cabinetSpecs.display.resolution?.height || 640) * rows,
          pixelDensity: ((cabinetSpecs.display.resolution?.width || 320) * columns * (cabinetSpecs.display.resolution?.height || 640) * rows) / screenArea
        },
        // Only include powerConsumption if power data is provided
        ...(cabinetSpecs.power?.maxPower !== undefined && {
          powerConsumption: {
            maximum: cabinetSpecs.power.maxPower * totalCabinets,
            typical: (cabinetSpecs.power.typicalPower || cabinetSpecs.power.maxPower / 3) * totalCabinets,
            standby: (cabinetSpecs.power.standbyPower || 5) * totalCabinets,
            heatGeneration: {
              maxBTU: cabinetSpecs.power.maxPower * totalCabinets * 3.412,
              typicalBTU: (cabinetSpecs.power.typicalPower || cabinetSpecs.power.maxPower / 3) * totalCabinets * 3.412
            }
          }
        }),
        // Only include physical if weight data is provided
        ...(cabinetSpecs.physical?.weight !== undefined && {
          physical: {
            totalWeight: cabinetSpecs.physical.weight * totalCabinets,
            structuralLoad: (cabinetSpecs.physical.weight * totalCabinets) / screenArea
          }
        }),
        controlSystem: {
          controllers4K: Math.ceil(totalCabinets / 16),
          sendingCards: Math.ceil(totalCabinets / 8),
          fiberCables: Math.ceil(totalCabinets / 8)
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
        // Resolution info (new)
        resolution: {
          mode: targetResolution || 'Custom',
          target: targetPixels ? {
            width: targetPixels.width,
            height: targetPixels.height,
            name: targetResolution ? RESOLUTION_PRESETS[targetResolution as 'FHD' | 'UHD' | '8K']?.name : undefined
          } : undefined,
          actual: {
            width: actualPixels.width,
            height: actualPixels.height,
            totalPixels: actualPixels.width * actualPixels.height
          }
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
