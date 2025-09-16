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

interface KlipyResponse {
  result: boolean
  data: {
    data: KlipyGif[]
    current_page: number
    per_page: number
    has_next: boolean
  }
}

export const useGifSearch = () => {
  const isLoading = ref(false)
  const searchQuery = ref('')
  const gifs = ref<KlipyGif[]>([])
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const hasNext = ref(false)

  const searchGifs = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      gifs.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<KlipyResponse>('/api/klipy/search', {
        params: {
          q: query,
          page
        }
      })

      if (response.result) {
        if (page === 1) {
          gifs.value = response.data.data
        } else {
          gifs.value.push(...response.data.data)
        }
        currentPage.value = response.data.current_page
        hasNext.value = response.data.has_next
      } else {
        error.value = 'Failed to search for GIFs'
      }
    } catch (err) {
      error.value = 'Error searching for GIFs'
      console.error('GIF search error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const debouncedSearch = useDebounceFn((query: string) => {
    searchGifs(query, 1)
  }, 300)

  const search = (query: string) => {
    searchQuery.value = query
    debouncedSearch(query)
  }

  const loadMore = () => {
    if (hasNext.value && !isLoading.value) {
      searchGifs(searchQuery.value, currentPage.value + 1)
    }
  }

  const reset = () => {
    searchQuery.value = ''
    gifs.value = []
    error.value = null
    currentPage.value = 1
    hasNext.value = false
  }

  // Load some default/trending GIFs on mount
  onMounted(() => {
    searchGifs('celebration', 1)
  })

  return {
    isLoading: readonly(isLoading),
    searchQuery: readonly(searchQuery),
    gifs: readonly(gifs),
    error: readonly(error),
    hasNext: readonly(hasNext),
    search,
    loadMore,
    reset
  }
}