<template>
  <router-view />
</template>

<script setup lang="ts">
// Корневой компонент
</script>

<style lang="scss" scoped>
// Глобальные стили для лендинга
:global(body) {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0faff 0%, #fff 100%);
  color: #0d47a1;
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:global(*) {
  box-sizing: border-box;
}

:global(html) {
  scroll-behavior: smooth;
}
</style> 