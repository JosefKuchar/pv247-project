import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './auth';
import { location } from './location';
import { reviewPhoto } from './reviewPhoto';
import { comment } from './comment';
import { reviewLike } from './reviewLike';

export const review = sqliteTable(
  'review',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    locationId: text('location_id')
      .notNull()
      .references(() => location.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    rating: integer('rating').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [
    index('review_userId_idx').on(table.userId),
    index('review_locationId_idx').on(table.locationId),
  ],
);

export const reviewRelations = relations(review, ({ one, many }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  location: one(location, {
    fields: [review.locationId],
    references: [location.id],
  }),
  photos: many(reviewPhoto),
  comments: many(comment),
  likes: many(reviewLike),
}));
