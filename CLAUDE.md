# CLAUDE.md

## Dashboard

タスクの起点となるダッシュボード:

- `/Users/hirotaka/Workspaces/github.com/hirotaka/org/roam/permanent/marketing/20251230140111-dashboard.org`

ダッシュボードの読み方は `/Users/hirotaka/Workspaces/github.com/hirotaka/org/CLAUDE.md` に従うこと。

## Project Overview

Nuxt AI Chatbot Template - Nuxt UIコンポーネントとAI SDKを使ったフル機能AIチャットボットアプリケーション。

## Tech Stack

- **Framework**: Nuxt 4.3
- **UI**: Nuxt UI v4, Tailwind CSS v4
- **AI**: Vercel AI SDK, AI Gateway
- **DB**: SQLite (NuxtHub DB) + Drizzle ORM
- **Auth**: nuxt-auth-utils (GitHub OAuth)
- **Storage**: NuxtHub Blob
- **Package Manager**: pnpm

## Commands

- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm lint` - ESLint実行
- `pnpm typecheck` - 型チェック
- `pnpm db:generate` - DB マイグレーション生成
- `pnpm db:migrate` - DB マイグレーション実行

## Project Structure

```
app/           - フロントエンド (pages, components, composables, layouts)
server/        - バックエンド (api/, db/, routes/)
shared/        - フロント・バック共有コード
public/        - 静的ファイル
```

## Code Style

- ESLint stylistic: commaDangle: 'never', braceStyle: '1tbs'
- TypeScript strict
