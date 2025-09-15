<template>
  <div class="min-h-screen flex items-center justify-center p-4 transition-colors duration-300" :style="themeStyles">
    <LoadingSpinner v-if="pending" message="Loading page..." />
    
    <PageNotFound v-else-if="error" />
    
    <SubdomainContent v-else-if="data" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getThemeById } from '~/utils/themes'
import type { ISubdomain } from '../../../types'

// Get subdomain using the composable
const { subdomain } = useSubdomain()

// Fetch subdomain data
const { data, pending, error } = await useFetch<ISubdomain>(`/api/subdomains/${subdomain.value}`)

// Compute theme colors for the main container
const themeColors = computed(() => {
  if (!data.value) {
    // Return default theme colors when no data
    const defaultTheme = getThemeById('aurora')
    return defaultTheme ? defaultTheme.light : {
      primary: 'rgb(139, 92, 246)',
      secondary: 'rgb(236, 72, 153)',
      background: 'rgb(250, 250, 250)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      textMuted: 'rgb(107, 114, 128)',
      border: 'rgb(229, 231, 235)'
    }
  }
  
  const theme = getThemeById(data.value.theme || 'aurora')
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
  
  return data.value.isDarkMode ? theme.dark : theme.light
})

// Compute theme styles for the main container background
const themeStyles = computed(() => {
  return {
    backgroundColor: themeColors.value.background,
    color: themeColors.value.text
  }
})

// Set page meta
useHead({
  title: data.value?.title || 'Page Not Found',
  meta: [
    { name: 'description', content: data.value?.content || 'Create your own instant subdomain on FlashPage.io' }
  ]
})
</script>