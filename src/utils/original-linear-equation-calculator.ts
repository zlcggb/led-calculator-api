/**
 * 精确线性方程求解器 - 专门处理多箱体几何拼接问题
 * 基于丢番图方程求解，适用于两种箱体的完美拼接场景
 * 
 * 算法原理：
 * - 情况1（宽度相同）: n×W × (a×h1 + b×h2) = 屏幕尺寸
 * - 情况2（高度相同）: (a×w1 + b×w2) × n×H = 屏幕尺寸
 * - 情况3（通用）: 面积匹配 + 几何验证
 */

import { CabinetSelection } from '../types';

/**
 * 线性方程求解结果
 */
export interface LinearSolutionResult {
  success: boolean;
  counts: number[]; // 每种箱体的数量
  explanation: string;
  geometry: {
    screenWidth: number;  // mm
    screenHeight: number; // mm
    layout: string; // 布局说明
  };
}

/**
 * 精确线性丢番图方程求解器
 * 求解 a*x + b*y = c 的非负整数解
 * 
 * @param a 第一个系数
 * @param b 第二个系数  
 * @param c 目标值
 * @param maxIterations 最大迭代次数
 * @returns 所有可能的解 [x, y][]
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
      // 特殊情况：b为0，只需验证remaining是否为0
      if (Math.abs(remaining) < 1e-6) {
        solutions.push([x, 0]);
      }
    } else {
      const y = remaining / b;
      // 检查y是否为非负整数（允许1mm误差）
      if (Math.abs(y - Math.round(y)) < 1e-3 && y >= 0) {
        const yInt = Math.round(y);
        // 验证解的准确性（允许1mm误差）
        if (Math.abs(a * x + b * yInt - c) < 1) {
          solutions.push([x, yInt]);
        }
      }
    }
  }
  
  return solutions;
}

/**
 * 情况1：宽度相同，高度不同
 * 求解：W = n×w, H = a×h1 + b×h2
 * 
 * @param cabA 箱体A规格（主箱体，优先使用）
 * @param cabB 箱体B规格（辅助箱体）
 * @param screenWidthMm 屏幕宽度（毫米）
 * @param screenHeightMm 屏幕高度（毫米）
 * @returns 解决方案
 */
function solveSameWidthCombination(
  cabA: { w: number; h: number; name: string; area: number },
  cabB: { w: number; h: number; name: string; area: number },
  screenWidthMm: number,
  screenHeightMm: number
): LinearSolutionResult | null {
  const commonWidth = cabA.w;
  
  console.log(`🎯 情况1: 宽度相同 (${commonWidth}mm)`);
  
  // 计算宽度方向需要多少列
  const widthCount = screenWidthMm / commonWidth;
  if (Math.abs(widthCount - Math.round(widthCount)) > 0.01) {
    console.log(`❌ 宽度无法整除: ${screenWidthMm} ÷ ${commonWidth} = ${widthCount}`);
    return null;
  }
  
  const nWidth = Math.round(widthCount);
  console.log(`✓ 宽度方向需要 ${nWidth} 列箱体`);
  
  // 求解线性方程: a×h1 + b×h2 = screenHeight
  const h1 = cabA.h;
  const h2 = cabB.h;
  const H = screenHeightMm;
  
  console.log(`🧮 高度方向求解: ${h1}*a + ${h2}*b = ${H}`);
  
  const solutions = solveLinearEquation(h1, h2, H);
  
  if (solutions.length > 0) {
    // 🎯 优先选择主箱体（cabA）数量最多的解
    // 按照 a 的值从大到小排序（a 是主箱体的行数）
    const sortedSolutions = solutions.sort((sol1, sol2) => sol2[0] - sol1[0]);
    
    console.log(`📊 找到 ${solutions.length} 个解，按主箱体优先级排序:`);
    sortedSolutions.forEach(([a, b], index) => {
      console.log(`   解${index + 1}: a=${a}行主箱体, b=${b}行辅助箱体`);
    });
    
    // 选择主箱体数量最多的解（第一个）
    for (let i = 0; i < sortedSolutions.length; i++) {
      const [a, b] = sortedSolutions[i];
      const countA = a * nWidth;
      const countB = b * nWidth;
      const area1 = countA * cabA.area;
      const area2 = countB * cabB.area;
      const totalArea = area1 + area2;
      const targetArea = (screenWidthMm * screenHeightMm) / 1000000;
      
      console.log(`✅ 选择解${i+1}: 高度层数 a=${a}, b=${b}`);
      console.log(`      最终数量 ${cabA.name}×${countA}, ${cabB.name}×${countB}`);
      console.log(`      面积验证: ${area1.toFixed(4)} + ${area2.toFixed(4)} = ${totalArea.toFixed(4)}㎡`);
      console.log(`      误差: ${Math.abs(totalArea - targetArea).toFixed(6)}㎡`);
      
      if (Math.abs(totalArea - targetArea) < 0.001) {
        console.log(`🎉 找到优先使用主箱体的完美解！`);
        return {
          success: true,
          counts: [countA, countB],
          explanation: `宽度相同布局: ${nWidth}列 × (${a}行${cabA.name} + ${b}行${cabB.name})`,
          geometry: {
            screenWidth: screenWidthMm,
            screenHeight: screenHeightMm,
            layout: `${nWidth}列 × ${a}行(${h1}mm) + ${b}行(${h2}mm) = ${screenWidthMm}×${screenHeightMm}mm`
          }
        };
      }
    }
  }
  
  console.log("❌ 未找到整数解");
  return null;
}

/**
 * 情况2：高度相同，宽度不同
 * 求解：W = a×w1 + b×w2, H = n×h
 * 
 * @param cabA 箱体A规格（主箱体，优先使用）
 * @param cabB 箱体B规格（辅助箱体）
 * @param screenWidthMm 屏幕宽度（毫米）
 * @param screenHeightMm 屏幕高度（毫米）
 * @returns 解决方案
 */
function solveSameHeightCombination(
  cabA: { w: number; h: number; name: string; area: number },
  cabB: { w: number; h: number; name: string; area: number },
  screenWidthMm: number,
  screenHeightMm: number
): LinearSolutionResult | null {
  const commonHeight = cabA.h;
  
  console.log(`🎯 情况2: 高度相同 (${commonHeight}mm)`);
  
  // 计算高度方向需要多少行
  const heightCount = screenHeightMm / commonHeight;
  if (Math.abs(heightCount - Math.round(heightCount)) > 0.01) {
    console.log(`❌ 高度无法整除: ${screenHeightMm} ÷ ${commonHeight} = ${heightCount}`);
    return null;
  }
  
  const nHeight = Math.round(heightCount);
  console.log(`✓ 高度方向需要 ${nHeight} 行箱体`);
  
  // 求解线性方程: a×w1 + b×w2 = screenWidth
  const w1 = cabA.w;
  const w2 = cabB.w;
  const W = screenWidthMm;
  
  console.log(`🧮 宽度方向求解: ${w1}*a + ${w2}*b = ${W}`);
  
  const solutions = solveLinearEquation(w1, w2, W);
  
  if (solutions.length > 0) {
    // 🎯 优先选择主箱体（cabA）数量最多的解
    // 按照 a 的值从大到小排序（a 是主箱体的列数）
    const sortedSolutions = solutions.sort((sol1, sol2) => sol2[0] - sol1[0]);
    
    console.log(`📊 找到 ${solutions.length} 个解，按主箱体优先级排序:`);
    sortedSolutions.forEach(([a, b], index) => {
      console.log(`   解${index + 1}: a=${a}列主箱体, b=${b}列辅助箱体`);
    });
    
    // 选择主箱体数量最多的解（第一个）
    for (let i = 0; i < sortedSolutions.length; i++) {
      const [a, b] = sortedSolutions[i];
      const countA = a * nHeight;
      const countB = b * nHeight;
      const area1 = countA * cabA.area;
      const area2 = countB * cabB.area;
      const totalArea = area1 + area2;
      const targetArea = (screenWidthMm * screenHeightMm) / 1000000;
      
      console.log(`✅ 选择解${i+1}: 宽度列数 a=${a}, b=${b}`);
      console.log(`      最终数量 ${cabA.name}×${countA}, ${cabB.name}×${countB}`);
      console.log(`      面积验证: ${area1.toFixed(4)} + ${area2.toFixed(4)} = ${totalArea.toFixed(4)}㎡`);
      console.log(`      误差: ${Math.abs(totalArea - targetArea).toFixed(6)}㎡`);
      
      if (Math.abs(totalArea - targetArea) < 0.001) {
        console.log(`🎉 找到优先使用主箱体的完美解！`);
        return {
          success: true,
          counts: [countA, countB],
          explanation: `高度相同布局: (${a}列${cabA.name} + ${b}列${cabB.name}) × ${nHeight}行`,
          geometry: {
            screenWidth: screenWidthMm,
            screenHeight: screenHeightMm,
            layout: `(${a}列(${w1}mm) + ${b}列(${w2}mm)) × ${nHeight}行 = ${screenWidthMm}×${screenHeightMm}mm`
          }
        };
      }
    }
  }
  
  console.log("❌ 未找到整数解");
  return null;
}

/**
 * 注意：情况3（面积匹配法）已被移除
 * 
 * 原因：面积匹配虽然数学上可行，但在实际几何排列时往往无法完美拼接
 * 例如：5m×6m墙体使用800mm宽箱体，虽然可以计算出面积匹配的数量，
 * 但宽度5000mm ÷ 800mm = 6.25（无法整除），实际排列时会有缺口
 * 
 * 正确策略：
 * - 情况1（宽度相同）：如果宽度无法整除，直接失败
 * - 情况2（高度相同）：如果高度无法整除，直接失败  
 * - 情况3（宽高都不同）：不适用线性方程求解，应使用几何排列算法
 * 
 * 线性方程求解器仅适用于：
 * ✅ 两种同宽度不同高度的箱体（宽度能整除）
 * ✅ 两种同高度不同宽度的箱体（高度能整除）
 * ❌ 两种宽高都不同的箱体（需要几何算法）
 */

/**
 * 精确二元线性方程求解器 - 主函数
 * 针对两种箱体的完美拼接场景
 * 
 * @param cabinetSelections 两种箱体的选择（必须正好2个）
 * @param screenWidthM 屏幕宽度（米）
 * @param screenHeightM 屏幕高度（米）
 * @returns 求解结果
 */
export function solveLinearTwoCabinets(
  cabinetSelections: CabinetSelection[],
  screenWidthM: number,
  screenHeightM: number
): LinearSolutionResult | null {
  console.log("=== 🧮 精确二元线性求解开始 ===");
  
  if (cabinetSelections.length !== 2) {
    console.log(`❌ 线性求解仅支持两种箱体，当前有${cabinetSelections.length}种`);
    return null;
  }
  
  if (screenWidthM <= 0 || screenHeightM <= 0) {
    console.log("❌ 屏幕尺寸无效");
    return null;
  }
  
  const screenWidthMm = Math.round(screenWidthM * 1000);
  const screenHeightMm = Math.round(screenHeightM * 1000);
  
  console.log(`📐 屏幕尺寸: ${screenWidthM}m × ${screenHeightM}m = ${screenWidthMm}×${screenHeightMm}mm`);
  
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
  
  console.log(`📦 箱体A: ${cabA.name} (${cabA.w}×${cabA.h}mm = ${cabA.area.toFixed(4)}㎡)`);
  console.log(`📦 箱体B: ${cabB.name} (${cabB.w}×${cabB.h}mm = ${cabB.area.toFixed(4)}㎡)`);
  
  // 情况1：宽度相同，高度不同
  if (Math.abs(cabA.w - cabB.w) < 1) {
    console.log(`✓ 检测到情况1: 宽度相同 (${cabA.w}mm)`);
    const result = solveSameWidthCombination(cabA, cabB, screenWidthMm, screenHeightMm);
    if (result) return result;
    // 🎯 如果宽度相同但无法整除，直接失败，不要继续尝试面积匹配
    console.log(`❌ 宽度相同但无法完美拼接，线性求解失败`);
    return null;
  }
  
  // 情况2：高度相同，宽度不同
  if (Math.abs(cabA.h - cabB.h) < 1) {
    console.log(`✓ 检测到情况2: 高度相同 (${cabA.h}mm)`);
    const result = solveSameHeightCombination(cabA, cabB, screenWidthMm, screenHeightMm);
    if (result) return result;
    // 🎯 如果高度相同但无法整除，直接失败，不要继续尝试面积匹配
    console.log(`❌ 高度相同但无法完美拼接，线性求解失败`);
    return null;
  }
  
  // 情况3：宽高都不同 - 线性方程求解不适用
  console.log(`❌ 宽高都不同，线性方程求解不适用（需要使用几何排列算法）`);
  return null;
  
  console.log("=== ❌ 精确二元线性求解失败 ===");
  return null;
}

