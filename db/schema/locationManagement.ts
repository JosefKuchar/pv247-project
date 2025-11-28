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

export const locationManagement = sqliteTable(
  'location_management',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    locationId: text('location_id')
      .notNull()
      .references(() => location.id, { onDelete: 'cascade' }),
    approved: integer('approved', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [
    index('location_management_userId_idx').on(table.userId),
    index('location_management_locationId_idx').on(table.locationId),
    unique('location_management_unique_idx').on(table.userId, table.locationId),
  ],
);

export const locationManagementRelations = relations(
  locationManagement,
  ({ one }) => ({
    user: one(user, {
      fields: [locationManagement.userId],
      references: [user.id],
      relationName: 'managedLocations',
    }),
    location: one(location, {
      fields: [locationManagement.locationId],
      references: [location.id],
      relationName: 'managers',
    }),
  }),
);
