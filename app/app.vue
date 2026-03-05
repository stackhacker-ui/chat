<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Toaster } from '@/components/ui/sonner'

const mode = useColorMode()

const color = computed(() => mode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Stackhacker UI Chat Template'
const description = 'A full-featured Nuxt AI chatbot template built with shadcn-vue.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://chat-template.stackhacker.io/screenshots/chat-light.png',
  twitterImage: 'https://chat-template.stackhacker.io/screenshots/chat-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <NuxtLoadingIndicator color="var(--color-primary)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <Toaster position="top-right" />
    </ClientOnly>
  </TooltipProvider>
</template>
