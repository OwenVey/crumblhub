import { relations, sql } from 'drizzle-orm';
import { boolean, date, integer, numeric, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

const CREATED_AT = timestamp('created_at', { withTimezone: true }).defaultNow().notNull();
const UPDATED_AT = timestamp('updated_at', { withTimezone: true })
  .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
  .notNull();

export const cookiesTable = pgTable('cookies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameWithoutPartner: text('name_without_partner'),
  featuredPartner: text('featured_partner'),
  description: text('description'),
  calories: integer('calories'),
  allergies: text('allergies'),
  averageRating: numeric('average_rating').notNull(),
  totalReviews: integer('total_reviews').notNull(),
  totalVotes: integer('total_votes').notNull(),
  featuredPartnerLogo: text('featured_partner_logo'),
  aerialImage: text('aerial_image').notNull(),
  miniAerialImage: text('mini_aerial_image'),
  nutritionLabelImage: text('nutrition_label_image'),
  miniNutritionLabelImage: text('mini_nutrition_label_image'),
  servingMethod: text('serving_method'),
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
});

export const cookiesRelations = relations(cookiesTable, ({ many }) => ({
  weekCookies: many(weeklyCookiesTable),
}));

export const weeksTable = pgTable('weeks', {
  id: serial('id').primaryKey(),
  start: date('start', { mode: 'string' }).unique().notNull(),
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
});

export const weeksRelations = relations(weeksTable, ({ many }) => ({
  cookies: many(weeklyCookiesTable),
}));

export const weeklyCookiesTable = pgTable(
  'weekly_cookies',
  {
    id: serial('id').primaryKey(),
    weekId: integer('week_id')
      .references(() => weeksTable.id, { onDelete: 'cascade' })
      .notNull(),
    cookieId: text('cookie_id').references(() => cookiesTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isNew: boolean('is_new').notNull(),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  (table) => ({
    uniqueConstraint: unique().on(table.weekId, table.cookieId, table.name).nullsNotDistinct(),
  }),
);

export const weeklyCookiesRelations = relations(weeklyCookiesTable, ({ one }) => ({
  week: one(weeksTable, {
    fields: [weeklyCookiesTable.weekId],
    references: [weeksTable.id],
  }),
  cookie: one(cookiesTable, {
    fields: [weeklyCookiesTable.cookieId],
    references: [cookiesTable.id],
  }),
}));

export const storesTable = pgTable('stores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  address: text('address').notNull(),
  state: text('state').notNull(),
  phone: text('phone').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  timezone: text('timezone').notNull(),
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
});

export const storesRelations = relations(storesTable, ({ many }) => ({
  testCookies: many(testCookieStoresTable),
}));

export const testCookiesTable = pgTable('test_cookies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameWithoutPartner: text('name_without_partner'),
  featuredPartner: text('featured_partner'),
  description: text('description'),
  calories: integer('calories'),
  allergies: text('allergies'),
  averageRating: numeric('average_rating').notNull(),
  totalReviews: integer('total_reviews').notNull(),
  totalVotes: integer('total_votes').notNull(),
  featuredPartnerLogo: text('featured_partner_logo'),
  aerialImage: text('aerial_image').notNull(),
  miniAerialImage: text('mini_aerial_image'),
  nutritionLabelImage: text('nutrition_label_image'),
  miniNutritionLabelImage: text('mini_nutrition_label_image'),
  servingMethod: text('serving_method'),
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
});

export const testCookiesRelations = relations(testCookiesTable, ({ many }) => ({
  stores: many(testCookieStoresTable),
}));

export const testCookieStoresTable = pgTable(
  'test_cookie_stores',
  {
    id: serial('id').primaryKey(),
    cookieId: text('cookie_id')
      .references(() => testCookiesTable.id, { onDelete: 'cascade' })
      .notNull(),
    storeId: text('store_id')
      .references(() => storesTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  (table) => ({
    uniqueConstraint: unique().on(table.storeId, table.cookieId),
  }),
);

export const testCookieStoresRelations = relations(testCookieStoresTable, ({ one }) => ({
  store: one(storesTable, {
    fields: [testCookieStoresTable.storeId],
    references: [storesTable.id],
  }),
  cookie: one(testCookiesTable, {
    fields: [testCookieStoresTable.cookieId],
    references: [testCookiesTable.id],
  }),
}));
