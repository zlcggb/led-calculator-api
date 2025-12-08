# LED Calculator API

专业的 LED 显示墙计算与预览 API 服务 | Professional LED Display Wall Calculation & Preview API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883.svg)](https://vuejs.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub](https://img.shields.io/badge/GitHub-zlcggb/led--calculator--api-181717.svg?logo=github)](https://github.com/zlcggb/led-calculator-api)

---

## 📚 在线文档

| 页面 | 地址 | 描述 |
|------|------|------|
| 🏠 **首页** | [/app/](https://led-api.unilumin-gtm.com/app/) | 项目介绍和快速开始 |
| 🧪 **API 测试** | [/app/test](https://led-api.unilumin-gtm.com/app/test) | 在线测试所有 API |
| 📖 **API 文档** | [/app/docs](https://led-api.unilumin-gtm.com/app/docs) | 完整数据结构说明 |
| 🟢 **Vue 集成** | [/app/vue-integration](https://led-api.unilumin-gtm.com/app/vue-integration) | Vue 3 集成指南 |

---

## ✨ 核心功能

| 功能 | API 端点 | 描述 |
|------|----------|------|
| 📐 **单箱体布局** | `/api/calculate/optimal-layout` | 自动计算最优行列布局 |
| 🧩 **多箱体组合** | `/api/calculate/smart-combination` | 智能组合多种尺寸箱体 |
| 🖼️ **SVG 预览** | `/api/preview/svg` | 生成可视化预览图 |
| ⚡ **一键计算** | `/api/calculate/optimal-layout-with-preview` | 计算 + 预览一次完成 |

---

## 🚀 快速开始

### 1️⃣ 克隆项目

```bash
git clone https://github.com/zlcggb/led-calculator-api.git
cd led-calculator-api
```

### 2️⃣ 安装依赖

**一键安装所有依赖**（推荐）：

```bash
npm run install:all
```

这个命令会自动安装后端和前端的所有依赖。

**或者手动分步安装**：

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 3️⃣ 开发模式

**仅启动后端服务**：

```bash
npm run dev
```

服务将在 `http://localhost:3001` 启动

**同时启动前端和后端**（推荐）：

```bash
npm run dev:all
```

- 后端API服务：`http://localhost:3001`
- 前端文档页面：`http://localhost:5173`

### 4️⃣ 生产构建

**一键构建所有项目**（推荐）：

```bash
npm run build:all
```

这个命令会自动完成：
1. 编译后端TypeScript代码到 `dist/` 目录
2. 编译前端Vue项目到 `public/docs-app/` 目录

**或者手动分步构建**：

```bash
# 1. 构建后端
npm run build

# 2. 构建前端
cd frontend
npm run build
cd ..
```

### 5️⃣ 启动生产服务

```bash
npm run start
```

### 📚 访问文档

- **本地开发**: http://localhost:5173 (前端开发服务器)
- **本地生产**: http://127.0.0.1:3001/app/
- **线上服务**: https://led-api.unilumin-gtm.com/app/

---

## 📊 API 使用示例

### 单箱体最优布局 (支持可选参数)

```typescript
// 仅布局计算 (不需要功耗/重量)
const response = await fetch('/api/calculate/optimal-layout-with-preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cabinetSpecs: {
      dimensions: { width: 500, height: 1000, depth: 40 },
      display: {
        pixelPitch: 1.5625,
        resolution: { width: 320, height: 640 },
        brightness: 1000,
        refreshRate: 5760,
      },
      // power 和 physical 是可选的
    },
    roomConfig: {
      dimensions: { width: 5, height: 3 },
      unit: 'meters',
    },
    previewOptions: {
      showDimensions: true,
      showPerson: true,
      language: 'zh', // 或 'en'
    },
  }),
});

const result = await response.json();
// 返回: columns, rows, totalCabinets, coverage, preview.svg
```

### 完整计算 (包含功耗/重量)

```typescript
const response = await fetch('/api/calculate/optimal-layout-with-preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cabinetSpecs: {
      dimensions: { width: 500, height: 1000, depth: 40 },
      display: {
        pixelPitch: 1.5625,
        resolution: { width: 320, height: 640 },
      },
      // ✅ 传入 power → 返回 powerConsumption
      power: {
        maxPower: 180,
        typicalPower: 60,
      },
      // ✅ 传入 physical → 返回 physical
      physical: {
        weight: 10.5,
      },
    },
    roomConfig: {
      dimensions: { width: 5, height: 3 },
      unit: 'meters',
    },
  }),
});

const result = await response.json();
// 返回: columns, rows, totalCabinets, coverage, 
//       powerConsumption.maximum, powerConsumption.typical,
//       physical.totalWeight, preview.svg
```

---

## 🏗️ 项目结构

```
led-calculator-api/
├── src/                          # 后端源码
│   ├── server.ts                 # Express 服务入口
│   ├── routes/                   # API 路由
│   │   ├── calculator.ts         # 计算端点
│   │   └── preview.ts            # 预览端点
│   ├── middleware/               # 中间件
│   │   ├── validation.ts         # 请求验证
│   │   └── errorHandler.ts       # 错误处理
│   ├── utils/                    # 计算算法
│   │   ├── configurator-calculator.ts
│   │   └── svg-generator.ts
│   └── types/                    # TypeScript 类型
│
├── frontend/                     # Vue 3 前端文档网站
│   ├── src/
│   │   ├── views/                # 页面组件
│   │   │   ├── HomePage.vue      # 首页
│   │   │   ├── TestPage.vue      # API 测试
│   │   │   ├── ApiReference.vue  # API 文档
│   │   │   └── VueIntegration.vue # Vue 集成指南
│   │   ├── components/           # 通用组件
│   │   ├── i18n/                 # 国际化 (中/英)
│   │   └── styles/               # 样式
│   └── public/
│
├── public/                       # 静态资源
│   └── docs-app/                 # Vue 构建输出
│
├── dist/                         # 后端构建输出
└── docs/                         # 开发文档
```

---

## 🔧 技术栈

### 后端
- **运行时**: Node.js 18+
- **框架**: Express 4.x
- **语言**: TypeScript 5.x
- **验证**: 自定义中间件
- **CORS**: 可配置跨域

### 前端文档网站
- **框架**: Vue 3.4+ (Composition API)
- **构建**: Vite 5.x
- **路由**: Vue Router 4.x
- **国际化**: vue-i18n 9.x
- **样式**: TailwindCSS 3.x
- **设计**: Apple 风格 UI

---

## 🌐 国际化支持

API 和文档网站都支持中英文切换：

### API 预览图语言
```json
{
  "previewOptions": {
    "language": "zh" // 或 "en"
  }
}
```

### 文档网站
点击右上角语言切换按钮即可切换中/英文

---

## 📝 API 端点列表

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/api/calculate/single` | 单箱体计算 |
| POST | `/api/calculate/multi` | 多箱体计算 |
| POST | `/api/calculate/optimal-layout` | 最优布局 |
| POST | `/api/calculate/smart-combination` | 智能组合 |
| POST | `/api/calculate/optimal-layout-with-preview` | 一键布局+预览 |
| POST | `/api/calculate/smart-combination-with-preview` | 一键组合+预览 |
| POST | `/api/preview/svg` | SVG 预览生成 |

---

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t led-calculator-api .
```

### 运行容器

```bash
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e CORS_ORIGINS=https://your-domain.com \
  --name led-calculator-api \
  led-calculator-api
```

---

## ⚙️ 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `PORT` | 3001 | 服务端口 |
| `NODE_ENV` | development | 环境模式 |
| `LOG_LEVEL` | info | 日志级别 |
| `CORS_ORIGINS` | * | 允许的跨域源 |

---

## 📖 详细文档

- [📋 API 功能清单](./docs/API-FEATURES.md)
- [🚀 快速开始指南](./docs/QUICK-START.md)
- [💻 集成示例](./docs/INTEGRATION-EXAMPLES.md)
- [🧪 测试指南](./docs/TESTING-GUIDE.md)
- [📝 重构计划](./docs/REBUILD-PLAN.md)

---

## 📄 许可证

本项目采用 **CC BY-NC-SA 4.0** (知识共享署名-非商业性使用-相同方式共享 4.0 国际) 许可协议。

### ⚠️ 重要声明

- ✅ **允许**: 分享、修改、演绎本作品
- ✅ **允许**: 个人学习、教育、研究用途
- ❌ **禁止**: 任何商业用途
- ❌ **禁止**: 出售本软件或衍生品
- ❌ **禁止**: 在商业产品/服务中使用

### 商业授权

如需商业授权，请联系设计者：**Zora (u0015098@unilumin.com)**

📜 [查看完整许可证](./LICENSE) | 🔗 [CC BY-NC-SA 4.0 官方说明](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**© 2025 Unilumin. Designed by Zora(u0015098@unilumin.com).**
