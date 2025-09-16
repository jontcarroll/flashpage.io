<template>
  <div class="space-y-6">
    <div>
      <UFormField
        label="GIF URL"
        description="Add a fun GIF to make your page come alive!"
      >
        <UInput
          v-model="formData.gifUrl"
          placeholder="https://media.giphy.com/..."
          size="lg"
        >
          <template #leading>
            <UIcon name="i-lucide-image" />
          </template>
          <template #trailing>
            <UButton
              v-if="formData.gifUrl"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="previewGif = !previewGif"
            >
              {{ previewGif ? 'Hide' : 'Preview' }}
            </UButton>
          </template>
        </UInput>
      </UFormField>

      <div
        v-if="previewGif && formData.gifUrl && isValidUrl(formData.gifUrl)"
        class="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <img
          :src="formData.gifUrl"
          alt="GIF Preview"
          class="h-48 w-full object-cover"
          @error="handleImageError"
        />
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div>
        <UFormField
          label="Theme"
          description="Choose a color scheme"
        >
          <URadioGroup
            v-model="formData.theme"
            :options="themes"
          />
        </UFormField>
      </div>

      <div>
        <UFormField
          label="Dark Mode"
          description="Enable dark theme"
        >
          <div class="flex items-center gap-3 pt-2">
            <USwitch v-model="formData.isDarkMode" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formData.isDarkMode ? 'Dark theme enabled' : 'Light theme' }}
            </span>
          </div>
        </UFormField>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Theme Preview</h3>
      <div
        :class="[
          'rounded-md p-4 transition-all',
          themeClasses[formData.theme],
          formData.isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        ]"
      >
        <div class="mb-2 text-lg font-semibold">{{ formData.title || 'Your Title' }}</div>
        <div class="text-sm opacity-90">
          This is how your page will look with the {{ formData.theme }} theme
          {{ formData.isDarkMode ? 'in dark mode' : '' }}.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { formData } = useFlashpageWizard()

const previewGif = ref(false)

const themes = [
  { value: 'aurora', label: '🌈 Aurora', hint: 'Colorful northern lights' },
  { value: 'ocean', label: '🌊 Ocean', hint: 'Deep blue waters' },
  { value: 'sunset', label: '🌅 Sunset', hint: 'Warm orange glow' },
  { value: 'forest', label: '🌲 Forest', hint: 'Natural greens' }
]

const themeClasses: Record<string, string> = {
  aurora: 'border-2 border-purple-400',
  ocean: 'border-2 border-blue-400',
  sunset: 'border-2 border-orange-400',
  forest: 'border-2 border-green-400'
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const handleImageError = () => {
  previewGif.value = false
  useToast().add({
    title: 'Invalid GIF',
    description: 'Could not load the GIF. Please check the URL.',
    color: 'error'
  })
}
</script>