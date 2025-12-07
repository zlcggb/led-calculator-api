<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Tab state
const activeTab = ref('layout')

// API status
const isApiOnline = ref<boolean | null>(null)

// Cabinet data
const cabinetData = [
  // UslimIII MIP 1.5 Series
  {
    id: "uslimiii-mip-15-500x1000",
    name: "UslimIII MIP 1.5 (500×1000)",
    family: "UslimIII",
    dimensions: { width: 500, height: 1000, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 320, height: 640 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 180, typicalPower: 60, standbyPower: 5 },
    physical: { weight: 10.5 }
  },
  {
    id: "uslimiii-mip-15-500x500",
    name: "UslimIII MIP 1.5 (500×500)",
    family: "UslimIII",
    dimensions: { width: 500, height: 500, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 320, height: 320 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 90, typicalPower: 30, standbyPower: 3 },
    physical: { weight: 5.4 }
  },
  {
    id: "uslimiii-mip-15-500x250",
    name: "UslimIII MIP 1.5 (500×250)",
    family: "UslimIII",
    dimensions: { width: 500, height: 250, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 320, height: 160 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 45, typicalPower: 15, standbyPower: 2 },
    physical: { weight: 3.5 }
  },
  {
    id: "uslimiii-mip-15-250x500",
    name: "UslimIII MIP 1.5 (250×500)",
    family: "UslimIII",
    dimensions: { width: 250, height: 500, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 160, height: 320 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 45, typicalPower: 15, standbyPower: 2 },
    physical: { weight: 3.5 }
  },
  {
    id: "uslimiii-mip-15-250x750",
    name: "UslimIII MIP 1.5 (250×750)",
    family: "UslimIII",
    dimensions: { width: 250, height: 750, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 160, height: 480 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 67.5, typicalPower: 22.5, standbyPower: 2 },
    physical: { weight: 4.5 }
  },
  {
    id: "uslimiii-mip-15-750x250",
    name: "UslimIII MIP 1.5 (750×250)",
    family: "UslimIII",
    dimensions: { width: 750, height: 250, depth: 40 },
    display: { pixelPitch: 1.5625, resolution: { width: 480, height: 160 }, brightness: 1000, refreshRate: 5760 },
    power: { maxPower: 67.5, typicalPower: 22.5, standbyPower: 2 },
    physical: { weight: 4.5 }
  },
  // UMiniW 0.9 Series
  {
    id: "uminiw-09-600x337",
    name: "UMiniW 0.9 (600×337.5)",
    family: "UMiniW",
    dimensions: { width: 600, height: 337.5, depth: 29.8 },
    display: { pixelPitch: 0.9375, resolution: { width: 640, height: 360 }, brightness: 600, refreshRate: 3840 },
    power: { maxPower: 60, typicalPower: 42, standbyPower: 3 },
    physical: { weight: 4.3 }
  },
  {
    id: "uminiw-09-300x337",
    name: "UMiniW 0.9 (300×337.5)",
    family: "UMiniW",
    dimensions: { width: 300, height: 337.5, depth: 29.8 },
    display: { pixelPitch: 0.9375, resolution: { width: 320, height: 360 }, brightness: 600, refreshRate: 3840 },
    power: { maxPower: 30, typicalPower: 21, standbyPower: 2 },
    physical: { weight: 2.5 }
  }
]

// ==================== Layout Tab ====================
const layoutForm = reactive({
  cabinetId: '',
  wallWidth: 5,
  wallHeight: 3,
  unit: 'meters',
  includePower: true,
  includeWeight: true
})
const layoutLoading = ref(false)
const layoutResult = ref<any>(null)
const layoutError = ref<string | null>(null)
const layoutPreviewSvg = ref<string | null>(null)

const selectedLayoutCabinet = computed(() => cabinetData.find(c => c.id === layoutForm.cabinetId))

// ==================== Smart Combination Tab ====================
const smartForm = reactive({
  mainCabinetId: '',
  auxiliaryCabinetIds: [] as string[],
  wallWidthMm: 4300,
  wallHeightMm: 3300,
  includePower: true,
  includeWeight: true
})
const smartLoading = ref(false)
const smartResult = ref<any>(null)
const smartError = ref<string | null>(null)
const smartPreviewSvg = ref<string | null>(null)

const selectedMainCabinet = computed(() => cabinetData.find(c => c.id === smartForm.mainCabinetId))
const sameFamilyCabinets = computed(() => {
  if (!selectedMainCabinet.value) return []
  return cabinetData.filter(c => c.id !== smartForm.mainCabinetId && c.family === selectedMainCabinet.value!.family)
})

// ==================== One-Click Tab ====================
const oneclickMode = ref<'single' | 'multi'>('single')
const oneclickForm = reactive({
  cabinetId: '',
  wallWidth: 5,
  wallHeight: 3,
  unit: 'meters',
  autoAux: true,
  showDimensions: true,
  showPerson: true,
  includePower: true,
  includeWeight: true
})
const oneclickLoading = ref(false)
const oneclickResult = ref<any>(null)
const oneclickError = ref<string | null>(null)
const oneclickPreviewSvg = ref<string | null>(null)

const selectedOneclickCabinet = computed(() => cabinetData.find(c => c.id === oneclickForm.cabinetId))

// ==================== Preview Tab ====================
const previewForm = reactive({
  source: '',
  canvasWidth: 800,
  canvasHeight: 500,
  showDimensions: true,
  showPerson: true
})
const previewLoading = ref(false)
const previewSvg = ref<string | null>(null)
const previewError = ref<string | null>(null)

// Store calculation results for preview
const calculationResults = reactive<Record<string, any>>({})

// Check API status
onMounted(async () => {
  try {
    const response = await fetch('/health')
    isApiOnline.value = response.ok
  } catch {
    isApiOnline.value = false
  }
})

// Convert cabinet to API format with optional power/physical
function convertToApiFormat(cabinet: any, options: { includePower?: boolean, includeWeight?: boolean } = {}) {
  const { includePower = true, includeWeight = true } = options
  
  const result: any = {
    dimensions: cabinet.dimensions,
    display: {
      pixelPitch: cabinet.display.pixelPitch,
      resolution: cabinet.display.resolution,
      brightness: cabinet.display.brightness,
      refreshRate: cabinet.display.refreshRate,
      colorDepth: 16
    }
  }
  
  // Only include power if option is enabled
  if (includePower) {
    result.power = {
      maxPower: cabinet.power.maxPower,
      typicalPower: cabinet.power.typicalPower,
      standbyPower: cabinet.power.standbyPower || 5
    }
  }
  
  // Only include physical if option is enabled
  if (includeWeight) {
    result.physical = {
      weight: cabinet.physical.weight,
      operatingTemp: { min: 0, max: 45 },
      humidity: { min: 10, max: 90 },
      ipRating: "IP30"
    }
  }
  
  return result
}

// ==================== Layout Functions ====================
async function calculateLayout() {
  if (!selectedLayoutCabinet.value) {
    layoutError.value = t('test.layout.selectCabinet')
    return
  }

  layoutLoading.value = true
  layoutError.value = null
  layoutResult.value = null
  layoutPreviewSvg.value = null

  try {
    const response = await fetch('/api/calculate/optimal-layout-with-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cabinetSpecs: convertToApiFormat(selectedLayoutCabinet.value, {
          includePower: layoutForm.includePower,
          includeWeight: layoutForm.includeWeight
        }),
        roomConfig: {
          dimensions: { width: layoutForm.wallWidth, height: layoutForm.wallHeight },
          unit: layoutForm.unit,
          wallType: 'flat'
        },
        previewOptions: {
          showDimensions: true,
          showPerson: true,
          canvasWidth: 800,
          canvasHeight: 500,
          language: locale.value
        }
      })
    })

    const data = await response.json()
    
    if (data.success) {
      layoutResult.value = data.data
      layoutPreviewSvg.value = data.data.preview?.svg || null
      // Store for preview tab
      calculationResults.layout = {
        result: data.data.calculationResult,
        roomConfig: { dimensions: { width: layoutForm.wallWidth, height: layoutForm.wallHeight }, unit: layoutForm.unit },
        cabinet: selectedLayoutCabinet.value
      }
    } else {
      layoutError.value = data.error?.message || t('test.results.error')
    }
  } catch (e) {
    layoutError.value = e instanceof Error ? e.message : t('test.results.error')
  } finally {
    layoutLoading.value = false
  }
}

// ==================== Smart Combination Functions ====================
function onMainCabinetChange() {
  // Auto-select same family cabinets
  if (selectedMainCabinet.value) {
    smartForm.auxiliaryCabinetIds = sameFamilyCabinets.value.map(c => c.id)
  } else {
    smartForm.auxiliaryCabinetIds = []
  }
}

async function calculateSmart() {
  if (!selectedMainCabinet.value) {
    smartError.value = t('test.layout.selectCabinet')
    return
  }

  if (smartForm.auxiliaryCabinetIds.length === 0) {
    smartError.value = 'Please select at least one auxiliary cabinet'
    return
  }

  smartLoading.value = true
  smartError.value = null
  smartResult.value = null
  smartPreviewSvg.value = null

  try {
    const apiOptions = { 
      includePower: smartForm.includePower, 
      includeWeight: smartForm.includeWeight 
    }
    
    const auxiliaryCabinets = smartForm.auxiliaryCabinetIds.map(id => {
      const cab = cabinetData.find(c => c.id === id)!
      return { id: cab.id, specs: convertToApiFormat(cab, apiOptions) }
    })

    const response = await fetch('/api/calculate/smart-combination-with-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mainCabinet: {
          id: selectedMainCabinet.value.id,
          specs: convertToApiFormat(selectedMainCabinet.value, apiOptions)
        },
        auxiliaryCabinets,
        wallWidthMm: smartForm.wallWidthMm,
        wallHeightMm: smartForm.wallHeightMm,
        previewOptions: {
          showDimensions: true,
          showPerson: true,
          canvasWidth: 800,
          canvasHeight: 500,
          language: locale.value
        }
      })
    })

    const data = await response.json()
    
    if (data.success) {
      smartResult.value = data.data
      smartPreviewSvg.value = data.data.preview?.svg || null
      // Store for preview tab
      calculationResults.smart = {
        result: data.data.calculationResult,
        roomConfig: { dimensions: { width: smartForm.wallWidthMm / 1000, height: smartForm.wallHeightMm / 1000 }, unit: 'meters' }
      }
    } else {
      smartError.value = data.error?.message || t('test.results.error')
    }
  } catch (e) {
    smartError.value = e instanceof Error ? e.message : t('test.results.error')
  } finally {
    smartLoading.value = false
  }
}

// ==================== One-Click Functions ====================
async function calculateOneClick() {
  if (!selectedOneclickCabinet.value) {
    oneclickError.value = t('test.layout.selectCabinet')
    return
  }

  oneclickLoading.value = true
  oneclickError.value = null
  oneclickResult.value = null
  oneclickPreviewSvg.value = null

  try {
    const apiOptions = { 
      includePower: oneclickForm.includePower, 
      includeWeight: oneclickForm.includeWeight 
    }
    
    if (oneclickMode.value === 'single') {
      const response = await fetch('/api/calculate/optimal-layout-with-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabinetSpecs: convertToApiFormat(selectedOneclickCabinet.value, apiOptions),
          roomConfig: {
            dimensions: { width: oneclickForm.wallWidth, height: oneclickForm.wallHeight },
            unit: oneclickForm.unit,
            wallType: 'flat'
          },
          previewOptions: {
            showDimensions: oneclickForm.showDimensions,
            showPerson: oneclickForm.showPerson,
            canvasWidth: 800,
            canvasHeight: 500,
            language: locale.value
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        oneclickResult.value = data.data
        oneclickPreviewSvg.value = data.data.preview?.svg || null
      } else {
        oneclickError.value = data.error?.message || t('test.results.error')
      }
    } else {
      // Multi-cabinet mode
      const sameFamilyCabs = cabinetData.filter(c => c.id !== oneclickForm.cabinetId && c.family === selectedOneclickCabinet.value!.family)
      
      if (sameFamilyCabs.length === 0) {
        oneclickError.value = 'No auxiliary cabinets available for this cabinet family'
        return
      }

      let wallWidthMm = oneclickForm.wallWidth * 1000
      let wallHeightMm = oneclickForm.wallHeight * 1000
      if (oneclickForm.unit === 'feet') {
        wallWidthMm = oneclickForm.wallWidth * 304.8
        wallHeightMm = oneclickForm.wallHeight * 304.8
      }

      const response = await fetch('/api/calculate/smart-combination-with-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainCabinet: {
            id: selectedOneclickCabinet.value.id,
            specs: convertToApiFormat(selectedOneclickCabinet.value, apiOptions)
          },
          auxiliaryCabinets: sameFamilyCabs.map(cab => ({
            id: cab.id,
            specs: convertToApiFormat(cab, apiOptions)
          })),
          wallWidthMm: Math.round(wallWidthMm),
          wallHeightMm: Math.round(wallHeightMm),
          previewOptions: {
            showDimensions: oneclickForm.showDimensions,
            showPerson: oneclickForm.showPerson,
            canvasWidth: 800,
            canvasHeight: 500,
            language: locale.value
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        oneclickResult.value = data.data
        oneclickPreviewSvg.value = data.data.preview?.svg || null
      } else {
        oneclickError.value = data.error?.message || t('test.results.error')
      }
    }
  } catch (e) {
    oneclickError.value = e instanceof Error ? e.message : t('test.results.error')
  } finally {
    oneclickLoading.value = false
  }
}

// ==================== Preview Functions ====================
const previewSources = computed(() => {
  const sources: { value: string; label: string }[] = []
  if (calculationResults.layout) {
    sources.push({ value: 'layout', label: '📐 Single Cabinet Layout Result' })
  }
  if (calculationResults.smart) {
    sources.push({ value: 'smart', label: '🧩 Multi-Cabinet Combination Result' })
  }
  return sources
})

async function generatePreview() {
  if (!previewForm.source || !calculationResults[previewForm.source]) {
    previewError.value = 'Please select a calculation result first'
    return
  }

  previewLoading.value = true
  previewError.value = null
  previewSvg.value = null

  try {
    const calcData = calculationResults[previewForm.source]
    
    const response = await fetch('/api/preview/svg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calculationResult: calcData.result,
        roomConfig: calcData.roomConfig,
        options: {
          showDimensions: previewForm.showDimensions,
          showPerson: previewForm.showPerson,
          canvasWidth: previewForm.canvasWidth,
          canvasHeight: previewForm.canvasHeight,
          format: 'json',
          language: locale.value
        }
      })
    })

    const data = await response.json()
    if (data.success) {
      previewSvg.value = data.data.svg
    } else {
      previewError.value = data.error?.message || 'Failed to generate preview'
    }
  } catch (e) {
    previewError.value = e instanceof Error ? e.message : 'Network error'
  } finally {
    previewLoading.value = false
  }
}

function switchTab(tab: string) {
  activeTab.value = tab
}

function getCabinetById(id: string) {
  return cabinetData.find(c => c.id === id)
}
</script>

<template>
  <div class="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900 py-8">
    <div class="container-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="section-title">{{ t('test.title') }}</h1>
        <p class="section-subtitle mx-auto">{{ t('test.subtitle') }}</p>
        
        <!-- API Status -->
        <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple">
          <span 
            class="w-2 h-2 rounded-full"
            :class="isApiOnline === true ? 'bg-apple-green animate-pulse' : isApiOnline === false ? 'bg-apple-red' : 'bg-apple-gray-400'"
          ></span>
          <span class="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300">
            {{ isApiOnline === null ? t('header.checkingStatus') : isApiOnline ? t('header.online') : t('header.offline') }}
          </span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs max-w-3xl mx-auto mb-8">
        <button 
          v-for="tab in ['layout', 'smart', 'preview', 'oneclick']"
          :key="tab"
          class="tab"
          :class="{ 'tab-active': activeTab === tab }"
          @click="switchTab(tab)"
        >
          {{ t(`test.tabs.${tab}`) }}
        </button>
      </div>

      <!-- ==================== Layout Tab ==================== -->
      <div v-show="activeTab === 'layout'" class="max-w-5xl mx-auto animate-in">
        <div class="card p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">📐</span>
            <div>
              <h2 class="text-xl font-semibold text-apple-gray-800 dark:text-apple-gray-100">{{ t('test.layout.title') }}</h2>
              <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400">{{ t('test.layout.subtitle') }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Left: Form -->
            <div class="space-y-6">
              <!-- Cabinet Selection -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.layout.cabinetSelection') }}</h3>
                <div class="form-group">
                  <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.cabinetModel') }}</label>
                  <select v-model="layoutForm.cabinetId" class="select-field">
                    <option value="">{{ t('test.layout.selectCabinet') }}</option>
                    <optgroup label="UslimIII MIP 1.5">
                      <option v-for="cab in cabinetData.filter(c => c.family === 'UslimIII')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                    </optgroup>
                    <optgroup label="UMiniW 0.9">
                      <option v-for="cab in cabinetData.filter(c => c.family === 'UMiniW')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                    </optgroup>
                  </select>
                </div>
                <div v-if="selectedLayoutCabinet" class="mt-4 grid grid-cols-2 gap-2 text-xs text-apple-gray-500">
                  <div>{{ t('test.cabinet.dimensions') }}: {{ selectedLayoutCabinet.dimensions.width }}×{{ selectedLayoutCabinet.dimensions.height }}mm</div>
                  <div>{{ t('test.cabinet.pixelPitch') }}: {{ selectedLayoutCabinet.display.pixelPitch }}mm</div>
                  <div>{{ t('test.cabinet.resolution') }}: {{ selectedLayoutCabinet.display.resolution.width }}×{{ selectedLayoutCabinet.display.resolution.height }}</div>
                  <div>{{ t('test.cabinet.weight') }}: {{ selectedLayoutCabinet.physical.weight }}kg</div>
                </div>
              </div>

              <!-- Wall Dimensions -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.layout.wallDimensions') }}</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallWidth') }}</label>
                    <input v-model.number="layoutForm.wallWidth" type="number" step="0.1" min="0.1" class="input-field">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallHeight') }}</label>
                    <input v-model.number="layoutForm.wallHeight" type="number" step="0.1" min="0.1" class="input-field">
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.unit') }}</label>
                  <select v-model="layoutForm.unit" class="select-field">
                    <option value="meters">{{ t('test.layout.meters') }}</option>
                    <option value="feet">{{ t('test.layout.feet') }}</option>
                  </select>
                </div>
              </div>

              <!-- Power & Weight Options -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">⚙️ {{ t('test.options.powerWeight') || 'Optional Parameters' }}</h3>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="layoutForm.includePower" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includePower') || 'Include Power Consumption' }}</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="layoutForm.includeWeight" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includeWeight') || 'Include Weight' }}</span>
                  </label>
                </div>
                <p class="mt-3 text-xs text-apple-gray-400">{{ t('test.options.hint') || 'Uncheck to calculate layout only without power/weight data' }}</p>
              </div>

              <button @click="calculateLayout" :disabled="layoutLoading || !selectedLayoutCabinet" class="btn-primary w-full justify-center">
                <svg v-if="layoutLoading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('test.layout.calculate') }}
              </button>
            </div>

            <!-- Right: Results -->
            <div>
              <div v-if="layoutError" class="alert-error mb-4">
                <svg class="w-5 h-5 text-apple-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="text-apple-red">{{ layoutError }}</span>
              </div>

              <div v-if="layoutResult" class="space-y-4">
                <div class="alert-success">
                  <svg class="w-5 h-5 text-apple-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-apple-green font-medium">{{ t('test.results.success') }}</span>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                    <div class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">{{ layoutResult.columns }}</div>
                    <div class="text-xs text-apple-gray-500">{{ t('test.results.columns') }}</div>
                  </div>
                  <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                    <div class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">{{ layoutResult.rows }}</div>
                    <div class="text-xs text-apple-gray-500">{{ t('test.results.rows') }}</div>
                  </div>
                  <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                    <div class="text-2xl font-bold text-primary">{{ layoutResult.totalCabinets }}</div>
                    <div class="text-xs text-apple-gray-500">{{ t('test.results.totalCabinets') }}</div>
                  </div>
                </div>

                <!-- Power & Weight Stats -->
                <div v-if="layoutResult.calculationResult?.powerConsumption || layoutResult.calculationResult?.physical" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">⚡ {{ t('test.results.powerAndWeight') || 'Power & Weight' }}</h4>
                  <div class="grid grid-cols-3 gap-3">
                    <div v-if="layoutResult.calculationResult?.powerConsumption?.maximum" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-apple-orange">{{ layoutResult.calculationResult.powerConsumption.maximum.toLocaleString() }} W</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.maxPower') }}</div>
                    </div>
                    <div v-if="layoutResult.calculationResult?.powerConsumption?.typical" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-apple-green">{{ layoutResult.calculationResult.powerConsumption.typical.toLocaleString() }} W</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.typicalPower') }}</div>
                    </div>
                    <div v-if="layoutResult.calculationResult?.physical?.totalWeight" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-primary">{{ layoutResult.calculationResult.physical.totalWeight.toFixed(1) }} kg</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.totalWeight') }}</div>
                    </div>
                  </div>
                </div>

                <div v-if="layoutPreviewSvg" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">🖼️ Preview</h4>
                  <div class="bg-white dark:bg-apple-gray-800 rounded-lg p-4 overflow-x-auto svg-preview-container" v-html="layoutPreviewSvg"></div>
                </div>
              </div>

              <div v-else-if="!layoutError" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="text-6xl mb-4 opacity-30">📐</div>
                <p class="text-apple-gray-400">Select a cabinet and configure wall dimensions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== Smart Combination Tab ==================== -->
      <div v-show="activeTab === 'smart'" class="max-w-5xl mx-auto animate-in">
        <div class="card p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🧩</span>
            <div>
              <h2 class="text-xl font-semibold text-apple-gray-800 dark:text-apple-gray-100">{{ t('test.smart.title') }}</h2>
              <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400">{{ t('test.smart.subtitle') }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <!-- Main Cabinet -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.smart.mainCabinet') }}</h3>
                <select v-model="smartForm.mainCabinetId" @change="onMainCabinetChange" class="select-field">
                  <option value="">{{ t('test.layout.selectCabinet') }}</option>
                  <optgroup label="UslimIII MIP 1.5">
                    <option v-for="cab in cabinetData.filter(c => c.family === 'UslimIII')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                  </optgroup>
                  <optgroup label="UMiniW 0.9">
                    <option v-for="cab in cabinetData.filter(c => c.family === 'UMiniW')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                  </optgroup>
                </select>
                <div v-if="selectedMainCabinet" class="mt-3 text-xs text-apple-gray-500">
                  {{ selectedMainCabinet.dimensions.width }}×{{ selectedMainCabinet.dimensions.height }}mm | {{ selectedMainCabinet.physical.weight }}kg
                </div>
              </div>

              <!-- Auxiliary Cabinets -->
              <div v-if="sameFamilyCabinets.length > 0" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.smart.auxiliaryCabinets') }}</h3>
                <div class="space-y-2">
                  <label v-for="cab in sameFamilyCabinets" :key="cab.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-apple-gray-600/50 cursor-pointer">
                    <input type="checkbox" :value="cab.id" v-model="smartForm.auxiliaryCabinetIds" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ cab.name }}</span>
                    <span class="text-xs text-apple-gray-400 ml-auto">{{ cab.dimensions.width }}×{{ cab.dimensions.height }}mm</span>
                  </label>
                </div>
              </div>

              <!-- Wall Dimensions -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.smart.wallDimensionsMm') }}</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallWidth') }} (mm)</label>
                    <input v-model.number="smartForm.wallWidthMm" type="number" min="100" class="input-field">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallHeight') }} (mm)</label>
                    <input v-model.number="smartForm.wallHeightMm" type="number" min="100" class="input-field">
                  </div>
                </div>
              </div>

              <!-- Power & Weight Options -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">⚙️ {{ t('test.options.powerWeight') }}</h3>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="smartForm.includePower" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includePower') }}</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="smartForm.includeWeight" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includeWeight') }}</span>
                  </label>
                </div>
                <p class="mt-3 text-xs text-apple-gray-400">{{ t('test.options.hint') }}</p>
              </div>

              <button @click="calculateSmart" :disabled="smartLoading || !selectedMainCabinet || smartForm.auxiliaryCabinetIds.length === 0" class="btn-primary w-full justify-center">
                <svg v-if="smartLoading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('test.smart.calculate') }}
              </button>
            </div>

            <!-- Results -->
            <div>
              <div v-if="smartError" class="alert-error mb-4">
                <svg class="w-5 h-5 text-apple-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="text-apple-red">{{ smartError }}</span>
              </div>

              <div v-if="smartResult" class="space-y-4">
                <div class="alert-success">
                  <svg class="w-5 h-5 text-apple-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-apple-green font-medium">{{ t('test.results.success') }}</span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                    <div class="text-xl font-bold text-primary">{{ smartResult.coveragePercentage }}</div>
                    <div class="text-xs text-apple-gray-500">{{ t('test.results.coverage') }}</div>
                  </div>
                  <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                    <div class="text-xl font-bold" :class="smartResult.isFullyFilled ? 'text-apple-green' : 'text-apple-orange'">
                      {{ smartResult.isFullyFilled ? t('test.results.yes') : t('test.results.no') }}
                    </div>
                    <div class="text-xs text-apple-gray-500">{{ t('test.results.fullyFilled') }}</div>
                  </div>
                </div>

                <!-- Cabinet Details -->
                <div v-if="smartResult.bestCombination" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">📦 Cabinet Details</h4>
                  <div class="space-y-2">
                    <div v-for="cab in smartResult.bestCombination" :key="cab.id" class="flex justify-between items-center text-sm">
                      <span class="text-apple-gray-600 dark:text-apple-gray-400">{{ getCabinetById(cab.id)?.name || cab.id }}</span>
                      <span class="font-semibold text-apple-gray-800 dark:text-apple-gray-200">{{ cab.count }} pcs</span>
                    </div>
                  </div>
                </div>

                <!-- Power & Weight Stats -->
                <div v-if="smartResult.calculationResult?.powerConsumption || smartResult.calculationResult?.physical" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">⚡ {{ t('test.results.powerAndWeight') || 'Power & Weight' }}</h4>
                  <div class="grid grid-cols-3 gap-3">
                    <div v-if="smartResult.calculationResult?.powerConsumption?.maximum" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-apple-orange">{{ smartResult.calculationResult.powerConsumption.maximum.toLocaleString() }} W</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.maxPower') }}</div>
                    </div>
                    <div v-if="smartResult.calculationResult?.powerConsumption?.typical" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-apple-green">{{ smartResult.calculationResult.powerConsumption.typical.toLocaleString() }} W</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.typicalPower') }}</div>
                    </div>
                    <div v-if="smartResult.calculationResult?.physical?.totalWeight" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                      <div class="text-lg font-bold text-primary">{{ smartResult.calculationResult.physical.totalWeight.toFixed(1) }} kg</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.totalWeight') }}</div>
                    </div>
                  </div>
                </div>

                <div v-if="smartPreviewSvg" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">🖼️ Preview</h4>
                  <div class="bg-white dark:bg-apple-gray-800 rounded-lg p-4 overflow-x-auto svg-preview-container" v-html="smartPreviewSvg"></div>
                </div>
              </div>

              <div v-else-if="!smartError" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="text-6xl mb-4 opacity-30">🧩</div>
                <p class="text-apple-gray-400">Select main cabinet and auxiliary cabinets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== Preview Tab ==================== -->
      <div v-show="activeTab === 'preview'" class="max-w-5xl mx-auto animate-in">
        <div class="card p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">🖼️</span>
            <div>
              <h2 class="text-xl font-semibold text-apple-gray-800 dark:text-apple-gray-100">{{ t('test.preview.title') }}</h2>
              <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400">{{ t('test.preview.subtitle') }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <!-- Data Source -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.preview.dataSource') }}</h3>
                <select v-model="previewForm.source" class="select-field">
                  <option value="">{{ t('test.preview.selectResult') }}</option>
                  <option v-for="src in previewSources" :key="src.value" :value="src.value">{{ src.label }}</option>
                </select>
                <p v-if="previewSources.length === 0" class="mt-3 text-xs text-apple-orange">
                  ⚠️ Please complete a calculation first (Layout or Smart tabs)
                </p>
              </div>

              <!-- Preview Options -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.preview.previewOptions') }}</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.preview.canvasWidth') }}</label>
                    <input v-model.number="previewForm.canvasWidth" type="number" min="100" class="input-field">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.preview.canvasHeight') }}</label>
                    <input v-model.number="previewForm.canvasHeight" type="number" min="100" class="input-field">
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="previewForm.showDimensions" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.preview.showDimensions') }}</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="previewForm.showPerson" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.preview.showPerson') }}</span>
                  </label>
                </div>
              </div>

              <button @click="generatePreview" :disabled="previewLoading || !previewForm.source" class="btn-primary w-full justify-center">
                <svg v-if="previewLoading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('test.preview.generate') }}
              </button>
            </div>

            <!-- Preview Result -->
            <div>
              <div v-if="previewError" class="alert-error mb-4">
                <svg class="w-5 h-5 text-apple-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="text-apple-red">{{ previewError }}</span>
              </div>

              <div v-if="previewSvg" class="p-4 bg-white dark:bg-apple-gray-800 rounded-apple border border-apple-gray-200 dark:border-apple-gray-700 overflow-x-auto svg-preview-container">
                <div v-html="previewSvg"></div>
              </div>

              <div v-else-if="!previewError" class="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-apple-gray-200 dark:border-apple-gray-700 rounded-apple">
                <div class="text-6xl mb-4 opacity-30">🖼️</div>
                <p class="text-apple-gray-400">{{ t('test.preview.noResults') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== One-Click Tab ==================== -->
      <div v-show="activeTab === 'oneclick'" class="max-w-5xl mx-auto animate-in">
        <div class="card p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">⚡</span>
            <div>
              <h2 class="text-xl font-semibold text-apple-gray-800 dark:text-apple-gray-100">{{ t('test.oneclick.title') }}</h2>
              <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400">{{ t('test.oneclick.subtitle') }}</p>
            </div>
          </div>

          <!-- Mode Switch -->
          <div class="flex gap-4 mb-8">
            <button @click="oneclickMode = 'single'" class="flex-1 py-3 px-4 rounded-apple text-sm font-medium transition-all" :class="oneclickMode === 'single' ? 'bg-primary text-white shadow-apple' : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-200'">
              {{ t('test.oneclick.modeSingle') }}
            </button>
            <button @click="oneclickMode = 'multi'" class="flex-1 py-3 px-4 rounded-apple text-sm font-medium transition-all" :class="oneclickMode === 'multi' ? 'bg-primary text-white shadow-apple' : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-200'">
              {{ t('test.oneclick.modeMulti') }}
            </button>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <!-- Cabinet Selection -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.layout.cabinetSelection') }}</h3>
                <select v-model="oneclickForm.cabinetId" class="select-field">
                  <option value="">{{ t('test.layout.selectCabinet') }}</option>
                  <optgroup label="UslimIII MIP 1.5">
                    <option v-for="cab in cabinetData.filter(c => c.family === 'UslimIII')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                  </optgroup>
                  <optgroup label="UMiniW 0.9">
                    <option v-for="cab in cabinetData.filter(c => c.family === 'UMiniW')" :key="cab.id" :value="cab.id">{{ cab.name }}</option>
                  </optgroup>
                </select>
                <div v-if="selectedOneclickCabinet" class="mt-3 text-xs text-apple-gray-500">
                  {{ selectedOneclickCabinet.dimensions.width }}×{{ selectedOneclickCabinet.dimensions.height }}mm | {{ selectedOneclickCabinet.physical.weight }}kg
                </div>
                <label v-if="oneclickMode === 'multi'" class="flex items-center gap-3 mt-4 cursor-pointer">
                  <input type="checkbox" v-model="oneclickForm.autoAux" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                  <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.oneclick.autoAux') }}</span>
                </label>
              </div>

              <!-- Wall Dimensions -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.layout.wallDimensions') }}</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallWidth') }}</label>
                    <input v-model.number="oneclickForm.wallWidth" type="number" step="0.1" min="0.1" class="input-field">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.wallHeight') }}</label>
                    <input v-model.number="oneclickForm.wallHeight" type="number" step="0.1" min="0.1" class="input-field">
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 mb-2">{{ t('test.layout.unit') }}</label>
                  <select v-model="oneclickForm.unit" class="select-field">
                    <option value="meters">{{ t('test.layout.meters') }}</option>
                    <option value="feet">{{ t('test.layout.feet') }}</option>
                  </select>
                </div>
              </div>

              <!-- Preview Options -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">{{ t('test.preview.previewOptions') }}</h3>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="oneclickForm.showDimensions" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.preview.showDimensions') }}</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="oneclickForm.showPerson" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.preview.showPerson') }}</span>
                  </label>
                </div>
              </div>

              <!-- Power & Weight Options -->
              <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                <h3 class="text-sm font-semibold text-primary mb-4">⚙️ {{ t('test.options.powerWeight') }}</h3>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="oneclickForm.includePower" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includePower') }}</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" v-model="oneclickForm.includeWeight" class="w-4 h-4 rounded border-apple-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-apple-gray-700 dark:text-apple-gray-300">{{ t('test.options.includeWeight') }}</span>
                  </label>
                </div>
                <p class="mt-3 text-xs text-apple-gray-400">{{ t('test.options.hint') }}</p>
              </div>

              <button @click="calculateOneClick" :disabled="oneclickLoading || !selectedOneclickCabinet" class="btn-primary w-full justify-center">
                <svg v-if="oneclickLoading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('test.oneclick.calculate') }}
              </button>
            </div>

            <!-- Results -->
            <div>
              <div v-if="oneclickError" class="alert-error mb-4">
                <svg class="w-5 h-5 text-apple-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="text-apple-red">{{ oneclickError }}</span>
              </div>

              <div v-if="oneclickResult" class="space-y-4">
                <div class="alert-success">
                  <svg class="w-5 h-5 text-apple-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-apple-green font-medium">{{ t('test.results.success') }}</span>
                </div>

                <!-- Single Mode Results -->
                <template v-if="oneclickMode === 'single' && oneclickResult.columns">
                  <div class="grid grid-cols-3 gap-3">
                    <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                      <div class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">{{ oneclickResult.columns }}</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.columns') }}</div>
                    </div>
                    <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                      <div class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100">{{ oneclickResult.rows }}</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.rows') }}</div>
                    </div>
                    <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                      <div class="text-2xl font-bold text-primary">{{ oneclickResult.totalCabinets }}</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.totalCabinets') }}</div>
                    </div>
                  </div>
                  
                  <!-- Power & Weight Stats for Single Mode -->
                  <div v-if="oneclickResult.calculationResult?.powerConsumption || oneclickResult.calculationResult?.physical" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                    <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">⚡ {{ t('test.results.powerAndWeight') || 'Power & Weight' }}</h4>
                    <div class="grid grid-cols-3 gap-3">
                      <div v-if="oneclickResult.calculationResult?.powerConsumption?.maximum" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                        <div class="text-lg font-bold text-apple-orange">{{ oneclickResult.calculationResult.powerConsumption.maximum.toLocaleString() }} W</div>
                        <div class="text-xs text-apple-gray-500">{{ t('test.results.maxPower') }}</div>
                      </div>
                      <div v-if="oneclickResult.calculationResult?.powerConsumption?.typical" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                        <div class="text-lg font-bold text-apple-green">{{ oneclickResult.calculationResult.powerConsumption.typical.toLocaleString() }} W</div>
                        <div class="text-xs text-apple-gray-500">{{ t('test.results.typicalPower') }}</div>
                      </div>
                      <div v-if="oneclickResult.calculationResult?.physical?.totalWeight" class="p-3 bg-white dark:bg-apple-gray-800 rounded-lg text-center">
                        <div class="text-lg font-bold text-primary">{{ oneclickResult.calculationResult.physical.totalWeight.toFixed(1) }} kg</div>
                        <div class="text-xs text-apple-gray-500">{{ t('test.results.totalWeight') }}</div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Multi Mode Results -->
                <template v-else-if="oneclickMode === 'multi' && oneclickResult.bestCombination">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                      <div class="text-xl font-bold text-primary">{{ oneclickResult.coveragePercentage }}</div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.coverage') }}</div>
                    </div>
                    <div class="p-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple text-center">
                      <div class="text-xl font-bold" :class="oneclickResult.isFullyFilled ? 'text-apple-green' : 'text-apple-orange'">
                        {{ oneclickResult.isFullyFilled ? t('test.results.yes') : t('test.results.no') }}
                      </div>
                      <div class="text-xs text-apple-gray-500">{{ t('test.results.fullyFilled') }}</div>
                    </div>
                  </div>
                  <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                    <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">📦 Cabinets</h4>
                    <div class="space-y-2">
                      <div v-for="cab in oneclickResult.bestCombination" :key="cab.id" class="flex justify-between items-center text-sm">
                        <span class="text-apple-gray-600 dark:text-apple-gray-400">{{ getCabinetById(cab.id)?.name || cab.id }}</span>
                        <span class="font-semibold text-apple-gray-800 dark:text-apple-gray-200">{{ cab.count }} pcs</span>
                      </div>
                    </div>
                  </div>
                </template>

                <div v-if="oneclickPreviewSvg" class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
                  <h4 class="text-sm font-semibold text-apple-gray-700 dark:text-apple-gray-300 mb-3">🖼️ Preview</h4>
                  <div class="bg-white dark:bg-apple-gray-800 rounded-lg p-4 overflow-x-auto svg-preview-container" v-html="oneclickPreviewSvg"></div>
                </div>
              </div>

              <div v-else-if="!oneclickError" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="text-6xl mb-4 opacity-30">⚡</div>
                <p class="text-apple-gray-400">Select a cabinet and click calculate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
