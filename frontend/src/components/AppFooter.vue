<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-apple-gray-50 dark:bg-apple-gray-900 border-t border-apple-gray-200 dark:border-apple-gray-800">
    <div class="container-full py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span class="font-semibold text-apple-gray-800 dark:text-apple-gray-100">LED Calculator API</span>
          </div>
          <p class="text-sm text-apple-gray-500 dark:text-apple-gray-400 max-w-md">
            {{ t('footer.description') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">{{ t('footer.quickLinks') }}</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/test" class="text-sm text-apple-gray-500 dark:text-apple-gray-400 hover:text-primary transition-colors">
                {{ t('nav.test') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/docs" class="text-sm text-apple-gray-500 dark:text-apple-gray-400 hover:text-primary transition-colors">
                {{ t('nav.docs') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/vue-integration" class="text-sm text-apple-gray-500 dark:text-apple-gray-400 hover:text-primary transition-colors">
                {{ t('nav.vue') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact & License -->
        <div>
          <h4 class="font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">{{ t('footer.contactTitle') }}</h4>
          <div class="space-y-3 text-sm">
            <!-- Non-commercial Notice -->
            <div class="flex items-start gap-2 text-apple-gray-500 dark:text-apple-gray-400">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ t('footer.nonCommercial') }}</span>
            </div>
            
            <!-- Email Contact -->
            <div class="space-y-1">
              <p class="text-apple-gray-500 dark:text-apple-gray-400">{{ t('footer.contactEmail') }}:</p>
              <a 
                href="mailto:u0015098@unilumin.com" 
                class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span class="group-hover:underline">{{ t('footer.email') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 pt-8 border-t border-apple-gray-200 dark:border-apple-gray-800">
        <p class="text-sm text-apple-gray-400 dark:text-apple-gray-500 text-center">
          © {{ currentYear }} Unilumin. {{ t('footer.copyright') }}
        </p>
      </div>
    </div>
  </footer>
</template>


