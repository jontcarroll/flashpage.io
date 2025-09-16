<template>
  <div
    :class="[
      'absolute inset-0 pointer-events-none',
      patternClasses[pattern],
      { 'opacity-10': subtle },
      { 'opacity-20': !subtle }
    ]"
    :style="{ zIndex: -1 }"
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