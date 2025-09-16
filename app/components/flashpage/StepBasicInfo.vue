<template>
  <div class="space-y-6">
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
</template>

<script setup lang="ts">
const { formData, checkAvailability } = useFlashpageWizard()

const isCheckingAvailability = ref(false)
const availabilityStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const slugError = ref<string>()

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
</script>