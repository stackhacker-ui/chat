<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
    <p class="text-8xl font-bold">
      {{ error.statusCode }}
    </p>
    <p class="text-lg text-muted-foreground">
      {{ error.statusMessage || 'Something went wrong' }}
    </p>
    <button
      class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
      @click="handleError"
    >
      Go back home
    </button>
  </div>
</template>
