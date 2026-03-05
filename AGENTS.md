# AGENTS.md

## Project Overview

Stackhacker UI Chat Template — A full-featured AI chatbot application built with shadcn-vue components and Vercel AI SDK.

## Tech Stack

- **Framework**: Nuxt 4.3 (Nitro server engine)
- **UI**: shadcn-nuxt (reka-ui) + Tailwind CSS v4
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/vue`, `@ai-sdk/gateway`)
- **DB**: SQLite via NuxtHub DB + Drizzle ORM
- **Auth**: nuxt-auth-utils (GitHub OAuth)
- **Storage**: NuxtHub Blob
- **Package Manager**: pnpm 10.x

## Commands

```bash
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm lint           # Run ESLint (formatting + linting)
pnpm typecheck      # Run nuxt typecheck (vue-tsc)
pnpm db:generate    # Generate Drizzle migrations
pnpm db:migrate     # Run Drizzle migrations
```

**No test framework is configured.** There are no test files or test commands.
CI (`.github/workflows/ci.yml`) only runs `pnpm lint` and `pnpm typecheck`.

## Project Structure

```text
app/                        Frontend
  components/               Vue SFCs (PascalCase)
    ui/                     shadcn-vue components (barrel export via index.ts)
    tool/                   AI tool result components (Weather, Chart)
    prose/                  MDC prose overrides
  composables/              useXxx.ts composables
  pages/                    File-based routing (index.vue, chat/[id].vue)
  layouts/                  Layout components
  lib/utils.ts              cn() utility (clsx + tailwind-merge)
  utils/ai.ts               AI helper functions
  assets/css/main.css       Tailwind v4 + CSS variables
server/                     Backend (Nitro)
  api/                      API routes: <resource>.<method>.ts
  db/schema.ts              Drizzle ORM schema (users, chats, messages)
  db/migrations/            SQLite migration files
  routes/auth/              OAuth handlers
shared/                     Frontend + Backend shared code
  types/                    Type declarations (.d.ts)
  utils/                    Shared utilities & AI tool definitions
```

## Code Style

### Formatting (ESLint Stylistic — no Prettier)

- **No trailing commas** (`commaDangle: 'never'`)
- **1TBS brace style** (`braceStyle: '1tbs'`)
- Indent: 2 spaces, LF line endings, UTF-8
- Single quotes for strings
- Vue templates: max 3 attributes per single line (`vue/max-attributes-per-line`)
- Multi-word component names rule is disabled (`vue/multi-word-component-names: off`)

### TypeScript

- Strict mode enabled (Nuxt default)
- Use `type` keyword for type-only imports: `import type { UIMessage } from 'ai'`
- Props: `defineProps<T>()` with interface generics (no runtime validation)
- Emits: `defineEmits<T>()` with type-only syntax
- DB types derived from schema: `type Chat = typeof chats.$inferSelect`
- Co-locate interface/type definitions with usage (composable, component, or shared/types/)

### Imports

- **Nuxt auto-imports are used extensively** — do NOT manually import Vue/Nuxt APIs
  (`ref`, `computed`, `watch`, `useFetch`, `$fetch`, `navigateTo`, `defineEventHandler`,
  `createError`, `getUserSession`, `requireUserSession` etc.)
- Composables and shared utils are also auto-imported
- Use `@/` alias for app-internal cross-directory imports:
  `import { cn } from '@/lib/utils'`
- Use relative imports for nearby files in the same directory
- Use bare specifiers for external packages: `import { z } from 'zod'`
- NuxtHub imports: `import { db, schema } from 'hub:db'`, `import { blob } from 'hub:blob'`
- Lucide icons: `import { Plus, Search } from 'lucide-vue-next'`

### Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase `.vue` | `ChatMessage.vue`, `AppSidebar.vue` |
| UI components | PascalCase in lowercase dirs | `ui/button/Button.vue` + `index.ts` |
| Pages | lowercase, kebab-case params | `chat/[id].vue` |
| Composables | `use` prefix camelCase | `useChats.ts`, `useModels.ts` |
| API routes | `resource.method.ts` | `chats.get.ts`, `chats.post.ts` |
| Nested API routes | `[param].method.ts` | `chats/[id].delete.ts` |
| Shared utils | camelCase `.ts` | `file.ts`, `tools/weather.ts` |
| DB tables | plural snake_case (SQL) | `users`, `chats`, `messages` |
| DB variables | camelCase (JS) | `chats`, `messages` |

### Vue SFC Structure

```vue
<script setup lang="ts">
// 1. External package imports
// 2. Internal imports (@/ alias)
// 3. Props / Emits / Models
// 4. Composables
// 5. Reactive state (ref, reactive)
// 6. Computed properties
// 7. Functions
// 8. Lifecycle hooks
</script>

<template>
  <!-- template -->
</template>
```

- `<style>` blocks are rare; prefer Tailwind utility classes
- Use `defineModel<T>()` for v-model bindings

### Server API Route Pattern

```ts
export default defineEventHandler(async (event) => {
  // 1. Auth: getUserSession(event) or requireUserSession(event)
  // 2. Validation: readValidatedBody(event, z.object({...}).parse)
  //    or getValidatedRouterParams(event, z.object({...}).parse)
  // 3. Authorization: check ownership, throw createError if denied
  // 4. Business logic with Drizzle ORM (db.query, db.insert, etc.)
  // 5. Return response or sendNoContent(event)
})
```

### Error Handling

**Server-side:**

- `throw createError({ statusCode: 404, statusMessage: 'Chat not found' })` for HTTP errors
- `try/catch` with `console.error()` for non-critical operations (e.g., blob cleanup)

**Client-side:**

- `toast.error(message)` via vue-sonner for user-facing errors
- AI streaming errors: parse JSON message if possible, show toast with `duration: Infinity`
- Page-level: `throw createError(...)` triggers Nuxt error page

### AI Tool Definition Pattern

Tools are defined in `shared/utils/tools/` using AI SDK's `tool()`:

```ts
import { tool } from 'ai'
import { z } from 'zod'

export const myTool = tool({
  description: '...',
  inputSchema: z.object({ ... }),
  execute: async (input) => { ... }
})
```

Export a companion UI type: `export type MyUIToolInvocation = UIToolInvocation<typeof myTool>`

### Key Dependencies

- **reka-ui**: Headless UI primitives (underlying shadcn-vue)
- **@vueuse/core**: Vue composition utilities
- **date-fns**: Date formatting/comparison
- **zod**: Schema validation (server input + AI tool schemas)
- **shiki / shiki-stream**: Syntax highlighting (streaming-capable)
- **vue-sonner**: Toast notifications
- **class-variance-authority (CVA)**: Component variant definitions (in UI components)
- **@nuxtjs/mdc**: Markdown rendering
