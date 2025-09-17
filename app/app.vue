<template>
  <UApp>
    <LoadingScreen
      animation-path="/animations/loading.json"
      :minimum-duration="1000"
      @animation-complete="onLoadingComplete"
    />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
<script setup lang="ts">
  const onLoadingComplete = () => {
    // Optional: Add any logic after loading completes
    console.log('Loading animation completed')
  }
</script>
