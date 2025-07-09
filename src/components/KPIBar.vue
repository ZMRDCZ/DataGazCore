<template>
  <div class="kpi-bar">
    <div v-for="kpi in kpis" :key="kpi.label" class="kpi">
      <div class="kpi-label">{{ kpi.label }}</div>
      <div class="kpi-value">{{ kpi.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ kpis: { label: string, value: string }[] }>()
</script>

<style lang="scss" scoped>
.kpi-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  margin: 32px 0 0 0;
  min-height: $kpi-bar-height;
  animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1);
}
.kpi {
  background: #fff;
  border-radius: 16px;
  box-shadow: $color-shadow-xl;
  padding: 16px 32px;
  min-width: 140px;
  text-align: center;
  transition: box-shadow $transition-fast;
}
.kpi-label {
  color: $color-text-secondary;
  font-size: 1rem;
  margin-bottom: 4px;
}
.kpi-value {
  color: $color-accent-flame;
  font-size: 1.4rem;
  font-weight: 700;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: none; }
}
</style> 