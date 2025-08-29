<template>
  <div class="auto-text-color-demo">
    <h2>自动字体颜色演示</h2>
    
    <!-- 方案1: 使用CSS mix-blend-mode -->
    <div class="demo-section">
      <h3>方案1: CSS mix-blend-mode</h3>
      <div class="color-box mix-blend-mode">
        <span class="auto-text">浅色背景上的文字</span>
      </div>
      <div class="color-box mix-blend-mode dark-bg">
        <span class="auto-text">深色背景上的文字</span>
      </div>
    </div>

    <!-- 方案2: 使用CSS自定义属性 -->
    <div class="demo-section">
      <h3>方案2: CSS自定义属性</h3>
      <div class="color-box css-vars" :style="{ '--bg-color': lightColor }">
        <span class="auto-text-css">浅色背景上的文字</span>
      </div>
      <div class="color-box css-vars" :style="{ '--bg-color': darkColor }">
        <span class="auto-text-css">深色背景上的文字</span>
      </div>
    </div>

    <!-- 方案3: 使用JavaScript计算 -->
    <div class="demo-section">
      <h3>方案3: JavaScript计算</h3>
      <div 
        v-for="(bgColor, index) in backgroundColors" 
        :key="index"
        class="color-box js-calc"
        :style="{ backgroundColor: bgColor, color: getContrastColor(bgColor) }"
      >
        <span>{{ bgColor }} 背景上的文字</span>
      </div>
    </div>

    <!-- 方案4: 使用Tailwind CSS类 -->
    <div class="demo-section">
      <h3>方案4: Tailwind CSS</h3>
      <div class="color-box bg-white text-black dark:bg-gray-800 dark:text-white">
        <span>响应式颜色文字</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lightColor = '#f0f0f0'
const darkColor = '#333333'

const backgroundColors = ref([
  '#ffffff',
  '#000000', 
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#feca57',
  '#ff9ff3'
])

// 计算对比度并返回合适的文字颜色
function getContrastColor(hexColor: string): string {
  // 移除#号
  const hex = hexColor.replace('#', '')
  
  // 转换为RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // 计算亮度 (YIQ公式)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  
  // 根据亮度返回黑色或白色
  return yiq >= 128 ? '#000000' : '#ffffff'
}
</script>

<style scoped>
.auto-text-color-demo {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.color-box {
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

/* 方案1: CSS mix-blend-mode */
.mix-blend-mode {
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  position: relative;
}

.mix-blend-mode.dark-bg {
  background: linear-gradient(45deg, #333, #555);
}

.auto-text {
  mix-blend-mode: difference;
  color: white;
}

/* 方案2: CSS自定义属性 */
.css-vars {
  background-color: var(--bg-color);
}

.auto-text-css {
  color: var(--text-color, #000);
}

/* 为浅色背景设置深色文字 */
.css-vars[style*="f0f0f0"] .auto-text-css {
  color: #333;
}

/* 为深色背景设置浅色文字 */
.css-vars[style*="333333"] .auto-text-css {
  color: #fff;
}

/* 方案3: JavaScript计算 */
.js-calc {
  transition: all 0.3s ease;
}

.js-calc:hover {
  transform: scale(1.02);
}

/* 方案4: Tailwind CSS */
.bg-white {
  background-color: white;
}

.text-black {
  color: black;
}

.dark\:bg-gray-800 {
  background-color: #1f2937;
}

.dark\:text-white {
  color: white;
}

/* 响应式设计 */
@media (prefers-color-scheme: dark) {
  .auto-text-color-demo {
    background-color: #1a1a1a;
    color: #fff;
  }
  
  .demo-section h3 {
    color: #fff;
  }
}
</style> 