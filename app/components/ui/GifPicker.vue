<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <UFormField label="Search for GIFs" description="Find the perfect GIF to make your page shine!">
      <UInput
        :model-value="searchQuery"
        placeholder="Search for gifs... (e.g., celebration, cat, dance)"
        size="xl"
        class="input-glow"
        :loading="isLoading"
        @update:model-value="search"
      >
        <template #leading>
          <FpIcon name="search" class="size-4" />
        </template>
        <template #trailing>
          <UButton
            v-if="searchQuery"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="clearSearch"
          >
            <span>×</span>
          </UButton>
        </template>
      </UInput>
    </UFormField>

    <!-- Error State -->
    <UAlert v-if="error" color="error" variant="subtle" :title="error"> </UAlert>

    <!-- Loading State for Initial Search -->
    <div
      v-if="isLoading && gifs.length === 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
    >
      <div v-for="i in 8" :key="i" class="aspect-square animate-pulse rounded-lg bg-gray-200" />
    </div>

    <!-- GIF Grid -->
    <div v-else-if="gifs.length > 0" class="space-y-4">
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <button
          v-for="gif in gifs"
          :key="gif.slug"
          :class="[
            'group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200',
            selectedGif?.slug === gif.slug
              ? 'border-primary-500 ring-2 ring-primary-500/20 scale-105'
              : 'border-gray-200 hover:border-gray-300 hover:scale-105'
          ]"
          @click="selectGif(gif)"
        >
          <!-- GIF Image -->
          <img
            :src="gif.file.hd.webp.url || gif.file.hd.gif.url"
            :alt="gif.title"
            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
            loading="lazy"
          />

          <!-- Overlay -->
          <div
            :class="[
              'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200',
              selectedGif?.slug === gif.slug ? 'opacity-100' : 'group-hover:opacity-100'
            ]"
          >
            <span v-if="selectedGif?.slug === gif.slug" class="text-3xl text-white">✓</span>
            <span v-else class="text-3xl text-white">+</span>
          </div>

          <!-- Title -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"
          >
            <p class="text-xs font-medium text-white truncate">
              {{ gif.title }}
            </p>
          </div>
        </button>
      </div>

      <!-- Load More Button -->
      <div v-if="hasNext" class="flex justify-center pt-4">
        <UButton :loading="isLoading" color="neutral" variant="outline" size="lg" @click="loadMore">
          <span class="mr-2">▼</span>
          Load More GIFs
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="searchQuery && !isLoading"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <span class="text-5xl text-gray-400 mb-4">🖼️</span>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No GIFs found</h3>
      <p class="text-gray-600 mb-4">
        Try searching for something else like "celebration" or "thumbs up"
      </p>
      <UButton color="neutral" variant="outline" @click="search('celebration')">
        <span class="mr-2">🎉</span>
        Try "celebration"
      </UButton>
    </div>

    <!-- Selected GIF Preview -->
    <div v-if="selectedGif" class="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 class="mb-3 text-sm font-medium text-gray-700">Selected GIF</h3>
      <div class="flex items-center gap-4">
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <img
            :src="selectedGif.file.hd.webp.url || selectedGif.file.hd.gif.url"
            :alt="selectedGif.title"
            class="h-20 w-20 object-cover"
          />
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">
            {{ selectedGif.title }}
          </h4>
          <p class="mt-1 text-sm text-gray-600">This GIF will be displayed on your flashpage</p>
        </div>
        <UButton color="neutral" variant="ghost" size="sm" @click="clearSelection">
          <UIcon name="i-lucide-x" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FpIcon from '~/components/ui/FpIcon.vue'

  interface KlipyGif {
    id: number
    slug: string
    title: string
    file: {
      hd: {
        gif: {
          url: string
          width: number
          height: number
          size: number
        }
        webp: {
          url: string
          width: number
          height: number
          size: number
        }
        mp4: {
          url: string
          width: number
          height: number
          size: number
        }
      }
    }
  }

  interface Props {
    modelValue?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const { isLoading, searchQuery, gifs, error, hasNext, search, loadMore, reset } = useGifSearch()

  const selectedGif = ref<KlipyGif | null>(null)

  // Watch for changes to the model value to update selected GIF
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue && !selectedGif.value) {
        // Try to find the GIF in our current results
        const gif = gifs.value.find(
          (g) => g.file.hd.gif.url === newValue || g.file.hd.webp.url === newValue
        )
        if (gif) {
          selectedGif.value = gif
        }
      } else if (!newValue) {
        selectedGif.value = null
      }
    },
    { immediate: true }
  )

  const selectGif = (gif: KlipyGif) => {
    selectedGif.value = gif
    // Prefer WebP for better compression, fallback to GIF
    const gifUrl = gif.file.hd.webp.url || gif.file.hd.gif.url
    emit('update:modelValue', gifUrl)
  }

  const clearSelection = () => {
    selectedGif.value = null
    emit('update:modelValue', '')
  }

  const clearSearch = () => {
    reset()
  }
</script>
