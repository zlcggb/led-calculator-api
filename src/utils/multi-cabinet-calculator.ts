/**
 * Multi-Cabinet Packing Calculator
 * Adapted from src/products/utils/multi-cabinet-calculator.ts for API use
 * Requirements: 2.1, 2.2
 */

import { 
  CabinetSpecs, 
  CabinetSelection, 
  ArrangedCabinet, 
  ArrangementResult 
} from '../types';

// Working cabinet unit (in millimeters)
interface WorkingCabinet {
  id: string;
  specs: CabinetSpecs;
  width: number;   // width (mm)
  height: number;  // height (mm)
  area: number;    // area (mm²)
  count: number;   // remaining available count
  priority: number; // priority
}

/**
 * 🎯 获取主导箱体宽度（数量最多的箱体）
 */
function getDominantWidth(boxes: WorkingCabinet[]): number {
  const dominantBox = boxes.reduce((max, box) => 
    box.count > max.count ? box : max
  );
  return dominantBox.width;
}

/**
 * 🎯 智能列宽度对齐：在放置时选择最优箱体
 * 同高度时，优先使用与主导箱体宽度相同的箱体（列对齐）
 */
function findBestCabinetForPosition(
  boxes: WorkingCabinet[],
  xOffset: number,
  yOffset: number,
  screenWidth: number,
  screenHeight: number,
  dominantWidth: number,
  currentRowHeight: number
): WorkingCabinet | null {
  // 筛选出能放置的箱体
  const candidates = boxes.filter(box => 
    box.count > 0 &&
    xOffset + box.width <= screenWidth &&
    yOffset + box.height <= screenHeight &&
    // 如果当前行已有高度，只选择相同高度的箱体
    (currentRowHeight === 0 || box.height === currentRowHeight)
  );
  
  if (candidates.length === 0) return null;
  
  // 按优先级排序候选箱体
  candidates.sort((a, b) => {
    // 第一优先级：优先使用与主导箱体宽度相同的箱体（确保列对齐）
    const aMatchesDominant = a.width === dominantWidth;
    const bMatchesDominant = b.width === dominantWidth;
    
    if (aMatchesDominant && !bMatchesDominant) return -1;
    if (!aMatchesDominant && bMatchesDominant) return 1;
    
    // 第二优先级：按宽度从小到大（小箱体放后面）
    return a.width - b.width;
  });
  
  return candidates[0];
}

/**
 * 🎯 智能列宽度对齐排序（用于确定行的处理顺序）
 * 高度从大到小，先处理主体区域
 */
function sortByHeightDescending(boxes: WorkingCabinet[]): WorkingCabinet[] {
  return [...boxes].sort((a, b) => b.height - a.height);
}

/**
 * Row-wise cabinet arrangement algorithm
 * Fills screen from left to right, bottom to top
 * 🎯 智能列宽度对齐：同高度时优先使用与主导箱体宽度相同的箱体
 */
export function arrangeBoxesRowWise(
  screenWidth: number,    // screen width (mm)
  screenHeight: number,   // screen height (mm) 
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // Prepare working cabinet data
  const workingBoxes: WorkingCabinet[] = cabinetSelections.map(selection => ({
    id: selection.id,
    specs: selection.specs,
    width: selection.specs.dimensions.width,
    height: selection.specs.dimensions.height,
    area: selection.specs.dimensions.width * selection.specs.dimensions.height,
    count: selection.count,
    priority: selection.priority || 0
  }));

  // 🎯 获取主导箱体宽度（数量最多的箱体）
  const dominantWidth = getDominantWidth(workingBoxes);
  
  // 按高度排序，先处理高度大的行（主体区域）
  const heightSortedBoxes = sortByHeightDescending(workingBoxes);

  const arrangement: ArrangedCabinet[] = [];
  let yOffset = 0; // Start from bottom of screen

  let maxIterations = 10000; // Prevent infinite loop
  let currentIterations = 0;
  
  while (yOffset < screenHeight && currentIterations < maxIterations) {
    let rowHeight = 0;
    let xOffset = 0; // Each row starts from left

    while (xOffset < screenWidth && currentIterations < maxIterations) {
      currentIterations++;
      
      // 🎯 智能选择：优先使用与主导箱体宽度相同的箱体
      const bestBox = findBestCabinetForPosition(
        workingBoxes,
        xOffset,
        yOffset,
        screenWidth,
        screenHeight,
        dominantWidth,
        rowHeight
      );
      
      if (bestBox) {
        // Place cabinet
        bestBox.count -= 1;
        
        const arrangedCabinet: ArrangedCabinet = {
          cabinetId: bestBox.id,
          specs: bestBox.specs,
          position: {
            x: xOffset,
            y: yOffset
          },
          size: {
            width: bestBox.width,
            height: bestBox.height
          },
          gridPosition: {
            row: Math.floor(yOffset / bestBox.height),
            col: Math.floor(xOffset / bestBox.width)
          }
        };
        
        arrangement.push(arrangedCabinet);
        xOffset += bestBox.width;
        rowHeight = Math.max(rowHeight, bestBox.height);
      } else {
        // 没有找到合适的箱体，尝试放置任意可用箱体
        let placed = false;
        for (const box of heightSortedBoxes) {
          if (box.count > 0 && 
              xOffset + box.width <= screenWidth && 
              yOffset + box.height <= screenHeight) {
            
            box.count -= 1;
            
            const arrangedCabinet: ArrangedCabinet = {
              cabinetId: box.id,
              specs: box.specs,
              position: {
                x: xOffset,
                y: yOffset
              },
              size: {
                width: box.width,
                height: box.height
              },
              gridPosition: {
                row: Math.floor(yOffset / box.height),
                col: Math.floor(xOffset / box.width)
              }
            };
            
            arrangement.push(arrangedCabinet);
            xOffset += box.width;
            rowHeight = Math.max(rowHeight, box.height);
            placed = true;
            break;
          }
        }
        
        if (!placed) {
          xOffset += 1; // Move xOffset to avoid deadlock
        }
      }
    }

    if (rowHeight === 0) {
      break; // Cannot place any cabinet in current row
    }

    yOffset += rowHeight; // Move to next row
  }

  return calculateArrangementResult(arrangement, screenWidth, screenHeight, 'row_wise', maxErrorRate);
}

/**
 * 🎯 智能列宽度对齐：在列模式放置时选择最优箱体
 * 同列内优先使用与主导箱体宽度相同的箱体
 */
function findBestCabinetForColumnPosition(
  boxes: WorkingCabinet[],
  xOffset: number,
  yOffset: number,
  screenWidth: number,
  screenHeight: number,
  dominantWidth: number,
  currentColWidth: number
): WorkingCabinet | null {
  // 筛选出能放置的箱体
  const candidates = boxes.filter(box => 
    box.count > 0 &&
    xOffset + box.width <= screenWidth &&
    yOffset + box.height <= screenHeight &&
    // 如果当前列已有宽度，只选择相同宽度的箱体（确保列对齐）
    (currentColWidth === 0 || box.width === currentColWidth)
  );
  
  if (candidates.length === 0) return null;
  
  // 按优先级排序候选箱体
  candidates.sort((a, b) => {
    // 第一优先级：优先使用与主导箱体宽度相同的箱体（确保列对齐）
    const aMatchesDominant = a.width === dominantWidth;
    const bMatchesDominant = b.width === dominantWidth;
    
    if (aMatchesDominant && !bMatchesDominant) return -1;
    if (!aMatchesDominant && bMatchesDominant) return 1;
    
    // 第二优先级：按高度从大到小（大箱体优先）
    return b.height - a.height;
  });
  
  return candidates[0];
}

/**
 * Column-wise cabinet arrangement algorithm
 * Fills screen from left to right, bottom to top
 * 🎯 智能列宽度对齐：优先使用与主导箱体宽度相同的箱体
 */
export function arrangeBoxesColumnWise(
  screenWidth: number,    // screen width (mm)
  screenHeight: number,   // screen height (mm)
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // Prepare working cabinet data
  const workingBoxes: WorkingCabinet[] = cabinetSelections.map(selection => ({
    id: selection.id,
    specs: selection.specs,
    width: selection.specs.dimensions.width,
    height: selection.specs.dimensions.height,
    area: selection.specs.dimensions.width * selection.specs.dimensions.height,
    count: selection.count,
    priority: selection.priority || 0
  }));

  // 🎯 获取主导箱体宽度（数量最多的箱体）
  const dominantWidth = getDominantWidth(workingBoxes);
  
  // 按高度排序作为fallback
  const heightSortedBoxes = sortByHeightDescending(workingBoxes);

  const arrangement: ArrangedCabinet[] = [];
  let xOffset = 0; // Start from left of screen

  let maxIterations = 10000; // Prevent infinite loop
  let currentIterations = 0;
  
  while (xOffset < screenWidth && currentIterations < maxIterations) {
    let colWidth = 0;
    let yOffset = 0; // Each column starts from bottom

    while (yOffset < screenHeight && currentIterations < maxIterations) {
      currentIterations++;
      
      // 🎯 智能选择：优先使用与主导箱体宽度相同的箱体
      const bestBox = findBestCabinetForColumnPosition(
        workingBoxes,
        xOffset,
        yOffset,
        screenWidth,
        screenHeight,
        dominantWidth,
        colWidth
      );
      
      if (bestBox) {
        // Place cabinet
        bestBox.count -= 1;
        
        const arrangedCabinet: ArrangedCabinet = {
          cabinetId: bestBox.id,
          specs: bestBox.specs,
          position: {
            x: xOffset,
            y: yOffset
          },
          size: {
            width: bestBox.width,
            height: bestBox.height
          },
          gridPosition: {
            row: Math.floor(yOffset / bestBox.height),
            col: Math.floor(xOffset / bestBox.width)
          }
        };
        
        arrangement.push(arrangedCabinet);
        yOffset += bestBox.height;
        colWidth = Math.max(colWidth, bestBox.width);
      } else {
        // 没有找到合适的箱体，尝试放置任意可用箱体
        let placed = false;
        for (const box of heightSortedBoxes) {
          if (box.count > 0 && 
              xOffset + box.width <= screenWidth && 
              yOffset + box.height <= screenHeight) {
            
            box.count -= 1;
            
            const arrangedCabinet: ArrangedCabinet = {
              cabinetId: box.id,
              specs: box.specs,
              position: {
                x: xOffset,
                y: yOffset
              },
              size: {
                width: box.width,
                height: box.height
              },
              gridPosition: {
                row: Math.floor(yOffset / box.height),
                col: Math.floor(xOffset / box.width)
              }
            };
            
            arrangement.push(arrangedCabinet);
            yOffset += box.height;
            colWidth = Math.max(colWidth, box.width);
            placed = true;
            break;
          }
        }
        
        if (!placed) {
          yOffset += 1; // Move yOffset to avoid deadlock
        }
      }
    }

    if (colWidth === 0) {
      break; // Cannot place any cabinet in current column
    }

    xOffset += colWidth; // Move to next column
  }

  return calculateArrangementResult(arrangement, screenWidth, screenHeight, 'column_wise', maxErrorRate);
}

/**
 * Auto-select optimal arrangement strategy
 */
export function arrangeBoxesAuto(
  screenWidth: number,    // screen width (mm)
  screenHeight: number,   // screen height (mm)
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // Try both strategies
  const rowWiseResult = arrangeBoxesRowWise(screenWidth, screenHeight, cabinetSelections, maxErrorRate);
  const columnWiseResult = arrangeBoxesColumnWise(screenWidth, screenHeight, cabinetSelections, maxErrorRate);
  
  // Select result with higher coverage
  if (rowWiseResult.coverage > columnWiseResult.coverage) {
    return rowWiseResult;
  } else if (columnWiseResult.coverage > rowWiseResult.coverage) {
    return columnWiseResult;
  }
  
  // If coverage is same, select result with fewer cabinets
  if (rowWiseResult.cabinets.length <= columnWiseResult.cabinets.length) {
    return rowWiseResult;
  } else {
    return columnWiseResult;
  }
}

/**
 * Calculate arrangement result statistics
 */
function calculateArrangementResult(
  arrangement: ArrangedCabinet[],
  screenWidth: number,
  screenHeight: number,
  strategy: 'row_wise' | 'column_wise',
  maxErrorRate: number
): ArrangementResult {
  
  // Calculate total occupied area
  const totalArea = arrangement.reduce((sum, cabinet) => {
    return sum + (cabinet.size.width * cabinet.size.height);
  }, 0);
  
  const screenArea = screenWidth * screenHeight;
  const coverage = screenArea > 0 ? totalArea / screenArea : 0;
  
  // Check if fully filled (within error rate)
  const errorRate = Math.abs(totalArea - screenArea) / screenArea;
  const isFullyFilled = errorRate <= maxErrorRate;
  
  return {
    cabinets: arrangement,
    totalArea,
    screenArea,
    coverage,
    isFullyFilled,
    strategy
  };
}

/**
 * Get arrangement result statistics
 */
export function getArrangementStats(result: ArrangementResult) {
  const cabinetStats = new Map<string, { count: number; specs: CabinetSpecs }>();
  
  result.cabinets.forEach(cabinet => {
    const existing = cabinetStats.get(cabinet.cabinetId);
    if (existing) {
      existing.count += 1;
    } else {
      cabinetStats.set(cabinet.cabinetId, {
        count: 1,
        specs: cabinet.specs
      });
    }
  });
  
  return {
    totalCabinets: result.cabinets.length,
    cabinetTypes: cabinetStats.size,
    cabinetBreakdown: Array.from(cabinetStats.entries()).map(([id, stats]) => ({
      cabinetId: id,
      name: stats.specs.name,
      model: stats.specs.model,
      count: stats.count,
      dimensions: stats.specs.dimensions
    })),
    coverage: Math.round(result.coverage * 100 * 100) / 100, // 2 decimal percentage
    isFullyFilled: result.isFullyFilled,
    strategy: result.strategy,
    errorRate: Math.abs(1 - result.coverage)
  };
}
