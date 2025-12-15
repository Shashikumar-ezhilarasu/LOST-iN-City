# LostCity - Final App Structure

## Overview

A gamified Lost & Found web application with medieval RPG fantasy theme. Users can browse lost items needing heroes, browse found items, report their own lost/found items, and manage everything through their profile.

## Page Structure

### Public Pages (Browse & Report)

1. **Landing Page** (`/`)

   - Hero section with medieval theme
   - How it works: Post & Reward → Find & Connect → Handover & Claim
   - CTA button to enter the realm

2. **Home/Quests Dashboard** (`/quests`)

   - Daily quests feed
   - Quick stats (items found, returned, active)
   - Leaderboard preview
   - Navigation hub

3. **Browse Lost Items** (`/browse-lost`) ⭐ NEW

   - All lost items posted by community
   - Search & filters (category, location, reward)
   - Each item shows: title, description, location, date, reward amount, owner
   - Click to view full details and help find
   - Anyone can browse and help find these items

4. **Browse Found Items** (`/browse-found`)

   - All found items posted by community
   - Search & filters
   - Each item shows: title, description, location, date, potential reward
   - Click to view full details and claim if yours
   - Helps owners find their lost items

5. **Report Lost Item** (`/report-lost`)

   - Form to post a lost item
   - User sets the reward amount (coins/cash)
   - Upload images, description, location, date lost
   - Item becomes visible to all users in "Browse Lost"

6. **Report Found Item** (`/report-found`) ⭐ NEW

   - Form to post a found item
   - Upload images, description, location, date found
   - Item becomes visible to all users in "Browse Found"
   - When matched, finder earns the reward set by owner

7. **Lost Item Detail** (`/lost-item/[id]`) ⭐ NEW

   - Full details of a lost item
   - Owner information
   - Reward amount
   - "I Found This!" button to report finding it
   - Contact owner through secure messaging

8. **Found Item Detail** (`/found-item/[id]`)

   - Full details of a found item
   - Finder information
   - Potential reward
   - "This is Mine!" button to claim
   - Contact finder through secure messaging

9. **Profile Page** (`/profile`)

   - Public profile: badges, level, XP, stats
   - **MY LOST ITEMS** section ⭐ NEW
     - Shows only the logged-in user's lost items
     - Items they've posted with rewards they're offering
     - Status: Active, Matched, Returned, Expired
     - Private to user only
   - **MY FOUND ITEMS** section ⭐ NEW
     - Shows only the logged-in user's found items
     - Items they've found and reported
     - Rewards they've earned or can earn
     - Status: Available, Matched, Returned
     - Private to user only
   - Recent Activity feed
   - Humanity Impact tracker

10. **Leaderboard** (`/leaderboard`)
    - Top 3 podium display
    - Full ranking table
    - Filter by timeframe

## Navigation Structure

### Bottom Navigation (4 tabs)

1. **Home** → `/quests`
2. **Lost** → `/browse-lost` (Browse all lost items)
3. **Found** → `/browse-found` (Browse all found items)
4. **Profile** → `/profile` (User's personal dashboard)

### Top Header

- Coin balance
- Level & XP
- Avatar (clicks to profile)

## Key Concepts

### Public vs Private

- **Public Pages**: Everyone can see ALL lost items and ALL found items
  - `/browse-lost` - See all items people have lost
  - `/browse-found` - See all items people have found
- **Private Sections** (in Profile only): User sees ONLY their own items
  - "My Lost Items" - Items I've lost and am offering rewards for
  - "My Found Items" - Items I've found and can earn rewards from

### User Flows

#### Flow 1: I Lost Something

1. Go to `/report-lost`
2. Fill form, set reward amount
3. Item appears in public `/browse-lost` for everyone to see
4. Appears in my profile under "My Lost Items"
5. Someone finds it and contacts me
6. After verification, I pay the reward via Stripe

#### Flow 2: I Found Something

1. Go to `/report-found`
2. Fill form with details
3. Item appears in public `/browse-found` for everyone to see
4. Appears in my profile under "My Found Items"
5. Owner claims it and contacts me
6. After handover, I receive the reward via Stripe

#### Flow 3: Helping Others

1. Browse `/browse-lost` to see items people need help finding
2. Click "I Found This!" if I found it
3. Contact owner, verify, handover
4. Receive reward set by owner

## File Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── quests/page.tsx            # Home dashboard
├── browse-lost/page.tsx       # Browse all lost items ⭐ NEW
├── browse-found/page.tsx      # Browse all found items
├── report-lost/page.tsx       # Report lost item form
├── report-found/page.tsx      # Report found item form ⭐ NEW
├── lost-item/[id]/page.tsx    # Lost item detail ⭐ NEW
├── found-item/[id]/page.tsx   # Found item detail (renamed)
├── profile/page.tsx           # Profile with My Lost/Found sections ⭐ UPDATED
└── leaderboard/page.tsx       # Full leaderboard

components/
├── Header.tsx                 # Top header
├── BottomNav.tsx             # Bottom navigation (4 tabs) ⭐ UPDATED
└── ui/                       # Shadcn components
```

## Theme & Design

- Colors: Brown (#2e1a0f), Gold (#f4c430), Beige (#eaddca)
- Fonts: Cinzel (serif), MedievalSharp (fantasy)
- Fantasy cards with thick gold borders
- 3D gold buttons with gradients
- Medieval RPG aesthetic throughout

## Backend Integration Ready

- All forms ready for API POST requests
- All lists ready for API GET requests
- User authentication via Clerk
- Payment processing via Stripe
- See BACKEND_REQUIREMENTS.md for full API specs

## Status

✅ Frontend 100% complete
✅ All pages functional with mock data
✅ Responsive design (mobile, tablet, desktop)
✅ Navigation updated to reflect public vs private structure
⏳ Backend integration pending (Spring Boot + MongoDB + Stripe + Clerk)
