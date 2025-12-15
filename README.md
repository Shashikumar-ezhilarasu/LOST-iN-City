# Lost & Found Quest 🏰

A gamified Lost & Found web application with a medieval RPG fantasy theme built with Next.js, Tailwind CSS, and Shadcn UI.

## 🎮 Features

- **Medieval RPG Fantasy Theme**: Rich brown and gold color palette with damask-inspired patterns
- **Gamification**: Earn coins, level up, complete daily quests, and climb the leaderboard
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Persistent Layout**: Fixed header with player stats and bottom navigation bar
- **Multiple Pages**:
  - Landing Page with hero banner and "How It Works" section
  - Home Dashboard with daily quests and leaderboard preview
  - Inventory page with grid of items
  - Full leaderboard with ranking system

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
cd lostCity
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎨 Design Features

### Color Palette

- **Deep Browns**: `#2e1a0f`, `#4a2e1b` for containers and backgrounds
- **Rich Golds**: `#f4c430`, `#c79b00` for buttons, highlights, and important text
- **Creamy Beige**: `#eaddca` for standard text

### Typography

- Primary Font: **Cinzel** (serif) - for body text
- Fantasy Titles: **MedievalSharp** - for headings and titles

### UI Components

- Thick gold borders with rounded corners
- 3D effect gold buttons
- Progress bars with gold gradient
- Fantasy-themed cards with shadow effects

## 📱 Pages

### 1. Landing Page (`/`)

- Hero banner with call-to-action
- "How It Works" section with 3 steps
- Engaging introduction to the platform

### 2. Home Dashboard (`/quests`)

- Welcome banner with daily reward
- Quick action buttons (Report Lost Item, Browse Found Items)
- Daily quests with progress tracking
- Leaderboard preview

### 3. Inventory Page (`/inventory`)

- Grid layout of lost/found items
- Item cards with images, details, and status badges
- Interactive hover effects

### 4. Leaderboard (`/leaderboard`)

- Top 3 podium display
- Full ranking list with player stats
- Current user position highlighted

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Card, Button, Progress, Avatar)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cinzel, MedievalSharp)
- **Images**: Unsplash (placeholder images)

## 📦 Project Structure

```
lostCity/
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout with Header and BottomNav
│   ├── page.tsx             # Landing page
│   ├── quests/
│   │   └── page.tsx         # Home dashboard
│   ├── inventory/
│   │   └── page.tsx         # Inventory page
│   └── leaderboard/
│       └── page.tsx         # Leaderboard page
├── components/
│   ├── Header.tsx           # Top navigation header
│   ├── BottomNav.tsx        # Bottom navigation bar
│   └── ui/                  # Shadcn UI components
│       ├── card.tsx
│       ├── button.tsx
│       ├── progress.tsx
│       └── avatar.tsx
├── lib/
│   └── utils.ts             # Utility functions
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
```

## 🎯 Custom Tailwind Classes

- `.fantasy-title` - Medieval-style title with gold color
- `.gold-border` - Thick gold border
- `.fantasy-card` - Card with brown background and gold border
- `.fantasy-button` - 3D gold button with hover effects
- `.nav-item-active` - Active navigation item styling
- `.nav-item` - Inactive navigation item styling

## 🔄 Future Enhancements

- User authentication
- Real-time chat system
- Map integration for item locations
- Notification system
- Achievement badges
- Social sharing features

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)

---

**Happy Questing! 🗡️**
