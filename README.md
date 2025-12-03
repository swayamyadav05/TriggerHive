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
- ✅ **Visual workflow editor with React Flow** - fully functional drag-and-drop canvas
- ✅ **Node system** - Initial, Manual Trigger, HTTP Request nodes implemented
- ✅ **Real-time execution** - Live workflow execution with Inngest integration
- ✅ **Node connections** - Visual connection system with data flow
- ✅ **Workflow execution tracking** - View execution history and results

### Trigger Nodes & Webhooks

- ✅ **Google Form Trigger** - Webhook integration with signature verification
- ✅ **Stripe Trigger** - Native Stripe webhook integration with SDK verification
- ✅ **Webhook Security** - HMAC-SHA256 signature verification system
- ✅ **Webhook Management** - Auto-generated webhook URLs per workflow
- ✅ **Real-time Updates** - Live workflow execution notifications via Inngest channels

### AI, Background Jobs & Observability

- ✅ Inngest integration with workflow execution engine
- ✅ Multi-channel support (Google Form, Stripe triggers)
- ✅ Sentry integrated for error tracking and telemetry (server + client configs present)
- ✅ Execution history and logging

### UI & Developer Experience

- ✅ UI component library and many primitives under `src/components/ui/` (inputs, dialogs, navigation, etc.)
- ✅ tRPC client/server plumbing and auth context (`src/trpc/*`, `src/lib/auth.ts`)
- ✅ **Node configuration dialogs** - Dynamic forms for each node type
- ✅ **Workflow sidebar** - App navigation and workflow management

### Summary

TriggerHive now has a fully functional visual workflow editor! Users can create workflows, connect nodes, configure triggers (Google Forms and Stripe), and execute them in real-time. The webhook system includes secure signature verification, and Inngest handles background execution with real-time updates. Next focus: expanding node types (email, Slack, more AI integrations) and improving execution monitoring.

## ✨ Features

### Visual Workflow Builder

- Drag-and-drop node-based editor powered by React Flow
- Real-time canvas updates and node connections
- Custom node types with configurable parameters

### Trigger Nodes

- **Google Form Trigger** - Receive form submissions via webhooks
- **Stripe Trigger** - Listen to Stripe payment events (payment_intent.succeeded, etc.)
- **Manual Trigger** - Execute workflows on-demand

### Action Nodes

- **HTTP Request** - Make API calls to external services
- More nodes coming soon (Email, Slack, AI, Database operations)

### Webhook System

- Auto-generated unique webhook URLs per workflow
- Secure signature verification (HMAC-SHA256 for custom webhooks, Stripe SDK for Stripe)
- Support for multiple trigger types per workflow

### Execution Engine

- Background job processing with Inngest
- Real-time execution status updates
- Execution history and logging

## 🏗 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or use Neon)
- Stripe account (for Stripe triggers)

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_..."
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."
SENTRY_AUTH_TOKEN="..."
```

### Installation

```bash
# Clone the repository
git clone https://github.com/swayamyadav05/TriggerHive.git
cd TriggerHive

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Usage

1. Sign up and create your first workflow
2. Add trigger nodes (Google Form, Stripe, or Manual)
3. Connect action nodes (HTTP Request, etc.)
4. Configure each node with the required parameters
5. For webhook triggers:
   - Copy the generated webhook URL
   - Configure it in the external service (Stripe Dashboard, Google Forms, etc.)
   - Add the signing secret (for Stripe triggers)
6. Execute your workflow and monitor the results!

## 🤝 Contributing

This is currently a personal project. I'm not accepting contributions at this time, but feel free to **fork** and build your own version!

---

> This README will be updated as the project progresses. Check back soon for development updates!

**TriggerHive** - Building the future of workflow automation 🐝

Last updated: December 4, 2025
