import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './styles/main.css'

// Import locale messages
import zh from './i18n/locales/zh.json'
import en from './i18n/locales/en.json'

// Import views
import HomePage from './views/HomePage.vue'
import TestPage from './views/TestPage.vue'
import ApiReference from './views/ApiReference.vue'
import VueIntegration from './views/VueIntegration.vue'

// Create router with base path matching vite.config.ts base
const router = createRouter({
  history: createWebHistory('/app/'),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/test', name: 'test', component: TestPage },
    { path: '/docs', name: 'docs', component: ApiReference },
    { path: '/vue-integration', name: 'vue', component: VueIntegration },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('led-calculator-lang') || 'en', // 默认英语
  fallbackLocale: 'en',
  messages: { zh, en },
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')


