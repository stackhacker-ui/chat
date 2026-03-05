<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useSidebar } from '@/components/ui/sidebar/utils'

const mode = useColorMode()
const { user, clear } = useUserSession()
const { state, isMobile } = useSidebar()
const collapsed = computed(() => !isMobile.value && state.value === 'collapsed')

function logout() {
  clear()
  navigateTo('/')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="w-full justify-start data-[state=open]:bg-accent"
        :class="collapsed ? 'size-8 p-0' : ''"
      >
        <Avatar class="size-6 shrink-0">
          <AvatarImage :src="user?.avatar ?? ''" :alt="user?.name || user?.username || ''" />
          <AvatarFallback>{{ (user?.name || user?.username || '?').charAt(0) }}</AvatarFallback>
        </Avatar>
        <template v-if="!collapsed">
          <span class="truncate">{{ user?.name || user?.username }}</span>
          <LucideIcon name="i-lucide-chevrons-up-down" class="ml-auto size-4 text-muted-foreground" />
        </template>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      :align="'center'"
      :collision-padding="12"
      :class="collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)'"
    >
      <!-- User label -->
      <DropdownMenuLabel class="flex items-center gap-2">
        <Avatar class="size-6 shrink-0">
          <AvatarImage :src="user?.avatar ?? ''" :alt="user?.name || user?.username || ''" />
          <AvatarFallback>{{ (user?.name || user?.username || '?').charAt(0) }}</AvatarFallback>
        </Avatar>
        {{ user?.name || user?.username }}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <!-- Appearance -->
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <LucideIcon name="i-lucide-sun-moon" class="size-4" />
          Appearance
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuCheckboxItem :checked="mode === 'light'" @select.prevent="mode = 'light'">
            <LucideIcon name="i-lucide-sun" class="size-4" />
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem :checked="mode === 'dark'" @select.prevent="mode = 'dark'">
            <LucideIcon name="i-lucide-moon" class="size-4" />
            Dark
          </DropdownMenuCheckboxItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      <!-- Templates -->
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <LucideIcon name="i-lucide-layout-template" class="size-4" />
          Templates
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            as="a"
            href="https://starter-template.stackhacker.io/"
            target="_blank"
          >
            Starter
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://chat-template.stackhacker.io/"
            target="_blank"
          >
            Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://docs-template.stackhacker.io/"
            target="_blank"
          >
            Docs
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://landing-template.stackhacker.io/"
            target="_blank"
          >
            Landing
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://portfolio-template.stackhacker.io/"
            target="_blank"
          >
            Portfolio
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://saas-template.stackhacker.io/"
            target="_blank"
          >
            SaaS
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://changelog-template.stackhacker.io/"
            target="_blank"
          >
            Changelog
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      <!-- Documentation & GitHub -->
      <DropdownMenuItem as="a" href="https://stackhacker-ui.stackhacker.io/" target="_blank">
        <LucideIcon name="i-lucide-book-open" class="size-4" />
        Documentation
      </DropdownMenuItem>
      <DropdownMenuItem as="a" href="https://github.com/stackhacker-ui/chat" target="_blank">
        <Icon name="i-simple-icons-github" class="size-4" />
        GitHub repository
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <!-- Log out -->
      <DropdownMenuItem @select="logout">
        <LucideIcon name="i-lucide-log-out" class="size-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
