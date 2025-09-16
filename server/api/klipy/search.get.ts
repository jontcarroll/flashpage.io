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
    console.warn('KLIPY_API_KEY is not configured')
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
    const response = await $fetch(`https://api.klipy.co/api/v1/${config.klipyApiKey}/gifs/search`, {
      params: {
        q: query.q,
        per_page: 12,
        content_filter: 'safe'  // equivalent to 'pg' rating
      }
    })

    return response
  } catch (error) {
    console.error('Error searching Klipy:', error)
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