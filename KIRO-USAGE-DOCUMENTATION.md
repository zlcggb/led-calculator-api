# 📖 Kiro 使用文档 | How I Used Kiro

> 本文档详细说明了如何使用 Kiro 的各项功能来开发 LED Calculator API 项目

---

## 目录

1. [Vibe Coding（对话式编程）](#1-vibe-coding对话式编程)
2. [Agent Hooks（代理钩子）](#2-agent-hooks代理钩子)
3. [Spec-Based Development（基于规范的开发）](#3-spec-based-development基于规范的开发)
4. [Steering Documents（引导文档）](#4-steering-documents引导文档)
5. [MCP Integration（MCP 集成）](#5-mcp-integrationmcp-集成)
6. [总结与对比](#6-总结与对比)

---

## 1. Vibe Coding（对话式编程）

### 1.1 与 Kiro 的沟通方式

我使用中文与 Kiro 进行自然对话，描述需求和问题：

**示例对话：**
```
我: "我需要把前端的 LED 配置计算器算法封装成 API，让其他网站可以调用"

Kiro: "我理解你的需求。让我帮你创建一个 Node.js + Express 微服务..."
```

**关键沟通技巧：**
- 使用领域特定术语（箱体、像素间距、覆盖率等）
- 提供具体的输入输出示例
- 分步骤描述复杂需求

### 1.2 最令人印象深刻的代码生成

#### SVG 生成器

Kiro 几乎完全自主生成了 SVG 预览生成器，包括：

```typescript
// 坐标系转换 - Kiro 正确理解了底部原点到顶部原点的转换
const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

#### 智能颜色映射

```typescript
// Kiro 理解了按类型而非位置分配颜色的需求
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
```

#### Guillotine 算法适配

Kiro 成功将前端的 Guillotine 装箱算法适配到后端环境，保持了与前端完全一致的排列结果。

### 1.3 Vibe Coding 的优势

| 优势 | 说明 |
|------|------|
| 快速原型 | 几分钟内生成可工作的代码 |
| 自然语言 | 无需精确的技术规格 |
| 迭代改进 | 通过对话逐步完善 |
| 上下文理解 | Kiro 记住之前的讨论 |

---

## 2. Agent Hooks（代理钩子）

### 2.1 创建的钩子

**中文输出规范钩子** (`.kiro/hooks/chinese-output-specs.kiro.hook`)

```json
{
  "enabled": true,
  "name": "中文输出规范",
  "description": "确保所有技术规格文档、代码注释和AI回答都使用中文书写",
  "version": "1",
  "when": {
    "type": "fileCreated",
    "patterns": []
  },
  "then": {
    "type": "askAgent",
    "prompt": "请始终使用中文进行回答和书写所有文档内容..."
  }
}
```

### 2.2 钩子如何改进开发流程

**自动化的工作流程：**

1. **语言一致性**
   - 每次创建新文件时，自动提醒使用中文
   - 确保团队成员都能理解文档

2. **减少手动操作**
   - 无需每次都提醒 Kiro 使用中文
   - 自动应用于所有新文件

3. **质量保证**
   - 文档风格保持一致
   - 减少语言混用的情况

### 2.3 潜在的其他钩子用例

```json
// 代码审查钩子示例
{
  "name": "TypeScript 类型检查提醒",
  "when": { "type": "fileSaved", "patterns": ["*.ts"] },
  "then": {
    "type": "askAgent",
    "prompt": "请检查此文件是否有 any 类型，并建议更具体的类型定义"
  }
}
```

---

## 3. Spec-Based Development（基于规范的开发）

### 3.1 规范文件结构

```
.kiro/specs/led-calculator-api/
├── requirements.md    # 需求文档（用户故事 + 验收标准）
├── design.md          # 设计文档（架构 + 正确性属性）
└── tasks.md           # 任务清单（实现步骤 + 需求追溯）
```

### 3.2 需求文档示例

**requirements.md 结构：**

```markdown
### Requirement 1

**User Story:** As a third-party developer, I want to calculate 
single cabinet display wall specifications via API...

#### Acceptance Criteria

1. WHEN a client sends a POST request to `/api/calculate/single`...
   THEN the API SHALL return complete calculation results...
2. WHEN the request body is missing required fields...
   THEN the API SHALL return a 400 error...
```

### 3.3 设计文档中的正确性属性

**design.md 中的 Correctness Properties：**

```markdown
### Property 1: Single cabinet calculation returns complete results
*For any* valid cabinet specs, room config, and display config, 
the API response SHALL contain all required fields...
**Validates: Requirements 1.1**

### Property 3: Multi-cabinet arrangement has no overlapping cabinets
*For any* multi-cabinet calculation result, no two cabinets 
SHALL have overlapping positions...
**Validates: Requirements 2.2**
```

### 3.4 任务追溯

**tasks.md 中的需求链接：**

```markdown
- [x] 4.1 Implement POST `/api/calculate/single` endpoint
    - Accept cabinetSpecs, roomConfig, displayConfig
    - Call calculateDisplayWallSpecs
    - Return CalculationResult
    - _Requirements: 1.1, 1.3_  ← 链接到需求
```

### 3.5 基于规范开发的优势

| 方面 | 优势 |
|------|------|
| 可追溯性 | 每个功能都能追溯到需求 |
| 测试指导 | 正确性属性直接转化为测试用例 |
| 文档完整 | 自动生成完整的项目文档 |
| 团队协作 | 新成员可以快速理解项目 |

### 3.6 与 Vibe Coding 的对比

| 方面 | Vibe Coding | Spec-Based |
|------|-------------|------------|
| **适用场景** | 快速原型、简单功能 | 复杂系统、长期项目 |
| **开发速度** | 更快 | 初期较慢，后期更快 |
| **代码质量** | 依赖对话质量 | 有规范保证 |
| **可维护性** | 较低 | 较高 |
| **文档** | 需要额外编写 | 自动生成 |
| **重构** | 较困难 | 有规范指导 |

---

## 4. Steering Documents（引导文档）

### 4.1 创建的引导文档

**`.kiro/steering/` 目录下的文件：**

| 文件 | 用途 |
|------|------|
| `tech.md` | 技术栈和开发规范 |
| `structure.md` | 项目结构约定 |
| `react-hooks-rules.md` | React Hooks 最佳实践 |
| `react-i18n-best-practices.md` | 国际化规范 |
| `product.md` | 产品上下文信息 |

### 4.2 最有效的引导策略

**tech.md 中的关键规则：**

```markdown
### TypeScript
- Use strict typing; avoid `any` type
- Define interfaces for all component props
- Use type inference where obvious

### Database Patterns
- Import from `src/supabaseClient.ts` (single source of truth)
- Use RLS policies for access control
- Write SQL migrations to `sql/` folder
```

**效果：**
- Kiro 生成的代码自动遵循项目规范
- 减少了代码审查中的风格问题
- 新功能与现有代码保持一致

### 4.3 引导文档的最佳实践

1. **具体而非抽象**
   ```markdown
   ❌ "使用好的命名"
   ✅ "React 组件使用 PascalCase，如 UserProfileModule.tsx"
   ```

2. **提供示例**
   ```markdown
   ### Query Pattern
   ```tsx
   const { data, error } = await supabase
     .from('table_name')
     .select('*')
     .eq('column', value);
   ```
   ```

3. **说明原因**
   ```markdown
   - **No inline styles** - use Tailwind or CSS modules
     (保持样式一致性，便于主题切换)
   ```

---

## 5. MCP Integration（MCP 集成）

### 5.1 使用的 MCP 服务

**Supabase MCP** - 用于数据库交互

```json
// .kiro/settings/mcp.json
{
  "mcpServers": {
    "supabase": {
      "command": "uvx",
      "args": ["supabase-mcp-server"],
      "env": {
        "SUPABASE_URL": "...",
        "SUPABASE_KEY": "..."
      }
    }
  }
}
```

### 5.2 MCP 如何帮助开发

**数据库 Schema 查询：**
```
我: "帮我查看 profiles 表的结构"

Kiro (通过 MCP): "profiles 表包含以下字段：
- id: uuid (主键)
- email: text
- member_level: text
- created_at: timestamp
..."
```

**类型定义生成：**
- Kiro 可以直接查询数据库结构
- 自动生成匹配的 TypeScript 接口
- 确保类型与数据库一致

### 5.3 MCP 实现的功能

| 功能 | 没有 MCP | 有 MCP |
|------|----------|--------|
| 查询表结构 | 手动复制粘贴 | 直接查询 |
| 类型生成 | 手动编写 | 自动生成 |
| 数据验证 | 需要测试 | 实时验证 |
| 上下文理解 | 需要解释 | 自动理解 |

---

## 6. 总结与对比

### 6.1 Kiro 功能使用总结

| 功能 | 使用频率 | 主要用途 |
|------|----------|----------|
| Vibe Coding | ⭐⭐⭐⭐⭐ | 日常开发、快速迭代 |
| Specs | ⭐⭐⭐⭐ | 复杂功能规划 |
| Steering | ⭐⭐⭐⭐ | 代码风格一致性 |
| Hooks | ⭐⭐⭐ | 自动化工作流 |
| MCP | ⭐⭐⭐ | 数据库交互 |

### 6.2 开发效率提升

**量化指标：**
- 代码生成速度：提升约 **3-5 倍**
- 文档编写时间：减少约 **70%**
- Bug 修复时间：减少约 **50%**（Kiro 能快速定位问题）

### 6.3 最佳实践建议

1. **从 Specs 开始**
   - 复杂功能先写规范
   - 让 Kiro 理解全局

2. **善用 Steering**
   - 项目初期就建立规范
   - 减少后期重构

3. **Hooks 自动化**
   - 识别重复性任务
   - 创建钩子自动处理

4. **MCP 扩展能力**
   - 连接外部数据源
   - 增强上下文理解

---

## 🎃 结语

Kiro 不仅是一个代码生成工具，更是一个智能开发伙伴。通过合理使用其各项功能，可以显著提升开发效率和代码质量。

**Happy Kiroween! 👻**
