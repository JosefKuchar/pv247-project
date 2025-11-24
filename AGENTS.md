# Project

Locagram is a social web application focused on sharing and exploring reviews of real-world locations.
Users can create posts linked to specific places, describe their experiences, and interact with other users through comments and likes.
The platform’s main purpose is to allow people to discover and evaluate locations through authentic, user-generated content.

## Technical overview

Technologies

- Typescript
- Next.js 16 with App router
- Tailwind
- Shadcn UI
  - Located in `/components/ui`
  - If you need to add new component, run `npx shadcn@latest add [component_name]`
- Drizzle ORM with Turso (SQLite compatible)
  - Located in `/db`
  - After adding or changing schema, run `npx drizzle-kit push` to update the database
  - To seed the database, run `npm run db:seed`
- TanStack Query
- TanStack Table
- React Hook Form

Requirements

- Responsive design
- User authentication
- Server-side rendering alongside client-side rendering
- Database (CRUD operations)
  - All tables should have a primary key and a created_at and updated_at column

## Project specification

1. User Accounts
   Users can register and log in to the platform.
   Each user has a personal profile displaying their name, profile picture, and posts.
   Users can edit or delete their profile information.
   Only authenticated users can create or interact with content.

2. Location Management Accounts
   Businesses and place owners can claim ownership of a place listed.
   Once approved, a Location Management account is linked to the location.
   Location Management accounts have a verified badge.

3. Location-Based Posts
   Users can create posts linked to a specific location.
   Each post contains:
   Title and description of the place
   Optional photo upload
   Star rating or other rating system
   Posts are automatically associated with a map location.
   Users can edit or delete their own posts.

4. Browsing and Discovery
   A main feed displays recent or popular posts from all users.
   Users can browse posts:
   By scrolling through the feed
   By searching for locations or keywords
   By viewing an interactive map showing reviewed places
   Posts can be filtered by category, rating, or proximity.

5. Social Interaction
   Users can like posts from others.
   Users can comment on posts to share their opinions or experiences.
   Users can follow other users to see their posts in a personalized feed.
   Each user’s profile includes a list of their followers and people they follow.

6. Location Information
   Each location has its own page summarizing:
   Average user rating
   All posts and photos associated with that place
   Basic information (name, address, coordinates)
   Users can see multiple reviews per location to compare experiences.

7. User Feed and Personalization
   Logged-in users see a custom feed with:
   Posts from people they follow
   Recommended or trending locations
   Each user can view their own post history and manage content directly from their profile.

8. Administrative and Data Management
   Users can delete their own posts and comments at any time.
   Data is stored persistently so posts and interactions remain available after logout.
   Input validation ensures no invalid or empty posts are submitted.
