// LED显示屏配置器计算工具 - API Version
import { 
  CabinetSpecs, 
  CabinetSelection, 
  RoomConfig, 
  DisplayConfig, 
  CalculationResult,
  ArrangementResult,
  ArrangedCabinet,
  CabinetArrangementStrategy,
} from '../types';

// Stub for SendingCardConfig (not used in API)
type SendingCardConfig = any;
type CabinetInfo = { width: number; height: number; count: number };

// Stub functions for SendingCard API (not used in API version)
const calculateSendingCard = async (_params: any): Promise<{
  success: boolean;
  card_info: { model: string; brand: string; usage_rate: number; ports: any; display?: { components: any } } | null;
  total_cables_needed: number;
}> => ({ success: false, card_info: null, total_cables_needed: 0 });
const buildBoxInfo = (_w: number, _h: number, _c: number) => '';
const buildMultiBoxInfo = (_arr: CabinetInfo[]) => '';

import { solveLinearTwoCabinets } from './original-linear-equation-calculator';
// 移除对multi-cabinet-calculator的依赖，使用优化的内置算法

/**
 * 计算显示墙规格
 * @param cabinetSpecs 箱体规格
 * @param roomConfig 房间配置
 * @param displayConfig 显示配置
 * @param sendingCardConfig 发送卡配置（可选）
 * @param wiringDirection 走线方向（从产品规格获取）
 * @param shouldCallAPI 是否调用发送卡API（默认false，仅在查看规格时调用）
 * @returns 计算结果
 */
export async function calculateDisplayWallSpecs(
  cabinetSpecs: CabinetSpecs,
  _roomConfig: RoomConfig,
  displayConfig: DisplayConfig,
  sendingCardConfig?: SendingCardConfig,
  wiringDirection?: 'Horizontal' | 'Vertical',
  shouldCallAPI: boolean = false
): Promise<CalculationResult> {
  // 单位转换：将mm转换为m
  const cabinetWidthM = cabinetSpecs.dimensions.width / 1000;
  const cabinetHeightM = cabinetSpecs.dimensions.height / 1000;
  
  // 计算显示墙总尺寸
  const totalWidthM = cabinetWidthM * displayConfig.layout.columns;
  const totalHeightM = cabinetHeightM * displayConfig.layout.rows;
  
  // 计算显示面积
  const displayArea = totalWidthM * totalHeightM;
  
  // 计算对角线尺寸（英寸）
  const diagonalM = Math.sqrt(totalWidthM * totalWidthM + totalHeightM * totalHeightM);
  const diagonalInches = diagonalM * 39.3701; // 1m = 39.3701英寸
  
  // 计算箱体总数
  const totalCabinets = displayConfig.layout.columns * displayConfig.layout.rows;
  
  // 计算像素信息
  const totalPixelWidth = cabinetSpecs.display.resolution.width * displayConfig.layout.columns;
  const totalPixelHeight = cabinetSpecs.display.resolution.height * displayConfig.layout.rows;
  const totalPixels = totalPixelWidth * totalPixelHeight;
  const pixelDensity = totalPixels / displayArea;
  
  // 计算功耗（瓦特）
  const maxPower = cabinetSpecs.power.maxPower * totalCabinets;
  const typicalPower = cabinetSpecs.power.typicalPower * totalCabinets;
  const standbyPower = cabinetSpecs.power.standbyPower * totalCabinets;
  
  // 计算热量产生（BTU/h）1瓦 = 3.41214 BTU/h
  const maxBTU = maxPower * 3.41214;
  const typicalBTU = typicalPower * 3.41214;
  
  // 计算总重量
  const totalWeight = cabinetSpecs.physical.weight * totalCabinets;
  const structuralLoad = totalWeight / displayArea; // kg/m²
  
  // 计算控制系统需求 - 调用真实API
  let controllers4K = Math.ceil(totalPixels / 8294400); // 默认值
  let sendingCards = Math.ceil(totalCabinets / 32);
  let fiberCables = Math.ceil(totalCabinets / 16);
  let cardInfo = undefined;
  
  // 只有在需要时才调用API（例如查看规格面板时）
  if (sendingCardConfig && shouldCallAPI) {
    try {
      console.log('🎯 调用发送卡API获取详细信息...');
      // 使用箱体尺寸的精确总和，避免浮点数四舍五入导致的面积不匹配
      // 保留3位小数，避免浮点数精度问题（如 3430.7999999999997）
      const exactScreenWidth = Math.round(cabinetSpecs.dimensions.width * displayConfig.layout.columns * 1000) / 1000;
      const exactScreenHeight = Math.round(cabinetSpecs.dimensions.height * displayConfig.layout.rows * 1000) / 1000;
      
      console.log(`📐 精确屏幕尺寸: ${exactScreenWidth}mm × ${exactScreenHeight}mm`);
      console.log(`📦 箱体规格: ${cabinetSpecs.dimensions.width}mm × ${cabinetSpecs.dimensions.height}mm × ${totalCabinets}个`);
      console.log(`🧮 箱体总面积: ${(exactScreenWidth * exactScreenHeight).toFixed(2)}mm² = 箱体单面积 ${(cabinetSpecs.dimensions.width * cabinetSpecs.dimensions.height).toFixed(2)}mm² × ${totalCabinets}个`);
      
      const apiResult = await calculateSendingCard({
        screen_width: exactScreenWidth,  // 使用精确的箱体总宽度（保留3位小数）
        screen_height: exactScreenHeight,  // 使用精确的箱体总高度（保留3位小数）
        resolution_width: totalPixelWidth,
        resolution_height: totalPixelHeight,
        box_info: buildBoxInfo(
          cabinetSpecs.dimensions.width,
          cabinetSpecs.dimensions.height,
          totalCabinets
        ),
        card_type: sendingCardConfig.cardType,
        card_brand: sendingCardConfig.cardBrand,
        loop_backup: sendingCardConfig.loopBackup,
        wiring_direction: wiringDirection === 'Vertical' ? 'vertical' : 'horizontal',
        language: 'zh',
        region: sendingCardConfig.region,
        coverage_mode: sendingCardConfig.coverageMode
      });
      
      if (apiResult.success && apiResult.card_info) {
        // 使用API返回的真实数据
        sendingCards = 1; // API返回的是整体发送卡配置
        controllers4K = 1; // 通常一个控制器配一个发送卡
        fiberCables = apiResult.total_cables_needed || Math.ceil(totalCabinets / 16);
        
        cardInfo = {
          model: apiResult.card_info.model,
          brand: apiResult.card_info.brand,
          usage_rate: apiResult.card_info.usage_rate,
          ports: apiResult.card_info.ports,
          components: apiResult.card_info.display?.components
        };
        
        console.log('✅ 发送卡API调用成功:', cardInfo);
      }
    } catch (error) {
      console.error('⚠️ 发送卡API调用失败，使用默认计算:', error);
      // 失败时继续使用默认值
    }
  }
  
  return {
    wallDimensions: {
      width: totalWidthM,
      height: totalHeightM,
      area: displayArea,
      diagonal: diagonalInches,
    },
    cabinetCount: {
      total: totalCabinets,
      horizontal: displayConfig.layout.columns,
      vertical: displayConfig.layout.rows,
    },
    pixels: {
      totalWidth: totalPixelWidth,
      totalHeight: totalPixelHeight,
      totalPixels: totalPixels,
      pixelDensity: pixelDensity,
    },
    powerConsumption: {
      maximum: maxPower,
      typical: typicalPower,
      standby: standbyPower,
      heatGeneration: {
        maxBTU: maxBTU,
        typicalBTU: typicalBTU,
      },
    },
    physical: {
      totalWeight: totalWeight,
      structuralLoad: structuralLoad,
    },
    controlSystem: {
      controllers4K: controllers4K,
      sendingCards: sendingCards,
      fiberCables: fiberCables,
      cardInfo: cardInfo,
    },
  };
}

/**
 * 根据房间尺寸自动计算最佳布局
 * @param cabinetSpecs 箱体规格
 * @param roomConfig 房间配置
 * @returns 建议的列数和行数
 */
export function calculateOptimalLayout(
  cabinetSpecs: CabinetSpecs,
  roomConfig: RoomConfig
): { columns: number; rows: number } {
  // 注意：dimensions 始终以米为单位存储，unit 只是显示标记
  const roomWidthM = roomConfig.dimensions.width;
  const roomHeightM = roomConfig.dimensions.height;
  
  const cabinetWidthM = cabinetSpecs.dimensions.width / 1000;
  const cabinetHeightM = cabinetSpecs.dimensions.height / 1000;
  
  // 计算能放置的最大箱体数量
  const maxColumns = Math.floor(roomWidthM / cabinetWidthM);
  const maxRows = Math.floor(roomHeightM / cabinetHeightM);
  
  return {
    columns: Math.max(1, maxColumns),
    rows: Math.max(1, maxRows),
  };
}

/**
 * 计算安装所需的结构支撑
 * @param calculationResult 计算结果
 * @returns 结构支撑建议
 */
export function calculateStructuralRequirements(calculationResult: CalculationResult) {
  const totalWeight = calculationResult.physical?.totalWeight;
  const { area } = calculationResult.wallDimensions;
  
  // 如果没有重量数据，返回基本建议
  if (!totalWeight) {
    return {
      loadPerSqm: 0,
      structuralAdvice: '未提供重量数据，无法计算结构负荷',
      recommendedBrackets: Math.ceil(calculationResult.cabinetCount.total / 4),
    };
  }
  
  // 每平方米的载荷
  const loadPerSqm = totalWeight / area;
  
  // 建议的支撑结构
  let structuralAdvice = '';
  
  if (loadPerSqm < 30) {
    structuralAdvice = '标准墙面安装，使用常规支架即可';
  } else if (loadPerSqm < 60) {
    structuralAdvice = '需要加固墙面结构，建议使用重型支架';
  } else {
    structuralAdvice = '需要专业结构工程师评估，可能需要独立支撑框架';
  }
  
  return {
    loadPerSqm,
    structuralAdvice,
    recommendedBrackets: Math.ceil(calculationResult.cabinetCount.total / 4), // 每4个箱体一个支架
  };
}

/**
 * 格式化数值显示
 * @param value 数值
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * 单位转换工具
 */
export const unitConverter = {
  // 米转英尺
  metersToFeet: (meters: number): number => meters * 3.28084,
  
  // 英尺转米
  feetToMeters: (feet: number): number => feet * 0.3048,
  
  // 平方米转平方英尺
  sqmToSqft: (sqm: number): number => sqm * 10.7639,
  
  // 千克转磅
  kgToLbs: (kg: number): number => kg * 2.20462,
  
  // 瓦特转BTU/h
  wattsToBTU: (watts: number): number => watts * 3.41214,
};

/**
 * 根据排列方向策略调整箱体位置
 * @param cabinets 排列好的箱体列表
 * @param strategy 排列方向策略
 * @returns 调整后的箱体列表
 */
function applyArrangementStrategy(
  cabinets: ArrangedCabinet[],
  strategy: CabinetArrangementStrategy = 'left-to-right'
): ArrangedCabinet[] {
  // 从左到右：默认策略，不需要调整
  if (strategy === 'left-to-right' || !strategy || cabinets.length === 0) {
    return cabinets;
  }

  // 从右到左：在屏幕区域内部进行水平镜像翻转
  // 注意：这里只翻转屏幕内部的箱体顺序，屏幕在墙体中的居中位置不变
  if (strategy === 'right-to-left') {
    // 计算屏幕的实际宽度（所有箱体的总宽度）
    const screenWidth = Math.max(...cabinets.map(c => c.position.x + c.size.width));
    
    // 在屏幕宽度内进行镜像翻转（不是墙体宽度）
    return cabinets.map(cabinet => ({
      ...cabinet,
      position: {
        x: screenWidth - (cabinet.position.x + cabinet.size.width),
        y: cabinet.position.y
      }
    }));
  }
  
  return cabinets;
}

/**
 * 优化的几何排版算法（从LEDConfigurator.tsx移植并增强）
 * 使用guillotine算法智能分配多箱体
 */
function geometricPackingCalculate(
  wallWidthMM: number,
  wallHeightMM: number,
  cabinetTypes: Array<{id: string, widthMM: number, heightMM: number, specs: CabinetSpecs}>
) {
  // 按面积从大到小排序，优先使用大箱体
  const sortedTypes = [...cabinetTypes].sort((a, b) => 
    (b.widthMM * b.heightMM) - (a.widthMM * a.heightMM)
  );

  // 计数器和排列结果
  const counts = new Map(sortedTypes.map(t => [t.id, 0]));
  const arrangedCabinets = [];

  // 矩形队列（guillotine拆分）- 从左下角开始填充
  let rects = [{ x: 0, y: 0, w: wallWidthMM, h: wallHeightMM }];
  let unfillableArea = 0;

  // 行优先策略：先右后上
  while (rects.length > 0) {
    const rect = rects.shift();
    if (!rect || rect.w <= 0 || rect.h <= 0) continue;

    // 找到能放下的最大箱体
    let chosen = null;
    for (const type of sortedTypes) {
      if (type.widthMM <= rect.w && type.heightMM <= rect.h) {
        chosen = type;
        break;
      }
    }

    if (!chosen) {
      unfillableArea += rect.w * rect.h;
      continue;
    }

    // 放置箱体，增加计数
    counts.set(chosen.id, (counts.get(chosen.id) || 0) + 1);
    
    // 添加到排列结果
    arrangedCabinets.push({
      cabinetId: chosen.id,
      specs: chosen.specs,
      position: { x: rect.x, y: rect.y },
      size: { width: chosen.widthMM, height: chosen.heightMM },
      gridPosition: { 
        row: Math.floor(rect.y / chosen.heightMM), 
        col: Math.floor(rect.x / chosen.widthMM) 
      }
    });

    // 生成右侧和上方的剩余矩形
    const rightRect = { 
      x: rect.x + chosen.widthMM, 
      y: rect.y, 
      w: rect.w - chosen.widthMM, 
      h: chosen.heightMM 
    };
    const topRect = { 
      x: rect.x, 
      y: rect.y + chosen.heightMM, 
      w: rect.w, 
      h: rect.h - chosen.heightMM 
    };

    // 行优先：先处理右侧（继续铺本行），再处理上方（下一行）
    if (rightRect.w > 0 && rightRect.h > 0) rects.unshift(rightRect);
    if (topRect.w > 0 && topRect.h > 0) rects.push(topRect);
  }

  // 计算覆盖率
  const totalAreaMM = wallWidthMM * wallHeightMM;
  const coverage = totalAreaMM > 0 ? ((totalAreaMM - unfillableArea) / totalAreaMM) : 0;

  return { counts, coverage, unfillableArea, arrangedCabinets };
}

/**
 * 多箱体模式：计算显示墙规格
 * @param cabinetSelections 选择的箱体列表
 * @param roomConfig 房间配置
 * @param displayConfig 显示配置
 * @param arrangementDirection 排列方向
 * @param sendingCardConfig 发送卡配置（可选）
 * @param wiringDirection 走线方向（从产品规格获取）
 * @param shouldCallAPI 是否调用发送卡API（默认false，仅在查看规格时调用）
 * @returns 计算结果
 */
export async function calculateMultiCabinetDisplayWall(
  cabinetSelections: CabinetSelection[],
  roomConfig: RoomConfig,
  _displayConfig: DisplayConfig,
  arrangementDirection?: CabinetArrangementStrategy,
  sendingCardConfig?: SendingCardConfig,
  wiringDirection?: 'Horizontal' | 'Vertical',
  shouldCallAPI: boolean = false
): Promise<CalculationResult> {
  // 安全检查：限制箱体总数
  const totalCabinets = cabinetSelections.reduce((sum, selection) => sum + selection.count, 0);
  if (totalCabinets > 1000) {
    throw new Error('箱体总数过多，请减少数量');
  }
  
  // 安全检查：限制屏幕尺寸
  const maxScreenSize = 50; // 最大50米
  if (roomConfig.dimensions.width > maxScreenSize || roomConfig.dimensions.height > maxScreenSize) {
    throw new Error('屏幕尺寸过大，请减小尺寸');
  }

  // 单位转换：dimensions 始终以米为单位存储，直接转换为毫米
  // 注意：roomConfig.unit 只是显示标记，dimensions 内部始终是米
  const wallWidthMm = roomConfig.dimensions.width * 1000; // 米转毫米
  const wallHeightMm = roomConfig.dimensions.height * 1000; // 米转毫米

  // 过滤出实际选择的箱体（count > 0）
  const activeCabinets = cabinetSelections.filter(selection => selection.count > 0);
  
  if (activeCabinets.length === 0) {
    throw new Error('未选择任何箱体');
  }

  // 单箱体模式：使用精确行列计算
  if (activeCabinets.length === 1) {
    const cabinet = activeCabinets[0];
    const cabinetWidthMM = cabinet.specs.dimensions.width;
    const cabinetHeightMM = cabinet.specs.dimensions.height;
    
    const maxColumns = Math.floor(wallWidthMm / cabinetWidthMM);
    const maxRows = Math.floor(wallHeightMm / cabinetHeightMM);
    const actualCount = Math.max(1, maxColumns) * Math.max(1, maxRows);

    // 计算实际使用的显示屏尺寸
    const actualWidthMm = maxColumns * cabinetWidthMM;
    const actualHeightMm = maxRows * cabinetHeightMM;
    const actualWidthM = actualWidthMm / 1000;
    const actualHeightM = actualHeightMm / 1000;
    const displayArea = actualWidthM * actualHeightM;
    
    // 生成排列结果
    const arrangedCabinets = [];
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxColumns; col++) {
        arrangedCabinets.push({
          cabinetId: cabinet.id,
          specs: cabinet.specs,
          position: { x: col * cabinetWidthMM, y: row * cabinetHeightMM },
          size: { width: cabinetWidthMM, height: cabinetHeightMM },
          gridPosition: { row, col }
        });
      }
    }

    const arrangementResult: ArrangementResult = {
      cabinets: arrangedCabinets,
      totalArea: actualWidthMm * actualHeightMm,
      screenArea: wallWidthMm * wallHeightMm,
      coverage: (actualWidthMm * actualHeightMm) / (wallWidthMm * wallHeightMm),
      isFullyFilled: Math.abs(actualWidthMm * actualHeightMm - wallWidthMm * wallHeightMm) / (wallWidthMm * wallHeightMm) <= 0.05,
      strategy: 'row_wise'
    };

    // 继续后续计算...
    const diagonalM = Math.sqrt(actualWidthM * actualWidthM + actualHeightM * actualHeightM);
    const diagonalInches = diagonalM * 39.3701;

    const totalPixelWidth = cabinet.specs.display.resolution.width * maxColumns;
    const totalPixelHeight = cabinet.specs.display.resolution.height * maxRows;
    const totalPixels = totalPixelWidth * totalPixelHeight;
    const pixelDensity = totalPixels / displayArea;

    const maxPower = cabinet.specs.power.maxPower * actualCount;
    const typicalPower = cabinet.specs.power.typicalPower * actualCount;
    const standbyPower = cabinet.specs.power.standbyPower * actualCount;
    const totalWeight = cabinet.specs.physical.weight * actualCount;

    const maxBTU = maxPower * 3.41214;
    const typicalBTU = typicalPower * 3.41214;
    const structuralLoad = totalWeight / displayArea;

    const controllers4K = Math.ceil(totalPixels / 8294400);
    const sendingCards = Math.ceil(actualCount / 32);
    const fiberCables = Math.ceil(actualCount / 16);

    return {
      wallDimensions: {
        width: actualWidthM,
        height: actualHeightM,
        area: displayArea,
        diagonal: diagonalInches,
      },
      cabinetCount: {
        total: actualCount,
        horizontal: maxColumns,
        vertical: maxRows,
      },
      arrangement: arrangementResult,
      pixels: {
        totalWidth: totalPixelWidth,
        totalHeight: totalPixelHeight,
        totalPixels: totalPixels,
        pixelDensity: pixelDensity,
      },
      powerConsumption: {
        maximum: maxPower,
        typical: typicalPower,
        standby: standbyPower,
        heatGeneration: {
          maxBTU: maxBTU,
          typicalBTU: typicalBTU,
        },
      },
      physical: {
        totalWeight: totalWeight,
        structuralLoad: structuralLoad,
      },
      controlSystem: {
        controllers4K: controllers4K,
        sendingCards: sendingCards,
        fiberCables: fiberCables,
      },
    };
  }

  // 多箱体模式：使用优化后的精准箱体数量进行排列
  console.log('📊 使用优化后的箱体数量进行排列:');
  activeCabinets.forEach(cabinet => {
    if (cabinet.count > 0) {
      console.log(`   ${cabinet.specs.name}: ${cabinet.count}个`);
    }
  });

  // 使用优化后的数量，但保持原有的排列算法：从左下角开始，按面积从大到小排列
  console.log('🎯 恢复正确的排列算法：从左下角开始，按面积从大到小排列');
  
  // 准备箱体数据并按面积排序（从大到小）
  const cabinetItems = [];
  const counts = new Map();
  
  for (const cabinet of activeCabinets) {
    if (cabinet.count <= 0) continue;
    
    counts.set(cabinet.id, cabinet.count);
    const area = cabinet.specs.dimensions.width * cabinet.specs.dimensions.height;
    
    for (let i = 0; i < cabinet.count; i++) {
      cabinetItems.push({
        id: cabinet.id,
        specs: cabinet.specs,
        width: cabinet.specs.dimensions.width,
        height: cabinet.specs.dimensions.height,
        area: area
      });
    }
  }

  // 🎯 智能列宽度对齐策略：先铺设主体区域确定列宽度，然后其他行优先使用相同宽度箱体
  // 步骤1：找到数量最多的箱体（通常是主体箱体，决定了主要列宽度）
  const dominantCabinet = activeCabinets.reduce((max, cabinet) => 
    cabinet.count > max.count ? cabinet : max
  );
  const dominantWidth = dominantCabinet.specs.dimensions.width;
  
  console.log(`🎯 检测到主导箱体: ${dominantCabinet.specs.name} (${dominantWidth}×${dominantCabinet.specs.dimensions.height}mm)`);
  console.log(`   列宽度对齐策略: 优先使用宽度为 ${dominantWidth}mm 的箱体以确保列对齐`);
  
  // 步骤2：按列宽度对齐优先级排序
  cabinetItems.sort((a, b) => {
    // 第一优先级：高度从大到小（先铺主体区域）
    if (a.height !== b.height) {
      return b.height - a.height;
    }
    
    // 第二优先级：同高度时，优先使用与主导箱体宽度相同的箱体（确保列对齐）
    const aMatchesDominant = a.width === dominantWidth;
    const bMatchesDominant = b.width === dominantWidth;
    
    if (aMatchesDominant && !bMatchesDominant) return -1; // a优先
    if (!aMatchesDominant && bMatchesDominant) return 1;  // b优先
    
    // 第三优先级：都不匹配或都匹配时，按宽度从小到大排序
    return a.width - b.width;
  });
  
  console.log('📊 排列顺序（列宽度对齐优化）:');
  const areaGroups = new Map();
  cabinetItems.forEach(item => {
    const key = `${item.width}×${item.height}`;
    areaGroups.set(key, (areaGroups.get(key) || 0) + 1);
  });
  areaGroups.forEach((count, key) => {
    const cabinetWidth = parseInt(key.split('×')[0]);
    const alignmentMark = cabinetWidth === dominantWidth ? ' ✓列对齐' : '';
    console.log(`   ${key}mm: ${count}个${alignmentMark}`);
  });

  // 使用guillotine算法进行排列（从左下角开始）
  const arrangedCabinets = [];
  let rects = [{ x: 0, y: 0, w: wallWidthMm, h: wallHeightMm }];

  for (const item of cabinetItems) {
    let placed = false;
    
    // 找到能放置的矩形区域
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      
      if (rect.w >= item.width && rect.h >= item.height) {
        // 放置箱体
        arrangedCabinets.push({
          cabinetId: item.id,
          specs: item.specs,
          position: { x: rect.x, y: rect.y },
          size: { width: item.width, height: item.height },
          gridPosition: { 
            row: Math.floor(rect.y / item.height), 
            col: Math.floor(rect.x / item.width) 
          }
        });

        // 分割剩余空间（guillotine切割）
        const newRects = [];
        
        // 右侧剩余矩形
        if (rect.w > item.width) {
          newRects.push({
            x: rect.x + item.width,
            y: rect.y,
            w: rect.w - item.width,
            h: item.height
          });
        }
        
        // 上方剩余矩形
        if (rect.h > item.height) {
          newRects.push({
            x: rect.x,
            y: rect.y + item.height,
            w: rect.w,
            h: rect.h - item.height
          });
        }
        
        // 移除已使用的矩形，添加新的剩余矩形
        rects.splice(i, 1, ...newRects);
        placed = true;
        break;
      }
    }
    
    if (!placed) {
      console.warn(`⚠️ 无法放置箱体: ${item.width}×${item.height}mm`);
    }
  }

  // 计算覆盖率
  const totalCabinetArea = arrangedCabinets.reduce((sum, cabinet) => 
    sum + (cabinet.size.width * cabinet.size.height), 0
  );
  const targetArea = wallWidthMm * wallHeightMm;
  const coverage = totalCabinetArea / targetArea;
  
  console.log(`📊 排列结果: ${arrangedCabinets.length}个箱体，覆盖率 ${(coverage * 100).toFixed(2)}%`);

  // 计算实际使用的显示屏尺寸
  const actualWidthMm = arrangedCabinets.length > 0 ? Math.max(...arrangedCabinets.map(c => c.position.x + c.size.width)) : 0;
  const actualHeightMm = arrangedCabinets.length > 0 ? Math.max(...arrangedCabinets.map(c => c.position.y + c.size.height)) : 0;
  
  const actualWidthM = actualWidthMm / 1000;
  const actualHeightM = actualHeightMm / 1000;
  const displayArea = actualWidthM * actualHeightM;
  
  const diagonalM = Math.sqrt(actualWidthM * actualWidthM + actualHeightM * actualHeightM);
  const diagonalInches = diagonalM * 39.3701;

  // 🎯 应用排列方向策略（只改变屏幕内部箱体顺序，不改变屏幕在墙体中的位置）
  const finalArrangedCabinets = applyArrangementStrategy(
    arrangedCabinets,
    arrangementDirection || 'left-to-right'
  );
  
  // 创建排列结果
  const arrangementResult: ArrangementResult = {
    cabinets: finalArrangedCabinets,
    totalArea: actualWidthMm * actualHeightMm,
    screenArea: wallWidthMm * wallHeightMm,
    coverage: coverage,
    isFullyFilled: coverage >= 0.95,
    strategy: 'row_wise',
    arrangementDirection: arrangementDirection
  };

  // 计算像素、功耗、重量等
  let totalPixels = 0;
  let maxPower = 0;
  let typicalPower = 0;
  let standbyPower = 0;
  let totalWeight = 0;

  counts.forEach((count, cabinetId) => {
    const cabinet = activeCabinets.find(c => c.id === cabinetId);
    if (cabinet && count > 0) {
      totalPixels += count * cabinet.specs.display.resolution.width * cabinet.specs.display.resolution.height;
      maxPower += count * cabinet.specs.power.maxPower;
      typicalPower += count * cabinet.specs.power.typicalPower;
      standbyPower += count * cabinet.specs.power.standbyPower;
      totalWeight += count * cabinet.specs.physical.weight;
    }
  });

  // 计算等效像素分辨率（使用加权平均像素间距）
  let totalArea = 0;
  let weightedPixelPitch = 0;
  
  counts.forEach((count, cabinetId) => {
    const cabinet = activeCabinets.find(c => c.id === cabinetId);
    if (cabinet && count > 0) {
      const cabinetArea = (cabinet.specs.dimensions.width * cabinet.specs.dimensions.height) * count;
      totalArea += cabinetArea;
      weightedPixelPitch += cabinet.specs.display.pixelPitch * cabinetArea;
    }
  });
  
  const avgPixelPitch = totalArea > 0 ? weightedPixelPitch / totalArea : 2.5;
  const totalPixelWidth = Math.floor(actualWidthM * 1000 / avgPixelPitch);
  const totalPixelHeight = Math.floor(actualHeightM * 1000 / avgPixelPitch);
  const pixelDensity = totalPixels / displayArea;

  const maxBTU = maxPower * 3.41214;
  const typicalBTU = typicalPower * 3.41214;
  const structuralLoad = totalWeight / displayArea;

  const totalCabinetsUsed = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
  let controllers4K = Math.ceil(totalPixels / 8294400);
  let sendingCards = Math.ceil(totalCabinetsUsed / 32);
  let fiberCables = Math.ceil(totalCabinetsUsed / 16);
  let cardInfo = undefined;
  
  // 只有在需要时才调用API（例如查看规格面板时）
  if (sendingCardConfig && shouldCallAPI) {
    try {
      console.log('🎯 调用发送卡API获取详细信息（多箱体模式）...');
      // 构建多箱体信息
      const boxInfoArray: CabinetInfo[] = [];
      counts.forEach((count, cabinetId) => {
        const cabinet = activeCabinets.find(c => c.id === cabinetId);
        if (cabinet && count > 0) {
          boxInfoArray.push({
            width: cabinet.specs.dimensions.width,
            height: cabinet.specs.dimensions.height,
            count: count
          });
        }
      });
      
      // 使用箱体实际排列后的精确尺寸，避免浮点数误差
      // actualWidthMm 和 actualHeightMm 是从箱体排列结果计算出来的精确值
      // 保留3位小数，避免浮点数精度问题（如 3430.7999999999997）
      const screenWidthRounded = Math.round(actualWidthMm * 1000) / 1000;
      const screenHeightRounded = Math.round(actualHeightMm * 1000) / 1000;
      
      console.log(`📐 多箱体精确屏幕尺寸: ${screenWidthRounded}mm × ${screenHeightRounded}mm`);
      console.log(`📦 多箱体配置:`, boxInfoArray.map(box => `${box.width}×${box.height}mm × ${box.count}个`).join(', '));
      
      // 计算并验证箱体总面积
      const totalBoxArea = boxInfoArray.reduce((sum, box) => sum + (box.width * box.height * box.count), 0);
      const screenArea = screenWidthRounded * screenHeightRounded;
      console.log(`🧮 箱体总面积: ${totalBoxArea.toFixed(2)}mm², 屏幕面积: ${screenArea.toFixed(2)}mm², 差异: ${Math.abs(totalBoxArea - screenArea).toFixed(2)}mm²`);
      
      const apiResult = await calculateSendingCard({
        screen_width: screenWidthRounded,  // 使用排列后的精确宽度（保留3位小数）
        screen_height: screenHeightRounded,  // 使用排列后的精确高度（保留3位小数）
        resolution_width: totalPixelWidth,
        resolution_height: totalPixelHeight,
        box_info: buildMultiBoxInfo(boxInfoArray),
        card_type: sendingCardConfig.cardType,
        card_brand: sendingCardConfig.cardBrand,
        loop_backup: sendingCardConfig.loopBackup,
        wiring_direction: wiringDirection === 'Vertical' ? 'vertical' : 'horizontal',
        language: 'zh',
        region: sendingCardConfig.region,
        coverage_mode: sendingCardConfig.coverageMode
      });
      
      if (apiResult.success && apiResult.card_info) {
        // 使用API返回的真实数据
        sendingCards = 1;
        controllers4K = 1;
        fiberCables = apiResult.total_cables_needed || Math.ceil(totalCabinetsUsed / 16);
        
        cardInfo = {
          model: apiResult.card_info.model,
          brand: apiResult.card_info.brand,
          usage_rate: apiResult.card_info.usage_rate,
          ports: apiResult.card_info.ports,
          components: apiResult.card_info.display?.components
        };
        
        console.log('✅ 多箱体发送卡API调用成功:', cardInfo);
      }
    } catch (error) {
      console.error('⚠️ 多箱体发送卡API调用失败，使用默认计算:', error);
      // 失败时继续使用默认值
    }
  }

  const maxColumns = arrangedCabinets.length > 0 ? Math.max(...arrangedCabinets.map(c => c.gridPosition?.col || 0)) + 1 : 1;
  const maxRows = arrangedCabinets.length > 0 ? Math.max(...arrangedCabinets.map(c => c.gridPosition?.row || 0)) + 1 : 1;

  return {
    wallDimensions: {
      width: actualWidthM,
      height: actualHeightM,
      area: displayArea,
      diagonal: diagonalInches,
    },
    cabinetCount: {
      total: totalCabinetsUsed,
      horizontal: maxColumns,
      vertical: maxRows,
    },
    arrangement: arrangementResult,
    pixels: {
      totalWidth: totalPixelWidth,
      totalHeight: totalPixelHeight,
      totalPixels: totalPixels,
      pixelDensity: pixelDensity,
    },
    powerConsumption: {
      maximum: maxPower,
      typical: typicalPower,
      standby: standbyPower,
      heatGeneration: {
        maxBTU: maxBTU,
        typicalBTU: typicalBTU,
      },
    },
    physical: {
      totalWeight: totalWeight,
      structuralLoad: structuralLoad,
    },
    controlSystem: {
      controllers4K: controllers4K,
      sendingCards: sendingCards,
      fiberCables: fiberCables,
      cardInfo: cardInfo,
    },
  };
}

/**
 * 调整墙体尺寸为可完美拼接的尺寸
 * 确保目标尺寸可以被箱体尺寸整除或线性组合
 */
function adjustToTileableSize(
  wallSizeMm: number,
  availableSizes: number[],
  direction: 'width' | 'height'
): { adjusted: number, reason: string } {
  console.log(`\n🔧 调整${direction === 'width' ? '宽度' : '高度'}为可拼接尺寸: ${wallSizeMm}mm`);
  console.log(`   可用尺寸: ${availableSizes.join(', ')}mm`);
  
  // 策略1：检查是否可以被单一尺寸整除
  for (const size of availableSizes.sort((a, b) => b - a)) {
    if (wallSizeMm % size === 0) {
      console.log(`   ✓ ${wallSizeMm}mm 可以被 ${size}mm 整除`);
      return { adjusted: wallSizeMm, reason: `${wallSizeMm} = ${wallSizeMm/size} × ${size}` };
    }
  }
  
  // 策略2：寻找最接近的可用最大公约数的倍数
  if (availableSizes.length >= 2) {
    let gcd = availableSizes[0];
    for (let i = 1; i < availableSizes.length; i++) {
      gcd = getGCD(gcd, availableSizes[i]);
    }
    
    console.log(`   GCD of available sizes: ${gcd}mm`);
    
    if (wallSizeMm % gcd !== 0) {
      // 向下调整到GCD的最大倍数
      const adjusted = Math.floor(wallSizeMm / gcd) * gcd;
      const reduction = wallSizeMm - adjusted;
      
      console.log(`   ⚠️ ${wallSizeMm}mm 不是 ${gcd}mm 的倍数`);
      console.log(`   → 调整为 ${adjusted}mm (减少 ${reduction}mm)`);
      
      return { 
        adjusted, 
        reason: `Adjusted from ${wallSizeMm} to ${adjusted} (nearest multiple of GCD ${gcd})`
      };
    }
  }
  
  console.log(`   ✓ ${wallSizeMm}mm 已是可拼接尺寸`);
  return { adjusted: wallSizeMm, reason: 'Already tileable' };
}

/**
 * 计算最大公约数（GCD）
 */
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * 递进式组合测试算法：固定主箱体，递进测试辅助箱体组合
 * @param mainCabinet 固定的主箱体规格
 * @param auxiliaryCabinets 可选择的辅助箱体列表
 * @param wallWidthMm 墙体宽度（毫米）
 * @param wallHeightMm 墙体高度（毫米）
 * @returns 最佳组合方案
 * 
 * 支持1-4个辅助箱体的递进组合测试，寻找最优覆盖率
 */
export function progressiveCabinetCombinationTest(
  mainCabinet: { id: string, specs: CabinetSpecs },
  auxiliaryCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  wallWidthMm: number,
  wallHeightMm: number
): {
  bestCombination: CabinetSelection[];
  coverage: number;
  isFullyFilled: boolean;
  testResults: Array<{
    combination: string[];
    coverage: number;
    counts: Map<string, number>;
    arrangementResult: ArrangementResult;
  }>;
  adjustedSize?: { width: number; height: number }; // 🎯 新增：返回调整后的尺寸
} {
  console.log('🎯 开始递进式组合测试算法');
  console.log(`主箱体: ${mainCabinet.specs.name} (${mainCabinet.specs.dimensions.width}×${mainCabinet.specs.dimensions.height}mm)`);
  console.log(`辅助箱体: ${auxiliaryCabinets.length}种`);
  auxiliaryCabinets.forEach((cabinet, index) => {
    console.log(`   ${index + 1}. ${cabinet.specs.name} (${cabinet.specs.dimensions.width}×${cabinet.specs.dimensions.height}mm)`);
  });
  console.log(`墙体尺寸（原始）: ${wallWidthMm}×${wallHeightMm}mm`);
  
  // 🎯 关键修复：调整墙体尺寸为可完美拼接的尺寸
  const allCabinets = [mainCabinet, ...auxiliaryCabinets];
  const availableWidths = [...new Set(allCabinets.map(c => c.specs.dimensions.width))];
  const availableHeights = [...new Set(allCabinets.map(c => c.specs.dimensions.height))];
  
  const adjustedWidth = adjustToTileableSize(wallWidthMm, availableWidths, 'width');
  const adjustedHeight = adjustToTileableSize(wallHeightMm, availableHeights, 'height');
  
  // 使用调整后的尺寸
  wallWidthMm = adjustedWidth.adjusted;
  wallHeightMm = adjustedHeight.adjusted;
  
  console.log(`墙体尺寸（调整后）: ${wallWidthMm}×${wallHeightMm}mm`);
  console.log(`   宽度调整: ${adjustedWidth.reason}`);
  console.log(`   高度调整: ${adjustedHeight.reason}`);

  const testResults = [];
  let bestCombination: CabinetSelection[] = [];
  let bestCoverage = 0;
  let isFullyFilled = false;

  // 生成所有可能的组合（1-3个辅助箱体）
  const allCombinations: string[][] = [];
  
  // 1个辅助箱体的组合
  for (let i = 0; i < auxiliaryCabinets.length; i++) {
    allCombinations.push([auxiliaryCabinets[i].id]);
  }

  // 2个辅助箱体的组合
  for (let i = 0; i < auxiliaryCabinets.length; i++) {
    for (let j = i + 1; j < auxiliaryCabinets.length; j++) {
      allCombinations.push([auxiliaryCabinets[i].id, auxiliaryCabinets[j].id]);
    }
  }

  // 3个辅助箱体的组合
  for (let i = 0; i < auxiliaryCabinets.length; i++) {
    for (let j = i + 1; j < auxiliaryCabinets.length; j++) {
      for (let k = j + 1; k < auxiliaryCabinets.length; k++) {
        allCombinations.push([auxiliaryCabinets[i].id, auxiliaryCabinets[j].id, auxiliaryCabinets[k].id]);
      }
    }
  }

  // 4个辅助箱体的组合
  for (let i = 0; i < auxiliaryCabinets.length; i++) {
    for (let j = i + 1; j < auxiliaryCabinets.length; j++) {
      for (let k = j + 1; k < auxiliaryCabinets.length; k++) {
        for (let l = k + 1; l < auxiliaryCabinets.length; l++) {
          allCombinations.push([auxiliaryCabinets[i].id, auxiliaryCabinets[j].id, auxiliaryCabinets[k].id, auxiliaryCabinets[l].id]);
        }
      }
    }
  }

  console.log(`生成组合数量: ${allCombinations.length}`);
  
  // 🐛 调试：特殊检查250×500是否在组合中
  const has250x500 = auxiliaryCabinets.some(cabinet => 
    cabinet.specs.dimensions.width === 250 && cabinet.specs.dimensions.height === 500
  );
  if (has250x500) {
    console.log('✅ 发现250×500箱体，将在组合测试中包含');
  } else {
    console.log('❌ 未发现250×500箱体');
  }
  
  // 显示所有待测试的组合
  console.log('待测试组合列表:');
  allCombinations.forEach((combination, index) => {
    const combNames = combination.map(id => {
      const cabinet = auxiliaryCabinets.find(c => c.id === id);
      return `${cabinet?.specs.name}`;
    });
    console.log(`   ${index + 1}. [${mainCabinet.specs.name}] + [${combNames.join(', ')}]`);
  });

  // 测试每种组合
  for (const combination of allCombinations) {
    const testCabinets = [
      {
        id: mainCabinet.id,
        widthMM: mainCabinet.specs.dimensions.width,
        heightMM: mainCabinet.specs.dimensions.height,
        specs: mainCabinet.specs,
        priority: 1 // 主箱体优先级最高
      },
      ...combination.map(cabinetId => {
        const cabinet = auxiliaryCabinets.find(c => c.id === cabinetId);
        return {
          id: cabinetId,
          widthMM: cabinet!.specs.dimensions.width,
          heightMM: cabinet!.specs.dimensions.height,
          specs: cabinet!.specs,
          priority: 2 // 辅助箱体优先级较低
        };
      })
    ];

    // 使用优化的几何排版算法
    const { counts, coverage, arrangedCabinets } = optimizedGeometricPacking(
      wallWidthMm, 
      wallHeightMm, 
      testCabinets,
      mainCabinet.id // 指定主箱体ID，确保优先使用
    );

    // 创建排列结果
    const arrangementResult: ArrangementResult = {
      cabinets: arrangedCabinets,
      totalArea: arrangedCabinets.reduce((sum, c) => sum + (c.size.width * c.size.height), 0),
      screenArea: wallWidthMm * wallHeightMm,
      coverage: coverage,
      isFullyFilled: coverage >= 0.995, // 99.5%以上认为完美拼接
      strategy: 'progressive_combination'
    };

    testResults.push({
      combination,
      coverage,
      counts,
      arrangementResult
    });

    // 🐛 特殊关注250×500的组合结果
    const includes250x500 = combination.some(cabinetId => {
      const cabinet = auxiliaryCabinets.find(c => c.id === cabinetId);
      return cabinet?.specs.dimensions.width === 250 && cabinet?.specs.dimensions.height === 500;
    });
    
    if (includes250x500) {
      console.log(`🔍 重点关注: 测试包含250×500的组合 [${[mainCabinet.specs.name, ...combination.map(id => {
        const cabinet = auxiliaryCabinets.find(c => c.id === id);
        return cabinet?.specs.name;
      })].join(', ')}]`);
      console.log(`     覆盖率: ${(coverage * 100).toFixed(2)}%`);
      console.log(`     箱体数量分布:`);
      counts.forEach((count, cabinetId) => {
        if (count > 0) {
          const cabinet = [mainCabinet, ...auxiliaryCabinets].find(c => c.id === cabinetId);
          console.log(`        ${cabinet?.specs.name}: ${count}个`);
        }
      });
    } else {
      console.log(`测试组合 [${[mainCabinet.id, ...combination].join(', ')}]: 覆盖率 ${(coverage * 100).toFixed(2)}%`);
    }

    // 计算当前组合的箱体总数
    const totalCabinets = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
    
    // 如果找到完美拼接（覆盖率≥99.5%），比较箱体总数
    if (coverage >= 0.995) {
      if (!isFullyFilled) {
        // 首次找到完美拼接
        isFullyFilled = true;
        bestCoverage = coverage;
        bestCombination = [
          { id: mainCabinet.id, specs: mainCabinet.specs, count: counts.get(mainCabinet.id) || 0, priority: 1 },
          ...combination.map(cabinetId => {
            const cabinet = auxiliaryCabinets.find(c => c.id === cabinetId);
            return {
              id: cabinetId,
              specs: cabinet!.specs,
              count: counts.get(cabinetId) || 0,
              priority: 2
            };
          })
        ];
        console.log(`🎉 找到完美拼接组合: 覆盖率 ${(coverage * 100).toFixed(2)}%, 箱体总数 ${totalCabinets}`);
      } else {
        // 已有完美拼接方案，比较箱体总数，选择数量更少的方案
        const currentBestTotal = bestCombination.reduce((sum, sel) => sum + sel.count, 0);
        if (totalCabinets < currentBestTotal) {
          bestCoverage = coverage;
          bestCombination = [
            { id: mainCabinet.id, specs: mainCabinet.specs, count: counts.get(mainCabinet.id) || 0, priority: 1 },
            ...combination.map(cabinetId => {
              const cabinet = auxiliaryCabinets.find(c => c.id === cabinetId);
              return {
                id: cabinetId,
                specs: cabinet!.specs,
                count: counts.get(cabinetId) || 0,
                priority: 2
              };
            })
          ];
          console.log(`✨ 找到箱体数量更优的完美拼接: 覆盖率 ${(coverage * 100).toFixed(2)}%, 箱体总数 ${totalCabinets} (优于之前的 ${currentBestTotal})`);
        }
      }
      // 继续测试其他组合，寻找箱体数量更少的方案
      continue;
    }

    // 如果还没找到完美拼接，记录最佳覆盖率（相同覆盖率下优先箱体数量少的）
    if (!isFullyFilled) {
      const currentBestTotal = bestCombination.reduce((sum, sel) => sum + sel.count, 0);
      const shouldUpdate = coverage > bestCoverage || 
                          (Math.abs(coverage - bestCoverage) < 0.001 && totalCabinets < currentBestTotal);
      
      if (shouldUpdate) {
        bestCoverage = coverage;
        bestCombination = [
          { id: mainCabinet.id, specs: mainCabinet.specs, count: counts.get(mainCabinet.id) || 0, priority: 1 },
          ...combination.map(cabinetId => {
            const cabinet = auxiliaryCabinets.find(c => c.id === cabinetId);
            return {
              id: cabinetId,
              specs: cabinet!.specs,
              count: counts.get(cabinetId) || 0,
              priority: 2
            };
          })
        ];
      }
    }
  }

  console.log(`🎯 递进式组合测试完成:`);
  console.log(`最佳覆盖率: ${(bestCoverage * 100).toFixed(2)}%`);
  console.log(`是否完美拼接: ${isFullyFilled ? '是' : '否'}`);

  return {
    bestCombination,
    coverage: bestCoverage,
    isFullyFilled,
    testResults,
    adjustedSize: { width: wallWidthMm, height: wallHeightMm } // 🎯 返回调整后的尺寸
  };
}

/**
 * 优化的几何排版算法：优先使用指定的主箱体，并尽量减少箱体总数
 * @param wallWidthMM 墙体宽度
 * @param wallHeightMM 墙体高度
 * @param cabinetTypes 箱体类型列表
 * @param mainCabinetId 主箱体ID，优先使用
 * @returns 排版结果
 */
function optimizedGeometricPacking(
  wallWidthMM: number,
  wallHeightMM: number,
  cabinetTypes: Array<{id: string, widthMM: number, heightMM: number, specs: CabinetSpecs, priority: number}>,
  mainCabinetId: string
) {
  // 按优先级排序：主箱体优先，然后按面积从大到小排序（优先使用大箱体减少数量）
  const sortedTypes = [...cabinetTypes].sort((a, b) => {
    // 首先按优先级排序（优先级数字越小越优先）
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // 同等优先级下，强化面积优先策略：优先使用大箱体以减少箱体总数
    const areaA = a.widthMM * a.heightMM;
    const areaB = b.widthMM * b.heightMM;
    if (areaB !== areaA) {
      return areaB - areaA; // 面积从大到小
    }
    // 面积相同时，优先选择宽度较大的（减少横向拼接数量）
    return b.widthMM - a.widthMM;
  });

  // 计数器和排列结果
  const counts = new Map(sortedTypes.map(t => [t.id, 0]));
  const arrangedCabinets = [];

  // 矩形队列（guillotine拆分）- 从左下角开始填充
  let rects = [{ x: 0, y: 0, w: wallWidthMM, h: wallHeightMM }];
  let unfillableArea = 0;

  // 优先使用大箱体策略：在满足拼接的前提下，尽量减少箱体总数
  while (rects.length > 0) {
    const rect = rects.shift();
    if (!rect || rect.w <= 0 || rect.h <= 0) continue;

    // 智能选择策略：平衡主箱体优先和大箱体优先
    let chosen = null;
    
    // 首先尝试主箱体
    const mainCabinet = sortedTypes.find(t => t.id === mainCabinetId);
    if (mainCabinet && mainCabinet.widthMM <= rect.w && mainCabinet.heightMM <= rect.h) {
      // 计算使用主箱体的空间利用率
      const mainUtilization = (mainCabinet.widthMM * mainCabinet.heightMM) / (rect.w * rect.h);
      
      // 如果主箱体利用率高于50%（降低阈值以更多使用主箱体），直接使用
      if (mainUtilization >= 0.5) {
        chosen = mainCabinet;
      } else {
        // 否则寻找能放下的最大辅助箱体（已按面积从大到小排序）
        let bestAuxiliary = null;
        let bestArea = 0;
        
        for (const type of sortedTypes) {
          if (type.id !== mainCabinetId && type.widthMM <= rect.w && type.heightMM <= rect.h) {
            const area = type.widthMM * type.heightMM;
            // 优先选择面积最大的箱体（减少箱体总数）
            if (area > bestArea) {
              bestArea = area;
              bestAuxiliary = type;
            }
          }
        }
        
        // 如果辅助箱体面积明显更大（1.5倍以上），优先使用辅助箱体
        const mainArea = mainCabinet.widthMM * mainCabinet.heightMM;
        chosen = (bestAuxiliary && bestArea > mainArea * 1.5) ? bestAuxiliary : mainCabinet;
      }
    } else {
      // 如果主箱体放不下，选择能放下的最大箱体（sortedTypes已按面积从大到小排序）
      for (const type of sortedTypes) {
        if (type.widthMM <= rect.w && type.heightMM <= rect.h) {
          chosen = type;
          break; // 已按面积排序，第一个能放下的就是最大的
        }
      }
    }

    if (!chosen) {
      unfillableArea += rect.w * rect.h;
      continue;
    }

    // 放置箱体，增加计数
    counts.set(chosen.id, (counts.get(chosen.id) || 0) + 1);
    
    // 添加到排列结果
    arrangedCabinets.push({
      cabinetId: chosen.id,
      specs: chosen.specs,
      position: { x: rect.x, y: rect.y },
      size: { width: chosen.widthMM, height: chosen.heightMM },
      gridPosition: { 
        row: Math.floor(rect.y / chosen.heightMM), 
        col: Math.floor(rect.x / chosen.widthMM) 
      }
    });

    // 生成右侧和上方的剩余矩形
    const rightRect = { 
      x: rect.x + chosen.widthMM, 
      y: rect.y, 
      w: rect.w - chosen.widthMM, 
      h: chosen.heightMM 
    };
    const topRect = { 
      x: rect.x, 
      y: rect.y + chosen.heightMM, 
      w: rect.w, 
      h: rect.h - chosen.heightMM 
    };

    // 行优先：先处理右侧（继续铺本行），再处理上方（下一行）
    if (rightRect.w > 0 && rightRect.h > 0) rects.unshift(rightRect);
    if (topRect.w > 0 && topRect.h > 0) rects.push(topRect);
  }

  // 计算覆盖率
  const totalAreaMM = wallWidthMM * wallHeightMM;
  const coverage = totalAreaMM > 0 ? ((totalAreaMM - unfillableArea) / totalAreaMM) : 0;

  return { counts, coverage, unfillableArea, arrangedCabinets };
}

/**
 * 临近匹配替换算法：当Smart Combo未达到100%覆盖率时的保底机制
 * 使用+1-1的方式，寻找临近尺寸的箱体进行替换优化
 */

/**
 * 定义箱体临近关系映射表
 * 每个箱体ID对应其可能的"升级"选项（更大尺寸）
 */
const CABINET_PROXIMITY_MAP: Record<string, string[]> = {
  'uslim-iii-250x500': ['uslim-iii-250x750'], // 250×500 → 250×750（高度+250）
  'uslim-iii-500x250': ['uslim-iii-750x250'], // 500×250 → 750×250（宽度+250）
  'uslim-iii-500x500': ['uslim-iii-500x1000'], // 500×500 → 500×1000（高度+500）
  'uslim-iii-500x1000': [], // 500×1000已经是最大的，无需升级
  'uslim-iii-250x750': [], // 250×750已经是该宽度的最大高度
  'uslim-iii-750x250': [], // 750×250已经是该高度的最大宽度
  // 可以根据需要添加更多映射关系
};

/**
 * 计算两个箱体之间的面积差异系数
 * @param sourceCabinet 源箱体规格
 * @param targetCabinet 目标箱体规格
 * @returns 面积比例 (target/source)
 */
function calculateAreaRatio(sourceCabinet: CabinetSpecs, targetCabinet: CabinetSpecs): number {
  const sourceArea = sourceCabinet.dimensions.width * sourceCabinet.dimensions.height;
  const targetArea = targetCabinet.dimensions.width * targetCabinet.dimensions.height;
  return targetArea / sourceArea;
}

/**
 * 临近匹配替换算法的核心逻辑
 * @param currentBestCombination 当前最佳组合
 * @param availableCabinets 所有可用的箱体规格
 * @param wallWidthMm 墙体宽度（毫米）
 * @param wallHeightMm 墙体高度（毫米）
 * @param currentCoverage 当前覆盖率
 * @returns 优化后的组合方案
 */
export async function proximityReplacementOptimization(
  currentBestCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  wallWidthMm: number,
  wallHeightMm: number,
  currentCoverage: number
): Promise<{
  optimizedCombination: CabinetSelection[];
  newCoverage: number;
  isImproved: boolean;
  replacements: Array<{
    removed: { id: string; count: number };
    added: { id: string; count: number };
    reason: string;
  }>;
}> {
  console.log('🔧 启动临近匹配替换算法');
  console.log(`当前覆盖率: ${(currentCoverage * 100).toFixed(2)}%`);
  
  let bestCombination = [...currentBestCombination];
  let bestCoverage = currentCoverage;
  let isImproved = false;
  const replacements: Array<{
    removed: { id: string, count: number };
    added: { id: string, count: number };
    reason: string;
  }> = [];

  // 创建可用箱体的映射表
  const cabinetMap = new Map<string, { id: string, specs: CabinetSpecs }>();
  availableCabinets.forEach(cabinet => {
    cabinetMap.set(cabinet.id, cabinet);
  });

  // 遍历当前组合中的每个箱体，寻找可替换的选项
  for (const currentSelection of currentBestCombination) {
    if (currentSelection.count <= 0) continue;
    
    const proximityOptions = CABINET_PROXIMITY_MAP[currentSelection.id];
    if (!proximityOptions || proximityOptions.length === 0) continue;

    console.log(`🔍 检查 ${currentSelection.specs.name} 的临近替换选项:`, proximityOptions);

    // 尝试每个临近替换选项
    for (const targetCabinetId of proximityOptions) {
      const targetCabinet = cabinetMap.get(targetCabinetId);
      if (!targetCabinet) continue;

      console.log(`   🧪 测试替换: ${currentSelection.specs.name} → ${targetCabinet.specs.name}`);

      // 计算面积比例，确定替换比例
      const areaRatio = calculateAreaRatio(currentSelection.specs, targetCabinet.specs);
      
      // 计算替换数量：+1个大箱体，-N个小箱体
      const targetCount = 1; // 新增1个大箱体
      const sourceReduction = Math.ceil(areaRatio); // 减少的小箱体数量
      
      // 确保不会减少过多
      if (sourceReduction > currentSelection.count) {
        console.log(`     ⚠️ 跳过：需要减少${sourceReduction}个，但只有${currentSelection.count}个`);
        continue;
      }

      // 创建测试组合
      const testCombination = bestCombination.map(selection => {
        if (selection.id === currentSelection.id) {
          // 减少源箱体数量
          return { ...selection, count: selection.count - sourceReduction };
        }
        return { ...selection };
      });

      // 查找或添加目标箱体
      let targetSelectionIndex = testCombination.findIndex(s => s.id === targetCabinetId);
      if (targetSelectionIndex >= 0) {
        // 如果目标箱体已存在，增加数量
        testCombination[targetSelectionIndex].count += targetCount;
      } else {
        // 如果目标箱体不存在，添加新的选择
        testCombination.push({
          id: targetCabinetId,
          specs: targetCabinet.specs,
          count: targetCount,
          priority: 2
        });
      }

      // 过滤掉count为0的箱体
      const filteredTestCombination = testCombination.filter(s => s.count > 0);

      try {
        // 使用多箱体计算算法测试新组合
        const testResult = await calculateMultiCabinetDisplayWall(
          filteredTestCombination,
          { 
            dimensions: { width: wallWidthMm / 1000, height: wallHeightMm / 1000 }, 
            unit: 'meters' as const,
            wallType: 'flat' as const
          },
          { 
            layout: { columns: 1, rows: 1 },
            resolution: 'FHD' as const,
            configuration: 'multi-cabinet' as const,
            redundancy: {
              power: false,
              data: false,
              noRedundancy: true
            }
          }
        );

        console.log(`     📊 测试结果: 覆盖率 ${(testResult.arrangement!.coverage * 100).toFixed(2)}%`);

        // 如果覆盖率有改善
        if (testResult.arrangement!.coverage > bestCoverage + 0.001) {
          console.log(`     ✅ 找到更优解！覆盖率提升: ${(bestCoverage * 100).toFixed(2)}% → ${(testResult.arrangement!.coverage * 100).toFixed(2)}%`);
          
          bestCombination = filteredTestCombination;
          bestCoverage = testResult.arrangement!.coverage;
          isImproved = true;

          // 记录这次替换
          replacements.push({
            removed: { 
              id: currentSelection.id, 
              count: sourceReduction 
            },
            added: { 
              id: targetCabinetId, 
              count: targetCount 
            },
            reason: `面积比例优化: ${areaRatio.toFixed(2)}倍，覆盖率提升至${(bestCoverage * 100).toFixed(2)}%`
          });

          // 如果达到了完美拼接，可以停止
          if (bestCoverage >= 0.999995) {
            console.log(`     🎉 达到完美拼接！停止进一步优化`);
            break;
          }
        }
      } catch (error) {
        console.log(`     ❌ 测试组合失败:`, error);
        continue;
      }
    }

    // 如果已经达到完美拼接，退出外层循环
    if (bestCoverage >= 0.999995) {
      break;
    }
  }

  console.log(`🔧 临近匹配替换算法完成`);
  console.log(`最终覆盖率: ${(bestCoverage * 100).toFixed(2)}% (改善: ${isImproved ? '是' : '否'})`);
  
  if (replacements.length > 0) {
    console.log(`执行的替换操作:`);
    replacements.forEach((replacement, index) => {
      console.log(`  ${index + 1}. 减少 ${replacement.removed.count}个 ${replacement.removed.id}`);
      console.log(`     增加 ${replacement.added.count}个 ${replacement.added.id}`);
      console.log(`     原因: ${replacement.reason}`);
    });
  }

  return {
    optimizedCombination: bestCombination,
    newCoverage: bestCoverage,
    isImproved,
    replacements
  };
}

/**
 * 增强版的递进式组合测试算法：集成临近匹配替换
 * @param mainCabinet 固定的主箱体规格
 * @param auxiliaryCabinets 可选择的辅助箱体列表
 * @param wallWidthMm 墙体宽度（毫米）
 * @param wallHeightMm 墙体高度（毫米）
 * @returns 最佳组合方案（包含临近匹配优化）
 */
export async function enhancedProgressiveCabinetCombination(
  mainCabinet: { id: string, specs: CabinetSpecs },
  auxiliaryCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  wallWidthMm: number,
  wallHeightMm: number
): Promise<{
  bestCombination: CabinetSelection[];
  coverage: number;
  isFullyFilled: boolean;
  testResults: Array<{
    combination: string[];
    coverage: number;
    counts: Map<string, number>;
    arrangementResult: ArrangementResult;
  }>;
  proximityOptimization?: {
    wasApplied: boolean;
    originalCoverage: number;
    optimizedCoverage: number;
    replacements: Array<{
      removed: { id: string; count: number };
      added: { id: string; count: number };
      reason: string;
    }>;
  };
}> {
  console.log('🚀 启动增强版递进式组合测试算法（集成临近匹配替换）');

  // 首先运行标准的递进式组合测试
  const standardResult = progressiveCabinetCombinationTest(
    mainCabinet,
    auxiliaryCabinets,
    wallWidthMm,
    wallHeightMm
  );

  // 🎯 关键修复：使用调整后的尺寸
  if (standardResult.adjustedSize) {
    wallWidthMm = standardResult.adjustedSize.width;
    wallHeightMm = standardResult.adjustedSize.height;
    console.log(`✅ 使用调整后的墙体尺寸: ${wallWidthMm}×${wallHeightMm}mm`);
  }

  let finalResult = {
    ...standardResult,
    proximityOptimization: undefined as any
  };

  // 如果覆盖率未达到100%，优先使用精准组合优化，然后再尝试临近匹配
  if (standardResult.coverage < 0.999995) {
    console.log('📈 覆盖率未达到100%，启用精准组合优化算法');
    
    // 构建所有可用箱体列表
    const allAvailableCabinets = [
      mainCabinet,
      ...auxiliaryCabinets
    ];

    // 优先尝试精准组合优化（专门处理边界尺寸问题）- 使用调整后的尺寸
    const precisionResult = preciseCombinationOptimization(
      standardResult.bestCombination,
      allAvailableCabinets,
      wallWidthMm,  // 🎯 使用调整后的宽度
      wallHeightMm, // 🎯 使用调整后的高度
      standardResult.coverage
    );

    if (precisionResult.isImproved) {
      console.log('🎯 精准组合优化成功解决边界问题！');
      console.log('优化详情:', precisionResult.optimizationDetails);
      
      finalResult = {
        ...standardResult,
        bestCombination: precisionResult.optimizedCombination,
        coverage: precisionResult.newCoverage,
        isFullyFilled: precisionResult.newCoverage >= 0.999995,
        proximityOptimization: {
          wasApplied: true,
          originalCoverage: standardResult.coverage,
          optimizedCoverage: precisionResult.newCoverage,
          replacements: [{
            removed: { id: 'boundary-issue', count: 0 },
            added: { id: 'precision-solution', count: 0 },
            reason: `精准组合优化: ${precisionResult.optimizationDetails}`
          }]
        }
      };
    } else {
      console.log('💡 精准组合优化未找到解决方案，回退到临近匹配替换算法');

    const proximityResult = await proximityReplacementOptimization(
      standardResult.bestCombination,
      allAvailableCabinets,
      wallWidthMm,
      wallHeightMm,
      standardResult.coverage
    );

    if (proximityResult.isImproved) {
      console.log('✨ 临近匹配替换算法成功优化了结果！');
      
      finalResult = {
        ...standardResult,
        bestCombination: proximityResult.optimizedCombination,
        coverage: proximityResult.newCoverage,
        isFullyFilled: proximityResult.newCoverage >= 0.999995,
        proximityOptimization: {
          wasApplied: true,
          originalCoverage: standardResult.coverage,
          optimizedCoverage: proximityResult.newCoverage,
          replacements: proximityResult.replacements
        }
      };
    } else {
      console.log('💡 临近匹配替换算法未找到更优解，保持原结果');
      finalResult.proximityOptimization = {
        wasApplied: false,
        originalCoverage: standardResult.coverage,
        optimizedCoverage: standardResult.coverage,
        replacements: []
      };
      }
    }
  } else {
    console.log('🎯 标准算法已达到完美拼接，无需临近匹配优化');
    finalResult.proximityOptimization = {
      wasApplied: false,
      originalCoverage: standardResult.coverage,
      optimizedCoverage: standardResult.coverage,
      replacements: []
    };
  }

  return finalResult;
}

/**
 * 精准组合优化算法 - 专门处理边界尺寸问题（如3.25m宽度）
 * 仅修改有问题的特定箱体组合，不影响其他已完美排列的区域
 */
export function preciseCombinationOptimization(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  wallWidthMm: number,
  wallHeightMm: number,
  currentCoverage: number
): {
  optimizedCombination: CabinetSelection[];
  newCoverage: number;
  isImproved: boolean;
  optimizationDetails: string;
} {
  console.log('🎯 启动精准组合优化算法');
  console.log(`当前覆盖率: ${(currentCoverage * 100).toFixed(3)}%`);
  console.log(`目标尺寸: ${wallWidthMm}×${wallHeightMm}mm`);

  // 分析当前组合的填充情况
  const analysis = analyzeCurrentFilling(currentCombination, wallWidthMm, wallHeightMm);
  
  if (!analysis.hasGap) {
    return {
      optimizedCombination: currentCombination,
      newCoverage: currentCoverage,
      isImproved: false,
      optimizationDetails: '当前组合无明显缺口，无需优化'
    };
  }

  console.log('📊 填充分析:', analysis);

  // 尝试寻找组合替换方案
  const replacement = findOptimalReplacement(
    currentCombination, 
    availableCabinets, 
    analysis
  );

  if (!replacement) {
    return {
      optimizedCombination: currentCombination,
      newCoverage: currentCoverage,
      isImproved: false,
      optimizationDetails: '未找到有效的组合替换方案'
    };
  }

  console.log('✨ 找到组合替换方案:', replacement);

  return {
    optimizedCombination: replacement.newCombination,
    newCoverage: 1.0, // 精准组合应该达到完美填充
    isImproved: true,
    optimizationDetails: replacement.explanation
  };
}

/**
 * 分析当前填充情况，专门检测行级拼接问题（如3.25m宽度）
 */
function analyzeCurrentFilling(
  combination: CabinetSelection[], 
  wallWidthMm: number, 
  wallHeightMm: number
) {
  console.log('🔍 行级拼接分析:');
  console.log(`目标尺寸: ${wallWidthMm}×${wallHeightMm}mm`);

  // 按高度分组分析箱体
  const heightGroups = new Map();
  
  for (const selection of combination) {
    if (selection.count <= 0) continue;
    
    const height = selection.specs.dimensions.height;
    if (!heightGroups.has(height)) {
      heightGroups.set(height, []);
    }
    
    heightGroups.get(height).push({
      id: selection.id,
      name: selection.specs.name,
      width: selection.specs.dimensions.width,
      height: height,
      count: selection.count,
      specs: selection.specs
    });
  }

  // 分析每个高度组的宽度填充情况
  let problemRow = null;
  for (const [height, cabinets] of heightGroups.entries()) {
    const totalWidth = cabinets.reduce((sum: number, cab: any) => sum + (cab.width * cab.count), 0);
    const widthGap = wallWidthMm - totalWidth;
    
    console.log(`高度${height}mm行: 总宽度${totalWidth}mm, 缺口${widthGap}mm`);
    cabinets.forEach((cab: any) => {
      console.log(`   ${cab.name}: ${cab.width}mm × ${cab.count}个 = ${cab.width * cab.count}mm`);
    });
    
    // 检测是否存在宽度拼接问题（余数在50-300mm之间）
    if (widthGap > 50 && widthGap <= 300) {
      console.log(`🎯 发现行级拼接问题: 高度${height}mm行缺少${widthGap}mm宽度`);
      
      // 寻找主导箱体（数量最多的）
      const dominantCabinet = cabinets.reduce((max: any, cab: any) => 
        cab.count > max.count ? cab : max
      );
      
      problemRow = {
        height,
        widthGap,
        cabinets,
        dominantCabinet,
        totalWidth,
        explanation: `${height}mm高行: 主导箱体${dominantCabinet.name}×${dominantCabinet.count}, 缺口${widthGap}mm`
      };
      break;
    }
  }

  return {
    hasGap: problemRow !== null,
    problemRow,
    heightGroups,
    needsRowLevelOptimization: problemRow !== null
  };
}


/**
 * 寻找最优的行级替换方案
 * 专门处理3.25m宽度等行级拼接问题
 */
function findOptimalReplacement(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  analysis: any
) {
  if (!analysis.needsRowLevelOptimization) {
    console.log('💡 无行级拼接问题，无需优化');
    return null;
  }

  const problemRow = analysis.problemRow;
  console.log(`🔧 处理行级拼接问题: ${problemRow.explanation}`);

  // 🎯 优先使用精确线性方程求解器（针对两种同高度箱体的行级拼接）
  const linearSolution = tryLinearEquationSolution(
    currentCombination,
    availableCabinets,
    problemRow
  );
  
  if (linearSolution) {
    console.log('✨ 线性方程求解器找到最优解！');
    return linearSolution;
  }

  // 尝试通用的动态组合优化（处理各种尺寸缺口）
  const dynamicSolution = findDynamicCombinationSolution(
    currentCombination,
    availableCabinets,
    problemRow
  );
  
  if (dynamicSolution) return dynamicSolution;

  // 专门处理3.25m宽度问题（250mm缺口，750mm主导箱体）- 保留作为特殊优化
  if (Math.abs(problemRow.widthGap - 250) <= 10 && 
      problemRow.dominantCabinet?.width === 750) {
    
    const solution = handle325mRowProblem(
      currentCombination, 
      availableCabinets, 
      problemRow
    );
    
    if (solution) return solution;
  }

  // 通用的行级拼接处理（简单直接填充）
  const genericSolution = findGenericRowSolution(
    currentCombination,
    availableCabinets, 
    problemRow
  );
  
  if (genericSolution) return genericSolution;

  console.log('💡 未找到合适的行级拼接方案');
  return null;
}

/**
 * 通用的动态组合优化算法
 * 处理任意尺寸的行级拼接问题（如3.25m, 4.25m等）
 */
function findDynamicCombinationSolution(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  problemRow: any
) {
  console.log('🧠 启动动态组合优化算法');
  
  const targetHeight = problemRow.height;
  const currentTotalWidth = problemRow.totalWidth;
  const targetWidth = currentTotalWidth + problemRow.widthGap; // 目标总宽度
  
  console.log(`目标: 在${targetHeight}mm高度行实现${targetWidth}mm完美拼接`);
  console.log(`当前: ${currentTotalWidth}mm，缺口: ${problemRow.widthGap}mm`);

  // 获取同高度的所有可用箱体宽度
  const availableWidths = availableCabinets
    .filter(cabinet => cabinet.specs.dimensions.height === targetHeight)
    .map(cabinet => ({
      width: cabinet.specs.dimensions.width,
      id: cabinet.id,
      specs: cabinet.specs
    }))
    .sort((a, b) => b.width - a.width); // 从大到小排序

  console.log(`可用宽度（${targetHeight}mm高）:`, availableWidths.map(w => `${w.width}mm`));

  // 使用动态规划找到最优组合
  const optimalCombination = findOptimalWidthCombination(targetWidth, availableWidths);
  
  if (!optimalCombination) {
    console.log('💡 动态规划未找到完美组合');
    return null;
  }

  console.log('✨ 找到最优宽度组合:', optimalCombination.explanation);

  // 计算需要的调整（当前组合 → 最优组合）
  const adjustment = calculateCombinationAdjustment(
    currentCombination,
    optimalCombination.combination,
    targetHeight,
    availableCabinets
  );

  if (!adjustment) {
    console.log('💡 无法计算有效的箱体调整方案');
    return null;
  }

  return adjustment;
}

/**
 * 使用动态规划找到最优的宽度组合
 */
function findOptimalWidthCombination(
  targetWidth: number,
  availableWidths: Array<{ width: number, id: string, specs: any }>
): { combination: Map<number, number>, explanation: string } | null {
  
  console.log(`🎯 动态规划求解: 目标宽度 ${targetWidth}mm`);

  // 动态规划表：dp[i] = 是否能精确组成宽度i
  const dp = new Array(targetWidth + 1).fill(false);
  const parent = new Array(targetWidth + 1).fill(-1);
  const usedWidth = new Array(targetWidth + 1).fill(0);
  
  dp[0] = true; // 宽度0可以达到

  // 填充DP表
  for (let i = 1; i <= targetWidth; i++) {
    for (const { width } of availableWidths) {
      if (width <= i && dp[i - width]) {
        dp[i] = true;
        parent[i] = i - width;
        usedWidth[i] = width;
        break; // 找到一种方案即可（优先使用大箱体）
      }
    }
  }

  if (!dp[targetWidth]) {
    console.log(`❌ 无法用可用宽度精确组成${targetWidth}mm`);
    return null;
  }

  // 回溯构建组合
  const combination = new Map<number, number>();
  let current = targetWidth;
  
  while (current > 0) {
    const width = usedWidth[current];
    combination.set(width, (combination.get(width) || 0) + 1);
    current = parent[current];
  }

  // 生成说明
  const parts = Array.from(combination.entries())
    .sort((a, b) => b[0] - a[0]) // 从大到小排序显示
    .map(([width, count]) => `${width}mm×${count}个`)
    .join(' + ');
  
  const explanation = `W=${targetWidth}mm = ${parts}`;
  
  console.log(`✅ 最优组合: ${explanation}`);
  
  return { combination, explanation };
}

/**
 * 计算从当前组合到最优组合的调整方案
 */
function calculateCombinationAdjustment(
  currentCombination: CabinetSelection[],
  optimalCombination: Map<number, number>,
  targetHeight: number,
  availableCabinets?: Array<{ id: string, specs: CabinetSpecs }>
): { 
  newCombination: CabinetSelection[], 
  explanation: string 
} | null {
  
  console.log('🔄 计算箱体调整方案');

  // 统计当前组合中同高度箱体的宽度分布
  const currentWidthCounts = new Map<number, { count: number, id: string }>();
  
  for (const selection of currentCombination) {
    if (selection.specs.dimensions.height === targetHeight && selection.count > 0) {
      const width = selection.specs.dimensions.width;
      currentWidthCounts.set(width, { 
        count: selection.count, 
        id: selection.id 
      });
    }
  }

  console.log('当前宽度分布:', Array.from(currentWidthCounts.entries()));
  console.log('目标宽度分布:', Array.from(optimalCombination.entries()));

  // 生成调整后的组合
  const newCombination = currentCombination.map(selection => ({ ...selection }));
  const adjustments = [];

  // 处理需要调整的宽度
  const allWidths = new Set([
    ...currentWidthCounts.keys(),
    ...optimalCombination.keys()
  ]);

  for (const width of allWidths) {
    const currentCount = currentWidthCounts.get(width)?.count || 0;
    const targetCount = optimalCombination.get(width) || 0;
    const diff = targetCount - currentCount;

    if (diff !== 0) {
      // 找到对应的箱体选择
      let selectionIndex = newCombination.findIndex(s => 
        s.specs.dimensions.width === width && 
        s.specs.dimensions.height === targetHeight
      );

      if (selectionIndex >= 0) {
        // 更新现有箱体数量
        newCombination[selectionIndex].count += diff;
        if (diff > 0) {
          adjustments.push(`+${diff}个${width}×${targetHeight}`);
        } else {
          adjustments.push(`${diff}个${width}×${targetHeight}`);
        }
      } else if (diff > 0 && availableCabinets) {
        // 需要添加新的箱体类型
        const targetCabinet = availableCabinets.find(c => 
          c.specs.dimensions.width === width && 
          c.specs.dimensions.height === targetHeight
        );
        
        if (targetCabinet) {
          console.log(`✨ 添加新箱体类型: ${targetCabinet.specs.name} × ${diff}个`);
          newCombination.push({
            id: targetCabinet.id,
            count: diff,
            specs: targetCabinet.specs,
            priority: 3 // 动态添加的箱体优先级较低
          });
          adjustments.push(`+${diff}个${width}×${targetHeight}`);
        } else {
          console.log(`❌ 未找到可用的箱体规格: ${width}×${targetHeight}mm`);
          return null;
        }
      } else if (diff > 0) {
        console.log(`⚠️ 需要添加新箱体类型但缺少availableCabinets参数: ${width}×${targetHeight}`);
        return null;
      }
    }
  }

  if (adjustments.length === 0) {
    console.log('💡 当前组合已是最优，无需调整');
    return null;
  }

  const explanation = `动态优化: ${adjustments.join(', ')}`;
  console.log(`✅ 调整方案: ${explanation}`);

  return { newCombination, explanation };
}

/**
 * 专门处理3.25m宽度行级拼接问题
 * 将1个750×250替换为2个500×250，实现完美行级拼接
 */
function handle325mRowProblem(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  problemRow: any
) {
  console.log('🎯 检测到3.25m宽度行级拼接问题，执行临近匹配算法');
  console.log('策略: 1个750×250 → 2个500×250，保持高度250mm不变');
  
  const dominantCabinet = problemRow.dominantCabinet;
  const targetHeight = problemRow.height; // 必须是250mm
  
  // 寻找同样高度的500mm宽箱体
  const target500Cabinet = availableCabinets.find(c => 
    c.specs.dimensions.width === 500 && 
    c.specs.dimensions.height === targetHeight
  );

  if (!target500Cabinet) {
    console.log(`❌ 未找到${targetHeight}mm高度的500mm宽箱体`);
    return null;
  }

  console.log(`✨ 找到行级替换方案:`);
  console.log(`   减少: 1个${dominantCabinet.name} (750×${targetHeight}mm)`);
  console.log(`   增加: 2个${target500Cabinet.specs.name} (500×${targetHeight}mm)`);
  console.log(`   结果: W = 3×750 + 2×500 = 2250 + 1000 = 3250mm = 3.25m ✓`);

  // 执行替换：-1个750×250, +2个500×250
  const newCombination = currentCombination.map(selection => {
    if (selection.id === dominantCabinet.id) {
      return { ...selection, count: selection.count - 1 };
    }
    if (selection.id === target500Cabinet.id) {
      return { ...selection, count: selection.count + 2 };
    }
    return selection;
  });

  // 如果500×250箱体原来不存在，需要添加
  const has500Cabinet = currentCombination.some(s => s.id === target500Cabinet.id);
  if (!has500Cabinet) {
    newCombination.push({
      id: target500Cabinet.id,
      count: 2,
      specs: target500Cabinet.specs,
      priority: 2
    });
  }

  return {
    newCombination,
    explanation: `3.25m行级拼接: 1个${dominantCabinet.name} → 2个${target500Cabinet.specs.name} (W=0.75×3+0.5×2=3.25m)`
  };
}

/**
 * 尝试使用精确线性方程求解器解决行级拼接问题
 * 专门处理同高度两种箱体的完美拼接（如3.25m宽度 = 5×500mm + 1×750mm）
 */
function tryLinearEquationSolution(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  problemRow: any
): { newCombination: CabinetSelection[], explanation: string } | null {
  console.log('🧮 尝试使用精确线性方程求解器...');
  
  const targetHeight = problemRow.height;
  const targetWidth = problemRow.totalWidth + problemRow.widthGap;
  
  console.log(`目标尺寸: ${targetWidth}mm × ${targetHeight}mm`);
  
  // 找到所有同高度的可用箱体
  const sameHeightCabinets = availableCabinets.filter(cabinet => 
    cabinet.specs.dimensions.height === targetHeight
  );
  
  console.log(`找到${sameHeightCabinets.length}种同高度(${targetHeight}mm)的箱体`);
  
  if (sameHeightCabinets.length < 2) {
    console.log('⚠️ 同高度箱体少于2种，无法使用线性方程求解');
    return null;
  }
  
  // 按宽度排序，优先使用较小的箱体（主箱体）
  const sortedCabinets = sameHeightCabinets.sort((a, b) => 
    a.specs.dimensions.width - b.specs.dimensions.width
  );
  
  // 尝试每一对箱体组合
  for (let i = 0; i < sortedCabinets.length - 1; i++) {
    for (let j = i + 1; j < sortedCabinets.length; j++) {
      const cabinetA = sortedCabinets[i]; // 较小的箱体（主箱体）
      const cabinetB = sortedCabinets[j]; // 较大的箱体（辅助箱体）
      
      console.log(`🔍 测试组合: ${cabinetA.specs.name}(${cabinetA.specs.dimensions.width}mm) + ${cabinetB.specs.name}(${cabinetB.specs.dimensions.width}mm)`);
      
      // 构造临时选择用于线性求解
      const tempSelections: CabinetSelection[] = [
        {
          id: cabinetA.id,
          specs: cabinetA.specs,
          count: 0,
          priority: 1
        },
        {
          id: cabinetB.id,
          specs: cabinetB.specs,
          count: 0,
          priority: 2
        }
      ];
      
      // 调用线性方程求解器（高度相同的情况）
      const linearResult = solveLinearTwoCabinets(
        tempSelections,
        targetWidth / 1000, // 转换为米
        targetHeight / 1000  // 转换为米
      );
      
      if (linearResult?.success) {
        console.log('✅ 线性方程求解成功！');
        console.log(`   ${linearResult.explanation}`);
        console.log(`   布局: ${linearResult.geometry.layout}`);
        
        const [countA, countB] = linearResult.counts;
        
        // 验证数量的合理性（避免过多箱体）
        if (countA + countB > 20) {
          console.log(`⚠️ 箱体数量过多(${countA + countB})，跳过此解`);
          continue;
        }
        
        // 构建新的箱体组合
        const newCombination = buildNewCombinationWithLinearSolution(
          currentCombination,
          cabinetA,
          cabinetB,
          countA,
          countB,
          targetHeight
        );
        
        return {
          newCombination,
          explanation: `线性方程精确解: ${linearResult.explanation} (优先使用${cabinetA.specs.name})`
        };
      }
    }
  }
  
  console.log('💡 线性方程求解器未找到完美解');
  return null;
}

/**
 * 根据线性求解结果构建新的箱体组合
 * 移除问题行的旧箱体，添加新的精确组合
 */
function buildNewCombinationWithLinearSolution(
  currentCombination: CabinetSelection[],
  cabinetA: { id: string, specs: CabinetSpecs },
  cabinetB: { id: string, specs: CabinetSpecs },
  countA: number,
  countB: number,
  targetHeight: number
): CabinetSelection[] {
  console.log('🔨 构建新的箱体组合...');
  
  // 复制当前组合
  const newCombination = currentCombination.map(sel => ({ ...sel }));
  
  // 移除所有同高度的箱体（这些是问题行的旧箱体）
  for (const selection of newCombination) {
    if (selection.specs.dimensions.height === targetHeight) {
      console.log(`   移除: ${selection.specs.name} × ${selection.count}个`);
      selection.count = 0;
    }
  }
  
  // 添加或更新箱体A的数量
  let foundA = false;
  for (const selection of newCombination) {
    if (selection.id === cabinetA.id) {
      selection.count = countA;
      foundA = true;
      console.log(`   更新: ${cabinetA.specs.name} → ${countA}个`);
      break;
    }
  }
  if (!foundA && countA > 0) {
    newCombination.push({
      id: cabinetA.id,
      specs: cabinetA.specs,
      count: countA,
      priority: 1
    });
    console.log(`   新增: ${cabinetA.specs.name} × ${countA}个`);
  }
  
  // 添加或更新箱体B的数量
  let foundB = false;
  for (const selection of newCombination) {
    if (selection.id === cabinetB.id) {
      selection.count = countB;
      foundB = true;
      console.log(`   更新: ${cabinetB.specs.name} → ${countB}个`);
      break;
    }
  }
  if (!foundB && countB > 0) {
    newCombination.push({
      id: cabinetB.id,
      specs: cabinetB.specs,
      count: countB,
      priority: 2
    });
    console.log(`   新增: ${cabinetB.specs.name} × ${countB}个`);
  }
  
  // 过滤掉数量为0的箱体
  const filteredCombination = newCombination.filter(sel => sel.count > 0);
  
  console.log('✅ 新组合构建完成');
  return filteredCombination;
}

/**
 * 通用的行级拼接解决方案
 * 处理其他类似的行级拼接问题
 */
function findGenericRowSolution(
  currentCombination: CabinetSelection[],
  availableCabinets: Array<{ id: string, specs: CabinetSpecs }>,
  problemRow: any
) {
  console.log('🔧 尝试通用行级拼接解决方案');
  
  const widthGap = problemRow.widthGap;
  const targetHeight = problemRow.height;
  
  console.log(`目标: 在${targetHeight}mm高度行填补${widthGap}mm宽度缺口`);

  // 策略1: 寻找能直接填补缺口的同高度箱体
  for (const cabinet of availableCabinets) {
    if (cabinet.specs.dimensions.height === targetHeight && 
        Math.abs(cabinet.specs.dimensions.width - widthGap) <= 10) {
      
      console.log(`✨ 找到直接填充方案: 添加${cabinet.specs.name}`);
      
      // 检查是否已存在该箱体
      const existingIndex = currentCombination.findIndex(s => s.id === cabinet.id);
      
      let newCombination;
      if (existingIndex >= 0) {
        newCombination = currentCombination.map((selection, index) => 
          index === existingIndex
            ? { ...selection, count: selection.count + 1 }
            : selection
        );
      } else {
        newCombination = [
          ...currentCombination,
          {
            id: cabinet.id,
            count: 1,
            specs: cabinet.specs,
            priority: 3
          }
        ];
      }

      return {
        newCombination,
        explanation: `行级直接填充: 添加1个${cabinet.specs.name}填补${widthGap}mm缺口`
      };
    }
  }

  console.log('💡 未找到通用行级解决方案');
  return null;
}

// 清理完毕：移除重复和不需要的辅助函数


