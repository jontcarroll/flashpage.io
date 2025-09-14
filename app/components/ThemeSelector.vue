<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Choose Your Theme
    </label>
    
    <!-- Theme options -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click.prevent="selectedTheme = theme.id"
        :class="[
          'relative rounded-xl p-3 border-2 transition-all duration-200',
          selectedTheme === theme.id 
            ? 'border-primary-500 shadow-lg scale-105' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        ]"
      >
        <!-- Theme preview -->
        <div class="aspect-square rounded-lg overflow-hidden mb-2 relative">
          <div 
            class="absolute inset-0 grid grid-cols-2"
            :style="{
              background: `linear-gradient(135deg, ${isDark ? theme.dark.primary : theme.light.primary} 0%, ${isDark ? theme.dark.secondary : theme.light.secondary} 100%)`
            }"
          >
            <!-- Light half -->
            <div 
              v-if="!isDark"
              class="bg-white/90"
            ></div>
            <!-- Dark half -->
            <div 
              v-if="isDark"
              class="bg-black/50"
            ></div>
          </div>
          
          <!-- Selected indicator -->
          <div
            v-if="selectedTheme === theme.id"
            class="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <svg class="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <span class="text-xs font-medium text-gray-700">{{ theme.name }}</span>
      </button>
    </div>
    
    <!-- Dark mode toggle -->
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <label class="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          v-model="isDark"
          class="sr-only"
        >
        <div class="relative">
          <div 
            :class="[
              'block w-14 h-8 rounded-full transition-colors duration-200',
              isDark ? 'bg-primary-600' : 'bg-gray-300'
            ]"
          ></div>
          <div 
            :class="[
              'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200',
              isDark ? 'translate-x-6' : 'translate-x-0'
            ]"
          ></div>
        </div>
        <span class="text-sm font-medium text-gray-700">
          Dark Mode
        </span>
      </label>
      
      <div class="flex items-center space-x-2 text-gray-500">
        <!-- Sun icon -->
        <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon icon -->
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </div>
    
    <!-- Preview -->
    <div 
      class="p-4 rounded-lg border-2 transition-all duration-300"
      :style="previewStyles"
    >
      <h3 class="font-bold mb-2" :style="{ color: previewTheme.text }">
        Preview: {{ currentTheme?.name }}
      </h3>
      <p class="text-sm mb-3" :style="{ color: previewTheme.textMuted }">
        This is how your page will look with the selected theme.
      </p>
      <div class="flex space-x-2">
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{ 
            background: `linear-gradient(135deg, ${previewTheme.primary} 0%, ${previewTheme.secondary} 100%)`,
            color: 'white'
          }"
        >
          Primary
        </span>
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{ 
            backgroundColor: previewTheme.surface,
            color: previewTheme.text,
            border: `1px solid ${previewTheme.border}`
          }"
        >
          Surface
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { themes, getThemeById } from '~/utils/themes'

const props = defineProps<{
  modelValue: {
    theme: string
    isDarkMode: boolean
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { theme: string; isDarkMode: boolean }]
}>()

const selectedTheme = ref(props.modelValue.theme)
const isDark = ref(props.modelValue.isDarkMode)

const currentTheme = computed(() => getThemeById(selectedTheme.value))

const previewTheme = computed(() => {
  const theme = currentTheme.value
  if (!theme && themes.length > 0) return themes[0]!.light
  if (!theme) {
    // Fallback to default colors if no themes available
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
  return isDark.value ? theme.dark : theme.light
})

const previewStyles = computed(() => ({
  backgroundColor: previewTheme.value.surface,
  borderColor: previewTheme.value.border,
  color: previewTheme.value.text
}))

watch([selectedTheme, isDark], () => {
  emit('update:modelValue', {
    theme: selectedTheme.value,
    isDarkMode: isDark.value
  })
})
</script>