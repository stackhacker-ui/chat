<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
</script>

<template>
  <header
    class="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <div class="ml-auto flex items-center gap-2">
        <ColorModeButton />
        <Button
          variant="ghost"
          size="icon"
          as-child
          class="md:hidden"
        >
          <NuxtLink to="/">
            <Plus class="size-5" />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>
