<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const { isStreaming = false } = defineProps<{
  text: string
  isStreaming?: boolean
}>()

const open = ref(false)

watch(() => isStreaming, () => {
  open.value = isStreaming
}, { immediate: true })

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/^#+\s+/gm, '') // Remove headers
}
</script>

<template>
  <Collapsible v-model:open="open" class="relative text-pretty min-w-0 *:first:mt-0 *:last:mb-0 w-full">
    <CollapsibleTrigger as-child>
      <Button class="p-0! group text-muted-foreground" variant="link">
        {{ isStreaming ? 'Thinking...' : 'Thoughts' }}
        <ChevronDown
          v-if="text.length > 0"
          class="size-4 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
      </Button>
    </CollapsibleTrigger>

    <CollapsibleContent>
      <div v-for="(value, index) in cleanMarkdown(text).split('\n').filter(Boolean)" :key="index">
        <span class="whitespace-pre-wrap text-sm text-muted-foreground font-normal">{{ value }}</span>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
