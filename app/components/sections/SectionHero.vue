<template>
  <section class="relative overflow-hidden border-b-8 border-black bg-[#FFFF00]">
    <FpIcon name="flash-1" class="absolute top-10 left-10 size-[11rem] brutal-rotate-2" />
    <FpIcon name="flash-2" class="absolute bottom-10 right-10 size-[18rem] brutal-rotate-2" />

    <UContainer class="relative py-24 px-4">
      <div class="mx-auto max-w-4xl">
        <!-- Badge -->
        <div class="mb-12">
          <div class="brutal-badge brutal-shadow-sm brutal-rotate-1 flex w-fit items-center gap-2">
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
  </section>
</template>

<style scoped></style>
<script setup lang="ts"></script>
