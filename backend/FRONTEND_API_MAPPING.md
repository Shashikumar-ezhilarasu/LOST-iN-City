# Frontend-Backend API Mapping

This document maps each Next.js frontend page to the backend endpoints it needs.

## 1. Home Page (`app/page.tsx`)

**Endpoints:**

- `GET /users/me` - Get current user info
- `GET /items/lost?page=1&pageSize=5` - Recent lost items
- `GET /items/found?page=1&pageSize=5` - Recent found items
- `GET /leaderboard/me` - Current user rank

## 2. Browse Lost Items (`app/browse-lost/page.tsx`)

**Endpoints:**

- `GET /items/lost?q={search}&category={category}&status={status}&page={page}&pageSize=20&sort=createdAt:desc`

**Query Parameters:**

- `q` - Search query
- `category` - Filter by category
- `status` - Filter by status (open, matched, closed)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `sort` - Sort field and direction (e.g., createdAt:desc)

## 3. Browse Found Items (`app/browse-found/page.tsx`)

**Endpoints:**

- `GET /items/found?q={search}&category={category}&status={status}&page={page}&pageSize=20&sort=createdAt:desc`

**Query Parameters:** Same as browse-lost

## 4. Lost Item Detail (`app/lost-item/[id]/page.tsx`)

**Endpoints:**

- `GET /items/lost/{id}` - Get item details
- `GET /items/lost/{id}/comments` - Get comments
- `POST /items/lost/{id}/comments` - Add comment
  ```json
  { "content": "Comment text" }
  ```

## 5. Found Item Detail (`app/found-item/[id]/page.tsx`)

**Endpoints:**

- `GET /items/found/{id}` - Get item details
- `GET /items/found/{id}/comments` - Get comments
- `POST /items/found/{id}/comments` - Add comment
  ```json
  { "content": "Comment text" }
  ```

## 6. Leaderboard (`app/leaderboard/page.tsx`)

**Endpoints:**

- `GET /leaderboard?page={page}&pageSize=20` - Get leaderboard
- `GET /leaderboard/me` - Get current user rank

## 7. Profile (`app/profile/page.tsx`)

**Endpoints:**

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update profile
  ```json
  {
    "display_name": "New Name",
    "avatar_url": "https://...",
    "bio": "Bio text",
    "phone": "+1234567890"
  }
  ```
- `GET /items/lost?page=1` - User's lost reports
- `GET /items/found?page=1` - User's found reports

## 8. Quests (`app/quests/page.tsx`)

**Endpoints:**

- `GET /quests?status={status}&page={page}&pageSize=20` - Get quests
  - status options: `available`, `in_progress`, `completed`, `all`
- `POST /quests/{id}/start` - Start a quest
- `POST /quests/{id}/complete` - Complete a quest

## 9. Report Lost Item (`app/report-lost/page.tsx`)

**Endpoints:**

- `POST /items/lost` - Create lost report
  ```json
  {
    "title": "Lost iPhone 13",
    "description": "Black iPhone 13 Pro",
    "category": "electronics",
    "lost_at": "2024-01-15T10:30:00Z",
    "latitude": 40.7128,
    "longitude": -74.006,
    "location_name": "Central Park",
    "images": ["https://..."],
    "tags": ["urgent", "reward_offered"],
    "color": "black",
    "brand": "Apple",
    "reward_amount": 100,
    "visibility": "public"
  }
  ```
- `GET /categories` - Get available categories
- `GET /tags/suggest?q={query}` - Get tag suggestions

## 10. Report Found Item (`app/report-found/page.tsx`)

**Endpoints:**

- `POST /items/found` - Create found report
  ```json
  {
    "title": "Found iPhone",
    "description": "Black iPhone found near bench",
    "category": "electronics",
    "found_at": "2024-01-15T14:30:00Z",
    "latitude": 40.7128,
    "longitude": -74.006,
    "location_name": "Central Park",
    "images": ["https://..."],
    "tags": ["near_station"],
    "color": "black",
    "brand": "Apple",
    "found_condition": "good",
    "holding_instructions": "At park security office"
  }
  ```
- `GET /categories` - Get available categories
- `GET /tags/suggest?q={query}` - Get tag suggestions

## Authentication Flow

### Register

```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "securepass123",
  "display_name": "John Doe"
}

Response:
{
  "data": {
    "access_token": "eyJhbGc...",
    "expires_in": 86400000,
    "user": {
      "id": "uuid",
      "display_name": "John Doe",
      "avatar_url": null
    }
  }
}
```

### Login

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: Same as register
```

### Using Token

Add to all authenticated requests:

```
Authorization: Bearer {access_token}
```

## Response Format

All responses follow this structure:

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  },
  "errors": []
}
```

## Error Handling

```json
{
  "data": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Email is required",
      "field": "email"
    }
  ]
}
```

## Next.js Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Example Fetch Calls

### With Authentication

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

const data = await response.json();
```

### POST Request

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/lost`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(lostItemData),
});

const result = await response.json();
```

## Categories List

- electronics
- pets
- documents
- jewelry
- clothing
- bags
- keys
- books
- sports_equipment
- toys
- other

## Item Status Values

- open
- matched
- closed

## Quest Difficulty Values

- easy
- medium
- hard

## Found Item Condition Values

- new
- good
- worn
- damaged
