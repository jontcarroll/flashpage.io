<template>
  <div class="space-y-6">
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
</template>

<script setup lang="ts">
const { formData } = useFlashpageWizard()
</script>