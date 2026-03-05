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
            href="https://stackhacker-ui-starter.stackhacker.io/"
            target="_blank"
            disabled
          >
            Starter
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-landing.stackhacker.io/"
            target="_blank"
            disabled
          >
            Landing
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-docs.stackhacker.io/"
            target="_blank"
            disabled
          >
            Docs
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-saas.stackhacker.io/"
            target="_blank"
            disabled
          >
            SaaS
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-dashboard.stackhacker.io/"
            target="_blank"
            disabled
          >
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem :checked="true" disabled>
            Chat
          </DropdownMenuCheckboxItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-portfolio.stackhacker.io/"
            target="_blank"
            disabled
          >
            Portfolio
          </DropdownMenuItem>
          <DropdownMenuItem
            as="a"
            href="https://stackhacker-ui-changelog.stackhacker.io/"
            target="_blank"
            disabled
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
