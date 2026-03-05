<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LucideIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export interface ChatMessageAction {
  label: string
  icon: string
  onClick?: (e: MouseEvent, message: UIMessage) => void
}

const props = withDefaults(defineProps<{
  id?: string
  role?: 'user' | 'assistant' | 'system'
  parts?: UIMessage['parts']
  side?: 'left' | 'right'
  actions?: ChatMessageAction[]
  class?: HTMLAttributes['class']
}>(), {
  side: 'left',
  actions: () => []
})

function handleAction(e: MouseEvent, action: ChatMessageAction) {
  if (!props.id || !props.role || !props.parts) return
  action.onClick?.(e, { id: props.id, role: props.role, parts: props.parts } as UIMessage)
}
</script>

<template>
  <div
    data-slot="chat-message"
    :class="cn(
      'group flex gap-3',
      side === 'right' ? 'flex-row-reverse' : 'flex-row',
      props.class
    )"
  >
    <div v-if="$slots.leading" class="shrink-0">
      <slot name="leading" />
    </div>

    <div :class="cn('flex flex-col gap-1', side === 'right' ? 'items-end' : 'items-start')">
      <div :class="cn('max-w-[80ch] space-y-2', side === 'right' && 'bg-muted rounded-xl px-4 py-2.5')">
        <slot
          :id="id"
          name="content"
          :role="role"
          :parts="parts"
        >
          <template v-for="(part, index) in parts" :key="`${id}-${part.type}-${index}`">
            <p v-if="part.type === 'text'" class="whitespace-pre-wrap">
              {{ part.text }}
            </p>
          </template>
        </slot>
      </div>

      <div
        v-if="actions.length > 0"
        class="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <TooltipProvider>
          <Tooltip v-for="action in actions" :key="action.label">
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon-sm"
                @click="handleAction($event, action)"
              >
                <LucideIcon :name="action.icon" class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {{ action.label }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
</template>
