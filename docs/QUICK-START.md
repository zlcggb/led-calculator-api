# LED Calculator API - 快速开始指南

## 🚀 5分钟快速上手

### 1. 启动服务 (30秒)

```bash
cd led-calculator-api
npm install
npm run dev
```

服务启动在: `http://localhost:3001`

### 2. 验证服务 (10秒)

打开浏览器访问: `http://localhost:3001/health`

看到这个就成功了:
```json
{
  "success": true,
  "data": { "status": "ok" }
}
```

### 3. 使用测试页面 (2分钟)

打开: `http://localhost:3001/test`

点击任意"测试"按钮，查看结果！

### 4. 第一个 API 调用 (2分钟)

复制这段代码到浏览器控制台:

```javascript
fetch('http://localhost:3001/api/calculate/optimal-layout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cabinetSpecs: {
      id: "test",
      name: "Test Cabinet",
      model: "TC-001",
      dimensions: { width: 600, height: 337.5, depth: 50 },
      display: {
        pixelPitch: 0.9,
        resolution: { width: 640, height: 360 },
        brightness: 600,
        refreshRate: 3840,
        colorDepth: 16
      },
      power: { maxPower: 150, typicalPower: 75, standbyPower: 5 },
      physical: {
        weight: 7.5,
        operatingTemp: { min: 0, max: 45 },
        humidity: { min: 10, max: 90 },
        ipRating: "IP30"
      },
      installation: {
        mountingType: ["wall"],
        cableType: ["power"],
        maintenanceAccess: "front"
      }
    },
    roomConfig: {
      dimensions: { width: 5, height: 3 },
      unit: "meters",
      wallType: "flat"
    }
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 📋 API 端点速查

| 端点 | 功能 | 用途 |
|------|------|------|
| `GET /health` | 健康检查 | 验证服务运行 |
| `POST /api/calculate/single` | 单箱体计算 | 标准配置 |
| `POST /api/calculate/multi` | 多箱体计算 | 复杂组合 |
| `POST /api/calculate/smart-combination` | 智能推荐 | 自动优化 |
| `POST /api/calculate/optimal-layout` | 最优布局 | 快速规划 |
| `POST /api/preview/svg` | SVG预览 | 矢量图 |
| `POST /api/preview/png` | PNG预览 | 位图 |

---

## 🎯 常用场景

### 场景 1: 我想知道一个房间能放多少箱体

使用 `/api/calculate/optimal-layout`:

```bash
curl -X POST http://localhost:3001/api/calculate/optimal-layout \
  -H "Content-Type: application/json" \
  -d '{
    "cabinetSpecs": { /* 箱体规格 */ },
    "roomConfig": {
      "dimensions": { "width": 5, "height": 3 },
      "unit": "meters",
      "wallType": "flat"
    }
  }'
```

### 场景 2: 我想计算完整的配置参数

使用 `/api/calculate/single`:

```bash
curl -X POST http://localhost:3001/api/calculate/single \
  -H "Content-Type": application/json" \
  -d '{
    "cabinetSpecs": { /* 箱体规格 */ },
    "roomConfig": { /* 房间配置 */ },
    "displayConfig": {
      "layout": { "columns": 8, "rows": 8 },
      "resolution": "UHD",
      "configuration": "fit-to-wall",
      "redundancy": { "power": false, "data": false, "noRedundancy": true }
    }
  }'
```

### 场景 3: 我想用多种箱体填充墙体

使用 `/api/calculate/smart-combination`:

```bash
curl -X POST http://localhost:3001/api/calculate/smart-combination \
  -H "Content-Type: application/json" \
  -d '{
    "mainCabinet": {
      "id": "main",
      "specs": { /* 主箱体规格 */ }
    },
    "auxiliaryCabinets": [
      { "id": "aux1", "specs": { /* 辅助箱体1 */ } },
      { "id": "aux2", "specs": { /* 辅助箱体2 */ } }
    ],
    "wallWidthMm": 5000,
    "wallHeightMm": 3000
  }'
```

### 场景 4: 我想生成预览图

使用 `/api/preview/svg`:

```bash
curl -X POST http://localhost:3001/api/preview/svg \
  -H "Content-Type: application/json" \
  -d '{
    "calculationResult": { /* 计算结果 */ },
    "roomConfig": { /* 房间配置 */ },
    "options": {
      "showDimensions": true,
      "showPerson": true,
      "format": "json"
    }
  }'
```

---

## 🔧 环境配置

### 修改端口

```bash
PORT=3000 npm run dev
```

### 配置 CORS

```bash
CORS_ORIGINS=https://your-domain.com npm run dev
```

### 生产环境

```bash
npm run build
NODE_ENV=production npm start
```

---

## 📚 下一步学习

1. **详细功能** → [API 功能清单](./API-FEATURES.md)
2. **集成代码** → [集成示例](./INTEGRATION-EXAMPLES.md)
3. **完整测试** → [测试指南](./TESTING-GUIDE.md)
4. **部署上线** → [README.md](../README.md)

---

## ❓ 常见问题

### Q: 如何修改默认端口？
A: 设置环境变量 `PORT=3000`

### Q: 如何允许跨域访问？
A: 设置环境变量 `CORS_ORIGINS=*` 或指定域名

### Q: 计算结果与前端不一致？
A: 确认使用相同的算法版本，检查 `arrangement.strategy` 字段

### Q: 请求超时怎么办？
A: 检查箱体数量是否超过1000，墙体尺寸是否超过50m

### Q: 如何查看详细日志？
A: 设置环境变量 `LOG_LEVEL=debug`

---

## 💡 提示

- 测试页面是最快的测试方式
- 所有端点都返回统一的 JSON 格式
- 错误信息包含详细的错误代码和描述
- SVG 预览支持直接嵌入网页
- PNG 预览适合下载和分享

---

## 🆘 获取帮助

- 查看 [API 文档](./API-FEATURES.md)
- 查看 [集成示例](./INTEGRATION-EXAMPLES.md)
- 查看 [测试指南](./TESTING-GUIDE.md)
- 查看服务器日志
- 使用测试页面调试
