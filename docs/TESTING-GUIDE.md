# LED Calculator API - 完整测试指南

## 📋 目录

1. [快速开始](#快速开始)
2. [使用测试页面](#使用测试页面)
3. [命令行测试](#命令行测试)
4. [自动化测试](#自动化测试)
5. [集成测试示例](#集成测试示例)

---

## 快速开始

### 1. 启动 API 服务

```bash
cd led-calculator-api
npm install
npm run dev
```

服务将在 `http://localhost:3001` 启动

### 2. 验证服务运行

打开浏览器访问: `http://localhost:3001/health`

应该看到:
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

---

## 使用测试页面

### 访问测试页面

打开浏览器访问: `http://localhost:3001/` 或 `http://localhost:3001/test`

### 测试页面功能

测试页面提供了所有 API 端点的可视化测试界面：

1. **单箱体配置计算**
   - 输入箱体规格、房间尺寸、布局参数
   - 点击"计算"按钮
   - 查看完整的计算结果

2. **多箱体组合计算**
   - 添加多种箱体类型
   - 设置每种箱体的数量和优先级
   - 选择排列方向（左到右/右到左）
   - 查看排列结果和覆盖率

3. **智能组合推荐**
   - 输入主箱体和辅助箱体
   - 输入墙体尺寸
   - 获取最优组合方案

4. **最优布局计算**
   - 输入房间尺寸和箱体规格
   - 获取推荐的行列布局

5. **SVG/PNG 预览生成**
   - 基于计算结果生成预览图
   - 可选显示尺寸标注和人物参考
   - 下载 SVG 或 PNG 文件

---

## 命令行测试

### 使用 curl 测试

#### 1. 健康检查

```bash
curl http://localhost:3001/health
```

#### 2. 单箱体计算

```bash
curl -X POST http://localhost:3001/api/calculate/single \
  -H "Content-Type: application/json" \
  -d '{
    "cabinetSpecs": {
      "id": "cabinet-001",
      "name": "UHW II 0.9",
      "model": "UHW-II-0.9",
      "dimensions": {"width": 600, "height": 337.5, "depth": 50},
      "display": {
        "pixelPitch": 0.9,
        "resolution": {"width": 640, "height": 360},
        "brightness": 600,
        "refreshRate": 3840,
        "colorDepth": 16
      },
      "power": {"maxPower": 150, "typicalPower": 75, "standbyPower": 5},
      "physical": {
        "weight": 7.5,
        "operatingTemp": {"min": 0, "max": 45},
        "humidity": {"min": 10, "max": 90},
        "ipRating": "IP30"
      },
      "installation": {
        "mountingType": ["wall"],
        "cableType": ["power", "data"],
        "maintenanceAccess": "front"
      }
    },
    "roomConfig": {
      "dimensions": {"width": 5, "height": 3},
      "unit": "meters",
      "wallType": "flat"
    },
    "displayConfig": {
      "layout": {"columns": 8, "rows": 8},
      "resolution": "UHD",
      "configuration": "fit-to-wall",
      "redundancy": {"power": false, "data": false, "noRedundancy": true}
    }
  }'
```

#### 3. 最优布局计算

```bash
curl -X POST http://localhost:3001/api/calculate/optimal-layout \
  -H "Content-Type: application/json" \
  -d '{
    "cabinetSpecs": {
      "id": "cabinet-001",
      "name": "Test Cabinet",
      "model": "TC-001",
      "dimensions": {"width": 600, "height": 337.5, "depth": 50},
      "display": {
        "pixelPitch": 0.9,
        "resolution": {"width": 640, "height": 360},
        "brightness": 600,
        "refreshRate": 3840,
        "colorDepth": 16
      },
      "power": {"maxPower": 150, "typicalPower": 75, "standbyPower": 5},
      "physical": {
        "weight": 7.5,
        "operatingTemp": {"min": 0, "max": 45},
        "humidity": {"min": 10, "max": 90},
        "ipRating": "IP30"
      },
      "installation": {
        "mountingType": ["wall"],
        "cableType": ["power"],
        "maintenanceAccess": "front"
      }
    },
    "roomConfig": {
      "dimensions": {"width": 16, "height": 10},
      "unit": "feet",
      "wallType": "flat"
    }
  }'
```

---

## 自动化测试

### 运行单元测试

```bash
cd led-calculator-api
npm test
```

### 运行属性测试

```bash
npm run test:property
```

### 测试覆盖率

```bash
npm test -- --coverage
```

---

## 集成测试示例

### Postman 集合

创建 Postman 集合测试所有端点：

1. 导入环境变量:
   - `API_BASE_URL`: `http://localhost:3001`

2. 创建请求集合:
   - Health Check
   - Single Cabinet Calculation
   - Multi-Cabinet Calculation
   - Smart Combination
   - Optimal Layout
   - SVG Preview
   - PNG Preview

3. 添加测试脚本验证响应

### 示例测试脚本 (Postman)

```javascript
// 验证响应状态
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 验证响应结构
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

// 验证数据完整性
pm.test("Response has required data fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('wallDimensions');
    pm.expect(jsonData.data).to.have.property('cabinetCount');
    pm.expect(jsonData.data).to.have.property('pixels');
});
```

---

## 性能测试

### 使用 Apache Bench

```bash
# 测试健康检查端点
ab -n 1000 -c 10 http://localhost:3001/health

# 测试计算端点（需要准备 JSON 文件）
ab -n 100 -c 5 -p request.json -T application/json \
  http://localhost:3001/api/calculate/single
```

### 使用 Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health Check"
    flow:
      - get:
          url: "/health"
```

运行:
```bash
artillery run artillery-config.yml
```

---

## 常见问题排查

### 1. 连接被拒绝

**问题**: `ECONNREFUSED`

**解决**:
- 确认 API 服务已启动
- 检查端口是否正确（默认 3001）
- 检查防火墙设置

### 2. CORS 错误

**问题**: `Access-Control-Allow-Origin` 错误

**解决**:
- 设置环境变量 `CORS_ORIGINS=*` 或指定域名
- 重启 API 服务

### 3. 请求超时

**问题**: 请求超过 30 秒无响应

**解决**:
- 检查箱体数量是否超过 1000
- 检查墙体尺寸是否超过 50m
- 查看服务器日志

### 4. 计算结果不一致

**问题**: API 结果与前端不同

**解决**:
- 确认使用相同的算法版本
- 检查输入参数是否完全一致
- 查看 `arrangement.strategy` 字段

---

## 下一步

- 查看 [API 功能清单](./API-FEATURES.md) 了解所有端点
- 查看 [集成示例](./INTEGRATION-EXAMPLES.md) 学习如何集成到你的应用
- 查看 [README.md](../README.md) 了解部署和配置
