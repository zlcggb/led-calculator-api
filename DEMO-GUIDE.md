# 🎬 Demo Guide | 演示指南

> 本指南帮助你录制 3 分钟的 Kiroween 演示视频

---

## 📋 视频大纲 (3 分钟)

### 第一部分：问题与解决方案 (0:00 - 0:30)

**展示内容：**
1. 打开前端 LED 配置器页面
2. 说明问题："这个强大的计算器被锁在前端，其他应用无法使用"
3. 展示解决方案："我们用 Kiro 创建了一个独立的 API 服务"

**脚本示例：**
```
"大家好，欢迎来到 Kiroween！

我们有一个复杂的 LED 显示屏配置计算器，它使用 Guillotine 算法
来优化箱体排列。但问题是，这个算法被锁在 React 前端里。

今天，我要展示如何用 Kiro 把它变成一个独立的 API 服务，
让任何应用都能调用这些计算能力。"
```

### 第二部分：Live Demo (0:30 - 1:30)

**展示内容：**
1. 打开测试页面 `http://localhost:3001/test`
2. 演示单箱体计算
3. 演示智能组合功能
4. 展示 SVG 预览生成

**操作步骤：**

```bash
# 1. 启动服务
cd led-calculator-api
npm run dev

# 2. 打开测试页面
open http://localhost:3001/test
```

**演示流程：**
1. 选择 "Smart Combination" 标签
2. 输入墙体尺寸：3250mm x 3250mm
3. 选择主箱体和辅助箱体
4. 点击计算
5. 展示 SVG 预览结果

### 第三部分：Kiro 功能展示 (1:30 - 2:30)

**展示内容：**
1. 打开 `.kiro/specs/led-calculator-api/` 目录
2. 展示 requirements.md 和 design.md
3. 展示 hooks 文件
4. 展示 steering 文件

**脚本示例：**
```
"让我展示 Kiro 是如何帮助我构建这个项目的。

首先是 Specs - 我用需求文档定义了用户故事和验收标准，
设计文档包含了正确性属性，这些直接转化为测试用例。

然后是 Hooks - 我创建了自动化钩子，比如这个中文输出规范，
确保所有文档保持语言一致性。

最后是 Steering - 这些引导文档让 Kiro 理解项目规范，
生成的代码自动符合我们的编码标准。"
```

### 第四部分：技术亮点与总结 (2:30 - 3:00)

**展示内容：**
1. 展示架构图
2. 强调 Frankenstein 特性
3. 总结 Kiro 的价值

**脚本示例：**
```
"这个项目完美体现了 Frankenstein 类别的精神 - 
我们把前端算法、Node.js 后端、SVG 生成引擎拼接在一起，
创造了一个意想不到的强大服务。

Kiro 不仅帮我生成代码，更重要的是帮我思考架构、
编写文档、保持代码质量。

感谢观看，Happy Kiroween！"
```

---

## 🎥 录制技巧

### 屏幕设置
- 分辨率：1920x1080
- 字体大小：放大到 16-18px
- 深色主题（更专业）

### 音频
- 使用外接麦克风
- 安静环境录制
- 语速适中，清晰

### 剪辑
- 去除等待时间
- 添加字幕（可选）
- 背景音乐（轻柔）

---

## 📝 关键演示点

### 必须展示的 Kiro 功能

| 功能 | 展示方式 | 时长 |
|------|----------|------|
| Vibe Coding | 展示与 Kiro 的对话历史 | 15s |
| Specs | 打开 requirements.md, design.md | 20s |
| Hooks | 展示 hooks 目录和配置 | 15s |
| Steering | 展示 steering 目录 | 10s |

### 必须展示的技术特性

| 特性 | 展示方式 |
|------|----------|
| API 调用 | 测试页面实时演示 |
| SVG 生成 | 展示生成的预览图 |
| 算法一致性 | 对比前端和 API 结果 |
| 错误处理 | 展示 400 错误响应 |

---

## 🔗 演示资源

### 测试数据

**智能组合测试参数：**
```json
{
  "wallWidthMm": 3250,
  "wallHeightMm": 3250,
  "mainCabinet": {
    "id": "main-001",
    "specs": {
      "dimensions": { "width": 500, "height": 1000 }
    }
  },
  "auxiliaryCabinets": [
    { "id": "aux-001", "specs": { "dimensions": { "width": 500, "height": 250 } } },
    { "id": "aux-002", "specs": { "dimensions": { "width": 250, "height": 500 } } }
  ]
}
```

### API 端点

| 端点 | 用途 |
|------|------|
| `GET /health` | 健康检查 |
| `POST /api/calculate/single` | 单箱体计算 |
| `POST /api/calculate/multi` | 多箱体计算 |
| `POST /api/calculate/smart-combination` | 智能组合 |
| `POST /api/preview/svg` | SVG 预览 |

---

## ✅ 演示前检查清单

- [ ] API 服务已启动 (`npm run dev`)
- [ ] 测试页面可访问
- [ ] 屏幕录制软件已准备
- [ ] 麦克风已测试
- [ ] 脚本已熟悉
- [ ] 演示数据已准备
- [ ] Kiro 界面已打开（展示 specs/hooks/steering）

---

## 🎃 Good Luck!

*记住：展示你的创意和 Kiro 的强大功能！*
