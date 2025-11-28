# LED Calculator API - 功能清单

## 📋 API 端点总览

| 端点 | 方法 | 功能 | 状态 |
|------|------|------|------|
| `/health` | GET | 健康检查 | ✅ 可用 |
| `/api/calculate/single` | POST | 单箱体配置计算 | ✅ 可用 |
| `/api/calculate/multi` | POST | 多箱体组合计算 | ✅ 可用 |
| `/api/calculate/smart-combination` | POST | 智能箱体组合推荐 | ✅ 可用 |
| `/api/calculate/optimal-layout` | POST | 最优布局计算 | ✅ 可用 |
| `/api/preview/svg` | POST | SVG 预览图生成 | ✅ 可用 |
| `/api/preview/png` | POST | PNG 预览图生成 | ✅ 可用 |

---

## 1. 健康检查 (Health Check)

### 功能描述
检查 API 服务是否正常运行。

### 端点
```
GET /health
```

### 请求示例
```bash
curl http://localhost:3001/health
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "environment": "development"
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 使用场景
- 服务启动后验证
- 负载均衡器健康检查
- 监控系统状态检测

---

## 2. 单箱体配置计算 (Single Cabinet)

### 功能描述
计算使用单一类型箱体组成的 LED 显示墙的完整规格参数。

### 端点
```
POST /api/calculate/single
```

### 核心功能
- ✅ 计算墙体尺寸（宽度、高度、面积、对角线）
- ✅ 计算箱体数量（总数、水平、垂直）
- ✅ 计算像素参数（总像素、像素密度）
- ✅ 计算功耗（最大、典型、待机、散热）
- ✅ 计算物理参数（总重量、结构负载）
- ✅ 计算控制系统（控制器、发送卡、光纤）

### 请求参数
```typescript
{
  cabinetSpecs: {
    id: string;              // 箱体ID
    name: string;            // 箱体名称
    model: string;           // 型号
    dimensions: {            // 尺寸（毫米）
      width: number;
      height: number;
      depth: number;
    };
    display: {               // 显示参数
      pixelPitch: number;    // 像素间距（毫米）
      resolution: {          // 分辨率
        width: number;
        height: number;
      };
      brightness: number;    // 亮度（尼特）
      refreshRate: number;   // 刷新率（Hz）
      colorDepth: number;    // 色深（位）
    };
    power: {                 // 功耗（瓦特）
      maxPower: number;
      typicalPower: number;
      standbyPower: number;
    };
    physical: {              // 物理参数
      weight: number;        // 重量（千克）
      operatingTemp: {       // 工作温度（摄氏度）
        min: number;
        max: number;
      };
      humidity: {            // 湿度（百分比）
        min: number;
        max: number;
      };
      ipRating: string;      // 防护等级
    };
    installation: {          // 安装参数
      mountingType: string[];
      cableType: string[];
      maintenanceAccess: string;
    };
  };
  roomConfig: {
    dimensions: {
      width: number;         // 房间宽度
      height: number;        // 房间高度
    };
    unit: 'meters' | 'feet'; // 单位
    wallType: 'flat' | 'curved' | 'corner';
  };
  displayConfig: {
    layout: {
      columns: number;       // 列数
      rows: number;          // 行数
    };
    resolution: 'FHD' | 'UHD' | '8K' | 'Custom';
    configuration: 'fit-to-wall' | 'custom' | 'multi-cabinet';
    redundancy: {
      power: boolean;
      data: boolean;
      noRedundancy: boolean;
    };
  };
}
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "wallDimensions": {
      "width": 4.8,
      "height": 2.7,
      "area": 12.96,
      "diagonal": 217.5
    },
    "cabinetCount": {
      "total": 64,
      "horizontal": 8,
      "vertical": 8
    },
    "pixels": {
      "totalWidth": 5120,
      "totalHeight": 2880,
      "totalPixels": 14745600,
      "pixelDensity": 1137777.78
    },
    "powerConsumption": {
      "maximum": 9600,
      "typical": 4800,
      "standby": 320,
      "heatGeneration": {
        "maxBTU": 32736,
        "typicalBTU": 16368
      }
    },
    "physical": {
      "totalWeight": 480,
      "structuralLoad": 37.04
    },
    "controlSystem": {
      "controllers4K": 2,
      "sendingCards": 1,
      "fiberCables": 2
    }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 使用场景
- 标准 LED 显示墙配置
- 快速报价计算
- 项目可行性评估

---

## 3. 多箱体组合计算 (Multi-Cabinet)

### 功能描述
计算使用多种不同尺寸箱体组合的 LED 显示墙配置，使用 Guillotine 算法优化排列。

### 端点
```
POST /api/calculate/multi
```

### 核心功能
- ✅ 支持多种箱体类型混合
- ✅ Guillotine 装箱算法（与前端一致）
- ✅ 智能列宽对齐（相同宽度箱体垂直堆叠）
- ✅ 支持左到右/右到左排列方向
- ✅ 计算覆盖率和填充状态
- ✅ 返回每个箱体的精确位置

### 请求参数
```typescript
{
  cabinetSelections: [
    {
      id: string;            // 箱体ID
      specs: CabinetSpecs;   // 箱体规格（同上）
      count: number;         // 数量
      priority: number;      // 优先级
    }
  ];
  roomConfig: RoomConfig;    // 房间配置（同上）
  displayConfig: DisplayConfig; // 显示配置（同上）
  arrangementDirection?: 'left-to-right' | 'right-to-left'; // 排列方向
}
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "wallDimensions": { /* ... */ },
    "cabinetCount": { /* ... */ },
    "arrangement": {
      "cabinets": [
        {
          "cabinetId": "main-cabinet",
          "specs": { /* ... */ },
          "position": { "x": 0, "y": 0 },      // 位置（毫米）
          "size": { "width": 600, "height": 337.5 }
        }
      ],
      "totalArea": 12960000,
      "screenArea": 15000000,
      "coverage": 0.864,                       // 覆盖率
      "isFullyFilled": false,
      "strategy": "progressive_combination",
      "arrangementDirection": "left-to-right"
    },
    "pixels": { /* ... */ },
    "powerConsumption": { /* ... */ },
    "physical": { /* ... */ },
    "controlSystem": { /* ... */ }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 算法特点
1. **智能列宽对齐**: 优先使用与主箱体相同宽度的箱体，形成垂直列
2. **Guillotine 装箱**: 递归切割剩余空间，优化填充
3. **安装优化**: 相同宽度箱体垂直堆叠，简化安装支架

### 使用场景
- 复杂形状墙体填充
- 利用库存箱体组合
- 最大化墙体覆盖率

---

## 4. 智能箱体组合推荐 (Smart Combination)

### 功能描述
自动计算最优箱体组合方案，实现最高墙体覆盖率。

### 端点
```
POST /api/calculate/smart-combination
```

### 核心功能
- ✅ 自动测试多种箱体组合
- ✅ 渐进式添加辅助箱体（最多4种）
- ✅ 精度优化（接近目标尺寸时调整）
- ✅ 返回最佳组合和覆盖率
- ✅ 包含完整排列信息

### 请求参数
```typescript
{
  mainCabinet: {
    id: string;
    specs: CabinetSpecs;
  };
  auxiliaryCabinets: [
    {
      id: string;
      specs: CabinetSpecs;
    }
  ];
  wallWidthMm: number;       // 墙体宽度（毫米）
  wallHeightMm: number;      // 墙体高度（毫米）
}
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "bestCombination": {
      "mainCabinetCount": 48,
      "auxiliaryCounts": {
        "aux-001": 8,
        "aux-002": 4
      }
    },
    "coverage": 0.95,
    "coveragePercentage": "95.00%",
    "isFullyFilled": false,
    "adjustedSize": {
      "width": 4800,
      "height": 2700
    },
    "testResultsCount": 15,
    "optimizationApplied": "proximity",
    "calculationResult": {
      /* 完整的计算结果，包含排列信息 */
    }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 算法流程
1. 使用主箱体填充墙体
2. 渐进式添加辅助箱体（1种、2种、3种、4种）
3. 每次添加测试多种数量组合
4. 选择覆盖率最高的方案
5. 应用精度优化（如果接近目标尺寸）

### 使用场景
- 不确定箱体组合方案
- 需要最大化覆盖率
- 自动化配置推荐

---

## 5. 最优布局计算 (Optimal Layout)

### 功能描述
根据房间尺寸和箱体规格，计算最优的行列布局。

### 端点
```
POST /api/calculate/optimal-layout
```

### 核心功能
- ✅ 自动计算最优列数和行数
- ✅ 支持米和英尺单位转换
- ✅ 确保至少1行1列
- ✅ 考虑房间实际可用空间

### 请求参数
```typescript
{
  cabinetSpecs: CabinetSpecs;
  roomConfig: {
    dimensions: {
      width: number;
      height: number;
    };
    unit: 'meters' | 'feet';
    wallType: 'flat' | 'curved' | 'corner';
  };
}
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "columns": 8,
    "rows": 9,
    "cabinetDimensions": {
      "widthMm": 600,
      "heightMm": 337.5
    },
    "roomDimensions": {
      "widthM": 4.8768,
      "heightM": 3.048,
      "originalUnit": "feet"
    }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 使用场景
- 快速布局规划
- 项目初期评估
- 箱体数量估算

---

## 6. SVG 预览图生成 (SVG Preview)

### 功能描述
生成 LED 显示墙配置的 SVG 矢量图预览。

### 端点
```
POST /api/preview/svg
```

### 核心功能
- ✅ 生成可缩放矢量图
- ✅ 显示箱体排列和颜色
- ✅ 可选尺寸标注
- ✅ 可选人物参考
- ✅ 支持 SVG 或 JSON 格式输出

### 请求参数
```typescript
{
  calculationResult: CalculationResult; // 计算结果
  roomConfig: RoomConfig;
  options?: {
    showDimensions?: boolean;    // 显示尺寸标注，默认 true
    showPerson?: boolean;        // 显示人物参考，默认 true
    canvasWidth?: number;        // 画布宽度，默认 800
    canvasHeight?: number;       // 画布高度，默认 500
    format?: 'svg' | 'json';     // 输出格式，默认 'svg'
  };
}
```

### 响应示例 (format: 'svg')
```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
  <!-- SVG 内容 -->
</svg>
```

### 响应示例 (format: 'json')
```json
{
  "success": true,
  "data": {
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>",
    "width": 800,
    "height": 500
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 视觉特性
- 不同箱体类型使用不同颜色
- 箱体显示实际尺寸标签
- 墙体和屏幕尺寸标注
- 人物参考（1.7米高）

### 使用场景
- 网页预览展示
- 报告文档生成
- 客户方案演示

---

## 7. PNG 预览图生成 (PNG Preview)

### 功能描述
生成 LED 显示墙配置的 PNG 位图预览。

### 端点
```
POST /api/preview/png
```

### 核心功能
- ✅ 生成高质量位图
- ✅ 自定义图片尺寸
- ✅ 与 SVG 相同的视觉效果
- ✅ 适用于不支持 SVG 的场景

### 请求参数
```typescript
{
  calculationResult: CalculationResult;
  roomConfig: RoomConfig;
  options?: {
    showDimensions?: boolean;
    showPerson?: boolean;
    width?: number;          // PNG 宽度，默认 800
    height?: number;         // PNG 高度，默认 500
  };
}
```

### 响应
返回 PNG 图片二进制数据，Content-Type: `image/png`

### 使用场景
- 邮件附件
- PDF 报告
- 移动应用展示
- 社交媒体分享

---

## 🔒 错误处理

所有端点使用统一的错误响应格式：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "cabinetSpecs is required"
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### 错误代码

| 代码 | HTTP 状态 | 描述 |
|------|-----------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `CABINET_LIMIT_EXCEEDED` | 400 | 箱体总数超过 1000 |
| `SCREEN_SIZE_EXCEEDED` | 400 | 屏幕尺寸超过 50m |
| `CALCULATION_ERROR` | 500 | 内部计算错误 |
| `UNKNOWN_ERROR` | 500 | 未知错误 |

---

## 🌐 CORS 支持

API 支持跨域请求，可通过环境变量配置：

```bash
CORS_ORIGINS=https://your-domain.com,https://another-domain.com
CORS_METHODS=GET,POST,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
CORS_MAX_AGE=86400
```

默认配置允许所有来源 (`*`)。

---

## 📊 性能指标

| 端点 | 平均响应时间 | 最大箱体数 |
|------|-------------|-----------|
| `/api/calculate/single` | < 50ms | 1000 |
| `/api/calculate/multi` | < 200ms | 1000 |
| `/api/calculate/smart-combination` | < 500ms | 1000 |
| `/api/calculate/optimal-layout` | < 10ms | N/A |
| `/api/preview/svg` | < 100ms | 1000 |
| `/api/preview/png` | < 300ms | 1000 |

---

## 🔄 版本信息

- **当前版本**: 1.0.0
- **API 版本**: v1
- **最后更新**: 2025-11-28
