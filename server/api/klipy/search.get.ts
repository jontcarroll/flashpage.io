export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  if (!query.q) {
    return {
      result: true,
      data: {
        data: [],
        current_page: 1,
        per_page: 12,
        has_next: false
      }
    }
  }

  if (!config.klipyApiKey) {
    console.error('KLIPY_API_KEY is not configured in runtime config')
    // Return some default GIFs for demo purposes
    return {
      result: true,
      data: {
        data: [
          {
            url: 'https://example.com/gif1',
            title: 'Demo GIF',
            slug: 'demo-gif-1',
            files: {
              gif: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
              webp: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
              mp4: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4'
            }
          },
          {
            url: 'https://example.com/gif2',
            title: 'Demo GIF 2',
            slug: 'demo-gif-2',
            files: {
              gif: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
              webp: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
              mp4: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.mp4'
            }
          }
        ],
        current_page: 1,
        per_page: 12,
        has_next: false
      }
    }
  }

  try {
    console.log(`Searching Klipy for: ${query.q}`)
    const response = await $fetch(`https://api.klipy.co/api/v1/${config.klipyApiKey}/gifs/search`, {
      params: {
        q: query.q,
        per_page: 12,
        content_filter: 'safe'  // equivalent to 'pg' rating
      }
    })

    console.log(`Klipy search successful, returned ${response.data?.data?.length || 0} results`)
    return response
  } catch (error: any) {
    console.error('Error searching Klipy:', error.message || error)
    console.error('API URL:', `https://api.klipy.co/api/v1/${config.klipyApiKey ? '[KEY_PRESENT]' : '[NO_KEY]'}/gifs/search`)
    return {
      result: false,
      data: {
        data: [],
        current_page: 1,
        per_page: 12,
        has_next: false
      }
    }
  }
})