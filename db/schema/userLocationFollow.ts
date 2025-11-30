import {
  sqliteTable,
  text,
  integer,
  index,
  unique,
} from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './auth';
import { location } from './location';

export const userLocationFollow = sqliteTable(
  'user_location_follow',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    locationId: text('location_id')
      .notNull()
      .references(() => location.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [
    index('user_location_follow_userId_idx').on(table.userId),
    index('user_location_follow_locationId_idx').on(table.locationId),
    unique('user_location_follow_unique_idx').on(
      table.userId,
      table.locationId,
    ),
  ],
);

export const userLocationFollowRelations = relations(
  userLocationFollow,
  ({ one }) => ({
    user: one(user, {
      fields: [userLocationFollow.userId],
      references: [user.id],
      relationName: 'followedLocations',
    }),
    location: one(location, {
      fields: [userLocationFollow.locationId],
      references: [location.id],
      relationName: 'followers',
    }),
  }),
);

export type userLocationFollowType = typeof userLocationFollow.$inferSelect;
