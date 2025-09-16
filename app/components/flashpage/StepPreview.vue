<template>
  <div class="space-y-6">
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
</template>

<script setup lang="ts">
const { formData, submitError, isLoading, submitForm } = useFlashpageWizard()
const toast = useToast()
const router = useRouter()

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