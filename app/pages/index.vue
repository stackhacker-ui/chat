<script setup lang="ts">
const input = ref('')
const loading = ref(false)
const chatId = crypto.randomUUID()

const {
  dropzoneRef,
  isDragging,
  open,
  files,
  isUploading,
  uploadedFiles,
  removeFile,
  clearFiles
} = useFileUploadWithStatus(chatId)

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  if (uploadedFiles.value.length > 0) {
    parts.push(...uploadedFiles.value)
  }

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      id: chatId,
      message: {
        role: 'user',
        parts
      }
    }
  })

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat?.id}`)
}

async function onSubmit() {
  await createChat(input.value)
  clearFiles()
}

const quickChats = [
  {
    label: 'Why use Nuxt UI?',
    icon: 'i-logos-nuxt-icon'
  },
  {
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue'
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs'
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse'
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon'
  },
  {
    label: 'What is the weather in Bordeaux?',
    icon: 'i-lucide-sun'
  },
  {
    label: 'Show me a chart of sales data',
    icon: 'i-lucide-chart-line'
  }
]
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <AppDashboardNavbar />

    <div ref="dropzoneRef" class="flex flex-1">
      <DragDropOverlay :show="isDragging" />

      <div class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8 max-w-3xl mx-auto w-full px-4 sm:px-6">
        <h1 class="text-3xl sm:text-4xl text-foreground font-bold">
          How can I help you today?
        </h1>

        <ChatPrompt
          v-model="input"
          :disabled="isUploading"
          autofocus
          class="[view-transition-name:chat-prompt]"
          @submit="onSubmit"
        >
          <template v-if="files.length > 0" #header>
            <div class="flex flex-wrap gap-2">
              <FileAvatar
                v-for="fileWithStatus in files"
                :key="fileWithStatus.id"
                :name="fileWithStatus.file.name"
                :type="fileWithStatus.file.type"
                :preview-url="fileWithStatus.previewUrl"
                :status="fileWithStatus.status"
                :error="fileWithStatus.error"
                removable
                @remove="removeFile(fileWithStatus.id)"
              />
            </div>
          </template>

          <template #footer>
            <div class="flex items-center gap-1">
              <FileUploadButton :open="open" />

              <ModelSelect />
            </div>

            <ChatPromptSubmit :disabled="isUploading" />
          </template>
        </ChatPrompt>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            variant="outline"
            size="sm"
            class="rounded-full"
            @click="createChat(quickChat.label)"
          >
            <LucideIcon v-if="quickChat.icon.startsWith('i-lucide-')" :name="quickChat.icon" class="size-4" />
            <Icon v-else :name="quickChat.icon" class="size-4" />
            {{ quickChat.label }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
