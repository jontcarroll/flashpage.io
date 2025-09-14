<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Search for a GIF
    </label>
    <div class="space-y-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Giphy..."
        class="input-field"
        @input="handleSearch"
      />

      <div v-if="gifs.length > 0" class="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
        <img
          v-for="gif in gifs"
          :key="gif.id"
          :src="gif.images.fixed_height.url"
          :alt="gif.title"
          class="w-full h-24 object-cover rounded cursor-pointer hover:ring-2 hover:ring-purple-500"
          :class="{ 'ring-2 ring-purple-500': modelValue === gif.images.original.url }"
          @click="selectGif(gif)"
        />
      </div>

      <div v-if="modelValue" class="text-center">
        <p class="text-sm text-gray-600 mb-2">Selected GIF:</p>
        <img :src="modelValue" alt="Selected GIF" class="mx-auto rounded-lg max-w-full h-40 object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const gifs = ref<any[]>([])

let searchTimeout: NodeJS.Timeout

const handleSearch = async () => {
  clearTimeout(searchTimeout)

  if (searchQuery.value.length < 2) {
    gifs.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await $fetch<{ data: any[] }>('/api/giphy/search', {
        params: { q: searchQuery.value }
      })
      gifs.value = response.data || []
    } catch (err) {
      console.error('Error searching GIFs:', err)
    }
  }, 500)
}

const selectGif = (gif: any) => {
  emit('update:modelValue', gif.images.original.url)
}
</script>