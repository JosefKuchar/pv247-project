# Locagram

A social web application focused on sharing and exploring reviews of real-world locations. Users can create posts linked to specific places, describe their experiences, and interact with other users through comments and likes.

## Features

### 🏪 Location-Based Reviews

- Create posts linked to specific Google Maps locations
- Add photos, ratings, and detailed descriptions
- Automatic location association with map coordinates

### 👥 Social Interaction

- Follow other users and see their posts in your personalized feed
- Like and comment on location reviews
- Build a community around shared experiences

### 🗺️ Discovery & Exploration

- Browse reviews through multiple interfaces:
  - Main feed with recent/popular posts
  - Interactive map showing reviewed places
  - Search functionality for locations and keywords
- Filter content by category, rating, or proximity

### 🏢 Business Management

- Location owners can claim their places
- Verified badges for Location Management accounts
- Comprehensive location pages with aggregated reviews and ratings

### 📱 User Profiles

- Personal profiles with post history
- Customizable profile information and photos
- Follower/following system

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Drizzle ORM with Turso (SQLite-compatible)
- **Authentication**: better-auth
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Local Turso database instance

### Installation & Setup

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the local database:

```bash
pnpm db
```

4. Push schema and seed data:

```bash
pnpm db:push
pnpm db:seed
```

5. Start the development server:

```bash
pnpm dev
```
