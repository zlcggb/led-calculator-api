/**
 * Property-Based Tests for LED Calculator API
 * Uses fast-check library for property testing
 * 
 * **Feature: led-calculator-api, Property 1: Single cabinet calculation returns complete results**
 * **Validates: Requirements 1.1**
 */

import * as fc from 'fast-check';
import { calculateDisplayWallSpecs } from '../src/utils/configurator-calculator';
import { CabinetSpecs, RoomConfig, DisplayConfig, CalculationResult, CabinetSelection, ArrangedCabinet } from '../src/types';
import { arrangeBoxesRowWise, arrangeBoxesColumnWise, arrangeBoxesAuto } from '../src/utils/multi-cabinet-calculator';

/**
 * Arbitrary generator for valid CabinetSpecs
 * Generates realistic cabinet specifications within valid ranges
 */
const cabinetSpecsArbitrary: fc.Arbitrary<CabinetSpecs> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  model: fc.string({ minLength: 1, maxLength: 30 }),
  dimensions: fc.record({
    width: fc.integer({ min: 100, max: 2000 }),   // 100mm to 2000mm
    height: fc.integer({ min: 100, max: 2000 }),  // 100mm to 2000mm
    depth: fc.integer({ min: 50, max: 500 }),     // 50mm to 500mm
  }),
  display: fc.record({
    pixelPitch: fc.double({ min: 0.5, max: 20, noNaN: true }),  // 0.5mm to 20mm
    resolution: fc.record({
      width: fc.integer({ min: 64, max: 1024 }),   // 64 to 1024 pixels
      height: fc.integer({ min: 64, max: 1024 }),  // 64 to 1024 pixels
    }),
    brightness: fc.integer({ min: 500, max: 10000 }),  // 500 to 10000 nits
    refreshRate: fc.integer({ min: 60, max: 7680 }),   // 60Hz to 7680Hz
    colorDepth: fc.integer({ min: 8, max: 16 }),       // 8 to 16 bit
  }),
  power: fc.record({
    maxPower: fc.integer({ min: 100, max: 2000 }),      // 100W to 2000W
    typicalPower: fc.integer({ min: 50, max: 1000 }),   // 50W to 1000W
    standbyPower: fc.integer({ min: 1, max: 50 }),      // 1W to 50W
  }),
  physical: fc.record({
    weight: fc.double({ min: 1, max: 100, noNaN: true }),  // 1kg to 100kg
    operatingTemp: fc.record({
      min: fc.integer({ min: -40, max: 0 }),
      max: fc.integer({ min: 40, max: 80 }),
    }),
    humidity: fc.record({
      min: fc.integer({ min: 0, max: 20 }),
      max: fc.integer({ min: 80, max: 100 }),
    }),
    ipRating: fc.constantFrom('IP20', 'IP54', 'IP65', 'IP67'),
  }),
  installation: fc.record({
    mountingType: fc.array(fc.constantFrom('wall', 'floor', 'ceiling', 'truss'), { minLength: 1, maxLength: 4 }),
    cableType: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
    maintenanceAccess: fc.constantFrom('front', 'rear', 'both'),
    wiringDirection: fc.option(fc.constantFrom('Horizontal', 'Vertical'), { nil: undefined }),
    powerDirection: fc.option(fc.constantFrom('Horizontal', 'Vertical', 'Horizontal_Left_To_Right'), { nil: undefined }),
  }),
});

/**
 * Arbitrary generator for valid RoomConfig
 */
const roomConfigArbitrary: fc.Arbitrary<RoomConfig> = fc.record({
  dimensions: fc.record({
    width: fc.double({ min: 1, max: 50, noNaN: true }),   // 1m to 50m
    height: fc.double({ min: 1, max: 30, noNaN: true }),  // 1m to 30m
    depth: fc.option(fc.double({ min: 1, max: 100, noNaN: true }), { nil: undefined }),
  }),
  unit: fc.constantFrom('meters', 'feet'),
  wallType: fc.constantFrom('flat', 'curved', 'corner'),
});

/**
 * Arbitrary generator for valid DisplayConfig
 * Generates layout with reasonable column/row counts
 */
const displayConfigArbitrary: fc.Arbitrary<DisplayConfig> = fc.record({
  layout: fc.record({
    columns: fc.integer({ min: 1, max: 50 }),  // 1 to 50 columns
    rows: fc.integer({ min: 1, max: 30 }),     // 1 to 30 rows
  }),
  resolution: fc.constantFrom('FHD', 'UHD', '8K', 'Custom'),
  resolutionMode: fc.option(fc.constantFrom('preset', 'manual'), { nil: undefined }),
  targetPixels: fc.option(fc.record({
    width: fc.integer({ min: 1920, max: 7680 }),
    height: fc.integer({ min: 1080, max: 4320 }),
  }), { nil: undefined }),
  configuration: fc.constantFrom('fit-to-wall', 'custom', 'multi-cabinet'),
  redundancy: fc.record({
    power: fc.boolean(),
    data: fc.boolean(),
    noRedundancy: fc.boolean(),
  }),
  multiCabinet: fc.option(fc.constant(undefined), { nil: undefined }),
});

/**
 * Helper function to validate CalculationResult structure
 * Checks that all required fields are present and have valid types
 */
function isValidCalculationResult(result: CalculationResult): boolean {
  // Check wallDimensions
  if (!result.wallDimensions) return false;
  if (typeof result.wallDimensions.width !== 'number') return false;
  if (typeof result.wallDimensions.height !== 'number') return false;
  if (typeof result.wallDimensions.area !== 'number') return false;
  if (typeof result.wallDimensions.diagonal !== 'number') return false;

  // Check cabinetCount
  if (!result.cabinetCount) return false;
  if (typeof result.cabinetCount.total !== 'number') return false;
  if (typeof result.cabinetCount.horizontal !== 'number') return false;
  if (typeof result.cabinetCount.vertical !== 'number') return false;

  // Check pixels
  if (!result.pixels) return false;
  if (typeof result.pixels.totalWidth !== 'number') return false;
  if (typeof result.pixels.totalHeight !== 'number') return false;
  if (typeof result.pixels.totalPixels !== 'number') return false;
  if (typeof result.pixels.pixelDensity !== 'number') return false;

  // Check powerConsumption
  if (!result.powerConsumption) return false;
  if (typeof result.powerConsumption.maximum !== 'number') return false;
  if (typeof result.powerConsumption.typical !== 'number') return false;
  if (typeof result.powerConsumption.standby !== 'number') return false;
  if (!result.powerConsumption.heatGeneration) return false;
  if (typeof result.powerConsumption.heatGeneration.maxBTU !== 'number') return false;
  if (typeof result.powerConsumption.heatGeneration.typicalBTU !== 'number') return false;

  // Check physical
  if (!result.physical) return false;
  if (typeof result.physical.totalWeight !== 'number') return false;
  if (typeof result.physical.structuralLoad !== 'number') return false;

  // Check controlSystem
  if (!result.controlSystem) return false;
  if (typeof result.controlSystem.controllers4K !== 'number') return false;
  if (typeof result.controlSystem.sendingCards !== 'number') return false;
  if (typeof result.controlSystem.fiberCables !== 'number') return false;

  return true;
}

/**
 * Helper function to check all numeric values are non-negative
 */
function hasNonNegativeValues(result: CalculationResult): boolean {
  return (
    result.wallDimensions.width >= 0 &&
    result.wallDimensions.height >= 0 &&
    result.wallDimensions.area >= 0 &&
    result.wallDimensions.diagonal >= 0 &&
    result.cabinetCount.total >= 0 &&
    result.cabinetCount.horizontal >= 0 &&
    result.cabinetCount.vertical >= 0 &&
    result.pixels.totalWidth >= 0 &&
    result.pixels.totalHeight >= 0 &&
    result.pixels.totalPixels >= 0 &&
    result.pixels.pixelDensity >= 0 &&
    result.powerConsumption.maximum >= 0 &&
    result.powerConsumption.typical >= 0 &&
    result.powerConsumption.standby >= 0 &&
    result.powerConsumption.heatGeneration.maxBTU >= 0 &&
    result.powerConsumption.heatGeneration.typicalBTU >= 0 &&
    result.physical.totalWeight >= 0 &&
    result.physical.structuralLoad >= 0 &&
    result.controlSystem.controllers4K >= 0 &&
    result.controlSystem.sendingCards >= 0 &&
    result.controlSystem.fiberCables >= 0
  );
}

/**
 * Helper function to check if two rectangles overlap
 * Returns true if the rectangles overlap (excluding touching edges)
 */
function rectanglesOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  // Two rectangles do NOT overlap if one is completely to the left, right, above, or below the other
  const noOverlap = 
    rect1.x + rect1.width <= rect2.x ||  // rect1 is to the left of rect2
    rect2.x + rect2.width <= rect1.x ||  // rect2 is to the left of rect1
    rect1.y + rect1.height <= rect2.y || // rect1 is below rect2
    rect2.y + rect2.height <= rect1.y;   // rect2 is below rect1
  
  return !noOverlap;
}

/**
 * Check if any two cabinets in the arrangement overlap
 * Returns true if there are NO overlapping cabinets (valid arrangement)
 */
function hasNoOverlappingCabinets(cabinets: ArrangedCabinet[]): boolean {
  for (let i = 0; i < cabinets.length; i++) {
    for (let j = i + 1; j < cabinets.length; j++) {
      const cab1 = cabinets[i];
      const cab2 = cabinets[j];
      
      const rect1 = {
        x: cab1.position.x,
        y: cab1.position.y,
        width: cab1.size.width,
        height: cab1.size.height
      };
      
      const rect2 = {
        x: cab2.position.x,
        y: cab2.position.y,
        width: cab2.size.width,
        height: cab2.size.height
      };
      
      if (rectanglesOverlap(rect1, rect2)) {
        return false; // Found overlapping cabinets
      }
    }
  }
  return true; // No overlapping cabinets found
}

describe('Property-Based Tests: Single Cabinet Calculation', () => {
  /**
   * Property 1: Single cabinet calculation returns complete results
   * 
   * *For any* valid cabinet specs, room config, and display config, 
   * the API response SHALL contain all required fields: wallDimensions, 
   * cabinetCount, pixels, powerConsumption, physical, and controlSystem.
   * 
   * **Feature: led-calculator-api, Property 1: Single cabinet calculation returns complete results**
   * **Validates: Requirements 1.1**
   */
  it('Property 1: Single cabinet calculation returns complete results', async () => {
    await fc.assert(
      fc.asyncProperty(
        cabinetSpecsArbitrary,
        roomConfigArbitrary,
        displayConfigArbitrary,
        async (cabinetSpecs, roomConfig, displayConfig) => {
          // Execute the calculation
          const result = await calculateDisplayWallSpecs(cabinetSpecs, roomConfig, displayConfig);

          // Property: Result must contain all required fields with valid types
          expect(isValidCalculationResult(result)).toBe(true);

          // Property: All numeric values must be non-negative
          expect(hasNonNegativeValues(result)).toBe(true);

          // Property: Cabinet count must match layout configuration
          expect(result.cabinetCount.horizontal).toBe(displayConfig.layout.columns);
          expect(result.cabinetCount.vertical).toBe(displayConfig.layout.rows);
          expect(result.cabinetCount.total).toBe(displayConfig.layout.columns * displayConfig.layout.rows);

          // Property: Pixel dimensions must be consistent with cabinet resolution and layout
          expect(result.pixels.totalWidth).toBe(
            cabinetSpecs.display.resolution.width * displayConfig.layout.columns
          );
          expect(result.pixels.totalHeight).toBe(
            cabinetSpecs.display.resolution.height * displayConfig.layout.rows
          );
          expect(result.pixels.totalPixels).toBe(
            result.pixels.totalWidth * result.pixels.totalHeight
          );

          // Property: Wall dimensions must be consistent with cabinet dimensions and layout
          const expectedWidthM = (cabinetSpecs.dimensions.width / 1000) * displayConfig.layout.columns;
          const expectedHeightM = (cabinetSpecs.dimensions.height / 1000) * displayConfig.layout.rows;
          expect(result.wallDimensions.width).toBeCloseTo(expectedWidthM, 5);
          expect(result.wallDimensions.height).toBeCloseTo(expectedHeightM, 5);

          // Property: Area must equal width * height
          expect(result.wallDimensions.area).toBeCloseTo(
            result.wallDimensions.width * result.wallDimensions.height,
            5
          );

          // Property: Power consumption must scale with cabinet count
          const totalCabinets = result.cabinetCount.total;
          expect(result.powerConsumption.maximum).toBe(cabinetSpecs.power.maxPower * totalCabinets);
          expect(result.powerConsumption.typical).toBe(cabinetSpecs.power.typicalPower * totalCabinets);
          expect(result.powerConsumption.standby).toBe(cabinetSpecs.power.standbyPower * totalCabinets);

          // Property: Weight must scale with cabinet count
          expect(result.physical.totalWeight).toBeCloseTo(
            cabinetSpecs.physical.weight * totalCabinets,
            5
          );
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });
});


/**
 * Arbitrary generator for valid CabinetSelection
 * Generates cabinet selections with realistic counts and priorities
 */
const cabinetSelectionArbitrary: fc.Arbitrary<CabinetSelection> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  specs: cabinetSpecsArbitrary,
  count: fc.integer({ min: 1, max: 100 }),  // 1 to 100 cabinets per type
  priority: fc.integer({ min: 0, max: 10 }), // Priority 0-10
});

/**
 * Arbitrary generator for screen dimensions (in mm)
 * Generates realistic screen sizes
 */
const screenDimensionsArbitrary = fc.record({
  width: fc.integer({ min: 500, max: 20000 }),   // 500mm to 20m
  height: fc.integer({ min: 500, max: 10000 }),  // 500mm to 10m
});

/**
 * Import SVG generator for Property 8 test
 */
import { generateSVGPreview, countCabinetsInSVG } from '../src/utils/svg-generator';

describe('Property-Based Tests: Multi-Cabinet Arrangement', () => {
  /**
   * Property 3: Multi-cabinet arrangement has no overlapping cabinets
   * 
   * *For any* multi-cabinet calculation result, no two cabinets in the arrangement 
   * SHALL have overlapping positions (their bounding boxes must not intersect).
   * 
   * **Feature: led-calculator-api, Property 3: Multi-cabinet arrangement has no overlapping cabinets**
   * **Validates: Requirements 2.2**
   */
  it('Property 3: Multi-cabinet arrangement has no overlapping cabinets (row-wise)', () => {
    fc.assert(
      fc.property(
        screenDimensionsArbitrary,
        fc.array(cabinetSelectionArbitrary, { minLength: 1, maxLength: 5 }),
        (screenDims, cabinetSelections) => {
          // Execute the row-wise arrangement
          const result = arrangeBoxesRowWise(
            screenDims.width,
            screenDims.height,
            cabinetSelections
          );

          // Property: No two cabinets should overlap
          expect(hasNoOverlappingCabinets(result.cabinets)).toBe(true);

          // Additional invariant: All cabinets should be within screen bounds
          for (const cabinet of result.cabinets) {
            expect(cabinet.position.x).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.y).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.x + cabinet.size.width).toBeLessThanOrEqual(screenDims.width);
            expect(cabinet.position.y + cabinet.size.height).toBeLessThanOrEqual(screenDims.height);
          }
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });

  it('Property 3: Multi-cabinet arrangement has no overlapping cabinets (column-wise)', () => {
    fc.assert(
      fc.property(
        screenDimensionsArbitrary,
        fc.array(cabinetSelectionArbitrary, { minLength: 1, maxLength: 5 }),
        (screenDims, cabinetSelections) => {
          // Execute the column-wise arrangement
          const result = arrangeBoxesColumnWise(
            screenDims.width,
            screenDims.height,
            cabinetSelections
          );

          // Property: No two cabinets should overlap
          expect(hasNoOverlappingCabinets(result.cabinets)).toBe(true);

          // Additional invariant: All cabinets should be within screen bounds
          for (const cabinet of result.cabinets) {
            expect(cabinet.position.x).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.y).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.x + cabinet.size.width).toBeLessThanOrEqual(screenDims.width);
            expect(cabinet.position.y + cabinet.size.height).toBeLessThanOrEqual(screenDims.height);
          }
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });

  it('Property 3: Multi-cabinet arrangement has no overlapping cabinets (auto)', () => {
    fc.assert(
      fc.property(
        screenDimensionsArbitrary,
        fc.array(cabinetSelectionArbitrary, { minLength: 1, maxLength: 5 }),
        (screenDims, cabinetSelections) => {
          // Execute the auto arrangement (selects best strategy)
          const result = arrangeBoxesAuto(
            screenDims.width,
            screenDims.height,
            cabinetSelections
          );

          // Property: No two cabinets should overlap
          expect(hasNoOverlappingCabinets(result.cabinets)).toBe(true);

          // Additional invariant: All cabinets should be within screen bounds
          for (const cabinet of result.cabinets) {
            expect(cabinet.position.x).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.y).toBeGreaterThanOrEqual(0);
            expect(cabinet.position.x + cabinet.size.width).toBeLessThanOrEqual(screenDims.width);
            expect(cabinet.position.y + cabinet.size.height).toBeLessThanOrEqual(screenDims.height);
          }

          // Additional invariant: Coverage should be between 0 and 1
          expect(result.coverage).toBeGreaterThanOrEqual(0);
          expect(result.coverage).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });
});


/**
 * Arbitrary generator for valid CalculationResult for single cabinet mode
 * Generates calculation results with consistent cabinet counts
 */
const singleCabinetCalculationResultArbitrary: fc.Arbitrary<CalculationResult> = fc.record({
  wallDimensions: fc.record({
    width: fc.double({ min: 0.5, max: 50, noNaN: true }),
    height: fc.double({ min: 0.5, max: 30, noNaN: true }),
    area: fc.double({ min: 0.25, max: 1500, noNaN: true }),
    diagonal: fc.double({ min: 10, max: 2000, noNaN: true }),
  }),
  cabinetCount: fc.record({
    total: fc.integer({ min: 1, max: 100 }),
    horizontal: fc.integer({ min: 1, max: 20 }),
    vertical: fc.integer({ min: 1, max: 20 }),
  }).filter(count => count.total === count.horizontal * count.vertical),
  pixels: fc.record({
    totalWidth: fc.integer({ min: 64, max: 20000 }),
    totalHeight: fc.integer({ min: 64, max: 10000 }),
    totalPixels: fc.integer({ min: 4096, max: 200000000 }),
    pixelDensity: fc.double({ min: 1000, max: 10000000, noNaN: true }),
  }),
  powerConsumption: fc.record({
    maximum: fc.integer({ min: 100, max: 200000 }),
    typical: fc.integer({ min: 50, max: 100000 }),
    standby: fc.integer({ min: 1, max: 5000 }),
    heatGeneration: fc.record({
      maxBTU: fc.double({ min: 100, max: 700000, noNaN: true }),
      typicalBTU: fc.double({ min: 50, max: 350000, noNaN: true }),
    }),
  }),
  physical: fc.record({
    totalWeight: fc.double({ min: 1, max: 10000, noNaN: true }),
    structuralLoad: fc.double({ min: 1, max: 500, noNaN: true }),
  }),
  controlSystem: fc.record({
    controllers4K: fc.integer({ min: 1, max: 50 }),
    sendingCards: fc.integer({ min: 1, max: 100 }),
    fiberCables: fc.integer({ min: 1, max: 200 }),
  }),
});

/**
 * Arbitrary generator for multi-cabinet CalculationResult with arrangement
 * Generates calculation results with cabinet arrangement data
 */
const multiCabinetCalculationResultArbitrary: fc.Arbitrary<CalculationResult> = fc.tuple(
  fc.integer({ min: 1, max: 30 }),  // Number of cabinets
  fc.integer({ min: 500, max: 20000 }),  // Screen width in mm
  fc.integer({ min: 500, max: 10000 }),  // Screen height in mm
).chain(([numCabinets, screenWidthMm, screenHeightMm]) => {
  // Generate arranged cabinets
  const arrangedCabinetsArbitrary = fc.array(
    fc.record({
      cabinetId: fc.string({ minLength: 1, maxLength: 10 }),
      specs: cabinetSpecsArbitrary,
      position: fc.record({
        x: fc.integer({ min: 0, max: screenWidthMm }),
        y: fc.integer({ min: 0, max: screenHeightMm }),
      }),
      size: fc.record({
        width: fc.integer({ min: 100, max: 1000 }),
        height: fc.integer({ min: 100, max: 1000 }),
      }),
    }),
    { minLength: numCabinets, maxLength: numCabinets }
  );

  return arrangedCabinetsArbitrary.map(cabinets => ({
    wallDimensions: {
      width: screenWidthMm / 1000,
      height: screenHeightMm / 1000,
      area: (screenWidthMm / 1000) * (screenHeightMm / 1000),
      diagonal: Math.sqrt(Math.pow(screenWidthMm / 25.4, 2) + Math.pow(screenHeightMm / 25.4, 2)),
    },
    cabinetCount: {
      total: numCabinets,
      horizontal: Math.ceil(Math.sqrt(numCabinets)),
      vertical: Math.ceil(numCabinets / Math.ceil(Math.sqrt(numCabinets))),
    },
    arrangement: {
      cabinets,
      totalArea: cabinets.reduce((sum, c) => sum + c.size.width * c.size.height, 0),
      screenArea: screenWidthMm * screenHeightMm,
      coverage: 0.8,
      isFullyFilled: false,
      strategy: 'row_wise' as const,
    },
    pixels: {
      totalWidth: 1920,
      totalHeight: 1080,
      totalPixels: 1920 * 1080,
      pixelDensity: 100000,
    },
    powerConsumption: {
      maximum: 1000 * numCabinets,
      typical: 500 * numCabinets,
      standby: 10 * numCabinets,
      heatGeneration: {
        maxBTU: 3412 * numCabinets,
        typicalBTU: 1706 * numCabinets,
      },
    },
    physical: {
      totalWeight: 10 * numCabinets,
      structuralLoad: 50,
    },
    controlSystem: {
      controllers4K: 1,
      sendingCards: 1,
      fiberCables: 2,
    },
  } as CalculationResult));
});

describe('Property-Based Tests: SVG Preview Generation', () => {
  /**
   * Property 8: SVG preview contains all cabinets
   * 
   * *For any* calculation result with N cabinets, the generated SVG 
   * SHALL contain exactly N cabinet rectangles.
   * 
   * **Feature: led-calculator-api, Property 8: SVG preview contains all cabinets**
   * **Validates: Requirements 7.2**
   */
  it('Property 8: SVG preview contains all cabinets (single cabinet mode)', () => {
    fc.assert(
      fc.property(
        singleCabinetCalculationResultArbitrary,
        roomConfigArbitrary,
        (calculationResult, roomConfig) => {
          // Generate SVG preview
          const svgString = generateSVGPreview(calculationResult, roomConfig, {
            showDimensions: true,
            showPerson: true,
            canvasWidth: 800,
            canvasHeight: 500,
          });

          // Count cabinet rectangles in SVG
          const cabinetCount = countCabinetsInSVG(svgString);

          // Property: SVG should contain exactly the same number of cabinets
          // as specified in the calculation result
          const expectedCabinets = calculationResult.cabinetCount.total;
          
          expect(cabinetCount).toBe(expectedCabinets);

          // Additional invariant: SVG should be valid XML
          expect(svgString).toContain('<?xml version="1.0"');
          expect(svgString).toContain('<svg');
          expect(svgString).toContain('</svg>');
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });

  it('Property 8: SVG preview contains all cabinets (multi-cabinet mode)', () => {
    fc.assert(
      fc.property(
        multiCabinetCalculationResultArbitrary,
        roomConfigArbitrary,
        (calculationResult, roomConfig) => {
          // Ensure room dimensions are at least as large as wall dimensions
          const adjustedRoomConfig = {
            ...roomConfig,
            dimensions: {
              ...roomConfig.dimensions,
              width: Math.max(roomConfig.dimensions.width, calculationResult.wallDimensions.width + 1),
              height: Math.max(roomConfig.dimensions.height, calculationResult.wallDimensions.height + 1),
            },
          };

          // Generate SVG preview
          const svgString = generateSVGPreview(calculationResult, adjustedRoomConfig, {
            showDimensions: true,
            showPerson: true,
            canvasWidth: 800,
            canvasHeight: 500,
          });

          // Count cabinet rectangles in SVG
          const cabinetCount = countCabinetsInSVG(svgString);

          // Property: SVG should contain exactly the same number of cabinets
          // as in the arrangement
          const expectedCabinets = calculationResult.arrangement!.cabinets.length;
          
          expect(cabinetCount).toBe(expectedCabinets);

          // Additional invariant: SVG should be valid XML
          expect(svgString).toContain('<?xml version="1.0"');
          expect(svgString).toContain('<svg');
          expect(svgString).toContain('</svg>');
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });

  /**
   * Property 9: SVG dimensions match request
   * 
   * *For any* SVG preview request with showDimensions=true, the generated SVG 
   * SHALL contain dimension annotation elements.
   * 
   * **Feature: led-calculator-api, Property 9: SVG dimensions match request**
   * **Validates: Requirements 7.3**
   */
  it('Property 9: SVG dimensions match request (showDimensions=true includes annotations)', () => {
    fc.assert(
      fc.property(
        singleCabinetCalculationResultArbitrary,
        roomConfigArbitrary,
        (calculationResult, roomConfig) => {
          // Generate SVG preview with showDimensions=true
          const svgWithDimensions = generateSVGPreview(calculationResult, roomConfig, {
            showDimensions: true,
            showPerson: true,
            canvasWidth: 800,
            canvasHeight: 500,
          });

          // Property: SVG with showDimensions=true should contain dimension annotations
          // Check for dimension annotation lines (stroke="#9CA3AF" for wall, stroke="#000000" for screen)
          expect(svgWithDimensions).toContain('stroke="#9CA3AF"'); // Wall dimension lines
          expect(svgWithDimensions).toContain('stroke="#000000"'); // Screen dimension lines
          
          // Check for dimension text with unit labels
          const hasMetersUnit = svgWithDimensions.includes(' m</text>');
          const hasFeetUnit = svgWithDimensions.includes(' ft</text>');
          expect(hasMetersUnit || hasFeetUnit).toBe(true);
          
          // Check for font-weight attributes used in dimension annotations
          expect(svgWithDimensions).toContain('font-weight="600"'); // Wall dimension text
          expect(svgWithDimensions).toContain('font-weight="bold"'); // Screen dimension text
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });

  it('Property 9: SVG dimensions match request (showDimensions=false excludes annotations)', () => {
    fc.assert(
      fc.property(
        singleCabinetCalculationResultArbitrary,
        roomConfigArbitrary,
        (calculationResult, roomConfig) => {
          // Generate SVG preview with showDimensions=false
          const svgWithoutDimensions = generateSVGPreview(calculationResult, roomConfig, {
            showDimensions: false,
            showPerson: true,
            canvasWidth: 800,
            canvasHeight: 500,
          });

          // Property: SVG with showDimensions=false should NOT contain dimension annotations
          // Should not have the wall dimension text styling (font-weight="600")
          expect(svgWithoutDimensions).not.toContain('font-weight="600"');
          
          // Should not have dimension unit labels in text elements
          // Note: We check for the specific pattern of dimension text, not just any 'm' or 'ft'
          const dimensionTextPattern = />\d+\.?\d*\s*(m|ft)<\/text>/;
          expect(dimensionTextPattern.test(svgWithoutDimensions)).toBe(false);
        }
      ),
      { numRuns: 100 }  // Run at least 100 iterations as specified in design doc
    );
  });
});
