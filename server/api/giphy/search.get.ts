export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  if (!query.q) {
    return { data: [] }
  }
  
  if (!config.giphyApiKey) {
    console.warn('GIPHY_API_KEY is not configured')
    // Return some default GIFs for demo purposes
    return {
      data: [
        {
          id: '1',
          title: 'Demo GIF',
          images: {
            fixed_height: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
            original: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' }
          }
        },
        {
          id: '2',
          title: 'Demo GIF 2',
          images: {
            fixed_height: { url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' },
            original: { url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif' }
          }
        }
      ]
    }
  }
  
  try {
    const response = await $fetch('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: config.giphyApiKey,
        q: query.q,
        limit: 12,
        rating: 'pg'
      }
    })
    
    return response
  } catch (error) {
    console.error('Error searching Giphy:', error)
    return { data: [] }
  }
})