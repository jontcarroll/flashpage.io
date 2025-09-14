export default defineEventHandler(async (event) => {
    const host = getHeader(event, 'host') || ''
    const config = useRuntimeConfig()

    // Remove port if present
    const hostWithoutPort = host.split(':')[0]
    
    // Extract subdomain from host
    const parts = hostWithoutPort.split('.')

    // For localhost testing (e.g., test.localhost, demo.localhost)
    if (hostWithoutPort.endsWith('.localhost')) {
        const subdomain = parts[0]
        if (subdomain && subdomain !== 'localhost') {
            console.log('Detected subdomain:', subdomain)
            event.context.subdomain = subdomain
            return
        }
    }

    // For production domains
    if (parts.length >= 3) {
        const subdomain = parts[0]
        // Skip if it's www or the main domain
        if (subdomain && subdomain !== 'www') {
            console.log('Detected subdomain:', subdomain)
            event.context.subdomain = subdomain
        }
    }
})