export default defineEventHandler(async (event) => {
  // Simple health check endpoint for container orchestration
  // Returns 200 OK if the service is running

  // You can add more sophisticated health checks here, such as:
  // - Database connectivity check
  // - External service availability
  // - Memory/CPU usage checks

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }
})