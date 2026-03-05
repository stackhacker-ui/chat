<script setup lang="ts">
defineProps<{
  href?: string
  target?: string
}>()
</script>

<template>
  <a
    :href="href"
    :target="target"
    class="text-primary border-b border-transparent hover:border-primary font-medium transition-colors"
  >
    <slot />
  </a>
</template>
