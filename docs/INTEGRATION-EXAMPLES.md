# LED Calculator API - 集成示例

## 📚 目录

1. [HTML/JavaScript 集成](#htmljavascript-集成)
2. [React 集成](#react-集成)
3. [Vue 集成](#vue-集成)
4. [通用最佳实践](#通用最佳实践)

---

## HTML/JavaScript 集成

### 示例 1: 基础单箱体计算

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>LED Calculator Example</title>
</head>
<body>
    <h1>LED 显示墙计算器</h1>
    <button onclick="calculate()">计算配置</button>
    <div id="result"></div>

    <script>
        const API_URL = 'http://localhost:3001';

        async function calculate() {
            try {
                const response = await fetch(`${API_URL}/api/calculate/single`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cabinetSpecs: {
                            id: "cabinet-001",
                            name: "UHW II 0.9",
                            model: "UHW-II-0.9",
                            dimensions: { width: 600, height: 337.5, depth: 50 },
                            display: {
                                pixelPitch: 0.9,
                                resolution: { width: 640, height: 360 },
                                brightness: 600,
                                refreshRate: 3840,
                                colorDepth: 16
                            },
                            power: {
                                maxPower: 150,
                                typicalPower: 75,
                                standbyPower: 5
                            },
                            physical: {
                                weight: 7.5,
                                operatingTemp: { min: 0, max: 45 },
                                humidity: { min: 10, max: 90 },
                                ipRating: "IP30"
                            },
                            installation: {
                                mountingType: ["wall"],
                                cableType: ["power", "data"],
                                maintenanceAccess: "front"
                            }
                        },
                        roomConfig: {
                            dimensions: { width: 5, height: 3 },
                            unit: "meters",
                            wallType: "flat"
                        },
                        displayConfig: {
                            layout: { columns: 8, rows: 8 },
                            resolution: "UHD",
                            configuration: "fit-to-wall",
                            redundancy: {
                                power: false,
                                data: false,
                                noRedundancy: true
                            }
                        }
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    displayResult(data.data);
                } else {
                    displayError(data.error);
                }
            } catch (error) {
                displayError({ message: error.message });
            }
        }

        function displayResult(result) {
            document.getElementById('result').innerHTML = `
                <h2>计算结果</h2>
                <p>墙体尺寸: ${result.wallDimensions.width}m × ${result.wallDimensions.height}m</p>
                <p>箱体总数: ${result.cabinetCount.total}</p>
                <p>总像素: ${result.pixels.totalWidth} × ${result.pixels.totalHeight}</p>
                <p>最大功耗: ${result.powerConsumption.maximum}W</p>
                <p>总重量: ${result.physical.totalWeight}kg</p>
            `;
        }

        function displayError(error) {
            document.getElementById('result').innerHTML = `
                <h2 style="color: red;">错误</h2>
                <p>${error.message}</p>
            `;
        }
    </script>
</body>
</html>
```

### 示例 2: 带 SVG 预览的完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>LED Calculator with Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
        #preview { margin-top: 20px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <div class="container">
        <h1>LED 显示墙计算器（带预览）</h1>
        <button onclick="calculateAndPreview()">计算并生成预览</button>
        <div id="result"></div>
        <div id="preview"></div>
    </div>

    <script>
        const API_URL = 'http://localhost:3001';
        let calculationResult = null;

        async function calculateAndPreview() {
            // Step 1: 计算配置
            const calcResponse = await fetch(`${API_URL}/api/calculate/single`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // ... 同上面的请求数据
                })
            });

            const calcData = await calcResponse.json();
            if (!calcData.success) {
                alert('计算失败: ' + calcData.error.message);
                return;
            }

            calculationResult = calcData.data;
            displayResult(calculationResult);

            // Step 2: 生成 SVG 预览
            const previewResponse = await fetch(`${API_URL}/api/preview/svg`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    calculationResult: calculationResult,
                    roomConfig: {
                        dimensions: { width: 5, height: 3 },
                        unit: "meters",
                        wallType: "flat"
                    },
                    options: {
                        showDimensions: true,
                        showPerson: true,
                        canvasWidth: 800,
                        canvasHeight: 500,
                        format: 'json'
                    }
                })
            });

            const previewData = await previewResponse.json();
            if (previewData.success) {
                document.getElementById('preview').innerHTML = previewData.data.svg;
            }
        }

        function displayResult(result) {
            document.getElementById('result').innerHTML = `
                <h2>计算结果</h2>
                <ul>
                    <li>墙体尺寸: ${result.wallDimensions.width.toFixed(2)}m × ${result.wallDimensions.height.toFixed(2)}m</li>
                    <li>箱体总数: ${result.cabinetCount.total} (${result.cabinetCount.horizontal} × ${result.cabinetCount.vertical})</li>
                    <li>总像素: ${result.pixels.totalWidth} × ${result.pixels.totalHeight}</li>
                    <li>像素密度: ${result.pixels.pixelDensity.toFixed(0)} pixels/m²</li>
                    <li>最大功耗: ${result.powerConsumption.maximum}W</li>
                    <li>典型功耗: ${result.powerConsumption.typical}W</li>
                    <li>总重量: ${result.physical.totalWeight}kg</li>
                    <li>结构负载: ${result.physical.structuralLoad.toFixed(2)} kg/m²</li>
                </ul>
            `;
        }
    </script>
</body>
</html>
```

---

## React 集成

### 示例 1: 使用 Hooks 的基础组件

```tsx
// LEDCalculator.tsx
import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

interface CalculationResult {
  wallDimensions: {
    width: number;
    height: number;
    area: number;
    diagonal: number;
  };
  cabinetCount: {
    total: number;
    horizontal: number;
    vertical: number;
  };
  pixels: {
    totalWidth: number;
    totalHeight: number;
    totalPixels: number;
    pixelDensity: number;
  };
  powerConsumption: {
    maximum: number;
    typical: number;
    standby: number;
  };
  physical: {
    totalWeight: number;
    structuralLoad: number;
  };
}

export const LEDCalculator: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateConfiguration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/calculate/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabinetSpecs: {
            id: "cabinet-001",
            name: "UHW II 0.9",
            model: "UHW-II-0.9",
            dimensions: { width: 600, height: 337.5, depth: 50 },
            display: {
              pixelPitch: 0.9,
              resolution: { width: 640, height: 360 },
              brightness: 600,
              refreshRate: 3840,
              colorDepth: 16
            },
            power: {
              maxPower: 150,
              typicalPower: 75,
              standbyPower: 5
            },
            physical: {
              weight: 7.5,
              operatingTemp: { min: 0, max: 45 },
              humidity: { min: 10, max: 90 },
              ipRating: "IP30"
            },
            installation: {
              mountingType: ["wall"],
              cableType: ["power", "data"],
              maintenanceAccess: "front"
            }
          },
          roomConfig: {
            dimensions: { width: 5, height: 3 },
            unit: "meters",
            wallType: "flat"
          },
          displayConfig: {
            layout: { columns: 8, rows: 8 },
            resolution: "UHD",
            configuration: "fit-to-wall",
            redundancy: {
              power: false,
              data: false,
              noRedundancy: true
            }
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="led-calculator">
      <h1>LED 显示墙计算器</h1>
      
      <button onClick={calculateConfiguration} disabled={loading}>
        {loading ? '计算中...' : '计算配置'}
      </button>

      {error && (
        <div className="error">
          <h2>错误</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>计算结果</h2>
          <div className="result-grid">
            <div className="result-section">
              <h3>墙体尺寸</h3>
              <p>宽度: {result.wallDimensions.width.toFixed(2)}m</p>
              <p>高度: {result.wallDimensions.height.toFixed(2)}m</p>
              <p>面积: {result.wallDimensions.area.toFixed(2)}m²</p>
            </div>

            <div className="result-section">
              <h3>箱体数量</h3>
              <p>总数: {result.cabinetCount.total}</p>
              <p>水平: {result.cabinetCount.horizontal}</p>
              <p>垂直: {result.cabinetCount.vertical}</p>
            </div>

            <div className="result-section">
              <h3>像素信息</h3>
              <p>分辨率: {result.pixels.totalWidth} × {result.pixels.totalHeight}</p>
              <p>总像素: {result.pixels.totalPixels.toLocaleString()}</p>
              <p>像素密度: {result.pixels.pixelDensity.toFixed(0)} px/m²</p>
            </div>

            <div className="result-section">
              <h3>功耗</h3>
              <p>最大: {result.powerConsumption.maximum}W</p>
              <p>典型: {result.powerConsumption.typical}W</p>
              <p>待机: {result.powerConsumption.standby}W</p>
            </div>

            <div className="result-section">
              <h3>物理参数</h3>
              <p>总重量: {result.physical.totalWeight}kg</p>
              <p>结构负载: {result.physical.structuralLoad.toFixed(2)} kg/m²</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 示例 2: 自定义 Hook

```tsx
// useLEDCalculator.ts
import { useState, useCallback } from 'react';

const API_URL = 'http://localhost:3001';

export const useLEDCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSingle = useCallback(async (
    cabinetSpecs: any,
    roomConfig: any,
    displayConfig: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/calculate/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cabinetSpecs, roomConfig, displayConfig })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateMulti = useCallback(async (
    cabinetSelections: any[],
    roomConfig: any,
    displayConfig: any,
    arrangementDirection?: 'left-to-right' | 'right-to-left'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/calculate/multi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabinetSelections,
          roomConfig,
          displayConfig,
          arrangementDirection
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePreview = useCallback(async (
    calculationResult: any,
    roomConfig: any,
    options?: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/preview/svg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculationResult,
          roomConfig,
          options: {
            showDimensions: true,
            showPerson: true,
            canvasWidth: 800,
            canvasHeight: 500,
            format: 'json',
            ...options
          }
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      return data.data.svg;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    calculateSingle,
    calculateMulti,
    generatePreview
  };
};
```

---

## Vue 集成

### 示例 1: Composition API

```vue
<!-- LEDCalculator.vue -->
<template>
  <div class="led-calculator">
    <h1>LED 显示墙计算器</h1>
    
    <button @click="calculate" :disabled="loading">
      {{ loading ? '计算中...' : '计算配置' }}
    </button>

    <div v-if="error" class="error">
      <h2>错误</h2>
      <p>{{ error }}</p>
    </div>

    <div v-if="result" class="result">
      <h2>计算结果</h2>
      <div class="result-grid">
        <div class="result-section">
          <h3>墙体尺寸</h3>
          <p>宽度: {{ result.wallDimensions.width.toFixed(2) }}m</p>
          <p>高度: {{ result.wallDimensions.height.toFixed(2) }}m</p>
          <p>面积: {{ result.wallDimensions.area.toFixed(2) }}m²</p>
        </div>

        <div class="result-section">
          <h3>箱体数量</h3>
          <p>总数: {{ result.cabinetCount.total }}</p>
          <p>水平: {{ result.cabinetCount.horizontal }}</p>
          <p>垂直: {{ result.cabinetCount.vertical }}</p>
        </div>

        <div class="result-section">
          <h3>像素信息</h3>
          <p>分辨率: {{ result.pixels.totalWidth }} × {{ result.pixels.totalHeight }}</p>
          <p>总像素: {{ result.pixels.totalPixels.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const API_URL = 'http://localhost:3001';

const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<any>(null);

const calculate = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${API_URL}/api/calculate/single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cabinetSpecs: {
          id: "cabinet-001",
          name: "UHW II 0.9",
          model: "UHW-II-0.9",
          dimensions: { width: 600, height: 337.5, depth: 50 },
          display: {
            pixelPitch: 0.9,
            resolution: { width: 640, height: 360 },
            brightness: 600,
            refreshRate: 3840,
            colorDepth: 16
          },
          power: {
            maxPower: 150,
            typicalPower: 75,
            standbyPower: 5
          },
          physical: {
            weight: 7.5,
            operatingTemp: { min: 0, max: 45 },
            humidity: { min: 10, max: 90 },
            ipRating: "IP30"
          },
          installation: {
            mountingType: ["wall"],
            cableType: ["power", "data"],
            maintenanceAccess: "front"
          }
        },
        roomConfig: {
          dimensions: { width: 5, height: 3 },
          unit: "meters",
          wallType: "flat"
        },
        displayConfig: {
          layout: { columns: 8, rows: 8 },
          resolution: "UHD",
          configuration: "fit-to-wall",
          redundancy: {
            power: false,
            data: false,
            noRedundancy: true
          }
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      result.value = data.data;
    } else {
      error.value = data.error.message;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.led-calculator {
  padding: 20px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 20px;
}

.result {
  margin-top: 20px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.result-section {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
```

### 示例 2: Composable

```typescript
// composables/useLEDCalculator.ts
import { ref } from 'vue';

const API_URL = 'http://localhost:3001';

export function useLEDCalculator() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const calculateSingle = async (
    cabinetSpecs: any,
    roomConfig: any,
    displayConfig: any
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_URL}/api/calculate/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cabinetSpecs, roomConfig, displayConfig })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const calculateMulti = async (
    cabinetSelections: any[],
    roomConfig: any,
    displayConfig: any,
    arrangementDirection?: 'left-to-right' | 'right-to-left'
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_URL}/api/calculate/multi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabinetSelections,
          roomConfig,
          displayConfig,
          arrangementDirection
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    calculateSingle,
    calculateMulti
  };
}
```

---

## 通用最佳实践

### 1. 错误处理

```typescript
async function callAPI(endpoint: string, data: any) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // 检查 HTTP 状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 检查业务逻辑错误
    if (!result.success) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### 2. 请求超时处理

```typescript
async function callAPIWithTimeout(endpoint: string, data: any, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

### 3. 请求重试

```typescript
async function callAPIWithRetry(
  endpoint: string,
  data: any,
  maxRetries = 3
) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callAPI(endpoint, data);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}
```

### 4. 响应缓存

```typescript
const cache = new Map();

async function callAPIWithCache(endpoint: string, data: any, ttl = 60000) {
  const cacheKey = `${endpoint}:${JSON.stringify(data)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const result = await callAPI(endpoint, data);
  cache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}
```

---

## 下一步

- 查看 [API 功能清单](./API-FEATURES.md) 了解所有端点详情
- 查看 [测试指南](./TESTING-GUIDE.md) 学习如何测试 API
- 查看 [README.md](../README.md) 了解部署和配置
