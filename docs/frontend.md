# 🎨 Next.js Frontend Framework

The **Lost & Found Quest** frontend is a high-performance web application built with Next.js 14. It features a stunning medieval fantasy aesthetic with modern interactivity and state management.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Clerk (Frontend SDK)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cinzel, MedievalSharp)
- **State Management**: React Hooks + Clerk Context
- **Deployment**: Vercel

## 📂 Project Structure

```
root/
├── app/                    # Next.js App Router (Pages, Layouts)
│   ├── found-item/         # Found Item details and claims
│   ├── inventory/          # User's items and tracking
│   ├── leaderboard/        # Global gamification rankings
│   ├── quests/             # User dashboard and challenges
│   ├── report-lost/        # Submission form for lost items
│   ├── globals.css         # Custom Tailwind and Fantasy styles
│   └── layout.tsx          # Root Layout (Navbar, Profile, Footer)
├── components/             # Reusable UI Components
│   └── ui/                 # Shadcn UI (Card, Button, Progress, etc.)
├── lib/                    # Utility Functions
│   ├── api.ts              # Centralized Fetch/API Service
│   └── utils.ts            # Formatting and helper logic
├── public/                 # Static Assets (Images, Icons)
└── tailwind.config.ts      # Custom Theme and Fantasy Colors
```

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js 18+**: Installed in your environment.
- **npm / yarn / pnpm**: To manage dependencies.
- **Environment Variables**: Add your Clerk keys to `.env.local` in the root folder.

### 2. Startup Commands
Install dependencies and run the dev server:
```bash
npm install
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## 🎭 UI/UX Design System

The platform uses a custom **Fantasy Design System** defined in `tailwind.config.ts` and `app/globals.css`.

- **Colors**: Rich browns (#2e1a0f), vibrant golds (#f4c430), and aged parchments (#eaddca).
- **Custom Classes**:
    - `.fantasy-card`: Textured backgrounds with gold borders.
    - `.fantasy-button`: 3D gold buttons with hover animations.
    - `.fantasy-title`: MedievalSharp typography with gold gradients.
- **Micro-Animations**: Smooth transitions, hover effects, and loading skeletons for a premium feel.

## 🔄 API Integration

The frontend communicates with the Spring Boot backend using a centralized API utility in `lib/api.ts`.

- **Authenticated Requests**: All calls automatically include the Clerk JWT for security.
- **Response Parsing**: Centralized error handling and JSON parsing for consistent data flow.
- **Optimistic UI (Planned)**: Instant updates on claims and reports before server confirmation.

## 🔑 Authentication (Clerk)

We use **Clerk** to provide a seamless login experience.

- **Custom Components**: Embedded sign-in/sign-up forms with fantasy styling.
- **User Sync**: Real-time user profile data (coins, XP) fetched from the backend on mount.
- **Protected Routes**: Middleware ensures only logged-in users can report items or view their inventory.

---
**Happy Questing! 🛡️**
