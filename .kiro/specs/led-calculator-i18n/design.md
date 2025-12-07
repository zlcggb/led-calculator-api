# Design Document: LED Calculator API Internationalization

## Overview

This design document outlines the implementation of bilingual (Chinese/English) support for the LED Calculator API project. The solution provides a client-side i18n system for HTML documentation pages and server-side localization for API responses.

### Goals
- Enable language switching on all user-facing HTML pages
- Maintain backward compatibility with existing Chinese content
- Provide consistent i18n implementation across all files
- Support API response localization based on client preferences

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LED Calculator API Project                    │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (HTML Pages)                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  test-page.html │  │api-reference.html│  │vue-integration  │ │
│  │                 │  │                 │  │     .html       │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                    │          │
│           └────────────────────┼────────────────────┘          │
│                                ▼                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Shared i18n JavaScript Module               │   │
│  │  - Translation object (zh/en)                           │   │
│  │  - Language switcher component                          │   │
│  │  - localStorage persistence                             │   │
│  │  - DOM update functions                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Backend (API)                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Express Middleware                          │   │
│  │  - Accept-Language header parsing                       │   │
│  │  - Error message localization                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SVG Generator                               │   │
│  │  - language parameter in previewOptions (existing)      │   │
│  │  - Localized labels in generated SVG                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Frontend i18n Module

Each HTML file will include an embedded i18n module with the following structure:

```javascript
// i18n Configuration
const i18n = {
  currentLang: 'zh',
  
  translations: {
    zh: {
      // Chinese translations
      header: { title: 'LED Calculator API', subtitle: '...' },
      // ...
    },
    en: {
      // English translations
      header: { title: 'LED Calculator API', subtitle: '...' },
      // ...
    }
  },
  
  // Get translation by key path
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },
  
  // Switch language
  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('led-calculator-lang', lang);
    this.updateDOM();
  },
  
  // Update all translatable elements
  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    // Handle placeholders, titles, etc.
  }
};
```

### 2. Language Switcher Component

```html
<div class="lang-switcher">
  <button onclick="i18n.setLanguage('zh')" class="lang-btn" data-lang="zh">
    🇨🇳 中文
  </button>
  <button onclick="i18n.setLanguage('en')" class="lang-btn" data-lang="en">
    🇺🇸 EN
  </button>
</div>
```

### 3. Translatable Element Markup

```html
<!-- Text content -->
<h1 data-i18n="header.title">LED Calculator API</h1>

<!-- Placeholder -->
<input data-i18n-placeholder="form.selectCabinet" placeholder="请选择箱体...">

<!-- Title attribute -->
<button data-i18n-title="buttons.calculate" title="计算">🚀</button>
```

### 4. API Error Message Localization

```typescript
// src/middleware/i18n.ts
const errorMessages = {
  zh: {
    VALIDATION_ERROR: '请求参数验证失败',
    CABINET_LIMIT_EXCEEDED: '箱体总数超过限制（>1000）',
    SCREEN_SIZE_EXCEEDED: '屏幕尺寸超过限制（>50m）',
    CALCULATION_ERROR: '内部计算错误',
  },
  en: {
    VALIDATION_ERROR: 'Request validation failed',
    CABINET_LIMIT_EXCEEDED: 'Cabinet count exceeds limit (>1000)',
    SCREEN_SIZE_EXCEEDED: 'Screen size exceeds limit (>50m)',
    CALCULATION_ERROR: 'Internal calculation error',
  }
};

export function getLocalizedError(code: string, lang: string): string {
  const messages = errorMessages[lang] || errorMessages['zh'];
  return messages[code] || code;
}
```

## Data Models

### Translation Object Structure

```typescript
interface Translations {
  [lang: string]: {
    header: {
      title: string;
      subtitle: string;
      apiStatus: string;
      checkingStatus: string;
      online: string;
      offline: string;
    };
    tabs: {
      layout: string;
      smart: string;
      preview: string;
      oneclick: string;
    };
    form: {
      cabinetSelect: string;
      selectCabinet: string;
      wallWidth: string;
      wallHeight: string;
      unit: string;
      meters: string;
      feet: string;
    };
    buttons: {
      calculate: string;
      generatePreview: string;
      addAuxiliary: string;
    };
    results: {
      columns: string;
      rows: string;
      totalCabinets: string;
      screenWidth: string;
      screenHeight: string;
      coverage: string;
    };
    // ... more sections
  };
}
```

### Language Preference Storage

```typescript
interface LanguagePreference {
  key: 'led-calculator-lang';
  values: 'zh' | 'en';
  default: 'zh';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing the acceptance criteria, the following redundancies were identified:
- Properties 2.2 and 2.3 (English/Chinese content display) can be combined into one property about content translation consistency
- Properties 3.2, 3.3, 3.4 overlap with 2.2, 2.3, 2.5 - they test the same translation mechanism on different pages
- Properties 4.1 and 4.2 can be combined into one property about API response localization

### Correctness Properties

**Property 1: Translation Completeness**
*For any* translatable element with a `data-i18n` attribute, the translation object SHALL contain corresponding values for both 'zh' and 'en' languages
**Validates: Requirements 1.3, 2.2, 2.3, 3.2**

**Property 2: Language Persistence Round-Trip**
*For any* language selection, setting the language and then reloading the page SHALL restore the same language from localStorage
**Validates: Requirements 1.4, 1.5**

**Property 3: DOM Update Consistency**
*For any* language switch operation, all elements with `data-i18n` attributes SHALL display text matching the translation for the current language
**Validates: Requirements 1.3, 2.2, 2.3, 3.3**

**Property 4: API Response Localization**
*For any* API request with an Accept-Language header, error messages in the response SHALL be in the language specified by the header (zh or en)
**Validates: Requirements 4.1, 4.2**

**Property 5: SVG Label Localization**
*For any* SVG preview generation with a language parameter, the generated SVG SHALL contain labels in the specified language
**Validates: Requirements 4.3**

**Property 6: Code Comment Translation**
*For any* code block with translatable comments, switching language SHALL update the comment text to the selected language
**Validates: Requirements 2.5, 3.4**

## Error Handling

### Frontend Errors

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Missing translation key | Return the key itself as fallback |
| localStorage unavailable | Use in-memory storage, default to browser language |
| Invalid language code | Default to 'zh' for backward compatibility |

### Backend Errors

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Invalid Accept-Language header | Default to 'zh' |
| Missing error message translation | Return English message as fallback |

## Testing Strategy

### Dual Testing Approach

This implementation requires both unit tests and property-based tests:

- **Unit tests**: Verify specific translation keys exist, language switcher renders correctly
- **Property-based tests**: Verify translation completeness and DOM update consistency

### Property-Based Testing Library

For JavaScript/TypeScript testing, we will use **fast-check** as the property-based testing library.

### Test Categories

1. **Translation Completeness Tests**
   - Generate random translation keys
   - Verify both zh and en translations exist
   - Tag: `**Feature: led-calculator-i18n, Property 1: Translation Completeness**`

2. **Language Persistence Tests**
   - Test localStorage round-trip
   - Tag: `**Feature: led-calculator-i18n, Property 2: Language Persistence Round-Trip**`

3. **DOM Update Tests**
   - Verify all data-i18n elements update correctly
   - Tag: `**Feature: led-calculator-i18n, Property 3: DOM Update Consistency**`

4. **API Localization Tests**
   - Test error message localization with different Accept-Language headers
   - Tag: `**Feature: led-calculator-i18n, Property 4: API Response Localization**`

5. **SVG Label Tests**
   - Verify SVG contains correct language labels
   - Tag: `**Feature: led-calculator-i18n, Property 5: SVG Label Localization**`

### Test Configuration

Property-based tests should run a minimum of 100 iterations to ensure adequate coverage of the input space.

```javascript
// jest.config.js or test setup
fc.configureGlobal({ numRuns: 100 });
```

