# TriggerHive 🐝

> A modern workflow automation platform currently under development

![Status](https://img.shields.io/badge/Status-Work%20in%20Progress-orange?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🚀 About This Project

I'm building **TriggerHive** - an open-source workflow automation platform similar to [n8n](https://n8n.io/) and [Zapier](https://zapier.com/). This project is currently in active development.

## 📚 Learning Journey

This implementation is part of my learning process, focusing on:

- ✨ Visual workflow builder with drag-and-drop interface
- 🔗 Multi-service integrations (AI, messaging, webhooks)
- 🛠 Full-stack TypeScript with modern development practices
- 💳 SaaS business layer including authentication and payments
- 🏭 Production-ready architecture with background jobs and error tracking

## � Production Ready

- 🐛 **Error Tracking** - Comprehensive monitoring with Sentry + AI insights
- 🧑‍💻 **Code Quality** - AI-powered PR reviews with CodeRabbit
- 🗄️ **Scalable Database** - Prisma ORM with Neon Postgres
- 🎨 **Modern UI** - Beautiful, responsive interface with React Flow

## 🛠 Tech Stack Planned

### Frontend

- **Framework:** Next.js 16 with App Router
- **UI Library:** React
- **Language:** TypeScript
- **Workflow Canvas:** React Flow

### Backend

- **API:** tRPC + Next.js API Routes
- **Language:** TypeScript

### Infrastructure

- **Database:** PostgreSQL with Prisma ORM, hosted on Neon
- **Authentication:** Better Auth
- **Payments:** Polar subscriptions
- **Background Jobs:** Inngest
- **Workflow Canvas:** React Flow
- **Error Tracking:** Sentry
- **Code Reviews:** CodeRabbit
- **Deployment:** Vercel

## 🗓 Current Status

### Project Setup

- ✅ Repository initialization and basic project structure
- ✅ TypeScript + Next.js 16 (App Router) configured
- ✅ ESLint and code quality tooling
- ✅ Prisma ORM integrated (client generated to `src/generated/prisma`)

### Core Foundation

- ✅ Database schema and migrations (Prisma) — workflow model and related migrations present
- ✅ Authentication wired with Better Auth (email/password + Polar plugins)
- ✅ Payments integration scaffolded with Polar (checkout & portal plugins configured)
- ✅ tRPC API foundation with a `workflows` router (CRUD endpoints implemented)

### Workflows & Editor

- ✅ Workflow model and CRUD APIs (create, list, get, update name, remove)
- ✅ Basic editor scaffold that loads a workflow (`features/editor/components/editor.tsx`) — currently renders workflow JSON
- ⚙️ Next: implement visual canvas (React Flow) and node execution UI

### AI, Background Jobs & Observability

- ✅ Inngest integration with an `execute` function demonstrating multi-LLM calls (Google Gemini, OpenAI, Anthropic)
- ✅ Sentry integrated for error tracking and telemetry (server + client configs present)

### UI & Developer Experience

- ✅ UI component library and many primitives under `src/components/ui/` (inputs, dialogs, navigation, etc.)
- ✅ tRPC client/server plumbing and auth context (`src/trpc/*`, `src/lib/auth.ts`)

### Summary

The core foundations are in place: database models, auth + payments wiring, a working workflows CRUD API, Inngest-based background execution examples, and a UI scaffold. The next focus is the visual workflow editor (React Flow canvas), execution engine wiring, and adding small end-to-end examples and getting-started docs.

## 🏗 Getting Started

Setup instructions will be added as the project develops. Stay tuned!

## 🤝 Contributing

This is currently a personal project. I'm not accepting contributions at this time, but feel free to **fork** and build your own version!

---

> This README will be updated as the project progresses. Check back soon for development updates!

**TriggerHive** - Building the future of workflow automation 🐝

Last updated: November 11, 2025
