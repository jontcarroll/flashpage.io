<template>
  <div class="min-h-screen bg-white relative">
    <GeometricPattern pattern="dots" subtle />

    <SectionHero />

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
            <SectionFlashpageWizard :key="currentStep" />
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

      <SectionFunFacts />
    </UContainer>
  </div>
</template>
<script setup lang="ts">
  const { currentStep, steps, canProceed, nextStep, prevStep, goToStep } = useFlashpageWizard()
</script>
