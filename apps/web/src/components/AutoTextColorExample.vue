<template>
  <div class="auto-text-color-example">
    <h1>自动文字颜色示例</h1>
    
    <!-- 基础使用示例 -->
    <section class="example-section">
      <h2>基础使用</h2>
      <div class="color-grid">
        <div 
          v-for="(color, index) in colors" 
          :key="index"
          class="color-box"
          :style="{ 
            backgroundColor: color,
            color: getAutoTextColor(color)
          }"
        >
          <span>{{ color }}</span>
          <small>自动文字颜色</small>
        </div>
      </div>
    </section>

    <!-- Vue组合式函数示例 -->
    <section class="example-section">
      <h2>Vue组合式函数</h2>
      <div class="composable-example">
        <div class="color-picker">
          <label>选择背景颜色:</label>
          <input 
            type="color" 
            v-model="selectedColor"
            @input="updateColor"
          >
          <span>{{ selectedColor }}</span>
        </div>
        
        <div 
          class="dynamic-box"
          :style="{ 
            backgroundColor: autoColor.backgroundColor,
            color: autoColor.textColor
          }"
        >
          <h3>动态文字颜色</h3>
          <p>背景色: {{ autoColor.backgroundColor }}</p>
          <p>文字色: {{ autoColor.textColor }}</p>
          <p>对比度: {{ autoColor.contrast.toFixed(2) }}</p>
        </div>
      </div>
    </section>

    <!-- CSS类示例 -->
    <section class="example-section">
      <h2>CSS类使用</h2>
      <div class="css-examples">
        <div class="bg-auto-primary text-auto">
          <span>主要背景色</span>
        </div>
        <div class="bg-auto-success text-auto">
          <span>成功背景色</span>
        </div>
        <div class="bg-auto-warning text-auto">
          <span>警告背景色</span>
        </div>
        <div class="bg-auto-danger text-auto">
          <span>危险背景色</span>
        </div>
        <div class="bg-auto-info text-auto">
          <span>信息背景色</span>
        </div>
      </div>
    </section>

    <!-- 混合模式示例 -->
    <section class="example-section">
      <h2>CSS混合模式</h2>
      <div class="mix-blend-examples">
        <div class="bg-gradient-1">
          <span class="auto-text-mix">混合模式文字</span>
        </div>
        <div class="bg-gradient-2">
          <span class="auto-text-mix">混合模式文字</span>
        </div>
        <div class="bg-gradient-3">
          <span class="auto-text-mix">混合模式文字</span>
        </div>
      </div>
    </section>

    <!-- 批量处理示例 -->
    <section class="example-section">
      <h2>批量颜色处理</h2>
      <div class="batch-results">
        <div 
          v-for="(result, index) in batchResults" 
          :key="index"
          class="batch-item"
          :style="{ 
            backgroundColor: result.background,
            color: result.text
          }"
        >
          <span>{{ result.background }}</span>
          <small>对比度: {{ result.contrast.toFixed(2) }}</small>
        </div>
      </div>
    </section>

    <!-- 响应式示例 -->
    <section class="example-section">
      <h2>响应式文字颜色</h2>
      <div class="responsive-example">
        <div class="bg-auto-light text-auto-responsive">
          <span>浅色主题文字</span>
        </div>
        <div class="bg-auto-dark text-auto-responsive">
          <span>深色主题文字</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAutoTextColor as getAutoTextColorUtil } from '../utils/autoTextColor'
import { useAutoTextColor, useBatchAutoTextColor } from '../composables/useAutoTextColor'

// 颜色数组
const colors = ref([
  '#ffffff',
  '#000000',
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#feca57',
  '#ff9ff3',
  '#a8e6cf',
  '#dcedc1',
  '#ffd3b6',
  '#ffaaa5'
])

// 选中的颜色
const selectedColor = ref('#ff6b6b')

// 使用组合式函数
const autoColor = useAutoTextColor({
  backgroundColor: selectedColor.value,
  useWCAG: true,
  minContrastRatio: 4.5
})

// 批量处理
const { results: batchResults } = useBatchAutoTextColor(colors.value)

// 更新颜色
const updateColor = () => {
  autoColor.setBackgroundColor(selectedColor.value)
}

// 基础函数
const getAutoTextColor = (color: string) => {
  return getAutoTextColorUtil(color)
}

onMounted(() => {
  // 初始化
  updateColor()
})
</script>

<style scoped>
.auto-text-color-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.example-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

/* 颜色网格 */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.color-box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.color-box:hover {
  transform: translateY(-2px);
}

.color-box span {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.color-box small {
  font-size: 12px;
  opacity: 0.8;
}

/* 组合式函数示例 */
.composable-example {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}

.color-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-picker label {
  font-weight: 500;
  color: #333;
}

.color-picker input[type="color"] {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dynamic-box {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.dynamic-box h3 {
  margin-top: 0;
}

.dynamic-box p {
  margin: 5px 0;
  font-size: 14px;
}

/* CSS类示例 */
.css-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.css-examples > div {
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

/* 混合模式示例 */
.mix-blend-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.mix-blend-examples > div {
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}

.bg-gradient-1 {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-2 {
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-3 {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
}

/* 批量处理示例 */
.batch-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.batch-item {
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.batch-item span {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
}

.batch-item small {
  font-size: 12px;
  opacity: 0.8;
}

/* 响应式示例 */
.responsive-example {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.responsive-example > div {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .composable-example {
    grid-template-columns: 1fr;
  }
  
  .responsive-example {
    grid-template-columns: 1fr;
  }
  
  .color-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .auto-text-color-example {
    background-color: #1a1a1a;
    color: #fff;
  }
  
  .example-section {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  .example-section h2 {
    color: #fff;
  }
  
  .color-picker label {
    color: #fff;
  }
}
</style> 