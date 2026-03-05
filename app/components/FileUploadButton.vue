<script setup lang="ts">
import { Paperclip } from 'lucide-vue-next'

const { loggedIn } = useUserSession()

defineProps<{
  open: () => void
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span class="inline-flex">
          <Button
            variant="ghost"
            size="sm"
            :disabled="!loggedIn"
            @click="open()"
          >
            <Paperclip class="size-4" />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent v-if="!loggedIn" side="top">
        You need to be logged in to upload files
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
