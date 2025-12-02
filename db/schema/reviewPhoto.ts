import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { review } from './review';

export const reviewPhoto = sqliteTable(
  'review_photo',
  {
    id: text('id').primaryKey(),
    reviewId: text('review_id')
      .notNull()
      .references(() => review.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [index('reviewPhoto_reviewId_idx').on(table.reviewId)],
);

export const reviewPhotoRelations = relations(reviewPhoto, ({ one }) => ({
  review: one(review, {
    fields: [reviewPhoto.reviewId],
    references: [review.id],
  }),
}));

export type reviewPhotoType = typeof reviewPhoto.$inferSelect;
