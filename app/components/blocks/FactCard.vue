<template>
  <div class="flex flex-col items-center brutal-card text-center brutal-transition brutal-hover">
    <div class="mb-4 size-16">
      <FpIcon :name="icon" />
    </div>
    <h3 class="text-xl font-black uppercase mb-2" v-html="heading" />
    <p class="font-mono text-sm" v-html="body" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    heading: string
    body: string
    icon: string
  }>()
</script>
