# LED Calculator API

Professional LED Display Wall Calculation & Preview API Service

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883.svg)](https://vuejs.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub](https://img.shields.io/badge/GitHub-zlcggb/led--calculator--api-181717.svg?logo=github)](https://github.com/zlcggb/led-calculator-api)

**[中文文档](./README.md)** | English

---

## 📚 Online Documentation

| Page | URL | Description |
|------|-----|-------------|
| 🏠 **Home** | [/app/](https://led-api.unilumin-gtm.com/app/) | Project introduction and quick start |
| 🧪 **API Test** | [/app/test](https://led-api.unilumin-gtm.com/app/test) | Test all APIs online |
| 📖 **API Docs** | [/app/docs](https://led-api.unilumin-gtm.com/app/docs) | Complete data structure documentation |
| 🟢 **Vue Integration** | [/app/vue-integration](https://led-api.unilumin-gtm.com/app/vue-integration) | Vue 3 integration guide |

---

## ✨ Core Features

| Feature | API Endpoint | Description |
|---------|--------------|-------------|
| 📐 **Single Cabinet Layout** | `/api/calculate/optimal-layout` | Auto-calculate optimal row/column layout |
| 🧩 **Multi-Cabinet Combination** | `/api/calculate/smart-combination` | Smart combination of multiple cabinet sizes |
| 🖼️ **SVG Preview** | `/api/preview/svg` | Generate visual preview images |
| ⚡ **One-Click Calculate** | `/api/calculate/optimal-layout-with-preview` | Calculate + Preview in one request |

---

## 🚀 Quick Start

### 1️⃣ Clone the Project

```bash
git clone https://github.com/zlcggb/led-calculator-api.git
cd led-calculator-api
```

### 2️⃣ Install Dependencies

**One-click install all dependencies** (Recommended):

```bash
npm run install:all
```

This command will automatically install all backend and frontend dependencies.

**Or install manually**:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3️⃣ Development Mode

**Start backend service only**:

```bash
npm run dev
```

Service will start at `http://localhost:3001`

**Start both frontend and backend** (Recommended):

```bash
npm run dev:all
```

- Backend API: `http://localhost:3001`
- Frontend docs: `http://localhost:5173`

### 4️⃣ Production Build

**One-click build all** (Recommended):

```bash
npm run build:all
```

This command will automatically:
1. Compile backend TypeScript to `dist/` directory
2. Compile frontend Vue project to `public/docs-app/` directory

**Or build manually**:

```bash
# 1. Build backend
npm run build

# 2. Build frontend
cd frontend
npm run build
cd ..
```

### 5️⃣ Start Production Service

```bash
npm run start
```

### 📚 Access Documentation

- **Local Development**: http://localhost:5173 (frontend dev server)
- **Local Production**: http://127.0.0.1:3001/app/
- **Online Service**: https://led-api.unilumin-gtm.com/app/

---

## 📊 API Usage Examples

### Single Cabinet Optimal Layout (with optional parameters)

```typescript
// Layout calculation only (no power/weight needed)
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
      // power and physical are optional
    },
    roomConfig: {
      dimensions: { width: 5, height: 3 },
      unit: 'meters',
    },
    previewOptions: {
      showDimensions: true,
      showPerson: true,
      language: 'en', // or 'zh'
    },
  }),
});

const result = await response.json();
// Returns: columns, rows, totalCabinets, coverage, preview.svg
```

### Full Calculation (including power/weight)

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
      // ✅ Pass power → returns powerConsumption
      power: {
        maxPower: 180,
        typicalPower: 60,
      },
      // ✅ Pass physical → returns physical
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
// Returns: columns, rows, totalCabinets, coverage, 
//          powerConsumption.maximum, powerConsumption.typical,
//          physical.totalWeight, preview.svg
```

---

## 🏗️ Project Structure

```
led-calculator-api/
├── src/                          # Backend source code
│   ├── server.ts                 # Express server entry
│   ├── routes/                   # API routes
│   │   ├── calculator.ts         # Calculation endpoints
│   │   └── preview.ts            # Preview endpoints
│   ├── middleware/               # Middleware
│   │   ├── validation.ts         # Request validation
│   │   └── errorHandler.ts       # Error handling
│   ├── utils/                    # Calculation algorithms
│   │   ├── configurator-calculator.ts
│   │   └── svg-generator.ts
│   └── types/                    # TypeScript types
│
├── frontend/                     # Vue 3 frontend documentation site
│   ├── src/
│   │   ├── views/                # Page components
│   │   │   ├── HomePage.vue      # Home page
│   │   │   ├── TestPage.vue      # API test
│   │   │   ├── ApiReference.vue  # API documentation
│   │   │   └── VueIntegration.vue # Vue integration guide
│   │   ├── components/           # Common components
│   │   ├── i18n/                 # Internationalization (zh/en)
│   │   └── styles/               # Styles
│   └── public/
│
├── public/                       # Static assets
│   └── docs-app/                 # Vue build output
│
├── dist/                         # Backend build output
└── docs/                         # Development documentation
```

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x
- **Validation**: Custom middleware
- **CORS**: Configurable cross-origin

### Frontend Documentation Site
- **Framework**: Vue 3.4+ (Composition API)
- **Build**: Vite 5.x
- **Routing**: Vue Router 4.x
- **i18n**: vue-i18n 9.x
- **Styling**: TailwindCSS 3.x
- **Design**: Apple-style UI

---

## 🌐 Internationalization Support

Both API and documentation site support Chinese/English switching:

### API Preview Language
```json
{
  "previewOptions": {
    "language": "en" // or "zh"
  }
}
```

### Documentation Site
Click the language switch button in the top right corner to switch between Chinese/English

---

## 📝 API Endpoints List

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/calculate/single` | Single cabinet calculation |
| POST | `/api/calculate/multi` | Multi-cabinet calculation |
| POST | `/api/calculate/optimal-layout` | Optimal layout |
| POST | `/api/calculate/smart-combination` | Smart combination |
| POST | `/api/calculate/optimal-layout-with-preview` | One-click layout + preview |
| POST | `/api/calculate/smart-combination-with-preview` | One-click combination + preview |
| POST | `/api/preview/svg` | SVG preview generation |

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t led-calculator-api .
```

### Run Container

```bash
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e CORS_ORIGINS=https://your-domain.com \
  --name led-calculator-api \
  led-calculator-api
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Service port |
| `NODE_ENV` | development | Environment mode |
| `LOG_LEVEL` | info | Log level |
| `CORS_ORIGINS` | * | Allowed CORS origins |

---

## 📖 Detailed Documentation

- [📋 API Features List](./docs/API-FEATURES.md)
- [🚀 Quick Start Guide](./docs/QUICK-START.md)
- [💻 Integration Examples](./docs/INTEGRATION-EXAMPLES.md)
- [🧪 Testing Guide](./docs/TESTING-GUIDE.md)
- [📝 Rebuild Plan](./docs/REBUILD-PLAN.md)

---

## 📄 License

This project is licensed under **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International).

### ⚠️ Important Notice

- ✅ **Allowed**: Share, modify, and adapt this work
- ✅ **Allowed**: Personal learning, education, and research purposes
- ❌ **Prohibited**: Any commercial use
- ❌ **Prohibited**: Selling this software or derivatives
- ❌ **Prohibited**: Use in commercial products/services

### Commercial License

For commercial licensing, please contact the designer: **Zora (u0015098@unilumin.com)**

📜 [View Full License](./LICENSE) | 🔗 [CC BY-NC-SA 4.0 Official](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

**© 2025 Unilumin. Designed by Zora (u0015098@unilumin.com).**
