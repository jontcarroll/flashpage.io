<template>
  <div class="mx-auto max-w-2xl">
    <!-- Step 1: Basic Info -->
    <div v-if="currentStep === 0" class="space-y-8">
      <div class="space-y-6">
        <UFormField
          label="Subdomain"
          :error="slugError"
          :help="`https://${formData.slug || 'your-name'}.flashpage.io`"
        >
          <UInput
            v-model="formData.slug"
            placeholder="your-awesome-page"
            size="xl"
            :loading="isCheckingAvailability"
            class="input-glow text-center"
            @update:model-value="onSlugChange"
          >
            <template #trailing>
              <UIcon
                v-if="availabilityStatus === 'available'"
                name="i-lucide-check-circle"
                class="text-green-500"
              />
              <UIcon
                v-else-if="availabilityStatus === 'unavailable'"
                name="i-lucide-x-circle"
                class="text-red-500"
              />
            </template>
          </UInput>
        </UFormField>

        <div v-if="formData.slug" class="text-center">
          <span v-if="availabilityStatus === 'available'" class="inline-flex items-center gap-2 text-green-600">
            <UIcon name="i-lucide-check-circle" class="h-4 w-4" />
            Great choice! This subdomain is available.
          </span>
          <span v-else-if="availabilityStatus === 'unavailable'" class="inline-flex items-center gap-2 text-red-600">
            <UIcon name="i-lucide-x-circle" class="h-4 w-4" />
            This subdomain is already taken. Try another one!
          </span>
        </div>

        <UFormField
          label="Page Title"
          :help="`${formData.title.length}/100 characters`"
        >
          <UInput
            v-model="formData.title"
            placeholder="My Amazing Page"
            size="xl"
            :maxlength="100"
            class="input-glow text-center"
          >
            <template #leading>
              <UIcon name="i-lucide-type" />
            </template>
          </UInput>
        </UFormField>
      </div>

      <UAlert
        v-if="formData.slug && formData.title"
        color="primary"
        variant="subtle"
        title="Looking good!"
        description="Your page will be accessible at the URL shown above."
        class="text-center"
      >
        <template #leading>
          <UIcon name="i-lucide-sparkles" />
        </template>
      </UAlert>
    </div>

    <!-- Step 2: Content & GIF -->
    <div v-else-if="currentStep === 1" class="space-y-8">
      <div class="space-y-6">
        <UFormField
          label="Your Message"
          :help="`${formData.content.length}/1000 characters`"
        >
          <UTextarea
            v-model="formData.content"
            placeholder="Share your story, thoughts, or message with the world..."
            :rows="6"
            :maxlength="1000"
            autoresize
            size="xl"
            class="input-glow"
          />
        </UFormField>

        <div class="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info-circle" class="h-4 w-4" />
            <span>Keep it engaging and personal</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-smile" class="h-4 w-4" />
            <span>Emojis are welcome!</span>
          </div>
        </div>
      </div>

      <div v-if="formData.content" class="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-sm transition-all hover:shadow-md dark:from-gray-800 dark:to-gray-700">
        <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Content Preview</h3>
        <p class="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{{ formData.content }}</p>
      </div>

      <!-- GIF Picker -->
      <div class="space-y-4">
        <div class="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Add a GIF (Optional)</h3>
          <GifPicker v-model="formData.gifUrl" />
        </div>
      </div>

      <UAlert
        v-if="formData.content.length > 800"
        color="warning"
        variant="subtle"
        title="Almost at the limit!"
        :description="`You have ${1000 - formData.content.length} characters remaining.`"
      >
        <template #leading>
          <UIcon name="i-lucide-alert-triangle" />
        </template>
      </UAlert>
    </div>

    <!-- Step 3: Theme -->
    <div v-else-if="currentStep === 2" class="space-y-8">
      <div class="space-y-6">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose Your Theme</h3>
          <p class="text-gray-600 dark:text-gray-400">Pick colors and style that match your vibe</p>
        </div>

        <UFormField
          label="Color Theme"
          description="Choose a color scheme for your page"
        >
          <URadioGroup
            v-model="formData.theme"
            :options="themes"
            class="grid grid-cols-1 gap-3 sm:grid-cols-2"
          />
        </UFormField>

        <UFormField
          label="Dark Mode"
          description="Enable dark theme for your page"
        >
          <div class="flex items-center justify-center gap-4 pt-2">
            <USwitch v-model="formData.isDarkMode" size="lg" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formData.isDarkMode ? 'Dark theme enabled' : 'Light theme' }}
            </span>
          </div>
        </UFormField>
      </div>

      <div class="rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700">
        <h3 class="mb-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Theme Preview</h3>
        <div
          :class="[
            'rounded-lg p-6 transition-all hover:scale-[1.02] mx-auto max-w-sm',
            themeClasses[formData.theme],
            formData.isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          ]"
        >
          <div class="mb-3 text-lg font-semibold text-center">{{ formData.title || 'Your Title' }}</div>
          <div class="text-sm opacity-90 text-center">
            This is how your page will look with the {{ formData.theme }} theme
            {{ formData.isDarkMode ? 'in dark mode' : '' }}.
          </div>
        </div>
      </div>
    </div>

    <!-- Step 4: Preview -->
    <div v-else-if="currentStep === 3" class="space-y-8">
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-6 text-center text-lg font-semibold">Review Your Page</h3>

        <div class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div class="text-center">
              <label class="text-sm font-medium text-gray-500">Subdomain</label>
              <p class="mt-1 font-mono text-sm">https://{{ formData.slug }}.flashpage.io</p>
            </div>
            <div class="text-center">
              <label class="text-sm font-medium text-gray-500">Theme</label>
              <p class="mt-1 capitalize">{{ formData.theme }} {{ formData.isDarkMode ? '(Dark)' : '(Light)' }}</p>
            </div>
          </div>

          <div class="text-center">
            <label class="text-sm font-medium text-gray-500">Title</label>
            <p class="mt-1 text-lg font-semibold">{{ formData.title }}</p>
          </div>

          <div class="text-center">
            <label class="text-sm font-medium text-gray-500">Content</label>
            <div class="mt-2 rounded-lg bg-white p-4 dark:bg-gray-900">
              <p class="whitespace-pre-wrap">{{ formData.content }}</p>
            </div>
          </div>

          <div v-if="formData.gifUrl" class="text-center">
            <label class="text-sm font-medium text-gray-500">GIF</label>
            <div class="mt-2 inline-block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                :src="formData.gifUrl"
                alt="Selected GIF"
                class="h-32 w-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <UAlert
        v-if="submitError"
        color="error"
        variant="subtle"
        :title="submitError"
      >
        <template #leading>
          <UIcon name="i-lucide-alert-circle" />
        </template>
      </UAlert>

      <div class="flex flex-col items-center gap-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-8 text-center dark:from-purple-950 dark:to-blue-950">
        <UIcon name="i-lucide-rocket" class="h-16 w-16 text-purple-600 dark:text-purple-400" />
        <div>
          <h3 class="text-xl font-semibold">Ready to Launch!</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Click the button below to create your flashpage
          </p>
        </div>
        <UButton
          size="xl"
          :loading="isLoading"
          class="btn-primary-gradient px-12 py-4 text-lg"
          @click="handleSubmit"
        >
          <UIcon name="i-lucide-sparkles" class="mr-2" />
          Create My Flashpage
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { formData, submitError, isLoading, submitForm, checkAvailability, currentStep } = useFlashpageWizard()
const toast = useToast()

const isCheckingAvailability = ref(false)
const availabilityStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const slugError = ref<string>()
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

const slugDebounce = useDebounceFn(async (value: string) => {
  if (!value || value.length < 3) {
    availabilityStatus.value = 'idle'
    return
  }

  if (!/^[a-z0-9-]+$/.test(value)) {
    slugError.value = 'Use only lowercase letters, numbers, and hyphens'
    availabilityStatus.value = 'idle'
    return
  }

  slugError.value = undefined
  isCheckingAvailability.value = true
  availabilityStatus.value = 'checking'

  try {
    const available = await checkAvailability(value)
    availabilityStatus.value = available ? 'available' : 'unavailable'
  } catch {
    availabilityStatus.value = 'idle'
  } finally {
    isCheckingAvailability.value = false
  }
}, 500)

const onSlugChange = (value: string) => {
  // Convert to lowercase and remove invalid characters
  const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (cleaned !== value) {
    formData.value.slug = cleaned
  }

  slugDebounce(cleaned)
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
  toast.add({
    title: 'Invalid GIF',
    description: 'Could not load the GIF. Please check the URL.',
    color: 'error'
  })
}

const handleSubmit = async () => {
  try {
    const result = await submitForm()

    toast.add({
      title: 'Success! 🎉',
      description: `Your flashpage has been created at ${result.slug}.flashpage.io`,
      color: 'success'
    })

    // Redirect to success page or the created subdomain
    setTimeout(() => {
      window.location.href = `https://${result.slug}.flashpage.io`
    }, 2000)
  } catch (error) {
    // Error is already handled in the composable
    console.error('Failed to create subdomain:', error)
  }
}
</script>