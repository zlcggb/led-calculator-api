<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}>(), {
  language: 'typescript',
  showLineNumbers: false
})

const { t } = useI18n()
const copied = ref(false)

// Syntax highlighting with placeholder system to avoid regex conflicts
const highlightedCode = computed(() => {
  let code = props.code
  const placeholders: { id: string; html: string }[] = []
  let placeholderIndex = 0
  
  // Helper function to create placeholder
  const createPlaceholder = (html: string): string => {
    const id = `__PLACEHOLDER_${placeholderIndex++}__`
    placeholders.push({ id, html })
    return id
  }
  
  // Step 1: Extract comments first (before HTML escaping)
  // Single-line comments
  code = code.replace(/(\/\/.*$)/gm, (match) => {
    return createPlaceholder(`<span class="comment">${escapeHtml(match)}</span>`)
  })
  // Multi-line comments
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
    return createPlaceholder(`<span class="comment">${escapeHtml(match)}</span>`)
  })
  
  // Step 2: Extract strings
  code = code.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
    return createPlaceholder(`<span class="string">${escapeHtml(match)}</span>`)
  })
  code = code.replace(/('(?:[^'\\]|\\.)*')/g, (match) => {
    return createPlaceholder(`<span class="string">${escapeHtml(match)}</span>`)
  })
  code = code.replace(/(`(?:[^`\\]|\\.)*`)/g, (match) => {
    return createPlaceholder(`<span class="string">${escapeHtml(match)}</span>`)
  })
  
  // Step 3: Escape remaining HTML
  code = escapeHtml(code)
  
  // Step 4: Highlight keywords
  const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'interface', 'type', 'enum', 'true', 'false', 'null', 'undefined']
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    code = code.replace(regex, '<span class="keyword">$1</span>')
  })
  
  // Step 5: Highlight numbers
  code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
  
  // Step 6: Highlight JSON keys (words followed by colon)
  code = code.replace(/(&quot;)([^&]+)(&quot;)(\s*:)/g, '<span class="key">$1$2$3</span>$4')
  
  // Step 7: Restore placeholders
  placeholders.forEach(({ id, html }) => {
    code = code.replace(id, html)
  })
  
  return code
})

// Helper function to escape HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="code-block group">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-apple-gray-700">
      <div class="flex items-center gap-3">
        <!-- Traffic lights decoration -->
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-apple-red/80"></div>
          <div class="w-3 h-3 rounded-full bg-apple-yellow/80"></div>
          <div class="w-3 h-3 rounded-full bg-apple-green/80"></div>
        </div>
        <span v-if="filename" class="text-sm text-apple-gray-400 font-mono">{{ filename }}</span>
      </div>
      
      <button 
        @click="copyCode"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all"
        :class="copied 
          ? 'bg-apple-green/20 text-apple-green' 
          : 'text-apple-gray-400 hover:text-white hover:bg-apple-gray-700'"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? t('common.copied') : t('common.copy') }}
      </button>
    </div>
    
    <!-- Code Content -->
    <div class="overflow-x-auto">
      <pre class="p-4 text-sm leading-relaxed"><code class="font-mono" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  @apply bg-apple-gray-800 dark:bg-apple-gray-900 rounded-apple overflow-hidden;
}

.code-block pre {
  @apply m-0;
}

.code-block code {
  @apply text-apple-gray-300;
}

/* Syntax highlighting colors */
.code-block :deep(.comment) {
  @apply text-apple-gray-500 italic;
}

.code-block :deep(.string) {
  @apply text-green-400;
}

.code-block :deep(.keyword) {
  @apply text-purple-400;
}

.code-block :deep(.number) {
  @apply text-orange-400;
}

.code-block :deep(.key) {
  @apply text-cyan-400;
}
</style>


