// 多箱体拼接计算器
import { 
  CabinetSpecs, 
  CabinetSelection, 
  ArrangedCabinet, 
  ArrangementResult 
} from '../types';

// 箱体拼接的工作单位（以毫米为单位）
interface WorkingCabinet {
  id: string;
  specs: CabinetSpecs;
  width: number;   // 宽度(mm)
  height: number;  // 高度(mm)
  area: number;    // 面积(mm²)
  count: number;   // 剩余可用数量
  priority: number; // 优先级
}

/**
 * 行优先箱体排列算法
 * 从左到右、从下到上填满屏幕
 */
export function arrangeBoxesRowWise(
  screenWidth: number,    // 屏幕宽度(mm)
  screenHeight: number,   // 屏幕高度(mm) 
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // 准备工作箱体数据
  const workingBoxes: WorkingCabinet[] = cabinetSelections.map(selection => ({
    id: selection.id,
    specs: selection.specs,
    width: selection.specs.dimensions.width,
    height: selection.specs.dimensions.height,
    area: selection.specs.dimensions.width * selection.specs.dimensions.height,
    count: selection.count,
    priority: selection.priority || 0
  }));

  // 按箱体面积从大到小排序（面积相同时按优先级）
  const sortedBoxes = [...workingBoxes].sort((a, b) => {
    if (Math.abs(a.area - b.area) < 0.01) {
      return a.priority - b.priority;
    }
    return b.area - a.area;
  });

  const arrangement: ArrangedCabinet[] = [];
  let yOffset = 0; // 从屏幕下边开始

  let maxIterations = 10000; // 防止无限循环
  let currentIterations = 0;
  
  while (yOffset < screenHeight && currentIterations < maxIterations) {
    let rowHeight = 0;
    let xOffset = 0; // 每行从左边开始

    while (xOffset < screenWidth && currentIterations < maxIterations) {
      let placed = false;
      currentIterations++;
      
      for (const box of sortedBoxes) {
        if (box.count > 0 && 
            xOffset + box.width <= screenWidth && 
            yOffset + box.height <= screenHeight) {
          
          // 放置箱体
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
          break; // 退出循环，重新从最大箱体开始检查
        }
      }
      
      if (!placed) {
        xOffset += 1; // 移动 xOffset，避免死循环
      }
    }

    if (rowHeight === 0) {
      break; // 无法在当前行放置任何箱体，退出
    }

    yOffset += rowHeight; // 移动到下一行
  }

  return calculateArrangementResult(arrangement, screenWidth, screenHeight, 'row_wise', maxErrorRate);
}

/**
 * 列优先箱体排列算法
 * 从左到右、从下到上填满屏幕
 */
export function arrangeBoxesColumnWise(
  screenWidth: number,    // 屏幕宽度(mm)
  screenHeight: number,   // 屏幕高度(mm)
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // 准备工作箱体数据
  const workingBoxes: WorkingCabinet[] = cabinetSelections.map(selection => ({
    id: selection.id,
    specs: selection.specs,
    width: selection.specs.dimensions.width,
    height: selection.specs.dimensions.height,
    area: selection.specs.dimensions.width * selection.specs.dimensions.height,
    count: selection.count,
    priority: selection.priority || 0
  }));

  // 按箱体面积从大到小排序（面积相同时按优先级）
  const sortedBoxes = [...workingBoxes].sort((a, b) => {
    if (Math.abs(a.area - b.area) < 0.01) {
      return a.priority - b.priority;
    }
    return b.area - a.area;
  });

  const arrangement: ArrangedCabinet[] = [];
  let xOffset = 0; // 从屏幕左边开始

  let maxIterations = 10000; // 防止无限循环
  let currentIterations = 0;
  
  while (xOffset < screenWidth && currentIterations < maxIterations) {
    let colWidth = 0;
    let yOffset = 0; // 每列从下边开始

    while (yOffset < screenHeight && currentIterations < maxIterations) {
      let placed = false;
      currentIterations++;
      
      for (const box of sortedBoxes) {
        if (box.count > 0 && 
            xOffset + box.width <= screenWidth && 
            yOffset + box.height <= screenHeight) {
          
          // 放置箱体
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
          break; // 退出循环，重新从最大箱体开始检查
        }
      }
      
      if (!placed) {
        yOffset += 1; // 移动 yOffset，避免死循环
      }
    }

    if (colWidth === 0) {
      break; // 无法在当前列放置任何箱体，退出
    }

    xOffset += colWidth; // 移动到下一列
  }

  return calculateArrangementResult(arrangement, screenWidth, screenHeight, 'column_wise', maxErrorRate);
}

/**
 * 自动选择最优排列策略
 */
export function arrangeBoxesAuto(
  screenWidth: number,    // 屏幕宽度(mm)
  screenHeight: number,   // 屏幕高度(mm)
  cabinetSelections: CabinetSelection[],
  maxErrorRate: number = 0.05
): ArrangementResult {
  
  // 尝试两种排列策略
  const rowWiseResult = arrangeBoxesRowWise(screenWidth, screenHeight, cabinetSelections, maxErrorRate);
  const columnWiseResult = arrangeBoxesColumnWise(screenWidth, screenHeight, cabinetSelections, maxErrorRate);
  
  // 选择覆盖率更高的结果
  if (rowWiseResult.coverage > columnWiseResult.coverage) {
    return rowWiseResult;
  } else if (columnWiseResult.coverage > rowWiseResult.coverage) {
    return columnWiseResult;
  }
  
  // 如果覆盖率相同，选择使用箱体数量更少的方案
  if (rowWiseResult.cabinets.length <= columnWiseResult.cabinets.length) {
    return rowWiseResult;
  } else {
    return columnWiseResult;
  }
}

/**
 * 计算排列结果统计信息
 */
function calculateArrangementResult(
  arrangement: ArrangedCabinet[],
  screenWidth: number,
  screenHeight: number,
  strategy: 'row_wise' | 'column_wise',
  maxErrorRate: number
): ArrangementResult {
  
  // 计算总占用面积
  const totalArea = arrangement.reduce((sum, cabinet) => {
    return sum + (cabinet.size.width * cabinet.size.height);
  }, 0);
  
  const screenArea = screenWidth * screenHeight;
  const coverage = screenArea > 0 ? totalArea / screenArea : 0;
  
  // 检查是否完全填充（允许指定的误差率）
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
 * 获取排列结果的统计信息
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
    coverage: Math.round(result.coverage * 100 * 100) / 100, // 保留2位小数的百分比
    isFullyFilled: result.isFullyFilled,
    strategy: result.strategy,
    errorRate: Math.abs(1 - result.coverage)
  };
}
