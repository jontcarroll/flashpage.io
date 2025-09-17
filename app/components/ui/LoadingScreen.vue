<template>
  <Transition mode="in-out" name="loading-fade" @after-leave="onTransitionComplete">
    <div v-if="isVisible" class="loading-screen">
      <GeometricPattern pattern="grid" subtle />
      <div class="loading-container">
        <div
          ref="lottieContainer"
          class="lottie-animation"
          :class="{ 'animation-loaded': animationLoaded }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import lottie, { type AnimationItem } from 'lottie-web'

  const props = defineProps<{
    animationPath?: string
    minimumDuration?: number
  }>()

  const emit = defineEmits<{
    'animation-complete': []
  }>()

  const isVisible = ref(true)
  const animationLoaded = ref(false)
  const lottieContainer = ref<HTMLElement>()
  let animation: AnimationItem | null = null
  let startTime: number

  const onTransitionComplete = () => {
    emit('animation-complete')
  }

  const hideLoading = async () => {
    const elapsed = Date.now() - startTime
    const minimumDuration = props.minimumDuration || 1500

    if (elapsed < minimumDuration) {
      await new Promise((resolve) => setTimeout(resolve, minimumDuration - elapsed))
    }

    isVisible.value = false
  }

  onMounted(() => {
    startTime = Date.now()

    if (lottieContainer.value) {
      animation = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: props.animationPath || '/animations/loading.json'
      })

      // Listen for the animation data to be loaded
      animation.addEventListener('DOMLoaded', () => {
        // Add a small delay for the pop effect
        setTimeout(() => {
          animationLoaded.value = true
        }, 50)
      })

      // Also trigger loaded state if animation loads quickly
      animation.addEventListener('complete', () => {
        if (!animationLoaded.value) {
          animationLoaded.value = true
        }
      })
    }

    // Listen for app ready state
    const nuxtApp = useNuxtApp()

    // Hide loading after page is ready
    nuxtApp.hook('page:finish', () => {
      hideLoading()
    })

    // Also hide after a maximum time to prevent stuck loading
    setTimeout(() => {
      if (isVisible.value) {
        hideLoading()
      }
    }, 5000)
  })

  onUnmounted(() => {
    if (animation) {
      animation.destroy()
    }
  })
</script>

<style scoped>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-brutal-white, #ffffff);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 8px solid var(--color-brutal-black, #000000);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .lottie-animation {
    width: 300px;
    height: 300px;
    max-width: 80vw;
    max-height: 80vh;
    opacity: 0;
    transform: scale(0) rotate(-10deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  /* Pop in animation when loaded */
  .lottie-animation.animation-loaded {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  /* Brutalist-style fade transition */
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: all 0.3s linear;
  }

  .loading-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px) rotate(-2deg);
  }
</style>
