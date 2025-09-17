import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  // Get the MongoDB URI from Nuxt runtime config
  const config = useRuntimeConfig()
  const mongoUri = config.mongoUri
  
  try {
    console.log('Attempting to connect to MongoDB at:', mongoUri)
    await mongoose.connect(mongoUri)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    console.error('Attempted URI:', mongoUri)
    throw error
  }
}