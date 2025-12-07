# LED Calculator API 文档网站重构计划

## 📋 项目概述

将现有的3个独立 HTML 文档页面重构为统一的 Vue 3 + Vite 单页应用，实现苹果风格的现代化设计和标准化国际化支持。

---

## 🎯 需求分析

### 1. 功能需求

| 功能模块 | 当前状态 | 目标状态 |
|---------|---------|---------|
| API 文档页 | 独立 HTML | Vue 组件 |
| API 测试页 | 独立 HTML | Vue 组件 + 实时交互 |
| Vue 集成指南 | 独立 HTML | Vue 组件 |
| 国际化 | 各页面独立实现 | vue-i18n 统一管理 |
| 代码高亮 | 手动 CSS 着色 | Prism.js / Shiki |
| 导航 | 无统一导航 | 全局导航栏 |
| 主题 | 固定样式 | 支持暗色模式 |

### 2. 非功能需求

- **性能**: 首屏加载 < 2s
- **SEO**: 支持 SSG 静态生成
- **可访问性**: WCAG 2.1 AA 级
- **响应式**: 支持移动端/平板/桌面
- **浏览器**: Chrome/Firefox/Safari/Edge 最新版

### 3. 设计需求

- **设计风格**: Apple Developer 文档风格
- **色彩方案**: 
  - 主色: `#0071e3` (Apple Blue)
  - 背景: 磨砂玻璃效果
  - 文字: 高对比度，易读性优先
- **字体**: SF Pro Display / Inter
- **动画**: 微妙、流畅的过渡效果

---

## 🏗️ 技术架构

### 技术栈

```
前端框架: Vue 3.4+ (Composition API)
构建工具: Vite 5.x
路由: Vue Router 4.x
国际化: vue-i18n 9.x
样式: 
  - TailwindCSS 3.x (实用优先)
  - CSS Variables (主题切换)
代码高亮: Shiki (与 Vite 集成好)
HTTP 客户端: 原生 fetch
状态管理: Vue Composition API (无需 Pinia)
```

### 目录结构

```
led-calculator-api/
├── frontend/                    # 新的前端项目
│   ├── src/
│   │   ├── assets/             # 静态资源
│   │   │   └── images/
│   │   ├── components/         # 通用组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── CodeBlock.vue
│   │   │   ├── ApiEndpoint.vue
│   │   │   ├── DataTable.vue
│   │   │   └── LanguageSwitcher.vue
│   │   ├── composables/        # 组合式函数
│   │   │   ├── useApi.ts
│   │   │   └── useTheme.ts
│   │   ├── i18n/               # 国际化
│   │   │   ├── index.ts
│   │   │   ├── locales/
│   │   │   │   ├── zh.json
│   │   │   │   └── en.json
│   │   │   └── code-comments/  # 代码注释翻译
│   │   │       ├── zh.ts
│   │   │       └── en.ts
│   │   ├── views/              # 页面视图
│   │   │   ├── HomePage.vue
│   │   │   ├── ApiReference.vue
│   │   │   ├── TestPage.vue
│   │   │   └── VueIntegration.vue
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── code-theme.css
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   │   └── favicon.ico
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── src/                         # 现有 API 后端
├── dist/
└── ...
```

---

## 📝 任务清单

### Phase 1: 项目初始化 (Day 1)

- [ ] **Task 1.1**: 创建 Vue 3 + Vite 项目
- [ ] **Task 1.2**: 配置 TailwindCSS
- [ ] **Task 1.3**: 配置 Vue Router
- [ ] **Task 1.4**: 配置 vue-i18n
- [ ] **Task 1.5**: 创建基础布局组件 (Header/Footer)

### Phase 2: 设计系统 (Day 1-2)

- [ ] **Task 2.1**: 定义 CSS 变量 (颜色/字体/间距)
- [ ] **Task 2.2**: 创建苹果风格组件样式
- [ ] **Task 2.3**: 实现暗色模式切换
- [ ] **Task 2.4**: 创建代码块组件 (带语法高亮)

### Phase 3: 国际化系统 (Day 2)

- [ ] **Task 3.1**: 迁移中文翻译到 zh.json
- [ ] **Task 3.2**: 迁移英文翻译到 en.json
- [ ] **Task 3.3**: 创建代码注释翻译系统
- [ ] **Task 3.4**: 实现语言切换器组件

### Phase 4: 页面开发 (Day 2-3)

- [ ] **Task 4.1**: 重构首页/测试页 (TestPage.vue)
- [ ] **Task 4.2**: 重构 API 文档页 (ApiReference.vue)
- [ ] **Task 4.3**: 重构 Vue 集成指南 (VueIntegration.vue)
- [ ] **Task 4.4**: 创建首页 (HomePage.vue)

### Phase 5: 交互功能 (Day 3-4)

- [ ] **Task 5.1**: 实现 API 测试功能
- [ ] **Task 5.2**: 实现代码复制功能
- [ ] **Task 5.3**: 实现响应式布局
- [ ] **Task 5.4**: 添加加载状态和错误处理

### Phase 6: 优化与部署 (Day 4)

- [ ] **Task 6.1**: 性能优化 (代码分割/懒加载)
- [ ] **Task 6.2**: SEO 优化 (meta tags)
- [ ] **Task 6.3**: 构建配置优化
- [ ] **Task 6.4**: 部署到现有服务器

---

## 🎨 设计规范

### 颜色系统

```css
/* 亮色主题 */
--color-primary: #0071e3;
--color-primary-hover: #0077ED;
--color-bg-primary: #ffffff;
--color-bg-secondary: #f5f5f7;
--color-bg-tertiary: #fbfbfd;
--color-text-primary: #1d1d1f;
--color-text-secondary: #86868b;
--color-border: #d2d2d7;

/* 暗色主题 */
--color-bg-primary-dark: #000000;
--color-bg-secondary-dark: #1d1d1f;
--color-text-primary-dark: #f5f5f7;
```

### 字体系统

```css
--font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'Monaco', monospace;

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 2rem;
--text-4xl: 2.5rem;
```

### 间距系统

```css
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-3: 0.75rem;
--spacing-4: 1rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;
--spacing-12: 3rem;
--spacing-16: 4rem;
```

### 组件规范

#### 卡片组件
- 圆角: 12px
- 阴影: `0 2px 12px rgba(0,0,0,0.08)`
- 背景: 磨砂玻璃效果 `backdrop-filter: blur(20px)`

#### 按钮组件
- 主按钮: 实心蓝色背景
- 次按钮: 边框样式
- 圆角: 8px
- 高度: 36px / 44px

#### 代码块
- 背景: #1d1d1f (暗色)
- 圆角: 12px
- 字体: SF Mono
- 行号: 可选显示

---

## 📅 时间估算

| 阶段 | 预估时间 | 产出物 |
|------|---------|-------|
| Phase 1 | 2-3 小时 | 项目骨架 |
| Phase 2 | 3-4 小时 | 设计系统 |
| Phase 3 | 2-3 小时 | i18n 系统 |
| Phase 4 | 4-6 小时 | 3个页面 |
| Phase 5 | 3-4 小时 | 交互功能 |
| Phase 6 | 2-3 小时 | 优化部署 |
| **总计** | **16-23 小时** | 完整项目 |

---

## ✅ 验收标准

1. **功能完整**: 所有原有功能正常工作
2. **国际化**: 中英文切换流畅，代码注释正确翻译
3. **设计**: 符合苹果风格，视觉一致性
4. **性能**: Lighthouse 评分 > 90
5. **响应式**: 移动端显示正常
6. **代码质量**: TypeScript 无错误，ESLint 通过

---

## 📝 备注

- 后端 API 保持不变，仅重构前端文档页面
- 重构完成后，原有 HTML 文件可删除或归档
- 新前端将作为静态文件集成到现有 Express 服务中

---

**文档创建日期**: 2025-01-06
**最后更新**: 2025-01-06
**负责人**: AI Assistant


