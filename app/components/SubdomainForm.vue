<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Subdomain input -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Choose your subdomain
      </label>
      <div class="flex items-center">
        <input
          v-model="form.slug"
          type="text"
          placeholder="my-awesome-page"
          class="input-field flex-1"
          pattern="[a-z0-9-]+"
          minlength="3"
          maxlength="50"
          required
          @input="checkAvailability"
        />
        <span class="ml-2 text-gray-500">.flashpage.io</span>
      </div>
      <p v-if="availability.checking" class="text-sm text-gray-500 mt-1">Checking availability...</p>
      <p v-if="availability.checked && !availability.available" class="text-sm text-red-500 mt-1">This subdomain is already taken</p>
      <p v-if="availability.checked && availability.available" class="text-sm text-green-500 mt-1">Available!</p>
    </div>

    <!-- Page title -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Page Title
      </label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Welcome to my page!"
        class="input-field"
        maxlength="100"
        required
      />
    </div>

    <!-- Content -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Your Message
      </label>
      <textarea
        v-model="form.content"
        placeholder="Write something fun..."
        class="input-field min-h-[120px] resize-none"
        maxlength="1000"
        required
      ></textarea>
      <p class="text-sm text-gray-500 mt-1">{{ form.content.length }}/1000 characters</p>
    </div>

    <!-- GIF Searcher -->
    <GifSearcher v-model="form.gifUrl" />

    <!-- Theme selector -->
    <ThemeSelector v-model="themeSettings" />

    <!-- Submit button -->
    <button
      type="submit"
      :disabled="submitting || !availability.available || !form.gifUrl"
      class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ submitting ? 'Creating...' : 'Create My Page!' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import type { SubdomainFormData, ThemeSettings, AvailabilityState } from '../../types'

interface Emits {
  (e: 'submit', data: SubdomainFormData): void
  (e: 'success', url: string): void
  (e: 'error', message: string): void
}

const emit = defineEmits<Emits>()

const form = reactive<SubdomainFormData>({
  slug: '',
  title: '',
  content: '',
  gifUrl: '',
  theme: 'aurora',
  isDarkMode: false
})

const themeSettings = reactive<ThemeSettings>({
  theme: 'aurora',
  isDarkMode: false
})

const availability = reactive<AvailabilityState>({
  checking: false,
  checked: false,
  available: true
})

const submitting = ref(false)

let checkTimeout: NodeJS.Timeout

const checkAvailability = async () => {
  clearTimeout(checkTimeout)
  availability.checked = false

  if (form.slug.length < 3) return

  availability.checking = true
  checkTimeout = setTimeout(async () => {
    try {
      const response = await $fetch<{ available: boolean }>(`/api/subdomains/check/${form.slug}`)
      availability.available = response.available
      availability.checked = true
    } catch (err) {
      console.error('Error checking availability:', err)
    } finally {
      availability.checking = false
    }
  }, 500)
}

const handleSubmit = async () => {
  submitting.value = true

  // Update form with theme settings
  form.theme = themeSettings.theme
  form.isDarkMode = themeSettings.isDarkMode

  try {
    const response = await $fetch('/api/subdomains', {
      method: 'POST',
      body: form
    })

    const config = useRuntimeConfig()
    const siteUrl = String(config.public.siteUrl)
    const successUrl = `http://${form.slug}.${siteUrl.replace(/https?:\/\//, '')}`
    
    emit('success', successUrl)

    // Reset form
    form.slug = ''
    form.title = ''
    form.content = ''
    form.gifUrl = ''
    form.theme = 'aurora'
    form.isDarkMode = false
    themeSettings.theme = 'aurora'
    themeSettings.isDarkMode = false
    availability.checked = false
  } catch (err: any) {
    emit('error', err.data?.message || 'Failed to create subdomain. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>