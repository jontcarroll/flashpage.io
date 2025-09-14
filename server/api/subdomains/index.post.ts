import { connectDB } from '../../utils/mongodb'
import { Subdomain } from '../../models/subdomain'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const body = await readBody(event)
  
  // Validate input
  if (!body.slug || !body.title || !body.content || !body.gifUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }
  
  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(body.slug) || body.slug.length < 3 || body.slug.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens (3-50 characters)'
    })
  }
  
  try {
    // Check if subdomain already exists
    const existing = await Subdomain.findOne({ slug: body.slug })
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Subdomain already exists'
      })
    }
    
    // Create new subdomain
    const subdomain = await Subdomain.create({
      slug: body.slug.toLowerCase(),
      title: body.title,
      content: body.content,
      gifUrl: body.gifUrl,
      theme: body.theme || 'aurora',
      isDarkMode: body.isDarkMode || false
    })
    
    return {
      success: true,
      subdomain: {
        slug: subdomain.slug,
        title: subdomain.title,
        createdAt: subdomain.createdAt
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error creating subdomain:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create subdomain'
    })
  }
})