<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ArrowUp, RotateCcw, Square } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  status?: 'ready' | 'streaming' | 'submitted' | 'error'
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  status: 'ready'
})

const emit = defineEmits<{
  stop: []
  reload: []
}>()

const icon = computed(() => {
  if (props.status === 'error') return RotateCcw
  if (props.status === 'streaming' || props.status === 'submitted') return Square
  return ArrowUp
})

const isSubmit = computed(() => props.status === 'ready')

function onClick() {
  if (props.status === 'error') {
    emit('reload')
  } else if (props.status === 'streaming' || props.status === 'submitted') {
    emit('stop')
  }
}
</script>

<template>
  <Button
    data-slot="chat-prompt-submit"
    :type="isSubmit ? 'submit' : 'button'"
    variant="default"
    size="icon-sm"
    :disabled="disabled"
    :class="cn('size-7 rounded-md', props.class)"
    @click="!isSubmit && onClick()"
  >
    <component :is="icon" class="size-4" />
  </Button>
</template>
