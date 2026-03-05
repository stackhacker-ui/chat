<script setup lang="ts">
import { MessageCircle, Monitor, Moon, SquarePen, Sun } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import type { UIChat } from '@/composables/useChats'

const props = defineProps<{
  groups: Array<{ id: string, label: string, items: UIChat[] }>
}>()

const open = defineModel<boolean>('open', { default: false })

const router = useRouter()
const mode = useColorMode()

const themeOptions = [
  { value: 'auto', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon }
]

function selectChat(chat: UIChat) {
  router.push(`/chat/${chat.id}`)
  open.value = false
}

function selectNewChat() {
  router.push('/')
  open.value = false
}

function selectTheme(value: string) {
  mode.value = value as 'auto' | 'light' | 'dark'
  open.value = false
}
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Search chats..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Links">
        <CommandItem value="new-chat" @select="selectNewChat">
          <SquarePen class="size-4" />
          New chat
        </CommandItem>
      </CommandGroup>
      <template v-for="group in props.groups" :key="group.id">
        <CommandSeparator />
        <CommandGroup :heading="group.label">
          <CommandItem
            v-for="chat in group.items"
            :key="chat.id"
            :value="`${chat.id} ${chat.label}`"
            @select="selectChat(chat)"
          >
            <MessageCircle class="size-4" />
            <span class="truncate" :class="chat.label === 'Untitled' ? 'text-muted-foreground' : ''">
              {{ chat.label }}
            </span>
          </CommandItem>
        </CommandGroup>
      </template>
      <CommandSeparator />
      <CommandGroup heading="Theme">
        <CommandItem
          v-for="theme in themeOptions"
          :key="theme.value"
          :value="`theme-${theme.value}`"
          @select="selectTheme(theme.value)"
        >
          <component :is="theme.icon" class="size-4" />
          {{ theme.label }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
