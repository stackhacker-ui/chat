<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

import { toast } from 'vue-sonner'

const route = useRoute()
const { loggedIn } = useUserSession()

const open = ref(false)
const deleteModalOpen = ref(false)
let pendingDeleteId: string | null = null

const { data: chats, refresh: refreshChats } = await useFetch('/api/chats', {
  key: 'chats',
  transform: data => data.map(chat => ({
    id: chat.id,
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

onNuxtReady(async () => {
  const first10 = (chats.value || []).slice(0, 10)
  for (const chat of first10) {
    await $fetch(`/api/chats/${chat.id}`)
  }
})

watch(loggedIn, () => {
  refreshChats()
  open.value = false
})

const { groups } = useChats(chats)

function deleteChat(id: string) {
  pendingDeleteId = id
  deleteModalOpen.value = true
}

async function onDeleteConfirm() {
  if (!pendingDeleteId) return

  const id = pendingDeleteId
  pendingDeleteId = null

  await $fetch(`/api/chats/${id}`, { method: 'DELETE' })

  toast.success('Chat deleted', {
    description: 'Your chat has been deleted'
  })

  refreshChats()

  if (route.params.id === id) {
    await nextTick()
    navigateTo('/')
  }
}

onKeyStroke('c', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  navigateTo('/')
})

onKeyStroke('k', (e) => {
  if (e.metaKey || e.ctrlKey) {
    e.preventDefault()
    open.value = !open.value
  }
})
</script>

<template>
  <SidebarProvider
    :style="{
      '--header-height': 'calc(var(--spacing) * 12)'
    }"
  >
    <AppSidebar :groups="groups" @delete-chat="deleteChat" @search="open = true" />

    <AppDashboardSearch v-model:open="open" :groups="groups" />

    <SidebarInset class="min-w-0 max-h-svh md:max-h-[calc(100svh-1rem)]">
      <slot />
    </SidebarInset>

    <ModalConfirm
      v-model:open="deleteModalOpen"
      title="Delete chat"
      description="Are you sure you want to delete this chat? This cannot be undone."
      @confirm="onDeleteConfirm"
    />
  </SidebarProvider>
</template>
