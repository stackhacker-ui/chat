<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  autofocus?: boolean
  error?: Error | null
  class?: HTMLAttributes['class']
}>(), {
  modelValue: '',
  placeholder: 'Type your message here...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [event: Event]
}>()

const inputId = useId()
const textareaRef = ref<HTMLTextAreaElement>()

defineExpose({ textareaRef })

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => textareaRef.value?.focus())
  }
})

function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(() => props.modelValue, () => {
  nextTick(resize)
})

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (props.modelValue?.trim()) {
      emit('submit', e)
    }
  }
  if (e.key === 'Escape') {
    textareaRef.value?.blur()
  }
}

function onSubmit(e: Event) {
  e.preventDefault()
  if (props.modelValue?.trim()) {
    emit('submit', e)
  }
}
</script>

<template>
  <form
    data-slot="chat-prompt"
    :class="cn('bg-muted rounded-xl border', props.class)"
    @submit="onSubmit"
  >
    <div v-if="$slots.header" class="px-3 pt-3">
      <slot name="header" />
    </div>

    <textarea
      :id="inputId"
      ref="textareaRef"
      name="prompt"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="1"
      class="w-full resize-none bg-transparent px-4 pt-4 pb-1.5 text-base leading-5 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div v-if="$slots.footer" class="flex items-center justify-between gap-2 px-3 pb-3">
      <slot name="footer" />
    </div>
  </form>
</template>
