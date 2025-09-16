<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/20">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute -left-4 top-20 h-72 w-72 animate-pulse rounded-full bg-purple-400 opacity-30 blur-3xl"></div>
        <div class="absolute -right-4 top-40 h-96 w-96 animate-pulse rounded-full bg-blue-400 opacity-25 blur-3xl animation-delay-2000"></div>
        <div class="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 animate-pulse rounded-full bg-indigo-400 opacity-30 blur-3xl animation-delay-4000"></div>
      </div>

      <UContainer class="relative py-16 text-center">
        <div class="mx-auto max-w-3xl">
          <div class="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-5 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition-transform hover:scale-105 dark:from-purple-900/50 dark:to-blue-900/50 dark:text-purple-300">
            <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
            Create your page in seconds
          </div>

          <h1 class="mb-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl animate-gradient">
            Build Your Flashpage
          </h1>

          <p class="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl">
            Share your story, showcase your work, or just have fun.<br />
            <span class="font-semibold text-gray-700 dark:text-gray-200">Your unique space on the web, ready in minutes.</span>
          </p>

          <div class="mb-16 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 transition-transform hover:scale-105 dark:bg-yellow-900/20">
              <UIcon name="i-lucide-zap" class="h-5 w-5 text-yellow-500" />
              <span>Lightning fast</span>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 transition-transform hover:scale-105 dark:bg-purple-900/20">
              <UIcon name="i-lucide-palette" class="h-5 w-5 text-purple-500" />
              <span>Beautiful themes</span>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 transition-transform hover:scale-105 dark:bg-green-900/20">
              <UIcon name="i-lucide-shield-check" class="h-5 w-5 text-green-500" />
              <span>Secure & reliable</span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Wizard Section -->
    <UContainer class="pb-20">
      <UCard class="mx-auto max-w-4xl shadow-xl ring-1 ring-purple-100 dark:ring-purple-900/50 sm:shadow-2xl">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create Your Flashpage</h2>
            <UBadge color="primary" variant="subtle" class="whitespace-nowrap px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Step {{ currentStep + 1 }} of {{ steps.length }}
            </UBadge>
          </div>
        </template>

        <!-- Stepper -->
        <UStepper
          v-model="currentStep"
          :items="stepperItems"
          class="mb-8 opacity-75 scale-95"
          color="neutral"
          variant="subtle"
        />

        <!-- Step Content -->
        <div class="py-6">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="translate-x-8 opacity-0 scale-95"
            enter-to-class="translate-x-0 opacity-100 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100 scale-100"
            leave-to-class="-translate-x-8 opacity-0 scale-95"
          >
            <FlashpageWizard :key="currentStep" />
          </Transition>
        </div>

        <!-- Navigation -->
        <template #footer>
          <div class="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <UButton
              v-if="currentStep > 0"
              color="neutral"
              variant="ghost"
              size="lg"
              class="hover-lift sm:w-auto w-full"
              @click="prevStep"
            >
              <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
              <span class="hidden sm:inline">Previous</span>
              <span class="sm:hidden">Back</span>
            </UButton>
            <div v-else class="hidden sm:block"></div>

            <UButton
              v-if="currentStep < steps.length - 1"
              :disabled="!canProceed"
              size="xl"
              class="btn-primary-gradient min-w-[140px] w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              @click="nextStep"
            >
              Next Step
              <UIcon name="i-lucide-arrow-right" class="ml-2 h-5 w-5" />
            </UButton>
          </div>
        </template>
      </UCard>

      <!-- Fun Facts -->
      <div class="mt-12 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
        <div class="group text-center transition-transform hover:scale-105">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 shadow-md transition-shadow group-hover:shadow-lg dark:from-purple-900 dark:to-purple-800">
            <UIcon name="i-lucide-users" class="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">Join thousands</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">of creators sharing their stories</p>
        </div>
        <div class="group text-center transition-transform hover:scale-105">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-md transition-shadow group-hover:shadow-lg dark:from-blue-900 dark:to-blue-800">
            <UIcon name="i-lucide-clock" class="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">Ready in 60 seconds</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">from start to published page</p>
        </div>
        <div class="group text-center transition-transform hover:scale-105">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-md transition-shadow group-hover:shadow-lg dark:from-green-900 dark:to-green-800">
            <UIcon name="i-lucide-trending-up" class="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">100% uptime</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">reliable hosting for your content</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { currentStep, steps, canProceed, nextStep, prevStep, goToStep } = useFlashpageWizard()

const stepperItems = computed(() =>
  steps.map((step, index) => ({
    title: step.title,
    description: step.description,
    icon: step.icon,
    disabled: index > 0 && !validatePreviousSteps(index)
  }))
)

function validatePreviousSteps(targetIndex: number): boolean {
  const { validateStep } = useFlashpageWizard()
  for (let i = 0; i < targetIndex; i++) {
    if (!validateStep(i)) return false
  }
  return true
}

// Set page meta
useHead({
  title: 'Flashpage - Create Your Unique Web Page',
  meta: [
    {
      name: 'description',
      content: 'Build your personalized flashpage in seconds. Share your story with beautiful themes and custom subdomains.'
    }
  ]
})
</script>
