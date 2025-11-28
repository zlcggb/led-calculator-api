# LED Calculator API

A standalone Node.js + Express microservice that provides RESTful API endpoints for LED display wall configuration calculations. This service wraps the existing TypeScript calculation algorithms for use by external applications.

## 📚 文档导航

### 🎯 从这里开始
- **[📖 完整总结 (API-SUMMARY.md)](./API-SUMMARY.md)** - 回答你的3个核心问题
- **[🗂️ 文档索引 (DOCUMENTATION-INDEX.md)](./DOCUMENTATION-INDEX.md)** - 快速找到你需要的内容

### 📖 详细文档
- **[🚀 快速开始](./docs/QUICK-START.md)** - 5分钟快速上手
- **[📋 API 功能清单](./docs/API-FEATURES.md)** - 所有端点详细说明
- **[💻 集成示例](./docs/INTEGRATION-EXAMPLES.md)** - HTML/React/Vue 集成代码
- **[🧪 测试指南](./docs/TESTING-GUIDE.md)** - 完整测试方法
- **[📚 文档中心](./docs/README.md)** - 文档导航和学习路径

## Features

- **Single Cabinet Calculation**: Calculate display wall specifications for single cabinet configurations
- **Multi-Cabinet Calculation**: Support complex LED configurations with mixed cabinet sizes using guillotine packing algorithm
- **Smart Combination**: Get intelligent cabinet combination recommendations for optimal wall coverage
- **Optimal Layout**: Calculate recommended columns and rows based on room dimensions
- **SVG Preview**: Generate SVG preview images of display wall configurations
- **PNG Preview**: Generate PNG preview images (requires sharp library)

## Quick Start

### Installation

```bash
cd led-calculator-api
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` environment variable).

### Test Page

A visual test page is available to test all API endpoints interactively:

- **URL**: `http://localhost:3001/` or `http://localhost:3001/test`
- **Features**:
  - Single Cabinet Configuration
  - Multi-Cabinet Configuration
  - Smart Cabinet Combination
  - Optimal Layout Calculator
  - SVG/PNG Preview Generator
- **Usage**: Simply open the URL in your browser after starting the server

### Production

```bash
npm run build
npm run start
```

## API Endpoints

### Health Check

```
GET /health
```

**Response:**
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

### POST /api/calculate/single

Calculate display wall specifications for single cabinet mode.

**Request Body:**
```json
{
  "cabinetSpecs": {
    "id": "cabinet-001",
    "name": "UHW II 0.9",
    "model": "UHW-II-0.9",
    "dimensions": {
      "width": 600,
      "height": 337.5,
      "depth": 50
    },
    "display": {
      "pixelPitch": 0.9,
      "resolution": { "width": 640, "height": 360 },
      "brightness": 600,
      "refreshRate": 3840,
      "colorDepth": 16
    },
    "power": {
      "maxPower": 150,
      "typicalPower": 75,
      "standbyPower": 5
    },
    "physical": {
      "weight": 7.5,
      "operatingTemp": { "min": 0, "max": 45 },
      "humidity": { "min": 10, "max": 90 },
      "ipRating": "IP30"
    },
    "installation": {
      "mountingType": ["wall", "floor"],
      "cableType": ["power", "data"],
      "maintenanceAccess": "front"
    }
  },
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  },
  "displayConfig": {
    "layout": { "columns": 8, "rows": 8 },
    "resolution": "UHD",
    "configuration": "fit-to-wall",
    "redundancy": {
      "power": false,
      "data": false,
      "noRedundancy": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallDimensions": {
      "width": 4.8,
      "height": 2.7,
      "area": 12.96,
      "diagonal": 217.5
    },
    "cabinetCount": {
      "total": 64,
      "horizontal": 8,
      "vertical": 8
    },
    "pixels": {
      "totalWidth": 5120,
      "totalHeight": 2880,
      "totalPixels": 14745600,
      "pixelDensity": 1137777.78
    },
    "powerConsumption": {
      "maximum": 9600,
      "typical": 4800,
      "standby": 320,
      "heatGeneration": {
        "maxBTU": 32736,
        "typicalBTU": 16368
      }
    },
    "physical": {
      "totalWeight": 480,
      "structuralLoad": 37.04
    },
    "controlSystem": {
      "controllers4K": 2,
      "sendingCards": 1,
      "fiberCables": 2
    }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

### POST /api/calculate/multi

Calculate display wall specifications for multi-cabinet mode with mixed cabinet sizes.

**Request Body:**
```json
{
  "cabinetSelections": [
    {
      "id": "main-cabinet",
      "specs": { /* CabinetSpecs object */ },
      "count": 50,
      "priority": 1
    },
    {
      "id": "aux-cabinet",
      "specs": { /* CabinetSpecs object */ },
      "count": 20,
      "priority": 2
    }
  ],
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  },
  "displayConfig": {
    "layout": { "columns": 1, "rows": 1 },
    "resolution": "Custom",
    "configuration": "multi-cabinet",
    "redundancy": {
      "power": false,
      "data": false,
      "noRedundancy": true
    }
  },
  "arrangementDirection": "left-to-right"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallDimensions": { /* ... */ },
    "cabinetCount": { /* ... */ },
    "arrangement": {
      "cabinets": [
        {
          "cabinetId": "main-cabinet",
          "specs": { /* ... */ },
          "position": { "x": 0, "y": 0 },
          "size": { "width": 600, "height": 337.5 }
        }
      ],
      "totalArea": 12960000,
      "screenArea": 15000000,
      "coverage": 0.864,
      "isFullyFilled": false,
      "strategy": "progressive_combination",
      "arrangementDirection": "left-to-right"
    },
    "pixels": { /* ... */ },
    "powerConsumption": { /* ... */ },
    "physical": { /* ... */ },
    "controlSystem": { /* ... */ }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

### POST /api/calculate/smart-combination

Find optimal cabinet combination for maximum wall coverage.

**Request Body:**
```json
{
  "mainCabinet": {
    "id": "main-001",
    "specs": { /* CabinetSpecs object */ }
  },
  "auxiliaryCabinets": [
    {
      "id": "aux-001",
      "specs": { /* CabinetSpecs object */ }
    },
    {
      "id": "aux-002",
      "specs": { /* CabinetSpecs object */ }
    }
  ],
  "wallWidthMm": 5000,
  "wallHeightMm": 3000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bestCombination": {
      "mainCabinetCount": 48,
      "auxiliaryCounts": { "aux-001": 8, "aux-002": 4 }
    },
    "coverage": 0.95,
    "coveragePercentage": "95.00%",
    "isFullyFilled": false,
    "adjustedSize": { "width": 4800, "height": 2700 },
    "testResultsCount": 15
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

### POST /api/calculate/optimal-layout

Calculate optimal layout (columns and rows) based on room dimensions.

**Request Body:**
```json
{
  "cabinetSpecs": { /* CabinetSpecs object */ },
  "roomConfig": {
    "dimensions": { "width": 16, "height": 10 },
    "unit": "feet",
    "wallType": "flat"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "columns": 8,
    "rows": 9,
    "cabinetDimensions": {
      "widthMm": 600,
      "heightMm": 337.5
    },
    "roomDimensions": {
      "widthM": 4.8768,
      "heightM": 3.048,
      "originalUnit": "feet"
    }
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

### POST /api/preview/svg

Generate SVG preview of LED display wall configuration.

**Request Body:**
```json
{
  "calculationResult": { /* CalculationResult object */ },
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  },
  "options": {
    "showDimensions": true,
    "showPerson": true,
    "canvasWidth": 800,
    "canvasHeight": 500,
    "format": "svg"
  }
}
```

**Response (format: "svg"):**
Returns raw SVG with `Content-Type: image/svg+xml`

**Response (format: "json"):**
```json
{
  "success": true,
  "data": {
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>",
    "width": 800,
    "height": 500
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

### POST /api/preview/png

Generate PNG preview of LED display wall configuration.

**Request Body:**
```json
{
  "calculationResult": { /* CalculationResult object */ },
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  },
  "options": {
    "showDimensions": true,
    "showPerson": true,
    "width": 800,
    "height": 500
  }
}
```

**Response:**
Returns PNG image with `Content-Type: image/png`

---

## Error Responses

All endpoints return structured error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "cabinetSpecs is required"
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `CABINET_LIMIT_EXCEEDED` | 400 | Total cabinet count > 1000 |
| `SCREEN_SIZE_EXCEEDED` | 400 | Screen dimensions > 50m |
| `CALCULATION_ERROR` | 500 | Internal calculation error |
| `UNKNOWN_ERROR` | 500 | Unexpected error |

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |
| `LOG_LEVEL` | info | Logging level (debug, info, warn, error) |
| `CORS_ORIGINS` | * | Allowed CORS origins (comma-separated or *) |
| `CORS_METHODS` | GET,POST,OPTIONS | Allowed HTTP methods |
| `CORS_ALLOWED_HEADERS` | Content-Type,Authorization | Allowed headers |
| `CORS_MAX_AGE` | 86400 | Preflight cache duration (seconds) |

---

## Docker Deployment

### Build Image

```bash
docker build -t led-calculator-api .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e CORS_ORIGINS=https://your-domain.com \
  --name led-calculator-api \
  led-calculator-api
```

### Docker Compose

```yaml
version: '3.8'
services:
  led-calculator-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGINS=*
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 3s
      retries: 3
```

---

## Multi-Cabinet Arrangement Algorithms

### ⚠️ CRITICAL: Algorithm Consistency

**The API MUST use the same arrangement algorithm as the frontend to ensure consistent results.**

### File Structure Overview

```
led-calculator-api/src/utils/
├── configurator-calculator.ts              # Re-exports from original-*
├── original-configurator-calculator.ts     # ✅ PRIMARY: Guillotine algorithm (from frontend)
├── multi-cabinet-calculator.ts             # ⚠️ BACKUP: Row/Column greedy (for testing only)
├── original-multi-cabinet-calculator.ts    # Original multi-cabinet (unused)
├── linear-equation-calculator.ts           # Re-exports from original-*
├── original-linear-equation-calculator.ts  # Linear equation solver (from frontend)
└── svg-generator.ts                        # SVG preview generation
```

### Algorithm Selection Matrix

| Endpoint | File | Function | Status |
|----------|------|----------|--------|
| `/api/calculate/multi` | `original-configurator-calculator.ts` | `calculateMultiCabinetDisplayWall()` | ✅ **PRODUCTION** |
| `/api/calculate/smart-combination` | `original-configurator-calculator.ts` | `calculateMultiCabinetDisplayWall()` | ✅ **PRODUCTION** |
| Internal testing only | `multi-cabinet-calculator.ts` | `arrangeBoxesAuto()` | ⚠️ **DO NOT USE** |

### Algorithm 1: Guillotine with Intelligent Column Alignment (PRIMARY)

**File**: `src/utils/original-configurator-calculator.ts`  
**Function**: `calculateMultiCabinetDisplayWall()`  
**Source**: Copied from frontend `src/products/utils/configurator-calculator.ts`

**Key Features**:
1. **Intelligent Column Width Alignment**: Prioritizes cabinets with the same width as the dominant cabinet (most numerous)
2. **Guillotine Packing**: Recursively splits remaining space after placing each cabinet
3. **Bottom-Left Origin**: Starts from (x=0, y=0) at bottom-left corner
4. **Installation Optimized**: Same-width cabinets stack vertically, simplifying mounting

**Sorting Strategy** (3-level priority):
```typescript
// File: src/utils/original-configurator-calculator.ts
// Lines: ~565-590

// Step 1: Find dominant cabinet (most numerous)
const dominantCabinet = activeCabinets.reduce((max, cabinet) => 
  cabinet.count > max.count ? cabinet : max
);
const dominantWidth = dominantCabinet.specs.dimensions.width;

// Step 2: Sort all cabinet items
cabinetItems.sort((a, b) => {
  // Priority 1: Height descending (place main body area first)
  if (a.height !== b.height) {
    return b.height - a.height;
  }
  
  // Priority 2: Same height → prioritize dominant width (column alignment)
  const aMatchesDominant = a.width === dominantWidth;
  const bMatchesDominant = b.width === dominantWidth;
  
  if (aMatchesDominant && !bMatchesDominant) return -1; // a first
  if (!aMatchesDominant && bMatchesDominant) return 1;  // b first
  
  // Priority 3: Width ascending (smaller cabinets last)
  return a.width - b.width;
});
```

**Example Result**:
```
Wall: 3.25m × 3.25m
Cabinets: 
  - 500×1000mm (18 units) ← Dominant cabinet
  - 500×250mm (5 units)   ← Same width as dominant
  - 750×250mm (1 unit)    ← Different width
  - 250×500mm (6 units)   ← Different width

Correct Arrangement (Guillotine with Column Alignment):
Top row:    [500×250] [500×250] [500×250] [500×250] [500×250] [750×250]
            ↓         ↓         ↓         ↓         ↓         ↓
Main area:  [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]
            [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]
            [500×1000][500×1000][500×1000][500×1000][500×1000][250×500]

✅ Columns 1-5: All 500mm wide (uniform mounting brackets)
✅ Column 6: Mixed widths (edge fill)
✅ 250×500mm cabinets form vertical column on right
```

**Why This Works**:
- Top row uses 500×250mm first (matches dominant width 500mm)
- 750×250mm placed last in top row (different width)
- Main area uses 500×1000mm (dominant cabinet)
- Right column uses 250×500mm (fills remaining space)

### Algorithm 2: Row/Column Greedy (BACKUP - DO NOT USE)

**File**: `src/utils/multi-cabinet-calculator.ts`  
**Functions**: `arrangeBoxesRowWise()`, `arrangeBoxesColumnWise()`, `arrangeBoxesAuto()`

**⚠️ DO NOT USE for production endpoints**

**Why Not**:
- ❌ Does not guarantee column width alignment
- ❌ May place different-width cabinets in same column
- ❌ Results differ from frontend
- ❌ Complicates installation (requires multiple bracket types)

**Only Use For**:
- Internal testing and comparison
- Algorithm research
- Coverage benchmarking

**Problem Example**:
```
Wrong Arrangement (Greedy without alignment):
Top row:    [750×250] [500×250] [500×250] [500×250] [...]
            ↓         ↓         ↓         ↓
Main area:  [500×1000][500×1000][500×1000][500×1000][...]

❌ Column 1: 750mm (top) + 500mm (main) → different widths
❌ Requires multiple bracket types
❌ Complicates installation
```

### SVG Generation Rules

**Location**: `src/utils/svg-generator.ts` → `generateSVGPreview()`

#### Cabinet Rendering

**Multi-Cabinet Mode**:
```typescript
// Use arrangement.cabinets from guillotine algorithm
const cabinets = calculationResult.arrangement.cabinets;

// Coordinate transformation: Bottom-left origin (y=0 at bottom)
const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

**Color Mapping**:
```typescript
const CABINET_COLORS = [
  "#3B82F6",  // Blue (primary)
  "#10B981",  // Green
  "#F59E0B",  // Yellow
  "#EF4444",  // Red
  "#8B5CF6",  // Purple
  "#06B6D4"   // Cyan
];

// Assign color by cabinet type (not by position)
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
```

**Cabinet Labels**:
- Display actual dimensions (width × height in mm)
- Font size scales with cabinet size
- White text with bold weight for visibility

#### Coordinate System

```
Frontend (React):           API (SVG):
┌─────────────┐            ┌─────────────┐
│ (0,0)       │            │ (0,0)       │
│             │            │             │
│             │            │             │
│             │            │             │
└─────────────┘            └─────────────┘
Top-left origin            Top-left origin (same)

Cabinet Position Storage:  Cabinet Position Rendering:
┌─────────────┐            ┌─────────────┐
│             │            │             │
│             │            │             │
│             │            │             │
│ (0,0)       │            │ (0,0)       │
└─────────────┘            └─────────────┘
Bottom-left origin         Flipped to top-left for SVG
(y=0 at bottom)            (y = screenHeight - y - height)
```

### Implementation in Routes

#### ✅ CORRECT: Smart Combination Endpoint

**File**: `src/routes/calculator.ts` (Lines ~115-145)

```typescript
// Step 1: Get best combination from enhanced algorithm
const result = await enhancedProgressiveCabinetCombination(
  mainCabinet,
  auxiliaryCabinets,
  wallWidthMm,
  wallHeightMm
);

// Step 2: Use guillotine algorithm for arrangement (same as frontend)
const tempRoomConfig = {
  dimensions: {
    width: finalWidthMm / 1000,
    height: finalHeightMm / 1000
  },
  unit: 'meters' as const,
  wallType: 'flat' as const
};

const tempDisplayConfig = {
  layout: { rows: 1, columns: 1 },
  resolution: 'FHD' as const,
  configuration: 'multi-cabinet' as const,
  redundancy: { power: false, data: false, noRedundancy: true }
};

// ✅ Use calculateMultiCabinetDisplayWall (guillotine algorithm)
const calculationResult = await calculateMultiCabinetDisplayWall(
  result.bestCombination,
  tempRoomConfig,
  tempDisplayConfig,
  'left-to-right'
);
```

#### ❌ WRONG: Using arrangeBoxesAuto

```typescript
// DON'T DO THIS - Results differ from frontend
const { arrangeBoxesAuto } = await import('../utils/multi-cabinet-calculator');
const arrangementResult = arrangeBoxesAuto(width, height, cabinets);
```

**Problems**:
- ❌ No column width alignment
- ❌ Different results from frontend
- ❌ Breaks installation optimization

### Common Pitfalls and Solutions

#### Pitfall 1: Wrong Algorithm Selection

**❌ WRONG**:
```typescript
// File: src/routes/calculator.ts
const { arrangeBoxesAuto } = await import('../utils/multi-cabinet-calculator');
```

**✅ CORRECT**:
```typescript
// File: src/routes/calculator.ts
import { calculateMultiCabinetDisplayWall } from '../utils/configurator-calculator';
// This re-exports from original-configurator-calculator.ts
```

#### Pitfall 2: Forgetting Y-Coordinate Flip in SVG

**❌ WRONG**:
```typescript
// File: src/utils/svg-generator.ts
const cabinetY = screenOffsetY + (cabinet.position.y / 1000) * wallScale;
```

**Problem**: Cabinets render upside-down because:
- Storage uses bottom-left origin (y=0 at bottom)
- SVG uses top-left origin (y=0 at top)

**✅ CORRECT**:
```typescript
// File: src/utils/svg-generator.ts (Lines ~380-385)
const screenHeightMm = wallDimensions.height * 1000;
const flippedY = screenHeightMm - cabinet.position.y - cabinet.size.height;
const cabinetY = screenOffsetY + (flippedY / 1000) * wallScale;
```

#### Pitfall 3: Color by Position Instead of Type

**❌ WRONG**:
```typescript
const colorIndex = cabinetIndex % CABINET_COLORS.length;
```

**Problem**: Same cabinet type gets different colors in different positions

**✅ CORRECT**:
```typescript
// File: src/utils/svg-generator.ts (Lines ~370-375)
const uniqueCabinetIds = [...new Set(cabinets.map(c => c.cabinetId))];
const colorIndex = uniqueCabinetIds.indexOf(cabinet.cabinetId) % CABINET_COLORS.length;
```

### Testing Checklist

When modifying arrangement algorithms:

**Basic Tests**:
- [ ] Test with 3.25m × 3.25m wall (mixed cabinet sizes)
- [ ] Verify column width alignment (same-width cabinets stack vertically)
- [ ] Compare SVG output with frontend preview
- [ ] Check cabinet colors match by type (not position)

**Specific Scenarios**:
- [ ] 250×500mm cabinets form vertical column on right side
- [ ] Top row uses 500mm cabinets before 750mm (dominant width first)
- [ ] Main area uses 500×1000mm cabinets (dominant cabinet)
- [ ] No overlapping cabinets in arrangement
- [ ] Coverage percentage matches frontend calculation

**Visual Verification**:
- [ ] Open test page: `http://localhost:3001/test`
- [ ] Run smart combination with UMiniW 0.7 cabinets
- [ ] Compare generated SVG with frontend screenshot
- [ ] Verify column alignment visually

---

## Development

### Project Structure

```
led-calculator-api/
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
├── jest.config.js                        # Jest test configuration
├── Dockerfile                            # Docker container definition
├── .dockerignore                         # Docker ignore patterns
├── test-page.html                        # Interactive API test page
│
├── src/                                  # Source code
│   ├── server.ts                         # Main entry point & Express setup
│   │
│   ├── routes/                           # API route handlers
│   │   ├── index.ts                      # Route exports
│   │   ├── calculator.ts                 # Calculation endpoints (/api/calculate/*)
│   │   └── preview.ts                    # Preview generation (/api/preview/*)
│   │
│   ├── middleware/                       # Express middleware
│   │   ├── index.ts                      # Middleware exports
│   │   ├── validation.ts                 # Request body validation
│   │   ├── errorHandler.ts               # Global error handling
│   │   ├── logger.ts                     # Request/response logging
│   │   └── cors.ts                       # CORS configuration
│   │
│   ├── services/                         # Business logic services
│   │   └── index.ts                      # Service exports (currently empty)
│   │
│   ├── types/                            # TypeScript type definitions
│   │   └── index.ts                      # All type definitions (CabinetSpecs, etc.)
│   │
│   └── utils/                            # Calculation algorithms
│       ├── index.ts                      # Utility exports
│       │
│       ├── configurator-calculator.ts    # ✅ Re-exports from original-*
│       ├── original-configurator-calculator.ts  # ✅ PRIMARY: Guillotine algorithm
│       │                                 #    - calculateMultiCabinetDisplayWall()
│       │                                 #    - enhancedProgressiveCabinetCombination()
│       │                                 #    - Intelligent column width alignment
│       │
│       ├── linear-equation-calculator.ts # ✅ Re-exports from original-*
│       ├── original-linear-equation-calculator.ts  # Linear equation solver
│       │                                 #    - solveLinearTwoCabinets()
│       │
│       ├── multi-cabinet-calculator.ts   # ⚠️ BACKUP: Row/Column greedy
│       │                                 #    - arrangeBoxesRowWise()
│       │                                 #    - arrangeBoxesColumnWise()
│       │                                 #    - arrangeBoxesAuto()
│       │                                 #    ❌ DO NOT USE for production
│       │
│       ├── original-multi-cabinet-calculator.ts  # Original (unused)
│       │
│       └── svg-generator.ts              # ✅ SVG/PNG preview generation
│                                         #    - generateSVGPreview()
│                                         #    - Coordinate transformation
│                                         #    - Cabinet color mapping
│
├── public/                               # Static assets
│   ├── women.png                         # Person reference image for SVG
│   ├── logo_24.svg                       # Logo
│   └── assets/                           # Other static files
│
├── tests/                                # Test files
│   ├── .gitkeep                          # Keep directory in git
│   └── calculator.property.test.ts       # Property-based tests
│
└── dist/                                 # Compiled JavaScript (generated)
    ├── server.js
    ├── routes/
    ├── middleware/
    ├── types/
    └── utils/
```

### Key Files and Their Roles

| File | Purpose | Used By |
|------|---------|---------|
| `src/server.ts` | Express app setup, middleware registration | Entry point |
| `src/routes/calculator.ts` | `/api/calculate/*` endpoints | All calculation requests |
| `src/routes/preview.ts` | `/api/preview/*` endpoints | SVG/PNG generation |
| `src/utils/original-configurator-calculator.ts` | **PRIMARY algorithm** (guillotine) | `/api/calculate/multi`, `/api/calculate/smart-combination` |
| `src/utils/multi-cabinet-calculator.ts` | Backup algorithm (greedy) | ⚠️ Testing only |
| `src/utils/svg-generator.ts` | SVG/PNG generation | `/api/preview/*` |
| `src/middleware/validation.ts` | Request validation | All API endpoints |
| `src/middleware/errorHandler.ts` | Error formatting | All API endpoints |
| `src/types/index.ts` | Type definitions | All files |
| `test-page.html` | Interactive test UI | Manual testing |

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run test` | Run all tests |
| `npm run test:property` | Run property-based tests only |

---

## License

ISC
