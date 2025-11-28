# 🎃 Kiroween Hackathon Submission

## LED Calculator API - Frankenstein Category

> *"Bringing together disparate technologies into one powerful application"*

---

## 📋 Project Overview

**LED Calculator API** is a standalone Node.js + Express microservice that transforms existing frontend LED display configuration algorithms into a powerful RESTful API. This project exemplifies the "Frankenstein" spirit by stitching together:

- 🧠 **Complex TypeScript algorithms** (originally designed for React frontend)
- 🔧 **Node.js/Express backend** (API layer)
- 🎨 **SVG generation engine** (visual preview system)
- 📐 **Mathematical optimization** (guillotine packing algorithm)
- 🖼️ **Image processing** (PNG conversion with Sharp)

### The Challenge We Solved

LED display wall configuration is a complex engineering problem:
- Multiple cabinet sizes must fit together like puzzle pieces
- Coverage must be maximized while maintaining structural integrity
- Visual previews are essential for client approval
- Third-party integrations need API access

**Our Frankenstein creation** takes algorithms that were trapped in a React frontend and gives them new life as a standalone API service that any application can consume.

---

## 🏆 Category: Frankenstein

### Why Frankenstein?

This project perfectly embodies the Frankenstein category because we:

1. **Stitched Together Incompatible Parts**
   - Frontend TypeScript algorithms → Backend Node.js service
   - React component rendering logic → Pure SVG string generation
   - Browser-based calculations → Server-side API endpoints

2. **Created Something Unexpectedly Powerful**
   - What was once locked in a single application is now accessible to any system
   - Mobile apps, other websites, IoT devices can all use our calculations
   - The API generates visual previews without any browser dependency

3. **Unified Disparate Technologies**
   - TypeScript type system for safety
   - Express.js for HTTP handling
   - Guillotine algorithm for 2D bin packing
   - SVG/PNG generation for visualization
   - Docker for deployment

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live API** | `https://your-deployment-url.com` |
| **GitHub Repository** | `https://github.com/your-username/led-calculator-api` |
| **Demo Video** | `https://youtube.com/watch?v=your-video-id` |
| **Interactive Test Page** | `https://your-deployment-url.com/test` |

---

## 🎬 Demo Video Highlights (3 minutes)

1. **0:00-0:30** - Introduction & Problem Statement
2. **0:30-1:30** - Live API Demo (using test page)
3. **1:30-2:30** - How Kiro Helped Build This
4. **2:30-3:00** - Technical Architecture & Conclusion

---

## 🛠️ How Kiro Was Used

### 1. Vibe Coding Experience

**How I communicated with Kiro:**
- Started with high-level requirements in Chinese (my native language)
- Kiro understood the domain-specific terminology (LED cabinets, pixel pitch, etc.)
- Iterative refinement through natural conversation

**Most impressive code generation:**
- The SVG generator was created almost entirely by Kiro
- Complex coordinate transformation (bottom-left to top-left origin) was handled correctly
- Cabinet color mapping by type (not position) was implemented without explicit instruction

```typescript
// Kiro generated this coordinate transformation logic
const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

### 2. Agent Hooks

**Automated workflows:**
- Created a hook for Chinese output specifications
- Ensures all documentation maintains language consistency
- Automatically reminds to use Chinese for specs, comments, and explanations

```json
{
  "name": "中文输出规范",
  "when": { "type": "fileCreated" },
  "then": {
    "type": "askAgent",
    "prompt": "请始终使用中文进行回答和书写所有文档内容..."
  }
}
```

**How hooks improved development:**
- Maintained consistent documentation language
- Reduced context-switching between languages
- Ensured team members could understand all documentation

### 3. Spec-Based Development

**How I structured specs for Kiro:**

The `.kiro/specs/led-calculator-api/` directory contains:
- `requirements.md` - User stories with acceptance criteria
- `design.md` - Technical architecture and correctness properties
- `tasks.md` - Implementation checklist with requirement traceability

**Benefits of spec-based approach:**
- Clear traceability from requirements → design → implementation
- Correctness properties serve as test specifications
- Tasks are linked to specific requirements

**Comparison with vibe coding:**
| Aspect | Vibe Coding | Spec-Based |
|--------|-------------|------------|
| Speed | Faster for simple tasks | Better for complex systems |
| Consistency | Variable | High |
| Documentation | Minimal | Comprehensive |
| Refactoring | Harder | Easier |

### 4. Steering Documents

**How steering improved Kiro's responses:**

Created multiple steering files in `.kiro/steering/`:
- `tech.md` - Technology stack guidelines
- `structure.md` - Project structure conventions
- `react-hooks-rules.md` - React best practices
- `react-i18n-best-practices.md` - Internationalization rules

**Most impactful strategy:**
The `tech.md` steering file that defines:
- Strict TypeScript typing requirements
- Database query patterns
- Environment variable conventions

This ensured Kiro always generated code that matched our existing codebase style.

### 5. MCP (Model Context Protocol)

**How MCP extended Kiro's capabilities:**
- Used Supabase MCP to query database schemas
- Enabled Kiro to understand existing data structures
- Facilitated accurate type definitions

**What MCP enabled:**
- Direct database schema inspection
- Accurate type generation matching existing tables
- Reduced back-and-forth for data structure questions

---

## 📊 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    External Clients                          │
│              (Websites, Mobile Apps, IoT)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   LED Calculator API                         │
│                  (Node.js + Express)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Routes Layer                       │   │
│  │  POST /api/calculate/single                          │   │
│  │  POST /api/calculate/multi                           │   │
│  │  POST /api/calculate/smart-combination               │   │
│  │  POST /api/calculate/optimal-layout                  │   │
│  │  POST /api/preview/svg                               │   │
│  │  POST /api/preview/png                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Calculation Engine                       │   │
│  │  • Guillotine Packing Algorithm                      │   │
│  │  • Linear Equation Solver                            │   │
│  │  • Progressive Combination Optimizer                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Preview Generator                        │   │
│  │  • SVG String Generation                             │   │
│  │  • PNG Conversion (Sharp)                            │   │
│  │  • Coordinate Transformation                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Single Cabinet Calculation** | Calculate specs for uniform cabinet configurations |
| **Multi-Cabinet Arrangement** | Optimize mixed cabinet layouts using guillotine algorithm |
| **Smart Combination** | AI-powered cabinet selection for maximum coverage |
| **Optimal Layout** | Automatic column/row calculation based on room size |
| **SVG Preview** | Generate visual previews without browser |
| **PNG Export** | Convert previews to PNG for universal compatibility |

---

## 🧪 Testing & Quality

- **Property-Based Tests**: Using fast-check for mathematical correctness
- **Integration Tests**: End-to-end API testing
- **Type Safety**: Strict TypeScript with no `any` types
- **Error Handling**: Structured error responses with codes

---

## 🚀 Deployment

```bash
# Docker deployment
docker build -t led-calculator-api .
docker run -p 3001:3001 led-calculator-api

# Or use Docker Compose
docker-compose up -d
```

---

## � Bucilt With

### Languages

| Language | Version | Usage |
|----------|---------|-------|
| **TypeScript** | 5.3.3 | Primary development language |
| **JavaScript** | ES2020 | Runtime execution |
| **HTML/CSS** | 5/3 | Test page UI |

### Frameworks & Libraries

| Framework/Library | Version | Purpose |
|-------------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.18.2 | HTTP server framework |
| **TypeScript** | 5.3.3 | Type safety and compilation |
| **Sharp** | 0.33.2 | SVG to PNG image conversion |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ts-node-dev** | 2.0.0 | Development server with hot reload |
| **Jest** | 29.7.0 | Testing framework |
| **ts-jest** | 29.1.2 | TypeScript Jest transformer |
| **fast-check** | 3.15.1 | Property-based testing |

### Algorithms & Techniques

| Algorithm | Purpose |
|-----------|---------|
| **Guillotine Packing** | 2D bin packing for cabinet arrangement |
| **Linear Equation Solver** | Two-cabinet combination optimization |
| **Progressive Combination** | Multi-cabinet coverage maximization |
| **Coordinate Transformation** | Bottom-left to top-left origin conversion |

### Deployment & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Vercel** (optional) | Serverless deployment |

### APIs & Protocols

| API/Protocol | Purpose |
|--------------|---------|
| **RESTful API** | HTTP endpoints for calculations |
| **JSON** | Request/response data format |
| **SVG** | Vector graphics for previews |
| **PNG** | Raster image export |

### Development Environment

| Tool | Purpose |
|------|---------|
| **Kiro IDE** | AI-powered development |
| **VS Code** | Code editing |
| **npm** | Package management |
| **Git** | Version control |

### Kiro Features Used

| Feature | Purpose |
|---------|---------|
| **Vibe Coding** | Natural language development |
| **Specs** | Requirements → Design → Tasks |
| **Hooks** | Automated quality checks |
| **Steering** | Code generation guidelines |
| **MCP** | Database schema access |

---

## 📝 License

ISC License - Open Source

---

## 👻 Happy Kiroween!

*Built with 🎃 Kiro, TypeScript, Express.js, and a lot of creativity!*
