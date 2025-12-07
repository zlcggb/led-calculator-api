/**
 * Verification script for SVG language parameter
 * Tests that the SVG generator correctly localizes the person reference label
 */

const { generateSVGPreview } = require('./dist/utils/svg-generator');

// Test data
const calculationResult = {
  wallDimensions: { width: 3, height: 2, area: 6, diagonal: 141.42 },
  cabinetCount: { total: 6, horizontal: 3, vertical: 2 },
  pixels: { totalWidth: 1920, totalHeight: 1080, totalPixels: 2073600, pixelDensity: 345600 },
  powerConsumption: { maximum: 3000, typical: 1500, standby: 30, heatGeneration: { maxBTU: 10236, typicalBTU: 5118 } },
  physical: { totalWeight: 60, structuralLoad: 10 },
  controlSystem: { controllers4K: 1, sendingCards: 1, fiberCables: 2 }
};

const roomConfig = {
  dimensions: { width: 5, height: 3 },
  unit: 'meters',
  wallType: 'flat'
};

console.log('=== SVG Language Parameter Verification ===\n');

// Test with Chinese language
const svgZh = generateSVGPreview(calculationResult, roomConfig, { language: 'zh', showPerson: true });
const hasChineseLabel = svgZh.includes('女性: 1.60 m');
console.log('Test 1: Chinese label (zh, meters):', hasChineseLabel ? '✅ PASS' : '❌ FAIL');
if (!hasChineseLabel) {
  console.log('  Expected: 女性: 1.60 m');
}

// Test with English language
const svgEn = generateSVGPreview(calculationResult, roomConfig, { language: 'en', showPerson: true });
const hasEnglishLabel = svgEn.includes('Woman: 1.60 m');
console.log('Test 2: English label (en, meters):', hasEnglishLabel ? '✅ PASS' : '❌ FAIL');
if (!hasEnglishLabel) {
  console.log('  Expected: Woman: 1.60 m');
}

// Test with feet unit
const roomConfigFeet = { ...roomConfig, unit: 'feet' };
const svgZhFeet = generateSVGPreview(calculationResult, roomConfigFeet, { language: 'zh', showPerson: true });
const hasChineseFeetLabel = svgZhFeet.includes('女性: 5.25 ft');
console.log('Test 3: Chinese label (zh, feet):', hasChineseFeetLabel ? '✅ PASS' : '❌ FAIL');
if (!hasChineseFeetLabel) {
  console.log('  Expected: 女性: 5.25 ft');
}

const svgEnFeet = generateSVGPreview(calculationResult, roomConfigFeet, { language: 'en', showPerson: true });
const hasEnglishFeetLabel = svgEnFeet.includes('Woman: 5.25 ft');
console.log('Test 4: English label (en, feet):', hasEnglishFeetLabel ? '✅ PASS' : '❌ FAIL');
if (!hasEnglishFeetLabel) {
  console.log('  Expected: Woman: 5.25 ft');
}

// Test default language (should be 'en')
const svgDefault = generateSVGPreview(calculationResult, roomConfig, { showPerson: true });
const hasDefaultEnglishLabel = svgDefault.includes('Woman: 1.60 m');
console.log('Test 5: Default language (should be en):', hasDefaultEnglishLabel ? '✅ PASS' : '❌ FAIL');

console.log('\n=== Verification Complete ===');

// Exit with error code if any test failed
const allPassed = hasChineseLabel && hasEnglishLabel && hasChineseFeetLabel && hasEnglishFeetLabel && hasDefaultEnglishLabel;
process.exit(allPassed ? 0 : 1);
