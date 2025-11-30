import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { review } from './review';
import { userLocationFollow } from './userLocationFollow';
import { locationManagement } from './locationManagement';

export const location = sqliteTable(
  'location',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    handle: text('handle').notNull().unique(),
    address: text('address'),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [
    index('location_coordinates_idx').on(table.latitude, table.longitude),
  ],
);

export const locationRelations = relations(location, ({ many }) => ({
  reviews: many(review),
  followers: many(userLocationFollow, { relationName: 'followers' }),
  managers: many(locationManagement, { relationName: 'managers' }),
}));

export type locationType = typeof location.$inferSelect;
