<script setup lang="ts">
import { AlertCircle, Loader2, X } from 'lucide-vue-next'

interface FileAvatarProps {
  name: string
  type: string
  previewUrl?: string
  status?: 'idle' | 'uploading' | 'uploaded' | 'error'
  error?: string
  removable?: boolean
}

withDefaults(defineProps<FileAvatarProps>(), {
  status: 'idle',
  removable: false
})

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="relative group">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Avatar
            class="size-10 rounded-lg"
            :class="{
              'opacity-50': status === 'uploading'
            }"
          >
            <AvatarImage v-if="type.startsWith('image/') && previewUrl" :src="previewUrl" :alt="name" />
            <AvatarFallback class="rounded-lg">
              <LucideIcon :name="getFileIcon(type, name)" class="size-5" />
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          {{ removeRandomSuffix(name) }}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <div
      v-if="status === 'uploading'"
      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
    >
      <Loader2 class="size-6 animate-spin text-white" />
    </div>

    <TooltipProvider>
      <Tooltip v-if="status === 'error'">
        <TooltipTrigger as-child>
          <div class="absolute inset-0 flex items-center justify-center bg-destructive/50 rounded-lg">
            <AlertCircle class="size-6 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {{ error }}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <Button
      v-if="removable && status !== 'uploading'"
      size="icon"
      variant="secondary"
      class="absolute size-5 p-0 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full ring ring-background"
      @click="emit('remove')"
    >
      <X class="size-3" />
    </Button>
  </div>
</template>
