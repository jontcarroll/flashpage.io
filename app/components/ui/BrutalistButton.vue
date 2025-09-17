<template>
  <button
    :class="[
      'brutal-btn brutal-transition',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'yellow' | 'pink' | 'blue' | 'white' | 'black'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'yellow',
  size: 'md',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  yellow: 'brutal-btn',
  pink: 'brutal-btn brutal-btn-pink',
  blue: 'brutal-btn brutal-btn-blue',
  white: 'brutal-btn brutal-btn-white',
  black: 'bg-black text-white border-4 border-black shadow-[8px_8px_0px_#FF0066]'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-12 py-6 text-xl'
}
</script>