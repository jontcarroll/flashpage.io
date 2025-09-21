<template>
  <div
    :class="[
      'brutal-card',
      { 'brutal-card-colored': colored },
      { 'brutal-rotate-1': rotate === 1 },
      { 'brutal-rotate-n2': rotate === -2 },
      { 'brutal-rotate-2': rotate === 2 }
    ]"
  >
    <div v-if="$slots.header" class="border-b-4 border-black pb-4 mb-4">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="border-t-4 border-black pt-4 mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  colored?: boolean
  rotate?: -2 | 0 | 1 | 2
}

withDefaults(defineProps<Props>(), {
  colored: false,
  rotate: 0
})
</script>