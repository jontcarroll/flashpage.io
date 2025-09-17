<template>
  <div
    class="min-h-screen min-w-screen"
    :class="[
      'fixed inset-0 pointer-events-none',
      patternClasses[pattern],
      { 'opacity-10': subtle },
      { 'opacity-20': !subtle }
    ]"
    :style="{ zIndex: 0 }"
  />
</template>

<script setup lang="ts">
  interface Props {
    pattern?: 'dots' | 'grid' | 'diagonal' | 'none'
    subtle?: boolean
  }

  withDefaults(defineProps<Props>(), {
    pattern: 'grid',
    subtle: false
  })

  const patternClasses = {
    dots: 'brutal-dots',
    grid: 'brutal-grid',
    diagonal: 'brutal-diagonal',
    none: ''
  }
</script>

<style lang="postcss" scoped>
  .brutal-dots {
    background-image: radial-gradient(circle, var(--color-brutal-black) 2px, transparent 2px);
    background-size: 32px 32px;
  }

  .brutal-grid {
    background-image:
      linear-gradient(var(--color-brutal-black) 2px, transparent 2px),
      linear-gradient(90deg, var(--color-brutal-black) 2px, transparent 2px);
    background-size: 64px 64px;
  }

  .brutal-diagonal {
    background: repeating-linear-gradient(
      45deg,
      var(--color-brutal-black),
      var(--color-brutal-black) 10px,
      transparent 10px,
      transparent 20px
    );
  }
</style>
