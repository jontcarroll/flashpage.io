<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card max-w-2xl w-full">
      <h1 class="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        FlashPage.io
      </h1>
      <p class="text-center text-gray-600 mb-8">Create your own instant subdomain with custom content and a fun GIF!</p>

      <SubdomainForm
        @success="handleSuccess"
        @error="handleError"
      />

      <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
        <p class="font-semibold">Success! Your page is ready:</p>
        <a :href="successUrl" target="_blank" class="underline">{{ successUrl }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const error = ref('')
const success = ref(false)
const successUrl = ref('')

const handleSuccess = (url: string) => {
  success.value = true
  successUrl.value = url
  error.value = ''
}

const handleError = (message: string) => {
  error.value = message
  success.value = false
}
</script>