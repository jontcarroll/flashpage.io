<template>
  <ClientOnly>
    <span v-if="svgContent" v-html="svgContent" class="inline-block" />
    <template #fallback>
      <span class="inline-block" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    name?: string
  }>()

  // Import all SVG files eagerly as raw strings
  const icons = import.meta.glob<string>('~/assets/icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true
  })

  // Get the SVG content with size attributes added
  const svgContent = computed(() => {
    if (!props.name) return ''

    const iconPath = Object.keys(icons).find(path =>
      path.includes(`/${props.name}.svg`)
    )

    if (!iconPath || !icons[iconPath]) return ''

    const svgString = icons[iconPath]

    // Add width and height attributes to the SVG
    return svgString.replace('<svg', '<svg width="100%" height="100%"')
  })
</script>
