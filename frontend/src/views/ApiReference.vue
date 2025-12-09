<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'

const { t, locale } = useI18n()

const tocItems = [
  { id: 'overview', key: 'docs.toc.overview' },
  { id: 'cabinet-specs', key: 'docs.toc.cabinetSpecs' },
  { id: 'room-config', key: 'docs.toc.roomConfig' },
  { id: 'optimal-layout', key: 'docs.toc.optimalLayout' },
  { id: 'smart-combination', key: 'docs.toc.smartCombination' },
  { id: 'oneclick-apis', key: 'docs.toc.oneclickApis' },
  { id: 'preview', key: 'docs.toc.preview' },
  { id: 'examples', key: 'docs.toc.examples' },
]

// Localized comments
const c = computed(() => locale.value === 'zh' ? {
  // Cabinet Specs comments
  dimensions: '// 箱体尺寸',
  width: '// 箱体宽度 (mm) - 必填',
  height: '// 箱体高度 (mm) - 必填',
  depth: '// 箱体深度 (mm) - 可选',
  display: '// 显示参数',
  pixelPitch: '// 像素间距 (mm) - 必填',
  resolution: '// 单箱体分辨率',
  resWidth: '// 水平分辨率 (px) - 必填',
  resHeight: '// 垂直分辨率 (px) - 必填',
  brightness: '// 亮度 (nits) - 可选',
  refreshRate: '// 刷新率 (Hz) - 可选',
  colorDepth: '// 色深 (bit) - 可选',
  power: '// 功率参数',
  maxPower: '// 最大功率 (W) - 必填',
  typicalPower: '// 典型功率 (W) - 必填',
  standbyPower: '// 待机功率 (W) - 可选',
  physical: '// 物理参数',
  weight: '// 单箱体重量 (kg) - 必填',
  // Room Config comments
  roomDimensions: '// 可用墙面尺寸',
  roomWidth: '// 墙面宽度',
  roomHeight: '// 墙面高度',
  unit: '// 单位: "meters" 或 "feet"',
  wallType: '// 墙面类型: "flat"',
  // Response comments
  success: '// 请求是否成功',
  columns: '// 推荐列数',
  rows: '// 推荐行数',
  totalCabinets: '// 箱体总数',
  screenWidth: '// 屏幕实际宽度 (mm)',
  screenHeight: '// 屏幕实际高度 (mm)',
  coverage: '// 墙面覆盖率 (0-1)',
  // Smart Combination
  mainCabinet: '// 主箱体配置',
  cabinetId: '// 箱体唯一标识符',
  specs: '// 箱体规格 (同 CabinetSpecs)',
  auxiliaryCabinets: '// 辅助箱体数组',
  wallWidthMm: '// 可用墙面宽度 (mm)',
  wallHeightMm: '// 可用墙面高度 (mm)',
  isFullyFilled: '// 是否完全填充',
  coveragePercentage: '// 覆盖率百分比',
  bestCombination: '// 最优组合方案',
  count: '// 该箱体数量',
  adjustedSize: '// 实际屏幕尺寸 (mm)',
  // Preview
  showDimensions: '// 显示尺寸标注',
  showPerson: '// 显示人物参照 (1.7m)',
  canvasWidth: '// 画布宽度 (px)',
  canvasHeight: '// 画布高度 (px)',
  language: '// 语言: "zh" 或 "en"',
  svg: '// SVG 图像字符串',
} : {
  // English comments
  dimensions: '// Cabinet dimensions',
  width: '// Cabinet width (mm) - Required',
  height: '// Cabinet height (mm) - Required',
  depth: '// Cabinet depth (mm) - Optional',
  display: '// Display parameters',
  pixelPitch: '// Pixel pitch (mm) - Required',
  resolution: '// Single cabinet resolution',
  resWidth: '// Horizontal resolution (px) - Required',
  resHeight: '// Vertical resolution (px) - Required',
  brightness: '// Brightness (nits) - Optional',
  refreshRate: '// Refresh rate (Hz) - Optional',
  colorDepth: '// Color depth (bit) - Optional',
  power: '// Power parameters',
  maxPower: '// Max power (W) - Required',
  typicalPower: '// Typical power (W) - Required',
  standbyPower: '// Standby power (W) - Optional',
  physical: '// Physical parameters',
  weight: '// Single cabinet weight (kg) - Required',
  // Room Config comments
  roomDimensions: '// Available wall dimensions',
  roomWidth: '// Wall width',
  roomHeight: '// Wall height',
  unit: '// Unit: "meters" or "feet"',
  wallType: '// Wall type: "flat"',
  // Response comments
  success: '// Request success flag',
  columns: '// Recommended columns',
  rows: '// Recommended rows',
  totalCabinets: '// Total cabinet count',
  screenWidth: '// Actual screen width (mm)',
  screenHeight: '// Actual screen height (mm)',
  coverage: '// Wall coverage (0-1)',
  // Smart Combination
  mainCabinet: '// Main cabinet config',
  cabinetId: '// Unique cabinet identifier',
  specs: '// Cabinet specs (same as CabinetSpecs)',
  auxiliaryCabinets: '// Auxiliary cabinets array',
  wallWidthMm: '// Available wall width (mm)',
  wallHeightMm: '// Available wall height (mm)',
  isFullyFilled: '// Whether fully filled',
  coveragePercentage: '// Coverage percentage',
  bestCombination: '// Optimal combination',
  count: '// Cabinet count',
  adjustedSize: '// Actual screen size (mm)',
  // Preview
  showDimensions: '// Show dimension annotations',
  showPerson: '// Show person reference (1.7m)',
  canvasWidth: '// Canvas width (px)',
  canvasHeight: '// Canvas height (px)',
  language: '// Language: "zh" or "en"',
  svg: '// SVG image string',
})

// Code examples
const cabinetSpecsCode = computed(() => `{
  "dimensions": {                    ${c.value.dimensions}
    "width": 500,                    ${c.value.width}
    "height": 1000,                  ${c.value.height}
    "depth": 40                      ${c.value.depth}
  },
  "display": {                       ${c.value.display}
    "pixelPitch": 1.5625,            ${c.value.pixelPitch}
    "resolution": {                  ${c.value.resolution}
      "width": 320,                  ${c.value.resWidth}
      "height": 640                  ${c.value.resHeight}
    },
    "brightness": 1000,              ${c.value.brightness}
    "refreshRate": 5760,             ${c.value.refreshRate}
    "colorDepth": 16                 ${c.value.colorDepth}
  },
  "power": {                         ${c.value.power}
    "maxPower": 180,                 ${c.value.maxPower}
    "typicalPower": 60,              ${c.value.typicalPower}
    "standbyPower": 5                ${c.value.standbyPower}
  },
  "physical": {                      ${c.value.physical}
    "weight": 10.5                   ${c.value.weight}
  }
}`)

const roomConfigCode = computed(() => `{
  "dimensions": {                    ${c.value.roomDimensions}
    "width": 5,                      ${c.value.roomWidth}
    "height": 3                      ${c.value.roomHeight}
  },
  "unit": "meters",                  ${c.value.unit}
  "wallType": "flat"                 ${c.value.wallType}
}`)

// Full request with power/weight data
const optimalLayoutRequestCode = computed(() => `{
  "cabinetSpecs": {
    "dimensions": { "width": 500, "height": 1000, "depth": 40 },
    "display": {
      "pixelPitch": 1.5625,
      "resolution": { "width": 320, "height": 640 },
      "brightness": 1000,
      "refreshRate": 5760
    },
    "power": { "maxPower": 180, "typicalPower": 60 },  // ${locale.value === 'zh' ? '可选: 传入则返回功耗统计' : 'Optional: If provided, returns power stats'}
    "physical": { "weight": 10.5 }                     // ${locale.value === 'zh' ? '可选: 传入则返回重量统计' : 'Optional: If provided, returns weight stats'}
  },
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  }
}`)

// Layout-only request (without power/weight)
const layoutOnlyRequestCode = computed(() => `{
  "cabinetSpecs": {
    "dimensions": { "width": 500, "height": 1000, "depth": 40 },
    "display": {
      "pixelPitch": 1.5625,
      "resolution": { "width": 320, "height": 640 },
      "brightness": 1000,
      "refreshRate": 5760
    }
    ${locale.value === 'zh' ? '// 不传 power/physical → 仅返回布局结果' : '// No power/physical → Returns layout only'}
  },
  "roomConfig": {
    "dimensions": { "width": 5, "height": 3 },
    "unit": "meters",
    "wallType": "flat"
  }
}`)

// Layout-only response (without power/weight)
const layoutOnlyResponseCode = computed(() => `{
  "success": true,
  "data": {
    "columns": 10,
    "rows": 3,
    "totalCabinets": 30,
    "wallWidth": 5000,
    "wallHeight": 3000,
    "coverage": 1.0
    ${locale.value === 'zh' ? '// 无 powerConsumption/physical 字段' : '// No powerConsumption/physical fields'}
  }
}`)

const optimalLayoutResponseCode = computed(() => `{
  "success": true,                   ${c.value.success}
  "data": {
    "columns": 10,                   ${c.value.columns}
    "rows": 3,                       ${c.value.rows}
    "totalCabinets": 30,             ${c.value.totalCabinets}
    "wallWidth": 5000,               ${c.value.screenWidth}
    "wallHeight": 3000,              ${c.value.screenHeight}
    "coverage": 1.0,                 ${c.value.coverage}
    "powerConsumption": {            ${locale.value === 'zh' ? '// ⚡ 功耗统计 (当传入power时返回)' : '// ⚡ Power stats (returned if power provided)'}
      "maximum": 5400,               ${locale.value === 'zh' ? '// 最大功率 (W)' : '// Maximum power (W)'}
      "typical": 1800                ${locale.value === 'zh' ? '// 典型功率 (W)' : '// Typical power (W)'}
    },
    "physical": {                    ${locale.value === 'zh' ? '// 📦 物理参数 (当传入weight时返回)' : '// 📦 Physical params (returned if weight provided)'}
      "totalWeight": 315             ${locale.value === 'zh' ? '// 总重量 (kg)' : '// Total weight (kg)'}
    }
  }
}`)

const smartCombinationRequestCode = computed(() => `{
  "mainCabinet": {                   ${c.value.mainCabinet}
    "id": "uslimiii-500x1000",       ${c.value.cabinetId}
    "specs": { ... }                 ${c.value.specs}
  },
  "auxiliaryCabinets": [             ${c.value.auxiliaryCabinets}
    {
      "id": "uslimiii-500x500",
      "specs": { ... }
    },
    {
      "id": "uslimiii-250x500",
      "specs": { ... }
    }
  ],
  "wallWidthMm": 4300,               ${c.value.wallWidthMm}
  "wallHeightMm": 3300                ${c.value.wallHeightMm}
}`)

const smartCombinationResponseCode = computed(() => `{
  "success": true,
  "data": {
    "isFullyFilled": true,           ${c.value.isFullyFilled}
    "coveragePercentage": "100%",    ${c.value.coveragePercentage}
    "bestCombination": [             ${c.value.bestCombination}
      { "id": "uslimiii-500x1000", "count": 24 },
      { "id": "uslimiii-250x500", "count": 6 }
    ],
    "adjustedSize": {                ${c.value.adjustedSize}
      "width": 4250,
      "height": 3000
    },
    "calculationResult": {
      "wallDimensions": { "width": 4.25, "height": 3.0, "area": 12.75 },
      "powerConsumption": { "maximum": 4590, "typical": 1530 },
      "physical": { "totalWeight": 273 }
    }
  }
}`)

const previewOptionsCode = computed(() => `{
  "showDimensions": true,            ${c.value.showDimensions}
  "showPerson": true,                ${c.value.showPerson}
  "canvasWidth": 800,                ${c.value.canvasWidth}
  "canvasHeight": 500,               ${c.value.canvasHeight}
  "language": "zh"                   ${c.value.language}
}`)

const oneClickRequestCode = computed(() => `{
  "cabinetSpecs": { ... },           ${locale.value === 'zh' ? '// 箱体规格' : '// Cabinet specs'}
  "roomConfig": { ... },             ${locale.value === 'zh' ? '// 墙面配置' : '// Room config'}
  "targetResolution": "Custom",      ${locale.value === 'zh' ? '// 目标分辨率 (可选): "FHD" | "UHD" | "8K" | "Custom"' : '// Target resolution (optional): "FHD" | "UHD" | "8K" | "Custom"'}
  "previewOptions": {                ${locale.value === 'zh' ? '// 预览选项 (可选)' : '// Preview options (optional)'}
    "showDimensions": true,
    "showPerson": true,
    "canvasWidth": 800,
    "canvasHeight": 500,
    "language": "zh"
  }
}`)

// Resolution-based request example
const resolutionBasedRequestCode = computed(() => `{
  "cabinetSpecs": {
    "dimensions": { "width": 500, "height": 500, "depth": 40 },
    "display": {
      "pixelPitch": 1.5625,
      "resolution": { "width": 320, "height": 320 },  ${locale.value === 'zh' ? '// 单箱体分辨率' : '// Single cabinet resolution'}
      "brightness": 1000,
      "refreshRate": 5760
    },
    "power": { "maxPower": 90, "typicalPower": 30 },
    "physical": { "weight": 5.5 }
  },
  "roomConfig": {
    "dimensions": { "width": 10, "height": 6 },       ${locale.value === 'zh' ? '// 使用分辨率模式时会被忽略' : '// Ignored when using resolution mode'}
    "unit": "meters",
    "wallType": "flat"
  },
  "targetResolution": "UHD",                          ${locale.value === 'zh' ? '// 指定4K分辨率 (3840×2160)' : '// Specify 4K resolution (3840×2160)'}
  "previewOptions": {
    "showDimensions": true,
    "showPerson": true,
    "language": "zh"
  }
}`)

// Resolution-based response example
const resolutionBasedResponseCode = computed(() => `{
  "success": true,
  "data": {
    "columns": 12,                                    ${locale.value === 'zh' ? '// 自动计算: ceil(3840/320) = 12' : '// Auto calculated: ceil(3840/320) = 12'}
    "rows": 7,                                        ${locale.value === 'zh' ? '// 自动计算: ceil(2160/320) = 7' : '// Auto calculated: ceil(2160/320) = 7'}
    "totalCabinets": 84,
    "screenDimensions": {
      "widthM": 6.0,                                  ${locale.value === 'zh' ? '// 12列 × 500mm = 6000mm' : '// 12 cols × 500mm = 6000mm'}
      "heightM": 3.5,                                 ${locale.value === 'zh' ? '// 7行 × 500mm = 3500mm' : '// 7 rows × 500mm = 3500mm'}
      "areaM2": 21.0
    },
    "resolution": {                                   ${locale.value === 'zh' ? '// 🎯 分辨率信息' : '// 🎯 Resolution info'}
      "mode": "UHD",                                  ${locale.value === 'zh' ? '// 使用的分辨率模式' : '// Resolution mode used'}
      "target": {                                     ${locale.value === 'zh' ? '// 目标分辨率' : '// Target resolution'}
        "width": 3840,
        "height": 2160,
        "name": "4K Ultra HD"
      },
      "actual": {                                     ${locale.value === 'zh' ? '// 实际分辨率 (可能略大于目标)' : '// Actual resolution (may be slightly larger)'}
        "width": 3840,                                ${locale.value === 'zh' ? '// 12 × 320 = 3840' : '// 12 × 320 = 3840'}
        "height": 2240,                               ${locale.value === 'zh' ? '// 7 × 320 = 2240' : '// 7 × 320 = 2240'}
        "totalPixels": 8601600
      }
    },
    "powerConsumption": { "maximum": 7560, "typical": 2520 },
    "physical": { "totalWeight": 462 },
    "preview": { "svg": "<svg>...</svg>", "width": 800, "height": 500 }
  }
}`)

const oneClickResponseCode = computed(() => `{
  "success": true,
  "data": {
    "columns": 10,
    "rows": 3,
    "totalCabinets": 30,
    "screenDimensions": {
      "widthM": 5.0,
      "heightM": 3.0,
      "areaM2": 15.0
    },
    "powerConsumption": {            ${locale.value === 'zh' ? '// ⚡ 功耗统计' : '// ⚡ Power statistics'}
      "maximum": 5400,               ${locale.value === 'zh' ? '// 最大功率 (W)' : '// Maximum power (W)'}
      "typical": 1800                ${locale.value === 'zh' ? '// 典型功率 (W)' : '// Typical power (W)'}
    },
    "physical": {                    ${locale.value === 'zh' ? '// 📦 物理参数' : '// 📦 Physical params'}
      "totalWeight": 315             ${locale.value === 'zh' ? '// 总重量 (kg)' : '// Total weight (kg)'}
    },
    "preview": {                     ${locale.value === 'zh' ? '// SVG 预览数据' : '// SVG preview data'}
      "svg": "<svg>...</svg>",       ${c.value.svg}
      "width": 800,
      "height": 500
    }
  }
}`)

// Field description tables
const cabinetDimensionsFields = computed(() => [
  { path: 'dimensions.width', type: 'number', required: true, unit: 'mm', desc: locale.value === 'zh' ? '箱体宽度，水平方向的物理尺寸' : 'Cabinet width, physical dimension in horizontal direction' },
  { path: 'dimensions.height', type: 'number', required: true, unit: 'mm', desc: locale.value === 'zh' ? '箱体高度，垂直方向的物理尺寸' : 'Cabinet height, physical dimension in vertical direction' },
  { path: 'dimensions.depth', type: 'number', required: false, unit: 'mm', desc: locale.value === 'zh' ? '箱体深度/厚度，用于安装空间规划' : 'Cabinet depth/thickness, for installation space planning' },
])

const cabinetDisplayFields = computed(() => [
  { path: 'display.pixelPitch', type: 'number', required: true, unit: 'mm', desc: locale.value === 'zh' ? '像素间距，相邻LED灯珠中心点之间的距离' : 'Pixel pitch, distance between adjacent LED bead centers' },
  { path: 'display.resolution.width', type: 'number', required: true, unit: 'px', desc: locale.value === 'zh' ? '单箱体水平分辨率 = 箱体宽度 ÷ 像素间距' : 'Horizontal resolution = width ÷ pixelPitch' },
  { path: 'display.resolution.height', type: 'number', required: true, unit: 'px', desc: locale.value === 'zh' ? '单箱体垂直分辨率 = 箱体高度 ÷ 像素间距' : 'Vertical resolution = height ÷ pixelPitch' },
  { path: 'display.brightness', type: 'number', required: false, unit: 'nits', desc: locale.value === 'zh' ? '屏幕亮度，室内屏通常600-1500nits' : 'Screen brightness, indoor typically 600-1500nits' },
  { path: 'display.refreshRate', type: 'number', required: false, unit: 'Hz', desc: locale.value === 'zh' ? '刷新率，常见值：1920、3840、5760Hz' : 'Refresh rate, common values: 1920, 3840, 5760Hz' },
  { path: 'display.colorDepth', type: 'number', required: false, unit: 'bit', desc: locale.value === 'zh' ? '色深，常见值：14bit、16bit' : 'Color depth, common values: 14bit, 16bit' },
])

const cabinetPowerFields = computed(() => [
  { path: 'power.maxPower', type: 'number', required: false, unit: 'W', desc: locale.value === 'zh' ? '最大功率，全白画面时的功率消耗。可选字段，传入后会返回功耗统计' : 'Max power consumption at full white screen. Optional - if provided, power stats will be returned' },
  { path: 'power.typicalPower', type: 'number', required: false, unit: 'W', desc: locale.value === 'zh' ? '典型功率，正常播放时的平均功率' : 'Typical power during normal playback' },
  { path: 'power.standbyPower', type: 'number', required: false, unit: 'W', desc: locale.value === 'zh' ? '待机功率，屏幕关闭但系统通电时的功率' : 'Standby power when screen off but system powered' },
])

const cabinetPhysicalFields = computed(() => [
  { path: 'physical.weight', type: 'number', required: false, unit: 'kg', desc: locale.value === 'zh' ? '单箱体重量，用于计算整屏总重量和结构承重。可选字段，传入后会返回重量统计' : 'Single cabinet weight, for total weight and structural load. Optional - if provided, weight stats will be returned' },
])

const roomConfigFields = computed(() => [
  { path: 'dimensions.width', type: 'number', required: true, unit: '-', desc: locale.value === 'zh' ? '可用墙面最大宽度' : 'Maximum available wall width' },
  { path: 'dimensions.height', type: 'number', required: true, unit: '-', desc: locale.value === 'zh' ? '可用墙面最大高度' : 'Maximum available wall height' },
  { path: 'unit', type: 'string', required: true, unit: '-', desc: locale.value === 'zh' ? '尺寸单位："meters" 或 "feet"' : 'Size unit: "meters" or "feet"' },
  { path: 'wallType', type: 'string', required: false, unit: '-', desc: locale.value === 'zh' ? '墙面类型，目前仅支持 "flat"' : 'Wall type, currently only "flat" supported' },
])

const previewOptionsFields = computed(() => [
  { path: 'showDimensions', type: 'boolean', default: 'true', desc: locale.value === 'zh' ? '是否显示尺寸标注（宽度、高度）' : 'Show dimension annotations (width, height)' },
  { path: 'showPerson', type: 'boolean', default: 'true', desc: locale.value === 'zh' ? '是否显示人物参照（1.7m高）' : 'Show person reference (1.7m tall)' },
  { path: 'canvasWidth', type: 'number', default: '800', desc: locale.value === 'zh' ? 'SVG画布宽度（像素）' : 'SVG canvas width (pixels)' },
  { path: 'canvasHeight', type: 'number', default: '500', desc: locale.value === 'zh' ? 'SVG画布高度（像素）' : 'SVG canvas height (pixels)' },
  { path: 'language', type: 'string', default: '"zh"', desc: locale.value === 'zh' ? '语言设置："zh" 中文，"en" 英文' : 'Language: "zh" Chinese, "en" English' },
])

// Resolution presets table
const resolutionPresetsTable = computed(() => [
  { preset: 'FHD', resolution: '1920 × 1080', name: locale.value === 'zh' ? '全高清 (1080p)' : 'Full HD (1080p)', desc: locale.value === 'zh' ? '适合小型会议室、零售展示' : 'Suitable for small meeting rooms, retail displays' },
  { preset: 'UHD', resolution: '3840 × 2160', name: locale.value === 'zh' ? '4K 超高清' : '4K Ultra HD', desc: locale.value === 'zh' ? '适合中大型会议室、展厅' : 'Suitable for medium-large meeting rooms, showrooms' },
  { preset: '8K', resolution: '7680 × 4320', name: locale.value === 'zh' ? '8K 超高清' : '8K Ultra HD', desc: locale.value === 'zh' ? '适合大型展厅、指挥中心' : 'Suitable for large showrooms, command centers' },
  { preset: 'Custom', resolution: '-', name: locale.value === 'zh' ? '自定义' : 'Custom', desc: locale.value === 'zh' ? '使用 roomConfig.dimensions 指定墙面尺寸' : 'Use roomConfig.dimensions to specify wall size' },
])

// Resolution response fields
const resolutionResponseFields = computed(() => [
  { path: 'resolution.mode', type: 'string', desc: locale.value === 'zh' ? '使用的分辨率模式：FHD/UHD/8K/Custom' : 'Resolution mode used: FHD/UHD/8K/Custom' },
  { path: 'resolution.target.width', type: 'number', desc: locale.value === 'zh' ? '目标水平分辨率（像素）' : 'Target horizontal resolution (pixels)' },
  { path: 'resolution.target.height', type: 'number', desc: locale.value === 'zh' ? '目标垂直分辨率（像素）' : 'Target vertical resolution (pixels)' },
  { path: 'resolution.target.name', type: 'string', desc: locale.value === 'zh' ? '分辨率名称' : 'Resolution name' },
  { path: 'resolution.actual.width', type: 'number', desc: locale.value === 'zh' ? '实际水平分辨率（可能略大于目标）' : 'Actual horizontal resolution (may be slightly larger)' },
  { path: 'resolution.actual.height', type: 'number', desc: locale.value === 'zh' ? '实际垂直分辨率（可能略大于目标）' : 'Actual vertical resolution (may be slightly larger)' },
  { path: 'resolution.actual.totalPixels', type: 'number', desc: locale.value === 'zh' ? '总像素数' : 'Total pixel count' },
])
</script>

<template>
  <div class="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900 py-8">
    <div class="container-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="section-title">📚 {{ t('docs.title') }}</h1>
        <p class="section-subtitle mx-auto">{{ t('docs.subtitle') }}</p>
      </div>

      <div class="max-w-5xl mx-auto">
        <!-- Table of Contents -->
        <div class="card p-6 mb-8">
          <h2 class="text-lg font-semibold text-primary mb-4">{{ t('docs.toc.title') }}</h2>
          <div class="grid md:grid-cols-2 gap-2">
            <a
              v-for="(item, index) in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/50 transition-colors"
            >
              <span class="text-apple-gray-400 text-sm">{{ index + 1 }}.</span>
              <span class="text-apple-gray-700 dark:text-apple-gray-300">{{ t(item.key) }}</span>
            </a>
          </div>
        </div>

        <!-- Overview Section -->
        <section id="overview" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            1. {{ t('docs.overview.title') }}
          </h2>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ t('docs.overview.description') }}
          </p>

          <!-- API Endpoints Table -->
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>{{ locale === 'zh' ? '功能' : 'Function' }}</th>
                  <th>{{ locale === 'zh' ? '推荐' : 'Recommended' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code class="inline-code">/api/calculate/optimal-layout</code></td>
                  <td>{{ locale === 'zh' ? '单箱体最优布局计算' : 'Single cabinet optimal layout' }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td><code class="inline-code">/api/calculate/smart-combination</code></td>
                  <td>{{ locale === 'zh' ? '多箱体智能组合计算' : 'Multi-cabinet smart combination' }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td><code class="inline-code">/api/calculate/optimal-layout-with-preview</code></td>
                  <td>{{ locale === 'zh' ? '单箱体计算 + SVG预览' : 'Single cabinet + SVG Preview' }}</td>
                  <td><span class="badge-success">⚡ {{ locale === 'zh' ? '推荐' : 'Recommended' }}</span></td>
                </tr>
                <tr>
                  <td><code class="inline-code">/api/calculate/smart-combination-with-preview</code></td>
                  <td>{{ locale === 'zh' ? '多箱体计算 + SVG预览' : 'Multi-cabinet + SVG Preview' }}</td>
                  <td><span class="badge-success">⚡ {{ locale === 'zh' ? '推荐' : 'Recommended' }}</span></td>
                </tr>
                <tr>
                  <td><code class="inline-code">/api/preview/svg</code></td>
                  <td>{{ locale === 'zh' ? 'SVG预览图生成' : 'SVG preview generation' }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- API Base URL -->
          <div class="alert-info mt-6">
            <div>
              <div class="font-semibold text-primary mb-1">🚀 {{ t('docs.overview.apiBase') }}</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ t('docs.overview.production') }}: <code class="inline-code">https://led-api.unilumin-gtm.com</code>
              </p>
            </div>
          </div>
        </section>

        <!-- Cabinet Specs Section -->
        <section id="cabinet-specs" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            2. {{ t('docs.toc.cabinetSpecs') }} (CabinetSpecs)
          </h2>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '所有计算接口都需要提供箱体规格数据，以下是完整的数据结构定义：' 
              : 'All calculation endpoints require cabinet specification data. Below is the complete data structure:' }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '2.1 完整数据结构' : '2.1 Complete Data Structure' }}
          </h3>
          <CodeBlock :code="cabinetSpecsCode" language="json" filename="CabinetSpecs" />

          <!-- Dimensions Fields -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '2.2 dimensions - 箱体尺寸' : '2.2 dimensions - Cabinet Dimensions' }}
          </h3>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-4">
            {{ locale === 'zh' 
              ? '定义箱体的物理尺寸，用于计算屏幕布局和排列。' 
              : 'Define physical dimensions of the cabinet for screen layout calculation.' }}
          </p>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ t('docs.tables.required') }}</th>
                  <th>{{ t('docs.tables.unit') }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in cabinetDimensionsFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td>
                    <span :class="field.required ? 'badge-error' : 'badge-secondary'">
                      {{ field.required ? t('docs.tables.required') : t('docs.tables.optional') }}
                    </span>
                  </td>
                  <td>{{ field.unit }}</td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Display Fields -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '2.3 display - 显示参数' : '2.3 display - Display Parameters' }}
          </h3>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-4">
            {{ locale === 'zh' 
              ? '定义LED显示屏的显示性能参数，用于计算分辨率和显示效果。' 
              : 'Define LED display performance parameters for resolution and display effect calculations.' }}
          </p>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ t('docs.tables.required') }}</th>
                  <th>{{ t('docs.tables.unit') }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in cabinetDisplayFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td>
                    <span :class="field.required ? 'badge-error' : 'badge-secondary'">
                      {{ field.required ? t('docs.tables.required') : t('docs.tables.optional') }}
                    </span>
                  </td>
                  <td>{{ field.unit }}</td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Power Fields -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '2.4 power - 功率参数' : '2.4 power - Power Parameters' }}
          </h3>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-4">
            {{ locale === 'zh' 
              ? '定义箱体的电力消耗参数，用于计算整屏的功率需求。' 
              : 'Define power consumption parameters for total screen power calculation.' }}
          </p>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ t('docs.tables.required') }}</th>
                  <th>{{ t('docs.tables.unit') }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in cabinetPowerFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td>
                    <span :class="field.required ? 'badge-error' : 'badge-secondary'">
                      {{ field.required ? t('docs.tables.required') : t('docs.tables.optional') }}
                    </span>
                  </td>
                  <td>{{ field.unit }}</td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Physical Fields -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '2.5 physical - 物理参数' : '2.5 physical - Physical Parameters' }}
          </h3>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ t('docs.tables.required') }}</th>
                  <th>{{ t('docs.tables.unit') }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in cabinetPhysicalFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td>
                    <span :class="field.required ? 'badge-error' : 'badge-secondary'">
                      {{ field.required ? t('docs.tables.required') : t('docs.tables.optional') }}
                    </span>
                  </td>
                  <td>{{ field.unit }}</td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Note -->
          <div class="alert-warning mt-6">
            <div>
              <div class="font-semibold text-apple-yellow mb-1">💡 {{ locale === 'zh' ? '可选参数说明' : 'Optional Parameters Note' }}</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ locale === 'zh' 
                  ? '核心必填字段：dimensions（width, height）、display（pixelPitch, resolution）。power 和 physical 为可选参数 - 仅计算布局时可不传；传入时会返回相应的功耗/重量统计。' 
                  : 'Core required fields: dimensions (width, height), display (pixelPitch, resolution). power and physical are optional - omit for layout-only calculation; provide them to get power/weight statistics in response.' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Room Config Section -->
        <section id="room-config" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            3. {{ t('docs.toc.roomConfig') }} (RoomConfig)
          </h2>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '定义LED屏幕的安装空间限制，API将在此范围内计算最优布局。' 
              : 'Define LED screen installation space constraints. API will calculate optimal layout within this range.' }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '3.1 完整数据结构' : '3.1 Complete Data Structure' }}
          </h3>
          <CodeBlock :code="roomConfigCode" language="json" filename="RoomConfig" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '3.2 字段说明' : '3.2 Field Descriptions' }}
          </h3>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ t('docs.tables.required') }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in roomConfigFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td>
                    <span :class="field.required ? 'badge-error' : 'badge-secondary'">
                      {{ field.required ? t('docs.tables.required') : t('docs.tables.optional') }}
                    </span>
                  </td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Optimal Layout Section -->
        <section id="optimal-layout" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            4. {{ t('docs.toc.optimalLayout') }}
          </h2>
          
          <div class="flex items-center gap-3 mb-6">
            <span class="method-post">POST</span>
            <code class="inline-code">/api/calculate/optimal-layout</code>
          </div>

          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '在指定墙面尺寸内，使用单一箱体型号拼接LED屏幕，自动计算最优的行列布局。适用于使用统一规格箱体的标准项目。'
              : 'Calculate optimal row and column layout for LED screen using a single cabinet model within specified wall dimensions.' }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '4.1 完整请求示例（包含功耗/重量）' : '4.1 Full Request Example (with power/weight)' }}
          </h3>
          <CodeBlock :code="optimalLayoutRequestCode" language="json" :filename="locale === 'zh' ? '完整请求' : 'Full Request'" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '4.2 完整响应示例' : '4.2 Full Response Example' }}
          </h3>
          <CodeBlock :code="optimalLayoutResponseCode" language="json" filename="Response" />

          <!-- Layout Only Example -->
          <div class="alert-info mt-8">
            <div>
              <div class="font-semibold text-primary mb-1">📐 {{ locale === 'zh' ? '仅布局计算' : 'Layout-Only Calculation' }}</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ locale === 'zh' 
                  ? '如果只需要计算屏幕布局，不需要功耗/重量统计，可以省略 power 和 physical 参数：'
                  : 'If you only need layout calculation without power/weight stats, you can omit power and physical:' }}
              </p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-6 mb-4">
            {{ locale === 'zh' ? '4.3 仅布局请求示例' : '4.3 Layout-Only Request' }}
          </h3>
          <CodeBlock :code="layoutOnlyRequestCode" language="json" :filename="locale === 'zh' ? '仅布局请求' : 'Layout-Only Request'" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-6 mb-4">
            {{ locale === 'zh' ? '4.4 仅布局响应示例' : '4.4 Layout-Only Response' }}
          </h3>
          <CodeBlock :code="layoutOnlyResponseCode" language="json" :filename="locale === 'zh' ? '仅布局响应' : 'Layout-Only Response'" />
        </section>

        <!-- Smart Combination Section -->
        <section id="smart-combination" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            5. {{ t('docs.toc.smartCombination') }}
          </h2>
          
          <div class="flex items-center gap-3 mb-6">
            <span class="method-post">POST</span>
            <code class="inline-code">/api/calculate/smart-combination</code>
          </div>

          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '在指定墙面尺寸内，使用多种尺寸箱体组合拼接LED屏幕，智能计算最佳填充方案。适用于需要精确填充特定空间的项目。'
              : 'Intelligently calculate the best combination of multiple cabinet sizes within specified wall dimensions.' }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '5.1 请求示例' : '5.1 Request Example' }}
          </h3>
          <CodeBlock :code="smartCombinationRequestCode" language="json" filename="Request Body" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '5.2 响应示例' : '5.2 Response Example' }}
          </h3>
          <CodeBlock :code="smartCombinationResponseCode" language="json" filename="Response" />

          <div class="alert-info mt-6">
            <div>
              <div class="font-semibold text-primary mb-1">💡 {{ locale === 'zh' ? '提示' : 'Tip' }}</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ locale === 'zh' 
                  ? '多箱体组合接口直接使用毫米(mm)作为墙面尺寸单位，与单箱体接口的 roomConfig 不同。'
                  : 'Multi-cabinet API uses millimeters (mm) directly for wall dimensions, different from single cabinet roomConfig.' }}
              </p>
            </div>
          </div>

          <!-- Auxiliary Cabinets Matching Rules -->
          <div class="mt-8 pt-6 border-t border-apple-gray-200 dark:border-apple-gray-700">
            <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
              {{ locale === 'zh' ? '5.3 辅助箱体匹配规则' : '5.3 Auxiliary Cabinet Matching Rules' }}
            </h3>
            
            <div class="alert-warning mb-6">
              <div>
                <div class="font-semibold text-apple-yellow mb-2">🔗 {{ locale === 'zh' ? '辅助箱体自动匹配条件' : 'Auxiliary Cabinet Auto-Matching Conditions' }}</div>
                <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-3">
                  {{ locale === 'zh' 
                    ? '辅助箱体必须与主箱体属于同一产品系列（family），才能进行组合计算。系统根据以下条件自动筛选可用的辅助箱体：'
                    : 'Auxiliary cabinets must belong to the same product family as the main cabinet for combination calculation. System auto-filters available auxiliary cabinets based on:' }}
                </p>
                <ul class="text-sm text-apple-gray-600 dark:text-apple-gray-400 space-y-2 ml-4">
                  <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">1.</span>
                    <span>{{ locale === 'zh' 
                      ? '同系列产品：辅助箱体的 family 字段必须与主箱体相同（如 UslimIII、UMiniW 等）'
                      : 'Same product family: auxiliary cabinet\'s family field must match main cabinet (e.g., UslimIII, UMiniW)' }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">2.</span>
                    <span>{{ locale === 'zh' 
                      ? '相同像素间距：同系列产品通常具有相同的 pixelPitch，确保拼接后画面一致性'
                      : 'Same pixel pitch: same family products typically have identical pixelPitch for seamless display' }}</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">3.</span>
                    <span>{{ locale === 'zh' 
                      ? '排除主箱体本身：辅助箱体列表不包含已选择的主箱体'
                      : 'Exclude main cabinet: auxiliary list does not include the selected main cabinet' }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Example Family Table -->
            <h4 class="text-base font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-3">
              {{ locale === 'zh' ? '产品系列示例' : 'Product Family Examples' }}
            </h4>
            <div class="overflow-x-auto mb-6">
              <table class="apple-table">
                <thead>
                  <tr>
                    <th>{{ locale === 'zh' ? '产品系列 (family)' : 'Product Family' }}</th>
                    <th>{{ locale === 'zh' ? '像素间距' : 'Pixel Pitch' }}</th>
                    <th>{{ locale === 'zh' ? '可用箱体尺寸' : 'Available Cabinet Sizes' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="inline-code">UslimIII</code></td>
                    <td>1.5625mm</td>
                    <td>500×1000, 500×500, 500×250, 250×500, 250×750, 750×250</td>
                  </tr>
                  <tr>
                    <td><code class="inline-code">UMiniW</code></td>
                    <td>0.9375mm</td>
                    <td>600×337.5, 300×337.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Matching Logic Explanation -->
            <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
              <h4 class="text-sm font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-2">
                {{ locale === 'zh' ? '匹配逻辑示例' : 'Matching Logic Example' }}
              </h4>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ locale === 'zh' 
                  ? '当选择 UslimIII MIP 1.5 (500×1000) 作为主箱体时，系统自动筛选出同系列的其他尺寸箱体作为辅助箱体：500×500、500×250、250×500、250×750、750×250。这些箱体具有相同的像素间距(1.5625mm)，可以无缝拼接。'
                  : 'When selecting UslimIII MIP 1.5 (500×1000) as main cabinet, system auto-filters other sizes from the same family as auxiliary: 500×500, 500×250, 250×500, 250×750, 750×250. These cabinets share the same pixel pitch (1.5625mm) for seamless tiling.' }}
              </p>
            </div>
          </div>
        </section>

        <!-- One-Click APIs Section -->
        <section id="oneclick-apis" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            6. {{ t('docs.toc.oneclickApis') }} ⚡
          </h2>
          
          <div class="alert-success mb-6">
            <div>
              <div class="font-semibold text-apple-green mb-1">⚡ {{ locale === 'zh' ? '推荐使用' : 'Recommended' }}</div>
              <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {{ locale === 'zh' 
                  ? '一键接口只需一次网络请求，同时返回计算结果和SVG预览图，避免重复数据传输，响应更快，集成更简单。'
                  : 'One-click APIs return both calculation results and SVG preview in a single request, reducing network calls and improving efficiency.' }}
              </p>
            </div>
          </div>

          <div class="space-y-4 mb-8">
            <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
              <div class="flex items-center gap-3 mb-2">
                <span class="method-post">POST</span>
                <code class="inline-code">/api/calculate/optimal-layout-with-preview</code>
              </div>
              <p class="text-sm text-apple-gray-500">{{ locale === 'zh' ? '单箱体一键计算 + SVG预览' : 'Single cabinet one-click + SVG preview' }}</p>
            </div>
            
            <div class="p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-apple">
              <div class="flex items-center gap-3 mb-2">
                <span class="method-post">POST</span>
                <code class="inline-code">/api/calculate/smart-combination-with-preview</code>
              </div>
              <p class="text-sm text-apple-gray-500">{{ locale === 'zh' ? '多箱体一键计算 + SVG预览' : 'Multi-cabinet one-click + SVG preview' }}</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '6.1 请求示例（单箱体）' : '6.1 Request Example (Single Cabinet)' }}
          </h3>
          <CodeBlock :code="oneClickRequestCode" language="json" filename="Request Body" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '6.2 响应示例' : '6.2 Response Example' }}
          </h3>
          <CodeBlock :code="oneClickResponseCode" language="json" filename="Response" />

          <!-- Target Resolution Section -->
          <div class="mt-10 pt-8 border-t border-apple-gray-200 dark:border-apple-gray-700">
            <h3 class="text-xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
              🎯 {{ locale === 'zh' ? '6.3 目标分辨率模式 (targetResolution)' : '6.3 Target Resolution Mode (targetResolution)' }}
            </h3>
            
            <div class="alert-info mb-6">
              <div>
                <div class="font-semibold text-primary mb-1">💡 {{ locale === 'zh' ? '分辨率优先计算' : 'Resolution-First Calculation' }}</div>
                <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                  {{ locale === 'zh' 
                    ? '使用 targetResolution 参数可以指定目标分辨率（FHD/UHD/8K），系统将自动计算所需的箱体行列数，而非基于墙面尺寸计算。这对于需要精确分辨率的项目非常有用。'
                    : 'Use targetResolution parameter to specify target resolution (FHD/UHD/8K). System will auto-calculate required cabinet rows/columns instead of wall-based calculation. Useful for projects requiring precise resolution.' }}
                </p>
              </div>
            </div>

            <!-- Resolution Presets Table -->
            <h4 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
              {{ locale === 'zh' ? '分辨率预设值' : 'Resolution Presets' }}
            </h4>
            <div class="overflow-x-auto mb-8">
              <table class="apple-table">
                <thead>
                  <tr>
                    <th>{{ locale === 'zh' ? '预设值' : 'Preset' }}</th>
                    <th>{{ locale === 'zh' ? '分辨率' : 'Resolution' }}</th>
                    <th>{{ locale === 'zh' ? '名称' : 'Name' }}</th>
                    <th>{{ locale === 'zh' ? '适用场景' : 'Use Case' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="preset in resolutionPresetsTable" :key="preset.preset">
                    <td><code class="inline-code">{{ preset.preset }}</code></td>
                    <td><span class="badge-primary">{{ preset.resolution }}</span></td>
                    <td>{{ preset.name }}</td>
                    <td>{{ preset.desc }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Resolution Request Example -->
            <h4 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
              {{ locale === 'zh' ? '分辨率模式请求示例' : 'Resolution Mode Request Example' }}
            </h4>
            <CodeBlock :code="resolutionBasedRequestCode" language="json" :filename="locale === 'zh' ? '分辨率模式请求' : 'Resolution Mode Request'" />

            <!-- Resolution Response Example -->
            <h4 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
              {{ locale === 'zh' ? '分辨率模式响应示例' : 'Resolution Mode Response Example' }}
            </h4>
            <CodeBlock :code="resolutionBasedResponseCode" language="json" :filename="locale === 'zh' ? '分辨率模式响应' : 'Resolution Mode Response'" />

            <!-- Resolution Response Fields -->
            <h4 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
              {{ locale === 'zh' ? '分辨率响应字段说明' : 'Resolution Response Fields' }}
            </h4>
            <div class="overflow-x-auto">
              <table class="apple-table">
                <thead>
                  <tr>
                    <th>{{ t('docs.tables.field') }}</th>
                    <th>{{ t('docs.tables.type') }}</th>
                    <th>{{ t('docs.tables.description') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="field in resolutionResponseFields" :key="field.path">
                    <td><code class="inline-code">{{ field.path }}</code></td>
                    <td><span class="badge-primary">{{ field.type }}</span></td>
                    <td>{{ field.desc }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Calculation Logic Note -->
            <div class="alert-warning mt-6">
              <div>
                <div class="font-semibold text-apple-yellow mb-1">📐 {{ locale === 'zh' ? '计算逻辑说明' : 'Calculation Logic' }}</div>
                <p class="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                  {{ locale === 'zh' 
                    ? '系统使用 ceil(目标分辨率 ÷ 单箱体分辨率) 计算所需行列数，因此实际分辨率可能略大于目标分辨率。例如：目标 4K (3840×2160)，单箱体 320×320，则需要 12×7=84 个箱体，实际分辨率为 3840×2240。'
                    : 'System uses ceil(target resolution ÷ cabinet resolution) to calculate rows/columns, so actual resolution may be slightly larger than target. Example: Target 4K (3840×2160), cabinet 320×320, needs 12×7=84 cabinets, actual resolution is 3840×2240.' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Preview Section -->
        <section id="preview" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            7. {{ t('docs.toc.preview') }}
          </h2>
          
          <div class="flex items-center gap-3 mb-6">
            <span class="method-post">POST</span>
            <code class="inline-code">/api/preview/svg</code>
          </div>

          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '基于计算结果生成LED屏幕的可视化预览图，展示箱体排列效果。此接口需要先调用计算接口获取结果，再传入生成预览。'
              : 'Generate visual SVG preview based on calculation results. This endpoint requires calculation results from previous API calls.' }}
          </p>

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            {{ locale === 'zh' ? '7.1 预览选项 (previewOptions)' : '7.1 Preview Options (previewOptions)' }}
          </h3>
          <CodeBlock :code="previewOptionsCode" language="json" filename="previewOptions" />

          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-8 mb-4">
            {{ locale === 'zh' ? '7.2 选项说明' : '7.2 Options Description' }}
          </h3>
          <div class="overflow-x-auto">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>{{ t('docs.tables.field') }}</th>
                  <th>{{ t('docs.tables.type') }}</th>
                  <th>{{ locale === 'zh' ? '默认值' : 'Default' }}</th>
                  <th>{{ t('docs.tables.description') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in previewOptionsFields" :key="field.path">
                  <td><code class="inline-code">{{ field.path }}</code></td>
                  <td><span class="badge-primary">{{ field.type }}</span></td>
                  <td><code class="inline-code">{{ field.default }}</code></td>
                  <td>{{ field.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Examples Section -->
        <section id="examples" class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-apple-gray-800 dark:text-apple-gray-100 mb-4">
            8. {{ t('docs.toc.examples') }}
          </h2>
          
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '以下是使用 fetch API 调用 LED Calculator API 的完整 JavaScript 示例：'
              : 'Here is a complete JavaScript example using fetch API to call LED Calculator API:' }}
          </p>

          <CodeBlock 
            :code="locale === 'zh' ? `// 一键计算 + 预览示例
async function calculateWithPreview() {
  const response = await fetch('https://led-api.unilumin-gtm.com/api/calculate/optimal-layout-with-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cabinetSpecs: {
        dimensions: { width: 500, height: 1000, depth: 40 },
        display: {
          pixelPitch: 1.5625,
          resolution: { width: 320, height: 640 },
          brightness: 1000,
          refreshRate: 5760
        },
        power: { maxPower: 180, typicalPower: 60 },
        physical: { weight: 10.5 }
      },
      roomConfig: {
        dimensions: { width: 5, height: 3 },
        unit: 'meters',
        wallType: 'flat'
      },
      previewOptions: {
        showDimensions: true,
        showPerson: true,
        language: 'zh'
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('布局:', result.data.columns, '×', result.data.rows);
    console.log('箱体总数:', result.data.totalCabinets);
    
    // 显示SVG预览
    document.getElementById('preview').innerHTML = result.data.preview.svg;
  }
  
  return result;
}` : `// One-click calculate + preview example
async function calculateWithPreview() {
  const response = await fetch('https://led-api.unilumin-gtm.com/api/calculate/optimal-layout-with-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cabinetSpecs: {
        dimensions: { width: 500, height: 1000, depth: 40 },
        display: {
          pixelPitch: 1.5625,
          resolution: { width: 320, height: 640 },
          brightness: 1000,
          refreshRate: 5760
        },
        power: { maxPower: 180, typicalPower: 60 },
        physical: { weight: 10.5 }
      },
      roomConfig: {
        dimensions: { width: 5, height: 3 },
        unit: 'meters',
        wallType: 'flat'
      },
      previewOptions: {
        showDimensions: true,
        showPerson: true,
        language: 'en'
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Layout:', result.data.columns, '×', result.data.rows);
    console.log('Total cabinets:', result.data.totalCabinets);
    
    // Display SVG preview
    document.getElementById('preview').innerHTML = result.data.preview.svg;
  }
  
  return result;
}`" 
            language="javascript" 
            filename="example.js" 
          />

          <!-- Resolution-based Example -->
          <h3 class="text-lg font-semibold text-apple-gray-800 dark:text-apple-gray-100 mt-10 mb-4">
            {{ locale === 'zh' ? '8.2 分辨率模式示例' : '8.2 Resolution Mode Example' }}
          </h3>
          <p class="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
            {{ locale === 'zh' 
              ? '使用 targetResolution 参数指定目标分辨率，系统自动计算所需箱体数量：'
              : 'Use targetResolution parameter to specify target resolution, system auto-calculates required cabinets:' }}
          </p>
          <CodeBlock 
            :code="locale === 'zh' ? `// 分辨率模式示例 - 指定4K分辨率
async function calculateFor4K() {
  const response = await fetch('https://led-api.unilumin-gtm.com/api/calculate/optimal-layout-with-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cabinetSpecs: {
        dimensions: { width: 500, height: 500, depth: 40 },
        display: {
          pixelPitch: 1.5625,
          resolution: { width: 320, height: 320 },  // 单箱体分辨率
          brightness: 1000,
          refreshRate: 5760
        },
        power: { maxPower: 90, typicalPower: 30 },
        physical: { weight: 5.5 }
      },
      roomConfig: {
        dimensions: { width: 10, height: 6 },  // 分辨率模式下会被忽略
        unit: 'meters',
        wallType: 'flat'
      },
      targetResolution: 'UHD',  // 🎯 指定4K分辨率
      previewOptions: {
        showDimensions: true,
        showPerson: true,
        language: 'zh'
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    const { resolution } = result.data;
    console.log('目标分辨率:', resolution.target.width, '×', resolution.target.height);
    console.log('实际分辨率:', resolution.actual.width, '×', resolution.actual.height);
    console.log('总像素:', resolution.actual.totalPixels.toLocaleString());
    console.log('布局:', result.data.columns, '×', result.data.rows);
    
    document.getElementById('preview').innerHTML = result.data.preview.svg;
  }
  
  return result;
}` : `// Resolution mode example - specify 4K resolution
async function calculateFor4K() {
  const response = await fetch('https://led-api.unilumin-gtm.com/api/calculate/optimal-layout-with-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cabinetSpecs: {
        dimensions: { width: 500, height: 500, depth: 40 },
        display: {
          pixelPitch: 1.5625,
          resolution: { width: 320, height: 320 },  // Single cabinet resolution
          brightness: 1000,
          refreshRate: 5760
        },
        power: { maxPower: 90, typicalPower: 30 },
        physical: { weight: 5.5 }
      },
      roomConfig: {
        dimensions: { width: 10, height: 6 },  // Ignored in resolution mode
        unit: 'meters',
        wallType: 'flat'
      },
      targetResolution: 'UHD',  // 🎯 Specify 4K resolution
      previewOptions: {
        showDimensions: true,
        showPerson: true,
        language: 'en'
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    const { resolution } = result.data;
    console.log('Target resolution:', resolution.target.width, '×', resolution.target.height);
    console.log('Actual resolution:', resolution.actual.width, '×', resolution.actual.height);
    console.log('Total pixels:', resolution.actual.totalPixels.toLocaleString());
    console.log('Layout:', result.data.columns, '×', result.data.rows);
    
    document.getElementById('preview').innerHTML = result.data.preview.svg;
  }
  
  return result;
}`" 
            language="javascript" 
            filename="resolution-example.js" 
          />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.method-post {
  @apply px-3 py-1 bg-apple-green/20 text-apple-green text-xs font-bold rounded-md uppercase;
}

.badge-success {
  @apply px-2 py-0.5 bg-apple-green/20 text-apple-green text-xs font-medium rounded;
}

.badge-error {
  @apply px-2 py-0.5 bg-apple-red/20 text-apple-red text-xs font-medium rounded;
}

.badge-secondary {
  @apply px-2 py-0.5 bg-apple-gray-200 dark:bg-apple-gray-600 text-apple-gray-600 dark:text-apple-gray-300 text-xs font-medium rounded;
}

.badge-primary {
  @apply px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded;
}

.alert-info {
  @apply p-4 bg-primary/10 border-l-4 border-primary rounded-r-apple;
}

.alert-success {
  @apply p-4 bg-apple-green/10 border-l-4 border-apple-green rounded-r-apple;
}

.alert-warning {
  @apply p-4 bg-apple-yellow/10 border-l-4 border-apple-yellow rounded-r-apple;
}

.inline-code {
  @apply px-1.5 py-0.5 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-700 dark:text-apple-gray-300 text-sm font-mono rounded;
}

.apple-table {
  @apply w-full border-collapse;
}

.apple-table th {
  @apply px-4 py-3 text-left text-xs font-semibold text-apple-gray-500 uppercase tracking-wider bg-apple-gray-50 dark:bg-apple-gray-700/50;
}

.apple-table td {
  @apply px-4 py-3 text-sm text-apple-gray-700 dark:text-apple-gray-300 border-b border-apple-gray-100 dark:border-apple-gray-700;
}

.apple-table tr:hover td {
  @apply bg-apple-gray-50 dark:bg-apple-gray-700/30;
}
</style>
