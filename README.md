# Lost & Found Quest 🏰

A gamified Lost & Found web application with a medieval RPG fantasy theme built with Next.js, Tailwind CSS, and Shadcn UI.

## � Application Concept

Lost & Found Quest is a humanitarian platform that gamifies the process of reuniting people with their lost belongings:

1. **Lost Item Owner** reports a lost item with photo/description and sets a reward
2. **Finder** discovers an item and posts it on the platform
3. **Matching** system connects lost items with found items
4. **Verification** process ensures rightful ownership
5. **Reward Transfer** happens after successful handover (via Stripe)
6. **Gamification** encourages participation through badges, levels, and leaderboard

## 🎮 Features

- **Medieval RPG Fantasy Theme**: Rich brown and gold color palette with damask-inspired patterns
- **Gamification System**:
  - Earn coins and XP for finding and returning items
  - Level up based on experience points
  - Unlock badges and achievements
  - Compete on the leaderboard
  - Daily quests for extra rewards
- **Humanitarian Impact**: Track how many people you've helped
- **Social Profile**: Showcase your achievements and statistics
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Complete User Flow**:
  - Report lost items with rewards
  - Browse and search found items
  - Claim items and verify ownership
  - Real-time chat for coordination
  - Secure payment processing

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
- "How It Works" section with 3 steps (Post & Reward, Find & Connect, Handover & Claim)
- Engaging introduction to the platform

### 2. Home Dashboard (`/quests`)

- Welcome banner with daily reward
- Quick action buttons (Report Lost Item, Browse Found Items)
- Daily quests with progress tracking
- Leaderboard preview with top 5 players

### 3. Report Lost Item (`/report-lost`)

- Comprehensive form with medieval styling
- Fields: item name, description, location, date, reward amount, images
- Category selection and contact information
- Quest summary showing posting fee and total cost

### 4. Browse Found Items (`/browse-found`)

- Search bar with advanced filters
- Grid of found items with reward badges
- Sorting options (newest, highest reward, most responses)
- Quick category filters

### 5. Item Detail Page (`/item/[id]`)

- Large item image gallery
- Complete description and distinguishing features
- Location and time details
- Finder profile with stats and rating
- Claim item button with reward display
- Verification requirements notice

### 6. Inventory Page (`/inventory`)

- Grid layout of user's lost/found items
- Item cards with images, details, and status badges
- Track items through the entire process
- Interactive hover effects

### 7. Profile Page (`/profile`)

- User avatar and level display with XP progress bar
- Comprehensive statistics (items found/returned, rewards earned, success rate)
- Badges and achievements showcase with rarity tiers
- Recent activity feed
- Detailed heroic statistics (helpfulness score, response rate)
- Humanity impact section showing people helped

### 8. Leaderboard (`/leaderboard`)

- Top 3 podium display with crowns and medals
- Full ranking list with player stats
- Current user position highlighted
- Stats include: level, items found, coins earned

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

## 🏗️ Architecture & Tech Stack

This platform is built with a modern, scalable, and event-driven architecture. Explore our detailed technology documentation below:

| Component | Technology | Documentation |
|-----------|------------|---------------|
| **Frontend** | Next.js 14, Tailwind, Shadcn | [Frontend Docs](./docs/frontend.md) |
| **Backend** | Spring Boot, Java 21, Maven | [Backend Docs](./docs/backend.md) |
| **Streaming** | Apache Kafka, Zookeeper | [Kafka Docs](./docs/kafka.md) |
| **Database** | MongoDB (NoSQL) | [Database Docs](./docs/database.md) |
| **Auth** | Clerk (JWT + SDKs) | [Auth Docs](./docs/frontend.md#clerk) |

## 📦 Project Structure

```
lostCity/
├── app/                    # Next.js App Router (Pages, Layouts)
├── backend/                # Spring Boot REST API
│   ├── src/main/java/      # Java Source Code
│   ├── src/main/resources/ # Config and YML
│   └── start.sh            # Backend Runner
├── components/             # Reusable UI Components
├── docs/                   # Detailed Technology Documentation
├── lib/                    # Shared Utilities
├── docker-compose.yml      # Kafka & Zookeeper Stack
├── run-all.sh              # Full Stack Launcher
└── README.md               # You are here
```

## 🔄 Roadmap & Features

### Core Features (Implemented ✅)
- **Gamification**: XP tracking, leveling, and leaderboard.
- **Reporting**: Full CRUD for lost and found reports.
- **Event Streaming**: Real-time Kafka events for all state changes.
- **Security**: Secure JWT authentication via Clerk.
- **Fantasy UI**: Premium medieval design system.

### Upcoming Features (In Progress 🚧)
- **Real-time Chat**: WebSocket-based messaging between finders and owners.
- **Stripe Payments**: Secure reward escrow and payouts.
- **Image Processing**: AI-based item matching and thumbnail generation.
- **Mobile App**: Dedicated Android/iOS version via React Native.


## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)

---

**Happy Questing! 🗡️**
