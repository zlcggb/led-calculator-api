# 🎃 Kiro Configuration for LED Calculator API

> Kiroween Hackathon Submission - Frankenstein Category

This directory contains all Kiro configurations used to develop the LED Calculator API project.

---

## 📁 Directory Structure

```
.kiro/
├── README.md              # This file
├── hooks/                 # Agent hooks for automated workflows
├── settings/              # MCP and other settings
├── specs/                 # Spec-based development documents
│   └── led-calculator-api/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
└── steering/              # Steering documents for code generation
```

---

## 🪝 Hooks (`hooks/`)

Agent hooks automate repetitive tasks and ensure consistency.

| Hook | Trigger | Purpose |
|------|---------|---------|
| `chinese-output-specs.kiro.hook` | File created | Ensures Chinese language consistency |
| `typescript-strict-check.kiro.hook` | `.ts/.tsx` saved | Checks for `any` types |
| `api-endpoint-test-reminder.kiro.hook` | Route file saved | Reminds to add tests |
| `svg-coordinate-check.kiro.hook` | SVG files saved | Validates coordinate transformation |

### Example Hook

```json
{
  "name": "TypeScript Strict Type Check",
  "when": {
    "type": "fileSaved",
    "patterns": ["**/*.ts", "**/*.tsx"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Check for any types and suggest improvements..."
  }
}
```

---

## 📋 Specs (`specs/led-calculator-api/`)

Spec-based development documents that guided the entire project.

### requirements.md
- 8 user stories with acceptance criteria
- Covers all API endpoints
- Defines error handling requirements

### design.md
- Technical architecture
- 9 correctness properties
- Algorithm documentation (Guillotine packing)
- SVG generation rules

### tasks.md
- 40+ implementation tasks
- Requirement traceability
- Progress tracking

---

## 🎯 Steering (`steering/`)

Steering documents that customize Kiro's behavior for this project.

| Document | Purpose |
|----------|---------|
| `led-calculator-api.md` | API-specific rules (algorithm consistency, SVG rules) |
| `tech.md` | Technology stack guidelines |
| `structure.md` | Project structure conventions |
| `react-hooks-rules.md` | React best practices |
| `react-i18n-best-practices.md` | Internationalization rules |

### Key Steering Rules

1. **Algorithm Consistency**: API must use same algorithm as frontend
2. **SVG Coordinate Transformation**: Y-axis must be flipped
3. **Color Mapping**: By cabinet type, not position
4. **Error Response Format**: Structured JSON with error codes

---

## ⚙️ Settings (`settings/`)

### mcp.json
MCP (Model Context Protocol) configuration for extended capabilities.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "uvx",
      "args": ["supabase-mcp-server"]
    }
  }
}
```

---

## 🏆 Kiroween Submission Highlights

### How Kiro Features Were Used

| Feature | Usage | Impact |
|---------|-------|--------|
| **Vibe Coding** | Natural language development | 3-5x faster coding |
| **Specs** | Structured requirements → design → tasks | Complete traceability |
| **Hooks** | Automated quality checks | Consistent code quality |
| **Steering** | Project-specific rules | Code matches standards |
| **MCP** | Database schema access | Accurate type definitions |

### Key Achievements

1. **Algorithm Porting**: Successfully ported complex Guillotine algorithm from React to Node.js
2. **SVG Generation**: Created pure SVG generator without browser dependency
3. **Documentation**: Comprehensive docs generated with Kiro assistance
4. **Testing**: Property-based tests for mathematical correctness

---

## 📖 Related Documentation

- [KIROWEEN-SUBMISSION.md](../led-calculator-api/KIROWEEN-SUBMISSION.md) - Competition submission
- [KIRO-USAGE-DOCUMENTATION.md](../led-calculator-api/KIRO-USAGE-DOCUMENTATION.md) - Detailed Kiro usage
- [DEMO-GUIDE.md](../led-calculator-api/DEMO-GUIDE.md) - Video demo guide

---

## 👻 Happy Kiroween!

*Built with Kiro - Your AI Development Partner*
