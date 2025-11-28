# Design Document

## Overview

LED Calculator API 是一个独立的 Node.js + Express 微服务，将现有的 LED 显示屏配置计算算法封装为 RESTful API。该服务直接复用现有的 TypeScript 算法代码（`configurator-calculator.ts`、`multi-cabinet-calculator.ts`），无需重写核心逻辑。

### 技术选型理由

- **Node.js + Express**: 可直接复用现有 TypeScript 代码，无需重写算法
- **TypeScript**: 保持类型安全，与现有代码一致
- **独立部署**: 作为微服务独立运行，不影响主前端项目

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    External Clients                          │
│              (Other websites, mobile apps)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   LED Calculator API                         │
│                  (Node.js + Express)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Routes Layer                       │   │
│  │  /api/calculate/single                               │   │
│  │  /api/calculate/multi                                │   │
│  │  /api/calculate/smart-combination                    │   │
│  │  /api/calculate/optimal-layout                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Calculator Service                   │   │
│  │  (Reused from src/products/utils/)                   │   │
│  │  - configurator-calculator.ts                        │   │
│  │  - multi-cabinet-calculator.ts                       │   │
│  │  - linear-equation-calculator.ts                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Type Definitions                   │   │
│  │  (Reused from src/products/data/)                    │   │
│  │  - led-configurator-types.ts                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. API Server (`led-calculator-api/src/server.ts`)

主服务器入口，配置 Express 应用。

```typescript
// 服务器配置
interface ServerConfig {
  port: number;
  corsOrigins: string[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
```

### 2. Routes (`led-calculator-api/src/routes/calculator.ts`)

API 路由定义。

```typescript
// POST /api/calculate/single
interface SingleCabinetRequest {
  cabinetSpecs: CabinetSpecs;
  roomConfig: RoomConfig;
  displayConfig: DisplayConfig;
}

// POST /api/calculate/multi
interface MultiCabinetRequest {
  cabinetSelections: CabinetSelection[];
  roomConfig: RoomConfig;
  displayConfig: DisplayConfig;
  arrangementDirection?: 'left-to-right' | 'right-to-left';
}

// POST /api/calculate/smart-combination
interface SmartCombinationRequest {
  mainCabinet: { id: string; specs: CabinetSpecs };
  auxiliaryCabinets: Array<{ id: string; specs: CabinetSpecs }>;
  wallWidthMm: number;
  wallHeightMm: number;
}

// POST /api/calculate/optimal-layout
interface OptimalLayoutRequest {
  cabinetSpecs: CabinetSpecs;
  roomConfig: RoomConfig;
}

// POST /api/preview/svg
interface SVGPreviewRequest {
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

// POST /api/preview/png
interface PNGPreviewRequest {
  calculationResult: CalculationResult;
  roomConfig: RoomConfig;
  options?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    width?: number;                // PNG 宽度，默认 800
    height?: number;               // PNG 高度，默认 500
  };
}
```

### 3. Calculator Service (`led-calculator-api/src/services/calculatorService.ts`)

封装计算逻辑，调用复用的算法模块。

### 4. Validation Middleware (`led-calculator-api/src/middleware/validation.ts`)

请求参数验证中间件。

## Data Models

复用现有类型定义（从 `src/products/data/led-configurator-types.ts` 复制）：

- `CabinetSpecs` - 箱体规格
- `RoomConfig` - 房间配置
- `DisplayConfig` - 显示配置
- `CabinetSelection` - 箱体选择
- `CalculationResult` - 计算结果
- `ArrangementResult` - 排列结果
- `ArrangedCabinet` - 排列的箱体

### API Response Format

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Single cabinet calculation returns complete results
*For any* valid cabinet specs, room config, and display config, the API response SHALL contain all required fields: wallDimensions, cabinetCount, pixels, powerConsumption, physical, and controlSystem.
**Validates: Requirements 1.1**

### Property 2: Invalid requests return 400 errors
*For any* request missing required fields (cabinetSpecs, roomConfig, or displayConfig), the API SHALL return HTTP 400 with an error message.
**Validates: Requirements 1.2**

### Property 3: Multi-cabinet arrangement has no overlapping cabinets
*For any* multi-cabinet calculation result, no two cabinets in the arrangement SHALL have overlapping positions (their bounding boxes must not intersect).
**Validates: Requirements 2.2**

### Property 4: Arrangement direction mirrors x-coordinates
*For any* multi-cabinet calculation with 'right-to-left' direction, the x-coordinates of cabinets SHALL be mirrored compared to 'left-to-right' direction within the screen bounds.
**Validates: Requirements 2.3**

### Property 5: Optimal layout returns positive integers
*For any* valid cabinet specs and room config, the optimal layout response SHALL contain columns >= 1 and rows >= 1.
**Validates: Requirements 4.1, 4.3**

### Property 6: Unit conversion preserves layout
*For any* room dimensions, calculating optimal layout with equivalent values in meters and feet SHALL produce the same columns and rows.
**Validates: Requirements 4.2**

### Property 7: CORS headers present in responses
*For any* request with an Origin header, the response SHALL include Access-Control-Allow-Origin header.
**Validates: Requirements 6.1**

### Property 8: SVG preview contains all cabinets
*For any* calculation result with N cabinets, the generated SVG SHALL contain exactly N cabinet rectangles.
**Validates: Requirements 7.2**

### Property 9: SVG dimensions match request
*For any* SVG preview request with showDimensions=true, the generated SVG SHALL contain dimension annotation elements.
**Validates: Requirements 7.3**

## Error Handling

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `CABINET_LIMIT_EXCEEDED` | 400 | Total cabinet count > 1000 |
| `SCREEN_SIZE_EXCEEDED` | 400 | Screen dimensions > 50m |
| `CALCULATION_ERROR` | 500 | Internal calculation error |
| `UNKNOWN_ERROR` | 500 | Unexpected error |

## Multi-Cabinet Arrangement Algorithm

### ⚠️ CRITICAL: Algorithm Consistency Rule

**The API MUST use the same arrangement algorithm as the frontend (`src/products/utils/configurator-calculator.ts`) to ensure consistent results.**

### Algorithm Selection

| Endpoint | Algorithm | Location | Reason |
|----------|-----------|----------|--------|
| `/api/calculate/multi` | **Guillotine** | `original-configurator-calculator.ts` → `calculateMultiCabinetDisplayWall()` | ✅ Frontend compatibility |
| `/api/calculate/smart-combination` | **Guillotine** | `original-configurator-calculator.ts` → `calculateMultiCabinetDisplayWall()` | ✅ Frontend compatibility |
| Internal testing only | Row/Column Greedy | `multi-cabinet-calculator.ts` → `arrangeBoxesAuto()` | ❌ DO NOT use for production endpoints |

### Guillotine Algorithm Details

**Core Features**:
1. **Intelligent Column Width Alignment**: Prioritizes cabinets with the same width as the dominant cabinet (most numerous)
2. **Bottom-Left Placement**: Starts from (x=0, y=0) at bottom-left corner
3. **Recursive Space Splitting**: After placing each cabinet, splits remaining space into right and top rectangles

**Sorting Strategy** (3-level priority):

```typescript
// Step 1: Identify dominant cabinet (most numerous)
const dominantCabinet = activeCabinets.reduce((max, cabinet) => 
  cabinet.count > max.count ? cabinet : max
);
const dominantWidth = dominantCabinet.specs.dimensions.width;

// Step 2: Sort all cabinet items
cabinetItems.sort((a, b) => {
  // Priority 1: Height descending (place main body area first)
  if (a.height !== b.height) {
    return b.height - a.height;
  }
  
  // Priority 2: Same height → prioritize dominant width (column alignment)
  const aMatchesDominant = a.width === dominantWidth;
  const bMatchesDominant = b.width === dominantWidth;
  
  if (aMatchesDominant && !bMatchesDominant) return -1; // a first
  if (!aMatchesDominant && bMatchesDominant) return 1;  // b first
  
  // Priority 3: Width ascending (smaller cabinets last)
  return a.width - b.width;
});
```

**Why This Matters**:

```
Example: 3.25m × 3.25m wall
Cabinets: 500×1000mm (18), 250×500mm (6), 750×250mm (1), 500×250mm (5)

✅ CORRECT (Guillotine with column alignment):
Top row:    [500×250] [500×250] [500×250] [500×250] [500×250] [750×250]
            ↓         ↓         ↓         ↓         ↓         ↓
Main area:  [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]
            [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]
            [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]

Benefits:
- Columns 1-5: All 500mm wide → uniform mounting brackets
- Column 6: Edge fill with different sizes
- 250×500mm cabinets form vertical column on right

❌ WRONG (Row/Column Greedy without alignment):
Top row:    [750×250] [500×250] [500×250] [500×250] [500×250] [...]
            ↓         ↓         ↓         ↓         ↓
Main area:  [500×1000][500×1000][500×1000][500×1000][500×1000][...]
            
Problems:
- Column 1: 750mm (top) + 500mm (main) → different widths
- Requires multiple bracket types
- Complicates installation
```

### SVG Generation Rules

**Location**: `src/utils/svg-generator.ts` → `generateSVGPreview()`

#### Coordinate System Transformation

```typescript
// Cabinet positions are stored with bottom-left origin (y=0 at bottom)
// SVG uses top-left origin (y=0 at top)
// Must flip Y coordinate when rendering

const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

**Coordinate System Diagram**:

```
Storage (Guillotine):       Rendering (SVG):
┌─────────────┐            ┌─────────────┐
│             │            │ (0,0)       │ ← SVG origin
│             │            │             │
│             │            │             │
│ (0,0)       │            │             │
└─────────────┘            └─────────────┘
Bottom-left origin         Top-left origin
(y increases upward)       (y increases downward)

Transformation:
svgY = screenHeight - storageY - cabinetHeight
```

#### Cabinet Color Mapping

```typescript
// Colors assigned by cabinet TYPE, not position
const CABINET_COLORS = [
  "#3B82F6",  // Blue (primary/dominant)
  "#10B981",  // Green
  "#F59E0B",  // Yellow
  "#EF4444",  // Red
  "#8B5CF6",  // Purple
  "#06B6D4"   // Cyan
];

// Get unique cabinet IDs in order
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];

// Assign color by type index
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
const color = CABINET_COLORS[colorIndex];
```

**Why This Matters**: Same cabinet type always gets same color across all positions, making it easy to identify cabinet types visually.

### Common Mistakes to Avoid

#### ❌ Mistake 1: Using Wrong Algorithm

```typescript
// DON'T DO THIS in smart-combination endpoint
const { arrangeBoxesAuto } = await import('../utils/multi-cabinet-calculator');
const arrangementResult = arrangeBoxesAuto(width, height, cabinets);
```

**Problem**: 
- Results differ from frontend
- No column width alignment
- Breaks installation optimization

#### ✅ Correct Approach

```typescript
// DO THIS
const calculationResult = await calculateMultiCabinetDisplayWall(
  result.bestCombination,
  tempRoomConfig,
  tempDisplayConfig,
  'left-to-right'
);
const arrangementResult = calculationResult.arrangement;
```

#### ❌ Mistake 2: Forgetting Y-Coordinate Flip

```typescript
// DON'T DO THIS in SVG generation
const cabinetY = screenOffsetY + (cabinet.position.y / 1000) * wallScale;
```

**Problem**: Cabinets render upside-down

#### ✅ Correct Approach

```typescript
// DO THIS
const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

#### ❌ Mistake 3: Color by Position Instead of Type

```typescript
// DON'T DO THIS
const colorIndex = cabinetIndex % CABINET_COLORS.length;
```

**Problem**: Same cabinet type gets different colors in different positions

#### ✅ Correct Approach

```typescript
// DO THIS
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
```

### Testing Checklist for Arrangement Changes

When modifying arrangement algorithms, verify:

- [ ] **Column Alignment**: Same-width cabinets stack vertically
- [ ] **Frontend Consistency**: SVG matches frontend preview exactly
- [ ] **Color Consistency**: Same cabinet type = same color everywhere
- [ ] **Coordinate System**: Y-axis correctly flipped for SVG
- [ ] **Test Case**: 3.25m × 3.25m wall with mixed cabinets
  - [ ] 250×500mm cabinets form vertical column on right
  - [ ] Top row uses 500mm cabinets before 750mm
  - [ ] Main area uses 500×1000mm cabinets
- [ ] **Visual Verification**: Compare API SVG with frontend screenshot

## Testing Strategy

### Unit Tests
- 验证请求参数验证逻辑
- 验证错误响应格式
- 验证计算服务调用

### Property-Based Tests
使用 `fast-check` 库进行属性测试：
- 每个属性测试运行至少 100 次迭代
- 测试文件使用 `*.property.test.ts` 命名
- 每个测试注释引用对应的 correctness property

### Integration Tests
- 端到端 API 调用测试
- CORS 配置测试
- 错误处理测试
- **Arrangement Consistency Tests**: 验证 API 和前端排列结果一致性

## File Structure

```
led-calculator-api/
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts              # 主入口
│   ├── routes/
│   │   ├── calculator.ts      # 计算 API 路由
│   │   └── preview.ts         # 预览图生成 API 路由
│   ├── services/
│   │   ├── calculatorService.ts  # 计算服务
│   │   └── previewService.ts     # SVG/PNG 预览生成服务
│   ├── middleware/
│   │   ├── validation.ts      # 参数验证
│   │   ├── errorHandler.ts    # 错误处理
│   │   └── logger.ts          # 日志中间件
│   ├── types/
│   │   └── index.ts           # 类型定义（复用）
│   └── utils/
│       ├── configurator-calculator.ts  # 复用
│       ├── multi-cabinet-calculator.ts # 复用
│       ├── linear-equation-calculator.ts # 复用
│       └── svg-generator.ts   # SVG 生成工具（从 DisplayWallPreview 提取）
└── tests/
    ├── calculator.test.ts
    ├── calculator.property.test.ts
    └── preview.test.ts
```
