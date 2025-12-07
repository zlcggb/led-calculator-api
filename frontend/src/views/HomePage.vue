<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { t } = useI18n()
const isApiOnline = ref<boolean | null>(null)

const features = [
  {
    icon: '📐',
    titleKey: 'home.features.singleLayout.title',
    descKey: 'home.features.singleLayout.description',
    color: 'blue'
  },
  {
    icon: '🧩',
    titleKey: 'home.features.multiCombination.title',
    descKey: 'home.features.multiCombination.description',
    color: 'purple'
  },
  {
    icon: '🖼️',
    titleKey: 'home.features.svgPreview.title',
    descKey: 'home.features.svgPreview.description',
    color: 'green'
  },
  {
    icon: '⚡',
    titleKey: 'home.features.oneClick.title',
    descKey: 'home.features.oneClick.description',
    color: 'orange'
  }
]

const apiEndpoints = [
  { method: 'POST', path: '/api/calculate/optimal-layout', desc: 'Single cabinet optimal layout' },
  { method: 'POST', path: '/api/calculate/smart-combination', desc: 'Multi-cabinet smart combination' },
  { method: 'POST', path: '/api/calculate/optimal-layout-with-preview', desc: 'Single + Preview ⚡' },
  { method: 'POST', path: '/api/calculate/smart-combination-with-preview', desc: 'Multi + Preview ⚡' },
  { method: 'POST', path: '/api/preview/svg', desc: 'SVG preview generation' },
]

onMounted(async () => {
  try {
    const response = await fetch('/health')
    isApiOnline.value = response.ok
  } catch {
    isApiOnline.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-apple-gray-50 to-white dark:from-apple-gray-900 dark:to-apple-gray-800">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-30 dark:opacity-20">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>
      
      <div class="container-full relative py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <!-- API Status Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-apple-gray-800 shadow-apple mb-8">
            <span 
              class="w-2 h-2 rounded-full"
              :class="isApiOnline === true ? 'bg-apple-green animate-pulse' : isApiOnline === false ? 'bg-apple-red' : 'bg-apple-gray-400'"
            ></span>
            <span class="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300">
              {{ isApiOnline === null ? t('header.checkingStatus') : isApiOnline ? t('header.online') : t('header.offline') }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-apple-gray-800 dark:text-white mb-6">
            {{ t('home.hero.title') }}
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-apple-gray-500 dark:text-apple-gray-400 mb-4">
            {{ t('home.hero.subtitle') }}
          </p>
          
          <p class="text-base text-apple-gray-400 dark:text-apple-gray-500 mb-10 max-w-2xl mx-auto">
            {{ t('home.hero.description') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/test" class="btn-primary text-lg px-8 py-4">
              {{ t('home.hero.tryNow') }}
              <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>
            <RouterLink to="/docs" class="btn-secondary text-lg px-8 py-4">
              {{ t('home.hero.viewDocs') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white dark:bg-apple-gray-900">
      <div class="container-full">
        <div class="text-center mb-16">
          <h2 class="section-title">{{ t('home.features.title') }}</h2>
          <p class="section-subtitle mx-auto">{{ t('home.features.subtitle') }}</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in features"
            :key="feature.titleKey"
            class="card p-6 hover:shadow-apple-hover transition-all duration-300 hover:-translate-y-1"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-2">
              {{ t(feature.titleKey) }}
            </h3>
            <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400">
              {{ t(feature.descKey) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- API Endpoints Section -->
    <section class="py-24 bg-apple-gray-50 dark:bg-apple-gray-800">
      <div class="container-full">
        <div class="text-center mb-16">
          <h2 class="section-title">{{ t('home.apiEndpoints.title') }}</h2>
          <p class="section-subtitle mx-auto">{{ t('home.apiEndpoints.subtitle') }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="card overflow-hidden">
            <div class="divide-y divide-apple-gray-100 dark:divide-apple-gray-700">
              <div
                v-for="endpoint in apiEndpoints"
                :key="endpoint.path"
                class="flex items-center gap-4 p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/50 transition-colors"
              >
                <span class="method-post shrink-0">{{ endpoint.method }}</span>
                <code class="flex-1 font-mono text-sm text-apple-gray-700 dark:text-apple-gray-300">
                  {{ endpoint.path }}
                </code>
                <span class="text-sm text-apple-gray-400 hidden sm:inline">{{ endpoint.desc }}</span>
              </div>
            </div>
          </div>

          <p class="text-center mt-6 text-sm text-apple-gray-400">
            Base URL: <code class="inline-code">https://led-api.unilumin-gtm.com</code>
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section class="py-24 bg-white dark:bg-apple-gray-900">
      <div class="container-full">
        <div class="text-center mb-16">
          <h2 class="section-title">{{ t('home.quickStart.title') }}</h2>
          <p class="section-subtitle mx-auto">{{ t('home.quickStart.subtitle') }}</p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="code-block">
            <div class="flex items-center justify-between px-4 py-3 border-b border-apple-gray-700">
              <span class="text-sm text-apple-gray-400">JavaScript / TypeScript</span>
              <button class="text-sm text-apple-gray-400 hover:text-white transition-colors">
                {{ t('common.copy') }}
              </button>
            </div>
            <pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="text-apple-gray-300"><span class="text-purple-400">const</span> <span class="text-blue-300">response</span> = <span class="text-purple-400">await</span> <span class="text-yellow-300">fetch</span>(<span class="text-green-300">'https://led-api.unilumin-gtm.com/api/calculate/optimal-layout-with-preview'</span>, {
  <span class="text-blue-300">method</span>: <span class="text-green-300">'POST'</span>,
  <span class="text-blue-300">headers</span>: { <span class="text-green-300">'Content-Type'</span>: <span class="text-green-300">'application/json'</span> },
  <span class="text-blue-300">body</span>: <span class="text-yellow-300">JSON</span>.<span class="text-yellow-300">stringify</span>({
    <span class="text-blue-300">cabinetSpecs</span>: {
      <span class="text-blue-300">dimensions</span>: { <span class="text-blue-300">width</span>: <span class="text-orange-300">500</span>, <span class="text-blue-300">height</span>: <span class="text-orange-300">1000</span> },
      <span class="text-blue-300">display</span>: { <span class="text-blue-300">pixelPitch</span>: <span class="text-orange-300">1.5625</span>, <span class="text-blue-300">resolution</span>: { <span class="text-blue-300">width</span>: <span class="text-orange-300">320</span>, <span class="text-blue-300">height</span>: <span class="text-orange-300">640</span> } },
      <span class="text-blue-300">power</span>: { <span class="text-blue-300">maxPower</span>: <span class="text-orange-300">180</span>, <span class="text-blue-300">typicalPower</span>: <span class="text-orange-300">60</span> },
      <span class="text-blue-300">physical</span>: { <span class="text-blue-300">weight</span>: <span class="text-orange-300">10.5</span> }
    },
    <span class="text-blue-300">roomConfig</span>: {
      <span class="text-blue-300">dimensions</span>: { <span class="text-blue-300">width</span>: <span class="text-orange-300">5</span>, <span class="text-blue-300">height</span>: <span class="text-orange-300">3</span> },
      <span class="text-blue-300">unit</span>: <span class="text-green-300">'meters'</span>
    }
  })
});

<span class="text-purple-400">const</span> <span class="text-blue-300">result</span> = <span class="text-purple-400">await</span> <span class="text-blue-300">response</span>.<span class="text-yellow-300">json</span>();
<span class="text-gray-500">// result.data.preview.svg contains the SVG preview</span></code></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


