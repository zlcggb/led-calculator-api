<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CodeBlock from '../components/CodeBlock.vue'

const { t } = useI18n()

const tocItems: Array<{ id: string; key?: string; label?: string }> = [
  { id: 'overview', key: 'vue.toc.overview' },
  { id: 'step1', key: 'vue.toc.step1' },
  { id: 'step2', key: 'vue.toc.step2' },
  { id: 'step3', key: 'vue.toc.step3' },
  { id: 'step4', key: 'vue.toc.step4' },
  { id: 'usage-modes', key: 'vue.toc.usageModes' },
  { id: 'complete', key: 'vue.toc.complete' },
  { id: 'tips', key: 'vue.toc.tips' },
]

const apiServiceCode = `const API_BASE = 'https://led-api.unilumin-gtm.com';

// Common request method
async function request<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(\`\${API_BASE}\${endpoint}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  return response.json();
}

// Single cabinet one-click calculation + preview
export async function calculateOptimalLayoutWithPreview(
  cabinetSpecs: CabinetSpecs,
  roomConfig: RoomConfig,
  previewOptions?: PreviewOptions
): Promise<OptimalLayoutWithPreviewResponse> {
  return request('/api/calculate/optimal-layout-with-preview', {
    cabinetSpecs,
    roomConfig,
    previewOptions: previewOptions || {
      showDimensions: true,
      showPerson: true,
      canvasWidth: 800,
      canvasHeight: 500,
      language: 'en',
    },
  });
}

// 🧩 Multi-cabinet smart combination + preview
export async function calculateSmartCombinationWithPreview(
  mainCabinet: { id: string; specs: CabinetSpecs },
  auxiliaryCabinets: Array<{ id: string; specs: CabinetSpecs }>,
  wallWidthMm: number,
  wallHeightMm: number,
  arrangementDirection?: 'left-to-right' | 'right-to-left',  // 🎯 排列方向
  previewOptions?: PreviewOptions
): Promise<SmartCombinationWithPreviewResponse> {
  return request('/api/calculate/smart-combination-with-preview', {
    mainCabinet,
    auxiliaryCabinets,
    wallWidthMm,
    wallHeightMm,
    arrangementDirection: arrangementDirection || 'left-to-right',  // 默认从左到右
    previewOptions: previewOptions || {
      showDimensions: true,
      showPerson: true,
      canvasWidth: 800,
      canvasHeight: 500,
      language: 'en',
    },
  });
}`

const typeDefinitionsCode = `// Cabinet Specifications
export interface CabinetSpecs {
  dimensions: {
    width: number;   // Cabinet width (mm)
    height: number;  // Cabinet height (mm)
    depth?: number;  // Cabinet depth (mm)
  };
  display: {
    pixelPitch: number;  // Pixel pitch (mm)
    resolution: {
      width: number;   // Horizontal resolution (px)
      height: number;  // Vertical resolution (px)
    };
    brightness?: number;
    refreshRate?: number;
  };
  // Optional: If provided, powerConsumption will be returned
  power?: {
    maxPower: number;       // Max power (W)
    typicalPower?: number;  // Typical power (W)
    standbyPower?: number;  // Standby power (W)
  };
  // Optional: If provided, physical stats will be returned
  physical?: {
    weight: number;  // Weight (kg)
  };
}

// Wall Configuration
export interface RoomConfig {
  dimensions: {
    width: number;
    height: number;
  };
  unit: 'meters' | 'feet';
  wallType?: 'flat';
}

// Preview Options
export interface PreviewOptions {
  showDimensions?: boolean;
  showPerson?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  language?: 'zh' | 'en';
}`

const composableCode = `import { ref, computed } from 'vue';
import { calculateOptimalLayoutWithPreview } from '@/api/ledCalculator';

export function useLedCalculator() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const result = ref<OptimalLayoutWithPreviewData | null>(null);
  
  const previewSvg = computed(() => result.value?.preview?.svg || null);

  async function calculateOptimal(
    cabinetSpecs: CabinetSpecs,
    roomConfig: RoomConfig,
    previewOptions?: PreviewOptions
  ) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await calculateOptimalLayoutWithPreview(
        cabinetSpecs,
        roomConfig,
        previewOptions
      );
      
      if (response.success) {
        result.value = response.data;
        return response.data;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    result,
    previewSvg,
    calculateOptimal,
  };
}`

const componentCode = `<script setup lang="ts">
import { reactive } from 'vue';
import { useLedCalculator } from '@/composables/useLedCalculator';

const { loading, error, previewSvg, calculateOptimal } = useLedCalculator();

const form = reactive({
  width: 500,
  height: 1000,
  pixelPitch: 1.5625,
  wallWidth: 5,
  wallHeight: 3,
});

// Full calculation with power/weight stats
async function handleCalculateFull() {
  await calculateOptimal(
    {
      dimensions: { width: form.width, height: form.height },
      display: {
        pixelPitch: form.pixelPitch,
        resolution: {
          width: Math.floor(form.width / form.pixelPitch),
          height: Math.floor(form.height / form.pixelPitch),
        },
      },
      // Optional: Include for power stats
      power: { maxPower: 180, typicalPower: 60 },
      // Optional: Include for weight stats
      physical: { weight: 10.5 },
    },
    {
      dimensions: { width: form.wallWidth, height: form.wallHeight },
      unit: 'meters',
    }
  );
}

// Layout-only calculation (without power/weight)
async function handleCalculateLayoutOnly() {
  await calculateOptimal(
    {
      dimensions: { width: form.width, height: form.height },
      display: {
        pixelPitch: form.pixelPitch,
        resolution: {
          width: Math.floor(form.width / form.pixelPitch),
          height: Math.floor(form.height / form.pixelPitch),
        },
      },
      // No power/physical → Response won't include powerConsumption/physical
    },
    {
      dimensions: { width: form.wallWidth, height: form.wallHeight },
      unit: 'meters',
    }
  );
}
<\/script>

<template>
  <div class="calculator">
    <form @submit.prevent="handleCalculate">
      <!-- Form fields... -->
      <button :disabled="loading">
        {{ loading ? 'Calculating...' : 'Calculate' }}
      </button>
    </form>
    
    <div v-if="previewSvg" v-html="previewSvg" />
    <div v-if="error">{{ error }}</div>
  </div>
</template>`

// Layout-only mode example (without power/weight)
const layoutOnlyExample = `// 📐 Layout-Only Mode - Minimal data, faster response
const cabinetSpecs = {
  dimensions: { width: 500, height: 1000, depth: 40 },
  display: {
    pixelPitch: 1.5625,
    resolution: { width: 320, height: 640 },
    brightness: 1000,
    refreshRate: 5760,
  },
  // ❌ No power - won't return powerConsumption
  // ❌ No physical - won't return physical stats
};

const result = await calculateOptimalLayoutWithPreview(cabinetSpecs, roomConfig);
// ✅ Returns: columns, rows, totalCabinets, wallWidth, wallHeight, coverage
// ❌ No powerConsumption, no physical in response`

// Full mode example (with power/weight)
const fullModeExample = `// ⚡ Full Mode - Complete data with power & weight stats
const cabinetSpecs = {
  dimensions: { width: 500, height: 1000, depth: 40 },
  display: {
    pixelPitch: 1.5625,
    resolution: { width: 320, height: 640 },
    brightness: 1000,
    refreshRate: 5760,
  },
  // ✅ Include power → returns powerConsumption
  power: {
    maxPower: 180,      // W - Maximum power
    typicalPower: 60,   // W - Typical power
    standbyPower: 5,    // W - Standby power (optional)
  },
  // ✅ Include physical → returns physical stats
  physical: {
    weight: 10.5,       // kg - Cabinet weight
  },
};

const result = await calculateOptimalLayoutWithPreview(cabinetSpecs, roomConfig);
// ✅ Returns: columns, rows, totalCabinets, wallWidth, wallHeight, coverage
// ✅ Also returns: powerConsumption.maximum, powerConsumption.typical
// ✅ Also returns: physical.totalWeight`

// Response comparison example
const responseComparison = `// 📊 Response Comparison

// Layout-Only Response:
{
  "success": true,
  "data": {
    "columns": 10,
    "rows": 3,
    "totalCabinets": 30,
    "wallWidth": 5000,
    "wallHeight": 3000,
    "coverage": 1.0,
    "preview": { "svg": "..." }
    // No powerConsumption
    // No physical
  }
}

// Full Mode Response:
{
  "success": true,
  "data": {
    "columns": 10,
    "rows": 3,
    "totalCabinets": 30,
    "wallWidth": 5000,
    "wallHeight": 3000,
    "coverage": 1.0,
    "preview": { "svg": "..." },
    "powerConsumption": {   // ⚡ Added when power provided
      "maximum": 5400,      // 30 cabinets × 180W
      "typical": 1800       // 30 cabinets × 60W
    },
    "physical": {           // 📦 Added when physical provided
      "totalWeight": 315    // 30 cabinets × 10.5kg
    }
  }
}`

// 🧩 Multi-cabinet smart combination example with arrangement direction
const multiCabinetExample = `// 🧩 Multi-Cabinet Smart Combination
// Automatically finds optimal cabinet combination for wall coverage

import { calculateSmartCombinationWithPreview } from '@/api/ledCalculator';

// Main cabinet (largest size, highest priority)
const mainCabinet = {
  id: 'uslimiii-500x1000',
  specs: {
    dimensions: { width: 500, height: 1000, depth: 40 },
    display: {
      pixelPitch: 1.5625,
      resolution: { width: 320, height: 640 },
      brightness: 1000,
      refreshRate: 5760,
    },
    power: { maxPower: 180, typicalPower: 60 },
    physical: { weight: 10.5 },
  },
};

// Auxiliary cabinets (same pixel pitch, different sizes)
const auxiliaryCabinets = [
  {
    id: 'uslimiii-500x500',
    specs: {
      dimensions: { width: 500, height: 500, depth: 40 },
      display: { pixelPitch: 1.5625, resolution: { width: 320, height: 320 } },
      power: { maxPower: 90, typicalPower: 30 },
      physical: { weight: 5.4 },
    },
  },
  {
    id: 'uslimiii-250x500',
    specs: {
      dimensions: { width: 250, height: 500, depth: 40 },
      display: { pixelPitch: 1.5625, resolution: { width: 160, height: 320 } },
      power: { maxPower: 45, typicalPower: 15 },
      physical: { weight: 3.5 },
    },
  },
];

// 🎯 Arrangement Direction Options:
// - 'left-to-right': Cabinets arranged from left to right (default)
// - 'right-to-left': Cabinets arranged from right to left (mirror layout)

const result = await calculateSmartCombinationWithPreview(
  mainCabinet,
  auxiliaryCabinets,
  4300,  // wallWidthMm
  3300,  // wallHeightMm
  'left-to-right',  // 🎯 arrangementDirection
  { showDimensions: true, showPerson: true, language: 'zh' }
);

// Response includes:
// - bestCombination: [{ id, count }, ...]
// - coveragePercentage: "100%"
// - isFullyFilled: true
// - calculationResult.arrangement.arrangementDirection: "left-to-right"
// - preview.svg: SVG string`

// Complete integration example
const completeIntegrationExample = `<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { calculateOptimalLayoutWithPreview } from '@/api/ledCalculator';

// Form state
const form = reactive({
  cabinetWidth: 500,
  cabinetHeight: 1000,
  pixelPitch: 1.5625,
  wallWidth: 5,
  wallHeight: 3,
  // Optional parameters - user can toggle
  includePower: true,
  includeWeight: true,
  maxPower: 180,
  typicalPower: 60,
  weight: 10.5,
});

const loading = ref(false);
const result = ref(null);
const previewSvg = computed(() => result.value?.preview?.svg);

// Build cabinet specs based on user selection
function buildCabinetSpecs() {
  const specs: any = {
    dimensions: {
      width: form.cabinetWidth,
      height: form.cabinetHeight,
      depth: 40,
    },
    display: {
      pixelPitch: form.pixelPitch,
      resolution: {
        width: Math.floor(form.cabinetWidth / form.pixelPitch),
        height: Math.floor(form.cabinetHeight / form.pixelPitch),
      },
      brightness: 1000,
      refreshRate: 5760,
    },
  };

  // Only add power if user wants power stats
  if (form.includePower) {
    specs.power = {
      maxPower: form.maxPower,
      typicalPower: form.typicalPower,
    };
  }

  // Only add physical if user wants weight stats
  if (form.includeWeight) {
    specs.physical = {
      weight: form.weight,
    };
  }

  return specs;
}

async function calculate() {
  loading.value = true;
  try {
    const response = await calculateOptimalLayoutWithPreview(
      buildCabinetSpecs(),
      {
        dimensions: { width: form.wallWidth, height: form.wallHeight },
        unit: 'meters',
      },
      { showDimensions: true, showPerson: true, language: 'zh' }
    );
    result.value = response.data;
  } catch (e) {
    console.error('Calculation failed:', e);
  } finally {
    loading.value = false;
  }
}
<\/script>

<template>
  <div class="led-calculator">
    <!-- Cabinet Parameters -->
    <div class="form-section">
      <h3>📦 Cabinet Specs</h3>
      <input v-model.number="form.cabinetWidth" placeholder="Width (mm)" />
      <input v-model.number="form.cabinetHeight" placeholder="Height (mm)" />
      <input v-model.number="form.pixelPitch" placeholder="Pixel Pitch" />
    </div>

    <!-- Wall Dimensions -->
    <div class="form-section">
      <h3>📐 Wall Dimensions</h3>
      <input v-model.number="form.wallWidth" placeholder="Width (m)" />
      <input v-model.number="form.wallHeight" placeholder="Height (m)" />
    </div>

    <!-- Optional: Power & Weight -->
    <div class="form-section">
      <h3>⚙️ Optional Parameters</h3>
      <label>
        <input type="checkbox" v-model="form.includePower" />
        Include Power Stats
      </label>
      <div v-if="form.includePower">
        <input v-model.number="form.maxPower" placeholder="Max Power (W)" />
        <input v-model.number="form.typicalPower" placeholder="Typical Power (W)" />
      </div>
      
      <label>
        <input type="checkbox" v-model="form.includeWeight" />
        Include Weight Stats
      </label>
      <div v-if="form.includeWeight">
        <input v-model.number="form.weight" placeholder="Weight (kg)" />
      </div>
    </div>

    <button @click="calculate" :disabled="loading">
      {{ loading ? 'Calculating...' : '🚀 Calculate' }}
    </button>

    <!-- Results -->
    <div v-if="result" class="results">
      <p>Columns: {{ result.columns }} | Rows: {{ result.rows }}</p>
      <p>Total: {{ result.totalCabinets }} cabinets</p>
      
      <!-- Power stats (only if provided) -->
      <div v-if="result.powerConsumption">
        <p>⚡ Max Power: {{ result.powerConsumption.maximum }}W</p>
        <p>⚡ Typical: {{ result.powerConsumption.typical }}W</p>
      </div>
      
      <!-- Weight stats (only if provided) -->
      <div v-if="result.physical">
        <p>📦 Total Weight: {{ result.physical.totalWeight }}kg</p>
      </div>
      
      <!-- SVG Preview -->
      <div v-if="previewSvg" v-html="previewSvg" />
    </div>
  </div>
</template>`
</script>

<template>
  <div class="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900 py-8">
    <div class="container-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="section-title">🟢 {{ t('vue.title') }}</h1>
        <p class="section-subtitle mx-auto">{{ t('vue.subtitle') }}</p>
        <div class="flex items-center justify-center gap-2 mt-4">
          <span class="badge bg-apple-green/10 text-apple-green">Vue 3</span>
          <span class="badge bg-blue-500/10 text-blue-500">TypeScript</span>
          <span class="badge bg-purple-500/10 text-purple-500">Composition API</span>
        </div>
      </div>

      <div class="max-w-5xl mx-auto">
        <!-- Table of Contents -->
        <div class="card p-6 mb-8">
          <h2 class="text-lg font-semibold text-apple-green mb-4">{{ t('vue.toc.title') }}</h2>
          <div class="grid md:grid-cols-2 gap-2">
            <a
              v-for="(item, index) in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/50 transition-colors"
            >
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-apple-green/10 text-apple-green text-sm font-medium">
                {{ index }}
              </span>
              <span class="text-apple-gray-700 dark:text-apple-gray-300">{{ item.label || (item.key ? t(item.key) : '') }}</span>
            </a>
          </div>
        </div>

        <!-- Overview Section -->
        <section id="overview" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">0</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.overview.title') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ t('vue.overview.description') }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ t('vue.overview.techStack') }}
          </h3>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center gap-2">
              <span class="badge bg-apple-green/10 text-apple-green">Vue 3.x</span>
              <span class="text-apple-gray-500">Composition API</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="badge bg-blue-500/10 text-blue-500">TypeScript 5.x</span>
              <span class="text-apple-gray-500">{{ t('vue.overview.recommended') }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="badge bg-purple-500/10 text-purple-500">Vite</span>
              <span class="text-apple-gray-500">Build tool</span>
            </li>
          </ul>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ t('vue.overview.projectStructure') }}
          </h3>
          <div class="code-block">
            <pre class="p-4 text-sm leading-relaxed text-apple-gray-300"><code><span class="text-apple-green">src/</span>
├── <span class="text-apple-green">api/</span>
│   └── <span class="text-apple-gray-400">ledCalculator.ts</span>        <span class="text-apple-gray-500">// API service layer</span>
├── <span class="text-apple-green">types/</span>
│   └── <span class="text-apple-gray-400">ledCalculator.ts</span>        <span class="text-apple-gray-500">// TypeScript types</span>
├── <span class="text-apple-green">composables/</span>
│   └── <span class="text-apple-gray-400">useLedCalculator.ts</span>    <span class="text-apple-gray-500">// Vue Composable</span>
├── <span class="text-apple-green">components/</span>
│   ├── <span class="text-apple-gray-400">LedCalculator.vue</span>       <span class="text-apple-gray-500">// Calculator component</span>
│   └── <span class="text-apple-gray-400">LedPreview.vue</span>          <span class="text-apple-gray-500">// Preview component</span>
└── <span class="text-apple-green">views/</span>
    └── <span class="text-apple-gray-400">LedConfigPage.vue</span>       <span class="text-apple-gray-500">// Complete page</span></code></pre>
          </div>
        </section>

        <!-- Step 1: API Service -->
        <section id="step1" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">1</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.toc.step1') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            Create a unified API service file to encapsulate all interaction logic with LED Calculator API.
          </p>

          <CodeBlock :code="apiServiceCode" language="typescript" filename="src/api/ledCalculator.ts" />

          <div class="alert-info mt-6">
            <div>
              <div class="font-semibold text-primary mb-1">💡 Tip</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                Recommend using *WithPreview interfaces to get both calculation results and preview in one request.
              </p>
            </div>
          </div>
        </section>

        <!-- Step 2: Type Definitions -->
        <section id="step2" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">2</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.toc.step2') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            Define TypeScript interfaces to ensure type safety and code hints.
          </p>

          <CodeBlock :code="typeDefinitionsCode" language="typescript" filename="src/types/ledCalculator.ts" />
        </section>

        <!-- Step 3: Composable -->
        <section id="step3" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">3</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.toc.step3') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            Create Vue 3 Composable to encapsulate state management and API call logic for easy reuse in components.
          </p>

          <CodeBlock :code="composableCode" language="typescript" filename="src/composables/useLedCalculator.ts" />
        </section>

        <!-- Step 4: Component -->
        <section id="step4" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">4</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.toc.step4') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            Create a complete LED calculator form component with cabinet parameter input and wall dimension configuration.
          </p>

          <CodeBlock :code="componentCode" language="vue" filename="src/components/LedCalculator.vue" />
        </section>

        <!-- Usage Modes Section - NEW -->
        <section id="usage-modes" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-orange/10 text-apple-orange text-lg font-bold">📐</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.usageModes.title') }}
            </h2>
          </div>

          <!-- Mode Comparison Cards -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- Layout-Only Mode -->
            <div class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-apple border-2 border-blue-200 dark:border-blue-800">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">📐</span>
                <h3 class="text-lg font-bold text-blue-700 dark:text-blue-300">{{ t('vue.usageModes.layoutOnly.title') }}</h3>
              </div>
              <p class="text-sm text-blue-600 dark:text-blue-400 mb-4">{{ t('vue.usageModes.layoutOnly.subtitle') }}</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-blue-500">✓</span> {{ t('vue.usageModes.layoutOnly.minData') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-blue-500">✓</span> {{ t('vue.usageModes.layoutOnly.fastResponse') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-blue-500">✓</span> {{ t('vue.usageModes.layoutOnly.returnLayout') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-400">
                  <span class="text-gray-400">✗</span> {{ t('vue.usageModes.layoutOnly.noPower') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-400">
                  <span class="text-gray-400">✗</span> {{ t('vue.usageModes.layoutOnly.noWeight') }}
                </li>
              </ul>
              <div class="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                <code class="text-xs text-blue-700 dark:text-blue-300">{{ t('vue.usageModes.layoutOnly.hint') }}</code>
              </div>
            </div>

            <!-- Full Mode -->
            <div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-apple border-2 border-green-200 dark:border-green-800">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">⚡</span>
                <h3 class="text-lg font-bold text-green-700 dark:text-green-300">{{ t('vue.usageModes.fullMode.title') }}</h3>
              </div>
              <p class="text-sm text-green-600 dark:text-green-400 mb-4">{{ t('vue.usageModes.fullMode.subtitle') }}</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-green-500">✓</span> {{ t('vue.usageModes.fullMode.fullData') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-green-500">✓</span> {{ t('vue.usageModes.fullMode.returnLayout') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-green-500">✓</span> {{ t('vue.usageModes.fullMode.returnPower') }}
                </li>
                <li class="flex items-center gap-2 text-apple-gray-600 dark:text-apple-gray-400">
                  <span class="text-green-500">✓</span> {{ t('vue.usageModes.fullMode.returnWeight') }}
                </li>
              </ul>
              <div class="mt-4 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                <code class="text-xs text-green-700 dark:text-green-300">{{ t('vue.usageModes.fullMode.hint') }}</code>
              </div>
            </div>
          </div>

          <!-- Layout-Only Code Example -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            📐 {{ t('vue.usageModes.layoutOnlyMode') }}
          </h3>
          <CodeBlock :code="layoutOnlyExample" language="typescript" filename="Layout-Only Example" />

          <!-- Full Mode Code Example -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            ⚡ {{ t('vue.usageModes.fullModeTitle') }}
          </h3>
          <CodeBlock :code="fullModeExample" language="typescript" filename="Full Mode Example" />

          <!-- Response Comparison -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            📊 {{ t('vue.usageModes.responseComparison') }}
          </h3>
          <CodeBlock :code="responseComparison" language="json" filename="Response Comparison" />

          <!-- 🧩 Multi-Cabinet Smart Combination -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            🧩 Multi-Cabinet Smart Combination
          </h3>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-4">
            Use multiple cabinet sizes to achieve optimal wall coverage. Supports <code class="inline-code">arrangementDirection</code> parameter to control cabinet arrangement direction.
          </p>
          
          <!-- Arrangement Direction Info -->
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-apple border border-blue-200 dark:border-blue-800">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span class="font-semibold text-blue-700 dark:text-blue-300">left-to-right</span>
              </div>
              <p class="text-sm text-blue-600 dark:text-blue-400">Cabinets arranged from left to right (default)</p>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-apple border border-purple-200 dark:border-purple-800">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span class="font-semibold text-purple-700 dark:text-purple-300">right-to-left</span>
              </div>
              <p class="text-sm text-purple-600 dark:text-purple-400">Cabinets arranged from right to left (mirror layout)</p>
            </div>
          </div>
          
          <CodeBlock :code="multiCabinetExample" language="typescript" filename="Multi-Cabinet Example" />

          <!-- Key Points -->
          <div class="alert-warning mt-8">
            <div>
              <div class="font-semibold text-apple-yellow mb-2">💡 {{ t('vue.usageModes.keyPoints') }}</div>
              <ul class="space-y-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                <li class="flex items-start gap-2">
                  <span class="text-apple-yellow">•</span>
                  <span>{{ t('vue.usageModes.keyPoint1') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-apple-yellow">•</span>
                  <span>{{ t('vue.usageModes.keyPoint2') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-apple-yellow">•</span>
                  <span>{{ t('vue.usageModes.keyPoint3') }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-apple-yellow">•</span>
                  <span>{{ t('vue.usageModes.keyPoint4') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Complete Integration Example Section -->
        <section id="complete" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">6</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.toc.complete') }}
            </h2>
          </div>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ t('vue.usageModes.completeExample') }}
          </p>

          <CodeBlock :code="completeIntegrationExample" language="vue" filename="src/components/LedCalculatorComplete.vue" />

          <div class="alert-success mt-6">
            <div>
              <div class="font-semibold text-apple-green mb-1">✅ {{ t('vue.usageModes.features') }}</div>
              <ul class="space-y-1 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                <li>• {{ t('vue.usageModes.feature1') }}</li>
                <li>• {{ t('vue.usageModes.feature2') }}</li>
                <li>• {{ t('vue.usageModes.feature3') }}</li>
                <li>• {{ t('vue.usageModes.feature4') }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Tips Section -->
        <section id="tips" class="card p-8 mb-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-apple-green/10 text-apple-green text-lg font-bold">7</span>
            <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">
              {{ t('vue.tips.title') }}
            </h2>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-3">
                {{ t('vue.tips.errorHandling') }}
              </h3>
              <p class="text-apple-gray-600 dark:text-apple-gray-400">
                Recommend unified error handling in API service layer with friendly error messages.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-3">
                {{ t('vue.tips.performance') }}
              </h3>
              <ul class="space-y-2 text-apple-gray-600 dark:text-apple-gray-400">
                <li class="flex items-start gap-2">
                  <span class="text-apple-green">✓</span>
                  Use *WithPreview one-click interfaces to reduce network requests
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-apple-green">✓</span>
                  Cache calculation results to avoid repeated calculations
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-apple-green">✓</span>
                  Use debounce for user input to avoid frequent requests
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-3">
                {{ t('vue.tips.i18n') }}
              </h3>
              <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-3">
                API supports Chinese and English preview images, controlled by previewOptions.language parameter.
              </p>
              <div class="code-block">
                <pre class="p-4 text-sm leading-relaxed text-apple-gray-300"><code><span class="text-purple-400">const</span> <span class="text-blue-300">previewOptions</span> = {
  <span class="text-blue-300">showDimensions</span>: <span class="text-orange-300">true</span>,
  <span class="text-blue-300">showPerson</span>: <span class="text-orange-300">true</span>,
  <span class="text-blue-300">language</span>: <span class="text-blue-300">locale</span>.<span class="text-blue-300">value</span> === <span class="text-green-300">'en'</span> ? <span class="text-green-300">'en'</span> : <span class="text-green-300">'zh'</span>,
};</code></pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>


