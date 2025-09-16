<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute -left-4 top-20 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
        <div class="absolute -right-4 top-40 h-72 w-72 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
        <div class="absolute bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300 opacity-20 blur-3xl"></div>
      </div>

      <UContainer class="relative py-16 text-center">
        <div class="mx-auto max-w-3xl">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
            Create your page in seconds
          </div>

          <h1 class="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            Build Your Flashpage
          </h1>

          <p class="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Share your story, showcase your work, or just have fun.<br />
            Your unique space on the web, ready in minutes.
          </p>

          <div class="mb-12 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-zap" class="h-4 w-4 text-yellow-500" />
              <span>Lightning fast</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-palette" class="h-4 w-4 text-purple-500" />
              <span>Beautiful themes</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-shield-check" class="h-4 w-4 text-green-500" />
              <span>Secure & reliable</span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Wizard Section -->
    <UContainer class="pb-20">
      <UCard class="mx-auto max-w-4xl">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">Create Your Flashpage</h2>
            <UBadge color="purple" variant="subtle">
              Step {{ currentStep + 1 }} of {{ steps.length }}
            </UBadge>
          </div>
        </template>

        <!-- Stepper -->
        <UStepper
          v-model="currentStep"
          :items="stepperItems"
          class="mb-8"
          @update:model-value="goToStep"
        />

        <!-- Step Content -->
        <div class="py-6">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-x-4 opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="-translate-x-4 opacity-0"
          >
            <div :key="currentStep">
              <SubdomainStepBasicInfo v-if="currentStep === 0" />
              <SubdomainStepContent v-else-if="currentStep === 1" />
              <SubdomainStepVisuals v-else-if="currentStep === 2" />
              <SubdomainStepPreview v-else-if="currentStep === 3" />
            </div>
          </Transition>
        </div>

        <!-- Navigation -->
        <template #footer>
          <div class="flex items-center justify-between">
            <UButton
              v-if="currentStep > 0"
              color="gray"
              variant="ghost"
              @click="prevStep"
            >
              <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
              Previous
            </UButton>
            <div v-else></div>

            <UButton
              v-if="currentStep < steps.length - 1"
              :disabled="!canProceed"
              @click="nextStep"
            >
              Next
              <UIcon name="i-lucide-arrow-right" class="ml-2 h-4 w-4" />
            </UButton>
          </div>
        </template>
      </UCard>

      <!-- Fun Facts -->
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <UIcon name="i-lucide-users" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="font-semibold">Join thousands</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">of creators sharing their stories</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <UIcon name="i-lucide-clock" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="font-semibold">Ready in 60 seconds</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">from start to published page</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <UIcon name="i-lucide-trending-up" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="font-semibold">100% uptime</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">reliable hosting for your content</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { currentStep, steps, canProceed, nextStep, prevStep, goToStep, formData } = useSubdomainWizard()

const stepperItems = computed(() =>
  steps.map((step, index) => ({
    title: step.title,
    description: step.description,
    icon: step.icon,
    disabled: index > 0 && !validatePreviousSteps(index)
  }))
)

function validatePreviousSteps(targetIndex: number): boolean {
  const { validateStep } = useSubdomainWizard()
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