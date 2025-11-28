---
inclusion: fileMatch
fileMatchPattern: "led-calculator-api/**/*"
---

# LED Calculator API 开发规范

## 项目概述

LED Calculator API 是一个独立的 Node.js + Express 微服务，将前端 LED 显示屏配置计算算法封装为 RESTful API。

## 核心算法规则

### ⚠️ 关键：算法一致性

**API 必须使用与前端相同的排列算法，以确保结果一致。**

| 端点 | 算法 | 文件 |
|------|------|------|
| `/api/calculate/multi` | Guillotine | `original-configurator-calculator.ts` |
| `/api/calculate/smart-combination` | Guillotine | `original-configurator-calculator.ts` |

### 禁止使用

```typescript
// ❌ 不要在生产端点使用 arrangeBoxesAuto
const { arrangeBoxesAuto } = await import('../utils/multi-cabinet-calculator');
```

### 正确使用

```typescript
// ✅ 使用 calculateMultiCabinetDisplayWall
import { calculateMultiCabinetDisplayWall } from '../utils/configurator-calculator';
```

## SVG 生成规则

### 坐标系转换

```typescript
// 存储坐标：底部左侧原点 (y=0 在底部)
// SVG 坐标：顶部左侧原点 (y=0 在顶部)
// 必须翻转 Y 坐标

const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

### 颜色分配

```typescript
// 按箱体类型分配颜色，而非位置
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
```

## API 响应格式

### 成功响应

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}
```

### 错误响应

```typescript
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

## 错误代码

| 代码 | HTTP 状态 | 描述 |
|------|-----------|------|
| `VALIDATION_ERROR` | 400 | 请求体验证失败 |
| `CABINET_LIMIT_EXCEEDED` | 400 | 箱体总数 > 1000 |
| `SCREEN_SIZE_EXCEEDED` | 400 | 屏幕尺寸 > 50m |
| `CALCULATION_ERROR` | 500 | 内部计算错误 |

## 测试要求

### Property-Based Tests

每个端点必须有对应的属性测试：

```typescript
// 示例：验证无重叠
test('Property 3: No overlapping cabinets', () => {
  fc.assert(
    fc.property(validMultiCabinetRequest, (request) => {
      const result = calculateMultiCabinet(request);
      return hasNoOverlappingCabinets(result.arrangement.cabinets);
    })
  );
});
```

## 文件结构

```
led-calculator-api/
├── src/
│   ├── server.ts              # 主入口
│   ├── routes/
│   │   ├── calculator.ts      # 计算端点
│   │   └── preview.ts         # 预览端点
│   ├── middleware/
│   │   ├── validation.ts      # 参数验证
│   │   └── errorHandler.ts    # 错误处理
│   ├── types/
│   │   └── index.ts           # 类型定义
│   └── utils/
│       ├── original-configurator-calculator.ts  # ✅ 主算法
│       ├── multi-cabinet-calculator.ts          # ⚠️ 仅测试用
│       └── svg-generator.ts                     # SVG 生成
└── tests/
    └── calculator.property.test.ts
```
