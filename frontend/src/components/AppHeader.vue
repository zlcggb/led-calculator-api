<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineProps<{
  isDark: boolean
}>()

defineEmits<{
  toggleTheme: []
}>()

const route = useRoute()
const { t } = useI18n()
const isMenuOpen = ref(false)

const navLinks = computed(() => [
  { path: '/', name: 'home', label: t('nav.home') },
  { path: '/test', name: 'test', label: t('nav.test') },
  { path: '/docs', name: 'docs', label: t('nav.docs') },
  { path: '/vue-integration', name: 'vue', label: t('nav.vue') },
])

function isActive(path: string) {
  return route.path === path
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-apple-gray-900/80 backdrop-blur-apple border-b border-apple-gray-200 dark:border-apple-gray-800">
    <nav class="container-full">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 font-semibold text-apple-gray-800 dark:text-apple-gray-100">
          <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span class="hidden sm:inline">LED Calculator API</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link text-sm"
            :class="{ 'nav-link-active': isActive(link.path) }"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2">
          <LanguageSwitcher />
          
          <!-- Theme Toggle -->
          <button
            @click="$emit('toggleTheme')"
            class="p-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun Icon -->
            <svg v-if="isDark" class="w-5 h-5 text-apple-gray-600 dark:text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon Icon -->
            <svg v-else class="w-5 h-5 text-apple-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- GitHub Link -->
          <a
            href="https://github.com/zlcggb/led-calculator-api"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
            aria-label="View on GitHub"
          >
            <!-- GitHub Icon -->
            <svg class="w-5 h-5 text-apple-gray-600 dark:text-apple-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg v-if="!isMenuOpen" class="w-5 h-5 text-apple-gray-600 dark:text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5 text-apple-gray-600 dark:text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="slide">
        <div v-if="isMenuOpen" class="md:hidden border-t border-apple-gray-200 dark:border-apple-gray-800 py-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="block px-4 py-2.5 text-sm font-medium rounded-lg"
            :class="[
              isActive(link.path)
                ? 'bg-primary/10 text-primary'
                : 'text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
            ]"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>


