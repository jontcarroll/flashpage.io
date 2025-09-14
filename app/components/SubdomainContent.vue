<template>
  <div class="max-w-4xl w-full rounded-2xl shadow-xl p-6 backdrop-blur-sm border" :style="cardStyles">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 bg-clip-text text-transparent" :style="gradientStyle">
        {{ data.title }}
      </h1>
      <p class="text-sm" :style="{ color: themeColors.textMuted }">
        Created {{ data.createdAt ? formatDate(typeof data.createdAt === 'string' ? data.createdAt : data.createdAt.toISOString()) : 'recently' }} • {{ data.views || 0 }} views
      </p>
    </div>
    
    <div class="prose prose-lg max-w-none mb-8">
      <p class="whitespace-pre-wrap" :style="{ color: themeColors.text }">{{ data.content }}</p>
    </div>
    
    <div class="text-center">
      <img 
        :src="data.gifUrl" 
        :alt="data.title"
        class="mx-auto rounded-xl shadow-lg max-w-full"
        style="max-height: 400px;"
      />
    </div>
    
    <div class="mt-8 pt-8 text-center" :style="{ borderTop: `1px solid ${themeColors.border}` }">
      <p class="mb-4" :style="{ color: themeColors.textMuted }">Want your own page like this?</p>
      <NuxtLink 
        to="/" 
        class="inline-block font-bold py-3 px-6 rounded-xl shadow-lg text-white transition-all duration-200 hover:scale-105"
        :style="{ background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)` }"
      >
        Create Your Page on FlashPage.io
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getThemeById } from '~/utils/themes'
import { formatDate } from '~/utils/formatters'
import type { ISubdomain } from '../../types'

interface Props {
  data: ISubdomain
}

const props = defineProps<Props>()

// Compute theme colors based on subdomain settings
const themeColors = computed(() => {
  const theme = getThemeById(props.data.theme || 'aurora')
  if (!theme) {
    // Return default aurora theme colors as fallback
    return {
      primary: 'rgb(139, 92, 246)',
      secondary: 'rgb(236, 72, 153)',
      background: 'rgb(250, 250, 250)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      textMuted: 'rgb(107, 114, 128)',
      border: 'rgb(229, 231, 235)'
    }
  }
  
  return props.data.isDarkMode ? theme.dark : theme.light
})

// Compute gradient style for title
const gradientStyle = computed(() => {
  return `background: linear-gradient(135deg, ${themeColors.value.primary} 0%, ${themeColors.value.secondary} 100%); -webkit-background-clip: text; background-clip: text;`
})

// Compute card styles
const cardStyles = computed(() => {
  return {
    backgroundColor: themeColors.value.surface,
    borderColor: themeColors.value.border,
    color: themeColors.value.text
  }
})
</script>