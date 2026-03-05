<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const { model, models } = useModels()

const open = ref(false)
const selectedModel = computed(() => models.find(m => m.value === model.value))

function selectModel(value: string) {
  model.value = value
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        role="combobox"
        :aria-expanded="open"
        class="w-auto border-none bg-transparent shadow-none hover:bg-accent data-[state=open]:bg-accent"
      >
        <span class="flex items-center gap-2">
          <Icon v-if="selectedModel?.icon" :name="selectedModel.icon" class="size-4" />
          {{ selectedModel?.label }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-52 p-0" align="start">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="m in models"
              :key="m.value"
              :value="m.label"
              @select="selectModel(m.value)"
            >
              <Icon :name="m.icon" class="size-4" />
              {{ m.label }}
              <Check class="ml-auto size-4" :class="model === m.value ? 'opacity-100' : 'opacity-0'" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
