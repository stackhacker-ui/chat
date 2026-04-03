<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <Dialog v-model:open="open" :modal="true">
    <DialogContent :show-close-button="false" @interact-outside.prevent @escape-key-down.prevent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex-row-reverse justify-start">
        <Button @click="emit('confirm'); open = false">
          Delete
        </Button>
        <Button variant="ghost" @click="open = false">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
