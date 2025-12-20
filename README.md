# TriggerHive 🐝

> **Visual Workflow Automation Platform** — Connect APIs, AI, and services with a drag-and-drop interface

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<!-- <p align="center">
  <img src="public/logo/triggerhive-banner.png" alt="TriggerHive Banner" width="800"/>
</p> -->

## ✨ What is TriggerHive?

**TriggerHive** is an open-source workflow automation platform that lets you visually connect triggers, APIs, AI models, and messaging services. Similar to [n8n](https://n8n.io/), [Zapier](https://zapier.com/), and [Make](https://make.com/), but built with a modern tech stack and fully customizable.

### 🎬 Demo Workflows

| Workflow                       | Description                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **LinkedIn Post Generator**    | Fetches trending tech articles → AI creates engaging post → Generates hashtags → Posts to Discord/Slack |
| **Customer Feedback Analyzer** | Google Form submission → AI sentiment analysis → Action items generation → Multi-channel alerts         |
| **Payment Celebration Engine** | Stripe payment webhook → Fetch customer data → AI personalized thank-you → Team notifications           |

## 🚀 Features

### Visual Workflow Builder

- **Drag-and-drop editor** powered by React Flow
- **Real-time canvas** with live node connections
- **Node configuration dialogs** with dynamic forms
- **Variable interpolation** — Pass data between nodes with `{{nodeName.field}}`

### Trigger Nodes

| Trigger            | Description                                               |
| ------------------ | --------------------------------------------------------- |
| 📝 **Google Form** | Receive form submissions via secure webhooks              |
| 💳 **Stripe**      | Listen to payment events (payment_intent.succeeded, etc.) |
| ▶️ **Manual**      | Execute workflows on-demand                               |

### Action Nodes

| Node                 | Description                                   |
| -------------------- | --------------------------------------------- |
| 🌐 **HTTP Request**  | Make GET/POST/PUT/PATCH/DELETE API calls      |
| 🤖 **OpenAI**        | Generate text with GPT-4, GPT-4o, GPT-4o-mini |
| 🧠 **Anthropic**     | Use Claude models for AI processing           |
| ✨ **Google Gemini** | Access Gemini 2.0 Flash and Pro models        |
| 💬 **Discord**       | Send messages via webhooks                    |
| 📢 **Slack**         | Post to Slack channels                        |

### Execution Engine

- **Background processing** with Inngest
- **Real-time status updates** via WebSocket channels
- **Execution history** with detailed logs and output data
- **Error tracking** with Sentry integration
- **Secure credential management** for API keys

## 🛠 Tech Stack

### Frontend

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| **Next.js 16**   | React framework with App Router |
| **React 19**     | UI library                      |
| **TypeScript**   | Type safety                     |
| **React Flow**   | Visual workflow canvas          |
| **Tailwind CSS** | Styling                         |
| **Radix UI**     | Accessible UI primitives        |
| **shadcn/ui**    | Component library               |

### Backend

| Technology      | Purpose                      |
| --------------- | ---------------------------- |
| **tRPC**        | End-to-end typesafe APIs     |
| **Prisma**      | Database ORM                 |
| **Inngest**     | Event-driven background jobs |
| **Better Auth** | Authentication               |
| **Polar**       | Payments & subscriptions     |

### AI & Integrations

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| **Vercel AI SDK** | Unified AI model interface |
| **OpenAI**        | GPT models                 |
| **Anthropic**     | Claude models              |
| **Google AI**     | Gemini models              |
| **Handlebars**    | Template interpolation     |

### Infrastructure

| Technology | Purpose             |
| ---------- | ------------------- |
| **Neon**   | Serverless Postgres |
| **Vercel** | Deployment          |
| **Sentry** | Error tracking      |
| **Stripe** | Payment webhooks    |

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech))
- npm or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/swayamyadav05/TriggerHive.git
cd TriggerHive

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key"

# Stripe (for payment triggers)
STRIPE_SECRET_KEY="sk_..."

# Inngest (background jobs)
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# Sentry (error tracking)
SENTRY_AUTH_TOKEN="..."

# Optional: AI Providers (users add their own keys)
# These are stored encrypted per-user in the credentials system
```

### Development Scripts

```bash
# Start all services (Next.js + Inngest Dev Server)
npm run dev:all

# Start Next.js only
npm run dev

# Start Inngest Dev Server
npm run inngest:dev

# Start ngrok tunnel (for webhooks)
npm run ngrok:dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🎯 Usage

### Creating Your First Workflow

1. **Sign up** and create your account
2. **Create a new workflow** from the dashboard
3. **Add a trigger node** (Manual, Google Form, or Stripe)
4. **Connect action nodes** (HTTP Request, AI, Discord, Slack)
5. **Configure each node** with required parameters
6. **Execute** and watch real-time status updates!

### Using Variables

Pass data between nodes using Handlebars syntax:

```handlebars
# Access HTTP response data
{{nested httpNode "httpResponse.data.title"}}

# Access AI generated text
{{aiNode.text}}

# Access Google Form responses
{{response "Question Name"}}

# Access Stripe payment data
{{stripe.data.amount}}

# Pretty print JSON
{{json someObject}}
```

### Webhook Configuration

For **Google Form Trigger**:

1. Open node settings → Copy webhook URL
2. Copy the generated Apps Script
3. Paste in Google Forms → Extensions → Apps Script
4. Add trigger: On form submit

For **Stripe Trigger**:

1. Open node settings → Copy webhook URL
2. Go to Stripe Dashboard → Webhooks → Add endpoint
3. Paste URL and select events (e.g., `payment_intent.succeeded`)
4. Copy signing secret → Paste in TriggerHive

## 📁 Project Structure

```
TriggerHive/
├── prisma/                    # Database schema & migrations
│   └── schema.prisma
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   └── api/              # API routes & webhooks
│   ├── components/           # UI components
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── react-flow/      # Workflow canvas components
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── credentials/     # API key management
│   │   ├── editor/          # Workflow editor
│   │   ├── executions/      # Execution nodes & logic
│   │   ├── triggers/        # Trigger nodes
│   │   └── workflows/       # Workflow management
│   ├── inngest/             # Background job functions
│   │   ├── channels/        # Real-time channels
│   │   └── functions.ts     # Workflow executor
│   ├── lib/                 # Utilities
│   │   ├── handlebars-helpers.ts  # Template helpers
│   │   └── encryption.ts    # Credential encryption
│   └── trpc/               # tRPC router & client
└── docs/                   # Documentation
```

## 🔒 Security

- **Credential Encryption** — All API keys stored encrypted (AES-256)
- **Webhook Verification** — HMAC-SHA256 signature validation
- **Stripe SDK Verification** — Native Stripe webhook signature verification
- **Per-user Isolation** — Credentials and workflows scoped to users
- **Secure Sessions** — Better Auth with HTTP-only cookies

## 🗺 Roadmap

### Completed ✅

- [x] Visual workflow editor with React Flow
- [x] Multiple trigger types (Manual, Google Form, Stripe)
- [x] AI integration (OpenAI, Anthropic, Gemini)
- [x] Messaging nodes (Discord, Slack)
- [x] HTTP Request node with all methods
- [x] Real-time execution tracking
- [x] Execution history with filtering
- [x] Secure credential management
- [x] Variable interpolation system
- [x] Webhook security (HMAC-SHA256)

### Can be added 🚧

- [ ] Email nodes (SendGrid, Resend)
- [ ] Database nodes (Postgres, MongoDB)
- [ ] Conditional logic nodes (If/Else, Switch)
- [ ] Loop nodes (For Each, While)
- [ ] Workflow templates gallery
- [ ] Team collaboration features
- [ ] Workflow versioning
- [ ] Scheduled triggers (Cron)
- [ ] File storage nodes (S3, Google Drive)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) — Workflow canvas
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [Inngest](https://inngest.com/) — Event-driven background jobs
- [Vercel AI SDK](https://sdk.vercel.ai/) — Unified AI interface
- [Better Auth](https://better-auth.com/) — Authentication
- [Polar](https://polar.sh/) — Payments

---

<p align="center">
  <b>TriggerHive</b> — Automate Everything 🐝
  <br/>
  Built with ❤️ by <a href="https://github.com/swayamyadav05">Swayam Yadav</a>
</p>

Last updated: December 20, 2025
