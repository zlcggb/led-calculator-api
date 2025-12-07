# Implementation Plan

## LED Calculator API Internationalization

- [x] 1. Implement test-page.html internationalization
  - [x] 1.1 Create translation object with all UI text for test-page.html
    - Define translations object with zh and en keys
    - Include header, tabs, form labels, buttons, result labels, status messages
    - _Requirements: 1.3, 5.1_
  - [x] 1.2 Add language switcher component to test-page.html header
    - Add switcher HTML with flag icons (🇨🇳/🇺🇸)
    - Style switcher to match existing header design
    - _Requirements: 1.1, 6.1, 6.2_
  - [x] 1.3 Implement i18n JavaScript module in test-page.html
    - Add t() function for translation lookup
    - Add setLanguage() function with localStorage persistence
    - Add updateDOM() function to update all translatable elements
    - Add browser language detection for default
    - _Requirements: 1.2, 1.4, 1.5, 1.6_
  - [x] 1.4 Add data-i18n attributes to all translatable elements in test-page.html
    - Mark headers, labels, buttons, placeholders, status text
    - Handle dynamic content (API responses, calculation results)
    - _Requirements: 1.3, 5.3_
  - [ ]* 1.5 Write property test for translation completeness (test-page)
    - **Property 1: Translation Completeness**
    - **Validates: Requirements 1.3**

- [x] 2. Implement api-reference.html internationalization
  - [x] 2.1 Create translation object for api-reference.html
    - Include section titles, field descriptions, table headers
    - Include code comments translations
    - _Requirements: 2.2, 2.3_
  - [x] 2.2 Add language switcher component to api-reference.html header
    - Reuse same switcher design from test-page
    - _Requirements: 2.1, 6.1_
  - [x] 2.3 Implement i18n JavaScript module in api-reference.html
    - Same structure as test-page implementation
    - Add special handling for code block comments
    - _Requirements: 2.2, 2.3, 2.5_
  - [x] 2.4 Add data-i18n attributes to api-reference.html content
    - Mark all documentation text, table content, notes
    - Handle code examples with translatable comments
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  - [ ]* 2.5 Write property test for code comment translation
    - **Property 6: Code Comment Translation**
    - **Validates: Requirements 2.5**

- [x] 3. Implement vue-integration.html internationalization
  - [x] 3.1 Create translation object for vue-integration.html
    - Include step descriptions, notes, warnings
    - Include code comments translations
    - _Requirements: 3.2, 3.3_
  - [x] 3.2 Add language switcher component to vue-integration.html header
    - Reuse same switcher design
    - _Requirements: 3.1, 6.1_
  - [x] 3.3 Implement i18n JavaScript module in vue-integration.html
    - Same structure as previous implementations
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 3.4 Add data-i18n attributes to vue-integration.html content
    - Mark tutorial text, code comments, notes
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 4. Checkpoint - Verify frontend i18n implementation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement API error message localization
  - [x] 5.1 Create i18n middleware for Express
    - Parse Accept-Language header
    - Attach language preference to request object
    - _Requirements: 4.1, 4.2_
  - [x] 5.2 Create error message translation module
    - Define error messages in zh and en
    - Export getLocalizedError function
    - _Requirements: 4.1, 4.2_
  - [x] 5.3 Update error handler middleware to use localized messages
    - Use request language preference for error responses
    - Default to zh for backward compatibility
    - _Requirements: 4.1, 4.2, 4.4_
  - [ ]* 5.4 Write property test for API response localization
    - **Property 4: API Response Localization**
    - **Validates: Requirements 4.1, 4.2**

- [-] 6. Verify and enhance SVG preview localization
  - [ ] 6.1 Verify existing SVG language parameter works correctly
    - Test with language: 'zh' and language: 'en'
    - Verify person reference label is localized
    - _Requirements: 4.3_
  - [ ]* 6.2 Write property test for SVG label localization
    - **Property 5: SVG Label Localization**
    - **Validates: Requirements 4.3**

- [ ] 7. Final Checkpoint - Verify all i18n functionality
  - Ensure all tests pass, ask the user if questions arise.

