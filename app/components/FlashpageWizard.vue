<template>
  <div class="space-y-6">
    <!-- Step 1: Basic Info -->
    <div v-if="currentStep === 0" class="space-y-6">
      <div>
        <UFormField
          label="Subdomain"
          :error="slugError"
          :help="`https://${formData.slug || 'your-name'}.flashpage.io`"
        >
          <UInput
            v-model="formData.slug"
            placeholder="your-awesome-page"
            size="lg"
            :loading="isCheckingAvailability"
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

        <div v-if="formData.slug" class="mt-2 text-sm text-gray-500">
          <span v-if="availabilityStatus === 'available'" class="text-green-600">
            ✨ Great choice! This subdomain is available.
          </span>
          <span v-else-if="availabilityStatus === 'unavailable'" class="text-red-600">
            😕 This subdomain is already taken. Try another one!
          </span>
        </div>
      </div>

      <div>
        <UFormField
          label="Page Title"
          :help="`${formData.title.length}/100 characters`"
        >
          <UInput
            v-model="formData.title"
            placeholder="My Amazing Page"
            size="lg"
            :maxlength="100"
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
      >
        <template #leading>
          <UIcon name="i-lucide-sparkles" />
        </template>
      </UAlert>
    </div>

    <!-- Step 2: Content -->
    <div v-else-if="currentStep === 1" class="space-y-6">
      <div>
        <UFormField
          label="Your Message"
          :help="`${formData.content.length}/1000 characters`"
        >
          <UTextarea
            v-model="formData.content"
            placeholder="Share your story, thoughts, or message with the world..."
            :rows="8"
            :maxlength="1000"
            autoresize
          />
        </UFormField>

        <div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-info-circle" class="h-4 w-4" />
            <span>Keep it engaging and personal</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-smile" class="h-4 w-4" />
            <span>Emojis are welcome!</span>
          </div>
        </div>
      </div>

      <div v-if="formData.content" class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
        <p class="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{{ formData.content }}</p>
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

    <!-- Step 3: Visuals -->
    <div v-else-if="currentStep === 2" class="space-y-6">
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

    <!-- Step 4: Preview -->
    <div v-else-if="currentStep === 3" class="space-y-6">
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-4 text-lg font-semibold">Review Your Page</h3>

        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-gray-500">Subdomain</label>
              <p class="mt-1 font-mono text-sm">https://{{ formData.slug }}.flashpage.io</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Theme</label>
              <p class="mt-1 capitalize">{{ formData.theme }} {{ formData.isDarkMode ? '(Dark)' : '(Light)' }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-500">Title</label>
            <p class="mt-1 text-lg font-semibold">{{ formData.title }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-500">Content</label>
            <p class="mt-1 whitespace-pre-wrap">{{ formData.content }}</p>
          </div>

          <div v-if="formData.gifUrl">
            <label class="text-sm font-medium text-gray-500">GIF Preview</label>
            <div class="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                :src="formData.gifUrl"
                alt="Selected GIF"
                class="h-32 w-full object-cover"
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

      <div class="flex flex-col items-center gap-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6 text-center dark:from-purple-950 dark:to-blue-950">
        <UIcon name="i-lucide-rocket" class="h-12 w-12 text-purple-600 dark:text-purple-400" />
        <div>
          <h3 class="text-lg font-semibold">Ready to Launch! 🚀</h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Click the button below to create your flashpage
          </p>
        </div>
        <UButton
          size="lg"
          :loading="isLoading"
          @click="handleSubmit"
        >
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