<script setup lang="ts">
import type { Component } from 'vue'
import { icons } from 'lucide-vue-next'

const props = defineProps<{
  name: string | Component
  size?: string | number
  class?: string
}>()

const iconStyle = computed(() => {
  if (!props.size) return {}
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: s, height: s }
})

const isLucide = computed(() => {
  if (typeof props.name !== 'string') return false
  return props.name.startsWith('i-lucide-')
})

const resolvedComponent = computed(() => {
  if (typeof props.name !== 'string') {
    return props.name
  }

  if (!isLucide.value) return null

  const pascalName = props.name
    .replace(/^i-lucide-/, '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return icons[pascalName as keyof typeof icons] ?? null
})
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="resolvedComponent"
    :class="props.class"
    :style="iconStyle"
  />
</template>
