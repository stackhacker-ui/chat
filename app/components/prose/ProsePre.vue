<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  class?: string
}>()

const copied = ref(false)
const preRef = ref<HTMLElement>()

function copyCode() {
  const code = preRef.value?.querySelector('code')?.textContent || ''
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="relative group my-5">
    <Button
      variant="ghost"
      size="icon-sm"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      @click="copyCode"
    >
      <Check v-if="copied" class="size-4" />
      <Copy v-else class="size-4" />
    </Button>
    <pre
      ref="preRef"
      :class="[$props.class, 'font-mono text-sm/6 border border-border bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto']"
    ><slot /></pre>
  </div>
</template>

<style scoped>
:deep(.shiki span.line) {
  display: block;
}

:deep(.shiki span.line.highlight) {
  margin: 0 -1rem;
  padding: 0 1rem;
  background-color: var(--color-muted);
}
</style>
