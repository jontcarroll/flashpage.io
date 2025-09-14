<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- Show subdomain page if subdomain is detected, otherwise show regular routing -->
    <PageSubdomain v-if="hasSubdomain" />
    <PageHome v-else />
  </div>
</template>

<script setup lang="ts">
// Subdomain detection logic
let subdomain: string | null = null

// Server-side: get from context
if (process.server) {
  const event = useRequestEvent()
  subdomain = event?.context.subdomain || null
}

// Client-side: parse from hostname
if (process.client) {
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

const hasSubdomain = !!subdomain
</script>
