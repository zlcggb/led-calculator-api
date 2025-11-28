# LED Calculator API - 文档索引

## 🎃 Kiroween Hackathon

> **Category: Frankenstein** - 将各种技术拼凑成一个强大的应用

| 比赛文档 | 描述 |
|----------|------|
| [KIROWEEN-SUBMISSION.md](./KIROWEEN-SUBMISSION.md) | 比赛提交说明 |
| [KIRO-USAGE-DOCUMENTATION.md](./KIRO-USAGE-DOCUMENTATION.md) | Kiro 使用详细文档 |
| [DEMO-GUIDE.md](./DEMO-GUIDE.md) | 3分钟演示视频指南 |

---

## 🎯 我想...

### 快速开始
- **我是第一次使用** → [API-SUMMARY.md](./API-SUMMARY.md) 或 [docs/QUICK-START.md](./docs/QUICK-START.md)
- **我想5分钟上手** → [docs/QUICK-START.md](./docs/QUICK-START.md)
- **我想看完整概述** → [API-SUMMARY.md](./API-SUMMARY.md)

### 了解功能
- **查看所有 API 端点** → [docs/API-FEATURES.md](./docs/API-FEATURES.md)
- **了解请求参数格式** → [docs/API-FEATURES.md](./docs/API-FEATURES.md) - 各端点详情
- **了解响应数据格式** → [docs/API-FEATURES.md](./docs/API-FEATURES.md) - 响应示例
- **查看错误代码** → [docs/API-FEATURES.md](./docs/API-FEATURES.md) - 错误处理部分

### 集成开发
- **集成到 HTML 网站** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - HTML 部分
- **集成到 React 应用** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - React 部分
- **集成到 Vue 应用** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - Vue 部分
- **学习最佳实践** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - 最佳实践部分
- **处理错误** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - 错误处理
- **优化性能** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) - 缓存和重试

### 测试验证
- **使用测试页面** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 测试页面部分
- **使用 curl 测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 命令行测试
- **运行自动化测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 自动化测试
- **使用 Postman 测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 集成测试
- **性能测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 性能测试
- **排查问题** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 常见问题排查

### 部署配置
- **修改端口** → [docs/QUICK-START.md](./docs/QUICK-START.md) - 环境配置
- **配置 CORS** → [docs/API-FEATURES.md](./docs/API-FEATURES.md) - CORS 支持
- **生产部署** → [README.md](./README.md) - Docker 部署
- **环境变量** → [README.md](./README.md) - 配置部分

---

## 📚 文档列表

### 核心文档

| 文档 | 描述 | 适合人群 | 阅读时间 |
|------|------|----------|----------|
| [API-SUMMARY.md](./API-SUMMARY.md) | 完整总结，回答3个核心问题 | 所有人 | 10分钟 |
| [docs/QUICK-START.md](./docs/QUICK-START.md) | 5分钟快速上手指南 | 新手 | 5分钟 |
| [docs/API-FEATURES.md](./docs/API-FEATURES.md) | 所有端点详细说明 | 开发者 | 30分钟 |
| [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md) | HTML/React/Vue 集成代码 | 开发者 | 45分钟 |
| [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) | 完整测试方法 | 开发者/QA | 30分钟 |
| [docs/README.md](./docs/README.md) | 文档中心导航 | 所有人 | 5分钟 |

### 项目文档

| 文档 | 描述 |
|------|------|
| [README.md](./README.md) | 项目主文档，包含部署指南 |
| [.kiro/specs/led-calculator-api/design.md](../.kiro/specs/led-calculator-api/design.md) | 架构设计文档 |
| [.kiro/specs/led-calculator-api/requirements.md](../.kiro/specs/led-calculator-api/requirements.md) | 功能需求文档 |
| [.kiro/specs/led-calculator-api/tasks.md](../.kiro/specs/led-calculator-api/tasks.md) | 开发任务列表 |

### Kiroween 比赛文档

| 文档 | 描述 |
|------|------|
| [KIROWEEN-SUBMISSION.md](./KIROWEEN-SUBMISSION.md) | 比赛提交说明和项目概述 |
| [KIRO-USAGE-DOCUMENTATION.md](./KIRO-USAGE-DOCUMENTATION.md) | Kiro 功能使用详细说明 |
| [DEMO-GUIDE.md](./DEMO-GUIDE.md) | 演示视频录制指南 |

### 测试文件

| 文件 | 描述 |
|------|------|
| [test-page.html](./test-page.html) | 可视化测试页面 |
| [tests/calculator.property.test.ts](./tests/calculator.property.test.ts) | 属性测试用例 |

---

## 🎓 学习路径

### 路径 1: 快速体验（15分钟）
```
1. API-SUMMARY.md (10分钟)
   ↓
2. 启动服务并使用测试页面 (5分钟)
   ↓
3. 开始集成
```

### 路径 2: 完整学习（90分钟）
```
1. docs/QUICK-START.md (5分钟)
   ↓
2. docs/API-FEATURES.md (30分钟)
   ↓
3. docs/INTEGRATION-EXAMPLES.md (45分钟)
   ↓
4. docs/TESTING-GUIDE.md (30分钟)
   ↓
5. 实践集成
```

### 路径 3: 问题解决（20分钟）
```
1. docs/QUICK-START.md - 常见问题 (5分钟)
   ↓
2. docs/TESTING-GUIDE.md - 问题排查 (10分钟)
   ↓
3. docs/API-FEATURES.md - 错误代码 (5分钟)
```

---

## 🔍 按主题查找

### API 端点
- **健康检查** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#1-健康检查-health-check)
- **单箱体计算** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#2-单箱体配置计算-single-cabinet)
- **多箱体计算** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#3-多箱体组合计算-multi-cabinet)
- **智能组合** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#4-智能箱体组合推荐-smart-combination)
- **最优布局** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#5-最优布局计算-optimal-layout)
- **SVG 预览** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#6-svg-预览图生成-svg-preview)
- **PNG 预览** → [docs/API-FEATURES.md](./docs/API-FEATURES.md#7-png-预览图生成-png-preview)

### 集成框架
- **HTML/JavaScript** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md#htmljavascript-集成)
- **React** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md#react-集成)
- **Vue** → [docs/INTEGRATION-EXAMPLES.md](./docs/INTEGRATION-EXAMPLES.md#vue-集成)

### 测试方法
- **测试页面** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md#使用测试页面)
- **curl 命令** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md#命令行测试)
- **自动化测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md#自动化测试)
- **Postman** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md#集成测试示例)
- **性能测试** → [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md#性能测试)

---

## 📖 文档特点

### ✅ 实用性
- 所有示例都是可运行的代码
- 包含完整的请求和响应示例
- 提供多种测试方法

### ✅ 完整性
- 覆盖所有 API 端点
- 包含 HTML、React、Vue 集成
- 提供错误处理和最佳实践

### ✅ 易读性
- 清晰的目录结构
- 代码高亮和格式化
- 丰富的表格和列表

### ✅ 可搜索性
- 详细的索引
- 按需求分类
- 按主题组织

---

## 🚀 快速链接

### 最常用
- [快速开始](./docs/QUICK-START.md)
- [API 功能清单](./docs/API-FEATURES.md)
- [集成示例](./docs/INTEGRATION-EXAMPLES.md)

### 测试相关
- [测试指南](./docs/TESTING-GUIDE.md)
- [测试页面](./test-page.html)
- [属性测试](./tests/calculator.property.test.ts)

### 项目相关
- [主 README](./README.md)
- [设计文档](../.kiro/specs/led-calculator-api/design.md)
- [需求文档](../.kiro/specs/led-calculator-api/requirements.md)

---

## 💡 使用建议

1. **新手**: 从 [API-SUMMARY.md](./API-SUMMARY.md) 开始
2. **开发者**: 直接查看 [集成示例](./docs/INTEGRATION-EXAMPLES.md)
3. **测试人员**: 使用 [测试页面](./test-page.html) 和 [测试指南](./docs/TESTING-GUIDE.md)
4. **架构师**: 查看 [设计文档](../.kiro/specs/led-calculator-api/design.md)

---

## 🆘 获取帮助

遇到问题时的查找顺序：

1. [docs/QUICK-START.md](./docs/QUICK-START.md) - 常见问题
2. [docs/TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - 问题排查
3. [docs/API-FEATURES.md](./docs/API-FEATURES.md) - 错误代码
4. 查看服务器日志
5. 使用测试页面调试

---

**最后更新**: 2025-11-28  
**文档版本**: 1.0.0
