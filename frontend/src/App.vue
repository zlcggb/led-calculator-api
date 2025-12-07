<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const { locale } = useI18n()
const isDark = ref(false)

// Check for saved theme preference or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('led-calculator-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

// Watch for theme changes
watch(isDark, () => {
  updateTheme()
  localStorage.setItem('led-calculator-theme', isDark.value ? 'dark' : 'light')
})

// Watch for locale changes
watch(locale, (newLocale) => {
  localStorage.setItem('led-calculator-lang', newLocale)
  document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
})

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader :is-dark="isDark" @toggle-theme="toggleTheme" />
    
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>


