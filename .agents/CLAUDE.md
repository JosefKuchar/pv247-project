# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Locagram** is a social web application focused on sharing and exploring reviews of real-world locations. Built with Next.js 16, it allows users to create posts linked to specific places, describe their experiences, and interact with other users through comments and likes. The platform's main purpose is to allow people to discover and evaluate locations through authentic, user-generated content.

### Core Features

**User Management & Authentication:**
- User registration and login with better-auth
- Personal profiles with customizable information and profile pictures
- Only authenticated users can create or interact with content
- Users can edit/delete their own profile information

**Location-Based Content:**
- Posts automatically linked to Google Maps locations
- Each post includes title, description, optional photos, and star ratings
- Users can edit or delete their own posts
- Input validation ensures no invalid or empty posts

**Social Interaction:**
- Like system for posts
- Comment system for sharing opinions and experiences
- Follow/following system between users
- Follow places to get updates when new reviews are posted
- Home feed showing posts from followed users AND followed places
- User profiles display followers and following lists
- Share posts to external platforms

**Discovery & Browsing:**
- Home feed (default tab) with posts from followed users/places only
- Map tab showing nearby reviewed places centered on user location
- Search tab for finding users and places
- Interactive place detail pages with all reviews
- User profile pages accessible from posts and search

**Business Features:**
- Place ownership claiming through Profile menu
- Simple claim process: select place + provide reasoning
- Admin approval system (outside UI scope)
- "My Places" section for managing claimed places
- Verified badges for approved place owners
- Place management: edit info, monitor reviews, view analytics

**Data Persistence & Management:**
- All posts and interactions stored persistently
- Users can delete their own posts and comments
- Data remains available after logout/login cycles

## Development Commands

**Setup and Development:**
```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
```

**Database Operations:**
```bash
pnpm db                     # Start local Turso database (port 8020)
pnpm db:push                # Push schema changes to database
pnpm db:seed                # Seed database with sample data
pnpm db:studio              # Open Drizzle Studio
```

**Code Quality:**
```bash
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix ESLint issues
pnpm format                 # Format code with Prettier
pnpm format:check           # Check Prettier formatting
```

**Type Checking:**
```bash
pnpm exec tsc --noEmit      # TypeScript type checking (used in CI)
```

## Architecture

**Tech Stack:**
- **Frontend**: Next.js 16 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Drizzle ORM with Turso (SQLite-compatible)
- **Auth**: better-auth with email/password
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form

**Key Directories:**
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components (includes shadcn/ui)
- `db/` - Database schema definitions and configuration
- `lib/` - Utilities and configurations (auth, utils)
- `modules/` - Feature-specific server logic
- `hooks/` - Custom React hooks

**Database Schema:**
All tables include `id`, `createdAt`, and `updatedAt` columns. Core entities:
- **Users**: Authentication and profiles
- **Locations**: Places that can be reviewed
- **Reviews**: User posts about locations with ratings
- **Comments**: Comments on reviews
- **Follows**: User-to-user following relationships
- **Location Management**: Business ownership claims

**App Router Structure:**
- `(app)/(auth)/` - Login/register pages
- `(app)/create/` - Review creation tab
- `(app)/map/` - Interactive map tab with nearby places
- `(app)/` or `(app)/home/` - Home feed tab (default)
- `(app)/search/` - Search tab for users and places
- `(app)/profile/` - User profile tab
- `(app)/profile/[handle]/` - Other user profile pages
- `(app)/location/[id]/` - Place detail pages

**Navigation:**
- 5-tab structure: Create | Map | Home | Search | Profile
- Desktop: Sidebar navigation with 5 main tabs
- Mobile: Bottom navigation bar with 5 tabs
- Responsive design with `md:` breakpoints

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL`: Local Turso database (http://127.0.0.1:8020)
- `AUTH_TOKEN`: Database auth token (use "none" for local)
- `BETTER_AUTH_SECRET`: Auth session secret
- `BETTER_AUTH_URL`: Application URL

## Adding New Components

For shadcn/ui components:
```bash
npx shadcn@latest add [component_name]
```

Components are located in `/components/ui` and configured via `components.json`.

## Database Workflow

1. Modify schema in `db/schema/`
2. Run `pnpm db:push` to update database
3. Use `pnpm db:seed` to populate with sample data
4. Access database studio with `pnpm db:studio`

## Server-Side Architecture

**Modules Pattern:**
- Feature logic organized in `modules/` directory (e.g., `modules/review/server.ts`)
- Use `'server only'` directive for server-side only code
- Query patterns use Drizzle's relational queries with `with` clause for joins

**Database Patterns:**
- All tables use text IDs and timestamp columns (`createdAt`, `updatedAt`)
- Relationships defined separately from table schemas using `relations()`
- Indexes on foreign keys for performance (e.g., `review_userId_idx`)
- Cascade deletes configured on foreign keys

**Query Examples:**
```typescript
// Typical relational query pattern
const reviews = await db.query.review.findMany({
  with: {
    user: { columns: { name: true, handle: true, image: true } },
    location: { with: { reviews: { columns: { rating: true } } } },
    photos: { columns: { url: true } }
  }
});
```

## Authentication

**Architecture:**
- better-auth with Drizzle adapter
- API routes: `/api/auth/[...all]` handles all auth endpoints
- Server config: `lib/auth.ts`
- Client utilities: `lib/auth-client.ts`
- Email/password authentication enabled

## Development Workflow

**Local Development:**
1. Start database: `pnpm db` (runs on port 8020)
2. Start dev server: `pnpm dev` (runs on port 3000)
3. View database: `pnpm db:studio`

**Making Schema Changes:**
1. Edit files in `db/schema/`
2. Run `pnpm db:push` to apply changes
3. Update seed data in `db/seed/seed.ts` if needed
4. Run `pnpm db:seed` to populate with fresh data

**No Testing Framework:**
This project currently has no test setup configured.