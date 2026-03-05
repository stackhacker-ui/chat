<script setup lang="ts">
import { Plus, Search, X } from 'lucide-vue-next'
import type { UIChat } from '@/composables/useChats'
import { useSidebar } from '@/components/ui/sidebar/utils'

defineProps<{
  groups: Array<{ id: string, label: string, items: UIChat[] }>
}>()

const emit = defineEmits<{
  deleteChat: [id: string]
  search: []
}>()

const route = useRoute()
const { loggedIn, openInPopup } = useUserSession()
const { state, isMobile, setOpenMobile } = useSidebar()
const collapsed = computed(() => !isMobile.value && state.value === 'collapsed')

function handleChatClick() {
  if (isMobile.value) {
    setOpenMobile(false)
  }
}
</script>

<template>
  <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child size="lg" tooltip="Chat">
            <NuxtLink to="/" @click="handleChatClick">
              <div class="flex aspect-square size-6 items-center justify-center">
                <Logo class="h-6 w-auto" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Chat</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Search" @click="emit('search')">
            <Search class="size-4" />
            <span>Search</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton as-child tooltip="New chat">
            <NuxtLink to="/" @click="handleChatClick">
              <Plus class="size-4" />
              <span>New chat</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <template v-if="!collapsed">
        <SidebarGroup v-for="group in groups" :key="group.id">
          <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="chat in group.items" :key="chat.id">
                <SidebarMenuButton as-child :is-active="route.params.id === chat.id">
                  <NuxtLink :to="`/chat/${chat.id}`" @click="handleChatClick">
                    <span class="truncate" :class="chat.label === 'Untitled' ? 'text-muted-foreground' : ''">
                      {{ chat.label }}
                    </span>
                  </NuxtLink>
                </SidebarMenuButton>
                <SidebarMenuAction show-on-hover @click="emit('deleteChat', chat.id)">
                  <X class="size-4" />
                  <span class="sr-only">Delete</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </template>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserMenu v-if="loggedIn" />
          <SidebarMenuButton v-else tooltip="Login with GitHub" @click="openInPopup('/auth/github')">
            <Icon name="i-simple-icons-github" class="size-4 shrink-0" />
            <span>Login with GitHub</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
