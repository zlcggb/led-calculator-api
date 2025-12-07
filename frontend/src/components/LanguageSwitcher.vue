<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[1]
})

function selectLanguage(code: string) {
  locale.value = code
  isOpen.value = false
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

// Add event listener when dropdown is open
import { watch, onUnmounted } from 'vue'

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="language-switcher relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-lg transition-colors"
    >
      <span>{{ currentLanguage.flag }}</span>
      <span class="hidden sm:inline">{{ currentLanguage.name }}</span>
      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-36 bg-white dark:bg-apple-gray-800 rounded-apple shadow-apple-md border border-apple-gray-200 dark:border-apple-gray-700 overflow-hidden z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700 transition-colors"
          :class="{
            'bg-primary/5 text-primary': locale === lang.code,
            'text-apple-gray-700 dark:text-apple-gray-200': locale !== lang.code
          }"
        >
          <span>{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <svg v-if="locale === lang.code" class="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>


