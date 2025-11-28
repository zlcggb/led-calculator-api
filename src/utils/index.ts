/**
 * Utils Index
 * Central export for all utility functions
 * Requirements: 1.1, 2.1, 2.2, 3.1
 */

// Main calculator functions
export {
  calculateDisplayWallSpecs,
  calculateOptimalLayout,
  calculateStructuralRequirements,
  calculateMultiCabinetDisplayWall,
  progressiveCabinetCombinationTest,
  enhancedProgressiveCabinetCombination,
  formatNumber,
  unitConverter,
} from './configurator-calculator';

// Multi-cabinet arrangement functions
export {
  arrangeBoxesRowWise,
  arrangeBoxesColumnWise,
  arrangeBoxesAuto,
  getArrangementStats,
} from './multi-cabinet-calculator';

// Linear equation solver
export {
  solveLinearTwoCabinets,
  type LinearSolutionResult,
} from './linear-equation-calculator';

// SVG preview generator
export {
  generateSVGPreview,
  countCabinetsInSVG,
  hasDimensionAnnotations,
  type SVGGeneratorOptions,
} from './svg-generator';
