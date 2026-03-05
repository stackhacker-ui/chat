<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const mode = useColorMode()

function toggle() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :class="cn('', props.class)"
    @click="toggle"
  >
    <ClientOnly>
      <Sun v-if="mode === 'light'" class="size-5" />
      <Moon v-else class="size-5" />
    </ClientOnly>
    <span class="sr-only">Toggle color mode</span>
  </Button>
</template>
