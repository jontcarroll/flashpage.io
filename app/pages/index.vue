<template>
  <div class="min-h-screen bg-white relative">
    <!-- Geometric Pattern Background -->
    <GeometricPattern pattern="dots" subtle />

    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b-8 border-black bg-[#FFFF00]">
      <FpIcon
        name="flash-1"
        class="absolute top-10 left-10 size-[11rem] text-[#FF0066] brutal-rotate-2"
      />
      <FpIcon
        name="flash-2"
        class="absolute bottom-10 right-10 size-[18rem] text-[#FF0066] brutal-rotate-2"
      />

      <UContainer class="relative py-24 px-4">
        <div class="mx-auto max-w-4xl">
          <!-- Badge -->
          <div class="mb-12">
            <div
              class="brutal-badge brutal-shadow-sm brutal-rotate-1 flex w-fit items-center gap-2"
            >
              <FpIcon name="flash-1" class="size-3" /> CREATE IN SECONDS
            </div>
          </div>

          <!-- Main Title -->

          <h1 class="mb-4 brutal-text text-black">BUILD YOUR</h1>
          <h1
            class="mb-12 brutal-text text-black bg-white inline-block px-4 brutal-border brutal-shadow-lg brutal-rotate-n2"
          >
            FLASHPAGE
          </h1>

          <!-- Subtitle -->
          <div class="mb-16 bg-white brutal-border brutal-shadow p-6 max-w-2xl brutal-rotate-1">
            <p class="text-xl font-black uppercase">Share your story. Showcase work. Have fun.</p>
            <p class="text-lg font-mono mt-2">YOUR_UNIQUE_SPACE_ON_THE_WEB</p>
          </div>

          <!-- Feature Pills -->
          <div class="flex flex-wrap gap-4 justify-center">
            <div class="brutal-badge bg-[#00FF00] brutal-shadow-sm">⚡ LIGHTNING FAST</div>
            <div class="brutal-badge bg-[#FF0066] text-white brutal-shadow-sm">🎨 BOLD THEMES</div>
            <div class="brutal-badge bg-[#0066FF] text-white brutal-shadow-sm">🔒 100% SECURE</div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Wizard Section -->
    <UContainer class="py-20">
      <BrutalistCard class="mx-auto max-w-4xl">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-black uppercase">CREATE YOUR FLASHPAGE</h2>
            <div class="brutal-badge">STEP {{ currentStep + 1 }}/{{ steps.length }}</div>
          </div>
        </template>

        <!-- Stepper with Brutal Style -->
        <div class="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            v-for="(step, index) in steps"
            :key="index"
            :class="[
              'brutal-badge brutal-transition',
              currentStep === index ? 'bg-[#FF0066] text-white' : 'bg-white',
              index <= currentStep ? '' : 'opacity-50'
            ]"
            :disabled="index > currentStep"
            @click="index <= currentStep && goToStep(index)"
          >
            {{ index + 1 }}. {{ step.title }}
          </button>
        </div>

        <!-- Step Content -->
        <div class="py-6">
          <Transition
            mode="out-in"
            enter-active-class="brutal-transition"
            enter-from-class="translate-x-8 opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="brutal-transition"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="-translate-x-8 opacity-0"
          >
            <FlashpageWizard :key="currentStep" />
          </Transition>
        </div>

        <!-- Navigation -->
        <template #footer>
          <div class="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BrutalistButton v-if="currentStep > 0" variant="white" size="lg" @click="prevStep">
              ← BACK
            </BrutalistButton>
            <div v-else class="hidden sm:block"></div>

            <BrutalistButton
              v-if="currentStep < steps.length - 1"
              :disabled="!canProceed"
              variant="pink"
              size="lg"
              @click="nextStep"
            >
              NEXT STEP →
            </BrutalistButton>
          </div>
        </template>
      </BrutalistCard>

      <!-- Fun Facts -->
      <div class="mt-16 grid gap-8 md:grid-cols-3">
        <div class="brutal-card brutal-rotate-1 text-center brutal-transition brutal-hover">
          <div class="text-6xl mb-4">👥</div>
          <h3 class="text-xl font-black uppercase mb-2">1000+ CREATORS</h3>
          <p class="font-mono text-sm">SHARING_THEIR_STORIES</p>
        </div>
        <div
          class="flex flex-col items-center brutal-card bg-[#FF0066] text-white brutal-rotate-n2 text-center brutal-transition brutal-hover"
        >
          <div class="mb-4 size-16">
            <FpIcon name="clock-forward" />
          </div>
          <h3 class="text-xl font-black uppercase mb-2">60 SECONDS</h3>
          <p class="font-mono text-sm">FROM_START_TO_PUBLISH</p>
        </div>
        <div
          class="brutal-card bg-[#0066FF] text-white brutal-rotate-2 text-center brutal-transition brutal-hover"
        >
          <div class="text-6xl mb-4">📈</div>
          <h3 class="text-xl font-black uppercase mb-2">100% UPTIME</h3>
          <p class="font-mono text-sm">RELIABLE_HOSTING</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  const { currentStep, steps, canProceed, nextStep, prevStep, goToStep } = useFlashpageWizard()

  // Set page meta
  useHead({
    title: 'Flashpage - Create Your Unique Web Page',
    meta: [
      {
        name: 'description',
        content:
          'Build your personalized flashpage in seconds. Share your story with beautiful themes and custom subdomains.'
      }
    ]
  })
</script>
