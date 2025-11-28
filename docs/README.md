# LED Calculator API - 文档中心

## 📖 文档概览

本文档中心提供 LED Calculator API 的完整使用指南，包括快速开始、API 参考、集成示例和测试方法。

---

## 🚀 新手入门

### [快速开始指南](./QUICK-START.md)
**适合**: 第一次使用 API 的开发者

**内容**:
- 5分钟快速上手
- 启动服务和验证
- 第一个 API 调用
- 常用场景示例
- 常见问题解答

**推荐阅读时间**: 5-10 分钟

---

## 📋 API 参考

### [API 功能清单](./API-FEATURES.md)
**适合**: 需要了解 API 完整功能的开发者

**内容**:
- 7个 API 端点详细说明
- 请求参数完整定义
- 响应格式和示例
- 错误代码参考
- 性能指标
- CORS 配置

**推荐阅读时间**: 20-30 分钟

**核心端点**:
1. `GET /health` - 健康检查
2. `POST /api/calculate/single` - 单箱体配置计算
3. `POST /api/calculate/multi` - 多箱体组合计算
4. `POST /api/calculate/smart-combination` - 智能箱体组合推荐
5. `POST /api/calculate/optimal-layout` - 最优布局计算
6. `POST /api/preview/svg` - SVG 预览图生成
7. `POST /api/preview/png` - PNG 预览图生成

---

## 💻 集成开发

### [集成示例](./INTEGRATION-EXAMPLES.md)
**适合**: 需要将 API 集成到应用中的开发者

**内容**:
- HTML/JavaScript 原生集成
- React 集成（Hooks + 自定义 Hook）
- Vue 集成（Composition API + Composable）
- 通用最佳实践
- 错误处理
- 请求超时和重试
- 响应缓存

**推荐阅读时间**: 30-45 分钟

**包含框架**:
- ✅ HTML + Vanilla JavaScript
- ✅ React (TypeScript)
- ✅ Vue 3 (Composition API)

---

## 🧪 测试验证

### [测试指南](./TESTING-GUIDE.md)
**适合**: 需要测试 API 功能的开发者和 QA

**内容**:
- 使用测试页面进行可视化测试
- 命令行测试（curl）
- 自动化测试（Jest + fast-check）
- 集成测试（Postman）
- 性能测试（Apache Bench, Artillery）
- 常见问题排查

**推荐阅读时间**: 20-30 分钟

**测试方法**:
1. **测试页面** - 最快速的可视化测试
2. **curl 命令** - 命令行快速验证
3. **自动化测试** - 单元测试和属性测试
4. **集成测试** - Postman 集合
5. **性能测试** - 压力测试和基准测试

---

## 📊 文档使用建议

### 学习路径

#### 路径 1: 快速体验（推荐新手）
1. [快速开始](./QUICK-START.md) - 启动服务
2. 使用测试页面 - 可视化测试
3. [集成示例](./INTEGRATION-EXAMPLES.md) - 复制代码集成

**总时间**: 15-20 分钟

#### 路径 2: 深入学习（推荐进阶）
1. [快速开始](./QUICK-START.md) - 基础了解
2. [API 功能清单](./API-FEATURES.md) - 完整功能
3. [集成示例](./INTEGRATION-EXAMPLES.md) - 集成方法
4. [测试指南](./TESTING-GUIDE.md) - 测试验证

**总时间**: 60-90 分钟

#### 路径 3: 问题解决（推荐遇到问题时）
1. [快速开始](./QUICK-START.md) - 常见问题
2. [测试指南](./TESTING-GUIDE.md) - 问题排查
3. [API 功能清单](./API-FEATURES.md) - 错误代码参考

---

## 🎯 按需求查找

### 我想...

#### 快速开始使用
→ [快速开始指南](./QUICK-START.md)

#### 了解所有 API 功能
→ [API 功能清单](./API-FEATURES.md)

#### 集成到我的网站/应用
→ [集成示例](./INTEGRATION-EXAMPLES.md)

#### 测试 API 是否正常工作
→ [测试指南](./TESTING-GUIDE.md)

#### 查看请求参数格式
→ [API 功能清单](./API-FEATURES.md) - 各端点的请求参数部分

#### 查看响应数据格式
→ [API 功能清单](./API-FEATURES.md) - 各端点的响应示例部分

#### 处理错误
→ [集成示例](./INTEGRATION-EXAMPLES.md) - 通用最佳实践 - 错误处理

#### 优化性能
→ [集成示例](./INTEGRATION-EXAMPLES.md) - 通用最佳实践 - 响应缓存

#### 解决问题
→ [测试指南](./TESTING-GUIDE.md) - 常见问题排查

---

## 🔗 相关资源

### 项目文件
- [主 README](../README.md) - 项目概述和部署指南
- [设计文档](../.kiro/specs/led-calculator-api/design.md) - 架构设计
- [需求文档](../.kiro/specs/led-calculator-api/requirements.md) - 功能需求
- [任务列表](../.kiro/specs/led-calculator-api/tasks.md) - 开发任务

### 测试文件
- [测试页面](../test-page.html) - 可视化测试界面
- [属性测试](../tests/calculator.property.test.ts) - 自动化测试

### 源代码
- [服务器入口](../src/server.ts) - Express 应用
- [计算路由](../src/routes/calculator.ts) - 计算端点
- [预览路由](../src/routes/preview.ts) - 预览端点
- [算法实现](../src/utils/) - 核心算法

---

## 📝 文档更新

- **最后更新**: 2025-11-28
- **API 版本**: 1.0.0
- **文档版本**: 1.0.0

---

## 💡 提示

- 所有文档都包含实际可运行的代码示例
- 建议按照学习路径顺序阅读
- 遇到问题先查看"常见问题"部分
- 测试页面是最快的验证方式

---

## 🆘 获取帮助

如果文档无法解决你的问题:

1. 检查服务器日志
2. 使用测试页面调试
3. 查看 [测试指南](./TESTING-GUIDE.md) 的问题排查部分
4. 查看 [API 功能清单](./API-FEATURES.md) 的错误代码参考
