export default defineNuxtRouteMiddleware((to, from) => {
  const { subdomain, hasSubdomain } = useSubdomain()
  
  // If we have a subdomain and we're not already on the subdomain page, redirect
  if (hasSubdomain.value && to.path !== '/subdomain') {
    return navigateTo('/subdomain', { replace: true })
  }
  
  // If we don't have a subdomain but we're on the subdomain page, redirect to home
  if (!hasSubdomain.value && to.path === '/subdomain') {
    return navigateTo('/', { replace: true })
  }
  
  // Otherwise, continue with normal routing
})