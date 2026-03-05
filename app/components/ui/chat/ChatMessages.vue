<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { UIMessage } from 'ai'
import { ArrowDown } from 'lucide-vue-next'
import type { ChatMessageAction } from './ChatMessage.vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  messages?: UIMessage[]
  status?: 'ready' | 'streaming' | 'submitted' | 'error'
  shouldAutoScroll?: boolean
  assistant?: { actions?: ChatMessageAction[] }
  class?: HTMLAttributes['class']
}>(), {
  messages: () => [],
  status: 'ready'
})

const containerRef = ref<HTMLElement>()
const showScrollToBottom = ref(false)
const userScrolledUp = ref(false)

function getScrollParent(el: HTMLElement | null): HTMLElement {
  while (el) {
    const { overflow, overflowY } = getComputedStyle(el)
    if (/(auto|scroll)/.test(overflow + overflowY)) return el
    el = el.parentElement
  }
  return document.documentElement
}

let scrollParent: HTMLElement | null = null

function checkScroll() {
  if (!scrollParent) return
  const { scrollTop, scrollHeight, clientHeight } = scrollParent
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight
  userScrolledUp.value = distanceFromBottom > 100
  showScrollToBottom.value = distanceFromBottom > 200
}

function scrollToBottom() {
  if (!scrollParent) return
  scrollParent.scrollTo({ top: scrollParent.scrollHeight, behavior: 'smooth' })
}

onMounted(() => {
  scrollParent = getScrollParent(containerRef.value ?? null)
  scrollParent.addEventListener('scroll', checkScroll, { passive: true })

  nextTick(() => {
    if (props.shouldAutoScroll && scrollParent) {
      scrollParent.scrollTop = scrollParent.scrollHeight
    }
  })
})

// Auto-scroll during streaming
let streamScrollInterval: ReturnType<typeof setInterval> | null = null

onBeforeUnmount(() => {
  scrollParent?.removeEventListener('scroll', checkScroll)
  if (streamScrollInterval) {
    clearInterval(streamScrollInterval)
  }
})

watch(
  () => [props.messages.length, props.status],
  () => {
    if (!props.shouldAutoScroll || userScrolledUp.value) return
    nextTick(() => {
      scrollParent?.scrollTo({ top: scrollParent.scrollHeight })
    })
  }
)

watch(
  () => props.status,
  (status) => {
    if (status === 'streaming' && props.shouldAutoScroll) {
      streamScrollInterval = setInterval(() => {
        if (!userScrolledUp.value && scrollParent) {
          scrollParent.scrollTop = scrollParent.scrollHeight
        }
      }, 100)
    } else if (streamScrollInterval) {
      clearInterval(streamScrollInterval)
      streamScrollInterval = null
    }
  }
)
</script>

<template>
  <div
    ref="containerRef"
    data-slot="chat-messages"
    :class="cn('flex flex-col gap-4', props.class)"
  >
    <ChatMessage
      v-for="(message, index) in messages"
      :id="message.id"
      :key="message.id"
      :role="(message.role as 'user' | 'assistant')"
      :parts="message.parts"
      :side="message.role === 'user' ? 'right' : 'left'"
      :actions="message.role === 'assistant' ? assistant?.actions : undefined"
    >
      <template v-if="$slots.content" #content="slotProps">
        <slot
          name="content"
          :message="message"
          :index="index"
          v-bind="slotProps"
        />
      </template>
    </ChatMessage>

    <div v-if="status === 'submitted'" class="flex items-center gap-1 text-muted-foreground">
      <slot name="indicator">
        <span class="inline-flex gap-1">
          <span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
          <span class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
          <span class="size-1.5 animate-bounce rounded-full bg-current" />
        </span>
      </slot>
    </div>

    <div
      v-if="shouldAutoScroll"
      :data-state="showScrollToBottom ? 'open' : 'closed'"
      class="absolute inset-x-0 top-[86%] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out"
    >
      <Button
        v-if="showScrollToBottom"
        variant="outline"
        size="icon-sm"
        class="absolute right-1/2 translate-x-1/2 bottom-0 rounded-full shadow-md"
        @click="scrollToBottom"
      >
        <ArrowDown class="size-4" />
      </Button>
    </div>
  </div>
</template>
