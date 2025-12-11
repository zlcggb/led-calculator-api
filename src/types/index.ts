/**
 * LED Calculator API - Type Definitions
 * Adapted from src/products/data/led-configurator-types.ts
 * Requirements: 1.1, 2.1
 */

// ============================================
// API Response Types
// ============================================

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

// ============================================
// Cabinet Specifications
// ============================================

export interface CabinetSpecs {
  // 基本参数
  id: string;
  name: string;
  model: string;
  
  // 物理尺寸 (mm)
  dimensions: {
    width: number;      // 宽度
    height: number;     // 高度 
    depth: number;      // 厚度
  };
  
  // 显示参数
  display: {
    pixelPitch: number;         // 像素间距 (mm)
    resolution: {               // 单个箱体分辨率
      width: number;            // 水平像素数
      height: number;           // 垂直像素数
    };
    brightness: number;         // 亮度 (nits)
    refreshRate: number;        // 刷新率 (Hz)
    colorDepth: number;         // 色深 (bit)
  };
  
  // 功耗参数 (W)
  power: {
    maxPower: number;           // 最大功耗
    typicalPower: number;       // 典型功耗
    standbyPower: number;       // 待机功耗
  };
  
  // 物理参数
  physical: {
    weight: number;             // 重量 (kg)
    operatingTemp: {            // 工作温度 (°C)
      min: number;
      max: number;
    };
    humidity: {                 // 湿度 (%)
      min: number;
      max: number;
    };
    ipRating: string;           // 防护等级
  };
  
  // 安装参数
  installation: {
    mountingType: string[];     // 安装方式 ['wall', 'floor', 'ceiling', 'truss']
    cableType: string[];        // 线缆类型
    maintenanceAccess: string;  // 维护方式 'front' | 'rear' | 'both'
    wiringDirection?: string;   // 信号走线方向 'Horizontal' | 'Vertical'
    powerDirection?: string;    // 电源走线方向 'Horizontal' | 'Vertical' | 'Horizontal_Left_To_Right'
  };
}

// ============================================
// Room Configuration
// ============================================

export interface RoomConfig {
  dimensions: {
    width: number;              // 房间宽度
    height: number;             // 房间高度
    depth?: number;             // 房间深度（可选）
  };
  unit: 'meters' | 'feet';      // 单位系统
  wallType: 'flat' | 'curved' | 'corner'; // 墙体类型
}

// ============================================
// Cabinet Selection & Arrangement
// ============================================

export interface CabinetSelection {
  id: string;
  specs: CabinetSpecs;
  count: number;                // 可用数量
  priority?: number;            // 排列优先级（数字越小优先级越高）
}

export interface ArrangedCabinet {
  cabinetId: string;            // 箱体ID
  specs: CabinetSpecs;          // 箱体规格
  position: {
    x: number;                  // X坐标（像素或物理单位）
    y: number;                  // Y坐标（像素或物理单位）
  };
  size: {
    width: number;              // 宽度
    height: number;             // 高度
  };
  gridPosition?: {              // 网格位置（可选）
    row: number;
    col: number;
  };
}

export type CabinetArrangementStrategy = 
  | 'left-to-right'        // 从左到右（默认）
  | 'right-to-left';       // 从右到左

export interface ArrangementResult {
  cabinets: ArrangedCabinet[];  // 排列的箱体列表
  totalArea: number;            // 总占用面积
  screenArea: number;           // 目标屏幕面积
  coverage: number;             // 覆盖率 (0-1)
  isFullyFilled: boolean;       // 是否完全填充
  strategy: 'row_wise' | 'column_wise' | 'progressive_combination'; // 使用的排列策略（内部算法）
  arrangementDirection?: CabinetArrangementStrategy; // 排列方向策略（用户选择）
}

// ============================================
// Display Configuration
// ============================================

export interface DisplayConfig {
  // 传统单一箱体配置（保持向后兼容）
  layout: {
    columns: number;            // 列数
    rows: number;               // 行数
  };
  resolution: 'FHD' | 'UHD' | '8K' | 'Custom'; // 分辨率预设
  resolutionMode?: 'preset' | 'manual'; // 分辨率模式：preset=预设优先，manual=手动调整
  targetPixels?: {              // 目标分辨率像素（仅在preset模式下使用）
    width: number;
    height: number;
  };
  configuration: 'fit-to-wall' | 'custom' | 'multi-cabinet'; // 配置模式
  redundancy: {
    power: boolean;             // 电源冗余
    data: boolean;              // 数据冗余
    noRedundancy: boolean;      // 无冗余
  };
  
  // 多箱体配置（新增）
  multiCabinet?: {
    selectedCabinets: CabinetSelection[]; // 选择的箱体类型
    arrangementStrategy: 'auto' | 'row_wise' | 'column_wise'; // 排列策略
    arrangementDirection?: CabinetArrangementStrategy; // 排列方向（新增）
    allowPartialFill: boolean;  // 是否允许部分填充
    maxErrorRate: number;       // 最大误差率 (默认0.05 = 5%)
  };
}

// ============================================
// Calculation Result
// ============================================

export interface CalculationResult {
  // 显示墙尺寸
  wallDimensions: {
    width: number;              // 总宽度 (m)
    height: number;             // 总高度 (m)
    area: number;               // 显示面积 (m²)
    diagonal: number;           // 对角线尺寸 (inches)
  };
  
  // 箱体数量（单一箱体模式）
  cabinetCount: {
    total: number;              // 总数量
    horizontal: number;         // 水平数量
    vertical: number;           // 垂直数量
  };
  
  // 多箱体排列结果（可选，仅在多箱体模式下存在）
  arrangement?: ArrangementResult;
  
  // 像素信息
  pixels: {
    totalWidth: number;         // 总像素宽度
    totalHeight: number;        // 总像素高度
    totalPixels: number;        // 总像素数
    pixelDensity: number;       // 像素密度 (pixels/m²)
  };
  
  // 功耗统计 (可选 - 仅当输入数据包含 power 时返回)
  powerConsumption?: {
    maximum: number;            // 最大功耗 (W)
    typical: number;            // 典型功耗 (W)
    standby: number;            // 待机功耗 (W)
    heatGeneration: {           // 热量产生
      maxBTU: number;           // 最大BTU/h
      typicalBTU: number;       // 典型BTU/h
    };
  };
  
  // 物理参数 (可选 - 仅当输入数据包含 physical.weight 时返回)
  physical?: {
    totalWeight: number;        // 总重量 (kg)
    structuralLoad: number;     // 结构负荷 (kg/m²)
  };
  
  // 控制系统需求
  controlSystem: {
    controllers4K: number;      // 4K控制器数量
    sendingCards: number;       // 发送卡数量
    fiberCables: number;        // 光纤数量
    // API返回的详细信息（可选）
    cardInfo?: {
      model: string;            // 发送卡型号
      brand: string;            // 品牌
      usage_rate: number | string; // 利用率
      ports: any;               // 端口数
      components?: any;         // 组件详情
    };
  };
}

// ============================================
// Sending Card Configuration
// ============================================

export interface SendingCardConfig {
  cardType: 'sync' | 'async';                            // 发送卡类型
  cardBrand: 'Unilumin' | 'Colorlight' | 'Brompton';    // 发送卡品牌
  loopBackup: boolean;                                   // 环路备份
  coverageMode: '4k' | 'economic';                       // 4K覆盖模式
  region: string;                                        // 区域
}

// ============================================
// Configurator State
// ============================================

export interface ConfiguratorState {
  selectedCabinet: CabinetSpecs | null;  // 单一箱体模式使用
  selectedCabinets?: CabinetSelection[];  // 多箱体模式使用
  roomConfig: RoomConfig;
  displayConfig: DisplayConfig;
  calculationResult: CalculationResult | null;
  viewMode: 'configurator' | 'specifications';
  sendingCardConfig?: SendingCardConfig;  // 发送卡配置（可选）
}

// ============================================
// API Request Types
// ============================================

export interface SingleCabinetRequest {
  cabinetSpecs: CabinetSpecs;
  roomConfig: RoomConfig;
  displayConfig: DisplayConfig;
}

export interface MultiCabinetRequest {
  cabinetSelections: CabinetSelection[];
  roomConfig: RoomConfig;
  displayConfig: DisplayConfig;
  arrangementDirection?: 'left-to-right' | 'right-to-left';
}

export interface SmartCombinationRequest {
  mainCabinet: { id: string; specs: CabinetSpecs };
  auxiliaryCabinets: Array<{ id: string; specs: CabinetSpecs }>;
  wallWidthMm: number;
  wallHeightMm: number;
  arrangementDirection?: 'left-to-right' | 'right-to-left';  // 排列方向
}

export interface OptimalLayoutRequest {
  cabinetSpecs: CabinetSpecs;
  roomConfig: RoomConfig;
}

export interface SVGPreviewRequest {
  calculationResult: CalculationResult;
  roomConfig: RoomConfig;
  options?: {
    showDimensions?: boolean;      // 是否显示尺寸标注，默认 true
    showPerson?: boolean;          // 是否显示人物参考，默认 true
    canvasWidth?: number;          // 画布宽度，默认 800
    canvasHeight?: number;         // 画布高度，默认 500
    format?: 'svg' | 'json';       // 输出格式，默认 'svg'
  };
}

export interface PNGPreviewRequest {
  calculationResult: CalculationResult;
  roomConfig: RoomConfig;
  options?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    width?: number;                // PNG 宽度，默认 800
    height?: number;               // PNG 高度，默认 500
  };
}
