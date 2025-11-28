/**
 * Precise Linear Equation Solver - For Multi-Cabinet Geometric Tiling
 * Based on Diophantine equation solving for perfect cabinet tiling scenarios
 * Adapted from src/products/utils/linear-equation-calculator.ts for API use
 * Requirements: 2.1, 3.1
 * 
 * Algorithm Principle:
 * - Case 1 (Same Width): n×W × (a×h1 + b×h2) = Screen Size
 * - Case 2 (Same Height): (a×w1 + b×w2) × n×H = Screen Size
 * - Case 3 (General): Area matching + geometric verification
 */

import { CabinetSelection } from '../types';

/**
 * Linear equation solution result
 */
export interface LinearSolutionResult {
  success: boolean;
  counts: number[]; // Count for each cabinet type
  explanation: string;
  geometry: {
    screenWidth: number;  // mm
    screenHeight: number; // mm
    layout: string; // Layout description
  };
}

/**
 * Precise linear Diophantine equation solver
 * Solves a*x + b*y = c for non-negative integer solutions
 * 
 * @param a First coefficient
 * @param b Second coefficient  
 * @param c Target value
 * @param maxIterations Maximum iterations
 * @returns All possible solutions [x, y][]
 */
function solveLinearEquation(
  a: number, 
  b: number, 
  c: number, 
  maxIterations: number = 100
): Array<[number, number]> {
  const solutions: Array<[number, number]> = [];
  const maxX = a > 0 ? Math.floor(c / a) + 1 : maxIterations;
  
  for (let x = 0; x <= Math.min(maxX, maxIterations); x++) {
    const remaining = c - a * x;
    if (remaining < 0) break;
    
    if (b === 0) {
      // Special case: b is 0, only verify if remaining is 0
      if (Math.abs(remaining) < 1e-6) {
        solutions.push([x, 0]);
      }
    } else {
      const y = remaining / b;
      // Check if y is non-negative integer (allow 1mm tolerance)
      if (Math.abs(y - Math.round(y)) < 1e-3 && y >= 0) {
        const yInt = Math.round(y);
        // Verify solution accuracy (allow 1mm tolerance)
        if (Math.abs(a * x + b * yInt - c) < 1) {
          solutions.push([x, yInt]);
        }
      }
    }
  }
  
  return solutions;
}

/**
 * Case 1: Same width, different height
 * Solve: W = n×w, H = a×h1 + b×h2
 * 
 * @param cabA Cabinet A specs (main cabinet, prioritized)
 * @param cabB Cabinet B specs (auxiliary cabinet)
 * @param screenWidthMm Screen width (mm)
 * @param screenHeightMm Screen height (mm)
 * @returns Solution
 */
function solveSameWidthCombination(
  cabA: { w: number; h: number; name: string; area: number },
  cabB: { w: number; h: number; name: string; area: number },
  screenWidthMm: number,
  screenHeightMm: number
): LinearSolutionResult | null {
  const commonWidth = cabA.w;
  
  // Calculate columns needed for width
  const widthCount = screenWidthMm / commonWidth;
  if (Math.abs(widthCount - Math.round(widthCount)) > 0.01) {
    return null;
  }
  
  const nWidth = Math.round(widthCount);
  
  // Solve linear equation: a×h1 + b×h2 = screenHeight
  const h1 = cabA.h;
  const h2 = cabB.h;
  const H = screenHeightMm;
  
  const solutions = solveLinearEquation(h1, h2, H);
  
  if (solutions.length > 0) {
    // Prioritize solutions with most main cabinet (cabA) count
    const sortedSolutions = solutions.sort((sol1, sol2) => sol2[0] - sol1[0]);
    
    for (let i = 0; i < sortedSolutions.length; i++) {
      const [a, b] = sortedSolutions[i];
      const countA = a * nWidth;
      const countB = b * nWidth;
      const area1 = countA * cabA.area;
      const area2 = countB * cabB.area;
      const totalArea = area1 + area2;
      const targetArea = (screenWidthMm * screenHeightMm) / 1000000;
      
      if (Math.abs(totalArea - targetArea) < 0.001) {
        return {
          success: true,
          counts: [countA, countB],
          explanation: `Same width layout: ${nWidth} columns × (${a} rows ${cabA.name} + ${b} rows ${cabB.name})`,
          geometry: {
            screenWidth: screenWidthMm,
            screenHeight: screenHeightMm,
            layout: `${nWidth} cols × ${a} rows(${h1}mm) + ${b} rows(${h2}mm) = ${screenWidthMm}×${screenHeightMm}mm`
          }
        };
      }
    }
  }
  
  return null;
}

/**
 * Case 2: Same height, different width
 * Solve: W = a×w1 + b×w2, H = n×h
 * 
 * @param cabA Cabinet A specs (main cabinet, prioritized)
 * @param cabB Cabinet B specs (auxiliary cabinet)
 * @param screenWidthMm Screen width (mm)
 * @param screenHeightMm Screen height (mm)
 * @returns Solution
 */
function solveSameHeightCombination(
  cabA: { w: number; h: number; name: string; area: number },
  cabB: { w: number; h: number; name: string; area: number },
  screenWidthMm: number,
  screenHeightMm: number
): LinearSolutionResult | null {
  const commonHeight = cabA.h;
  
  // Calculate rows needed for height
  const heightCount = screenHeightMm / commonHeight;
  if (Math.abs(heightCount - Math.round(heightCount)) > 0.01) {
    return null;
  }
  
  const nHeight = Math.round(heightCount);
  
  // Solve linear equation: a×w1 + b×w2 = screenWidth
  const w1 = cabA.w;
  const w2 = cabB.w;
  const W = screenWidthMm;
  
  const solutions = solveLinearEquation(w1, w2, W);
  
  if (solutions.length > 0) {
    // Prioritize solutions with most main cabinet (cabA) count
    const sortedSolutions = solutions.sort((sol1, sol2) => sol2[0] - sol1[0]);
    
    for (let i = 0; i < sortedSolutions.length; i++) {
      const [a, b] = sortedSolutions[i];
      const countA = a * nHeight;
      const countB = b * nHeight;
      const area1 = countA * cabA.area;
      const area2 = countB * cabB.area;
      const totalArea = area1 + area2;
      const targetArea = (screenWidthMm * screenHeightMm) / 1000000;
      
      if (Math.abs(totalArea - targetArea) < 0.001) {
        return {
          success: true,
          counts: [countA, countB],
          explanation: `Same height layout: (${a} cols ${cabA.name} + ${b} cols ${cabB.name}) × ${nHeight} rows`,
          geometry: {
            screenWidth: screenWidthMm,
            screenHeight: screenHeightMm,
            layout: `(${a} cols(${w1}mm) + ${b} cols(${w2}mm)) × ${nHeight} rows = ${screenWidthMm}×${screenHeightMm}mm`
          }
        };
      }
    }
  }
  
  return null;
}

/**
 * Precise two-cabinet linear equation solver - Main function
 * For perfect tiling scenarios with two cabinet types
 * 
 * @param cabinetSelections Two cabinet selections (must be exactly 2)
 * @param screenWidthM Screen width (meters)
 * @param screenHeightM Screen height (meters)
 * @returns Solution result
 */
export function solveLinearTwoCabinets(
  cabinetSelections: CabinetSelection[],
  screenWidthM: number,
  screenHeightM: number
): LinearSolutionResult | null {
  if (cabinetSelections.length !== 2) {
    return null;
  }
  
  if (screenWidthM <= 0 || screenHeightM <= 0) {
    return null;
  }
  
  const screenWidthMm = Math.round(screenWidthM * 1000);
  const screenHeightMm = Math.round(screenHeightM * 1000);
  
  const [selectionA, selectionB] = cabinetSelections;
  const cabA = {
    w: selectionA.specs.dimensions.width,
    h: selectionA.specs.dimensions.height,
    name: selectionA.specs.name,
    area: (selectionA.specs.dimensions.width * selectionA.specs.dimensions.height) / 1000000
  };
  const cabB = {
    w: selectionB.specs.dimensions.width,
    h: selectionB.specs.dimensions.height,
    name: selectionB.specs.name,
    area: (selectionB.specs.dimensions.width * selectionB.specs.dimensions.height) / 1000000
  };
  
  // Case 1: Same width, different height
  if (Math.abs(cabA.w - cabB.w) < 1) {
    const result = solveSameWidthCombination(cabA, cabB, screenWidthMm, screenHeightMm);
    if (result) return result;
    // If same width but cannot tile perfectly, fail directly
    return null;
  }
  
  // Case 2: Same height, different width
  if (Math.abs(cabA.h - cabB.h) < 1) {
    const result = solveSameHeightCombination(cabA, cabB, screenWidthMm, screenHeightMm);
    if (result) return result;
    // If same height but cannot tile perfectly, fail directly
    return null;
  }
  
  // Case 3: Both width and height different - linear equation not applicable
  return null;
}
