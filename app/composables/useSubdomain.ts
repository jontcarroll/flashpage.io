export const useSubdomain = () => {
  let subdomain: string | null = null

  // Server-side: get from context
  if (import.meta.server) {
    const event = useRequestEvent()
    subdomain = event?.context.subdomain || null
  }

  // Client-side: parse from hostname
  if (import.meta.client) {
    const host = window.location.hostname
    const parts = host.split('.')
    
    // Check for .localhost domains
    if (host.endsWith('.localhost') && parts.length === 2) {
      subdomain = parts[0] || null
    }
    // Check for production domains (subdomain.domain.com)
    else if (parts.length >= 3 && parts[0] !== 'www') {
      subdomain = parts[0] || null
    }
  }

  return {
    subdomain: ref(subdomain),
    hasSubdomain: computed(() => !!subdomain)
  }
}