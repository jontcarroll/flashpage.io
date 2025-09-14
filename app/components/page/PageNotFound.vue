<template>
  <div class="card max-w-2xl w-full text-center">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ title }}</h1>
    <p class="text-gray-600 mb-6">{{ message }}</p>
    <NuxtLink to="/public" class="btn-primary inline-block">{{ buttonText }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  buttonText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Page Not Found',
  message: "This subdomain doesn't exist yet.",
  buttonText: 'Create Your Own Page'
})
</script>