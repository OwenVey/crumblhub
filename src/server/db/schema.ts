import { relations, sql } from 'drizzle-orm';
import { boolean, date, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const cookiesTable = pgTable('cookies', {
  id: serial('id').primaryKey(),
  crumblId: text('crumbl_id').unique().notNull(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  allergies: text('allergies').notNull(),
  miniImage: text('mini_image'),
  nutritionLabelImage: text('nutrition_label_image'),
  miniNutritionLabelImage: text('mini_nutrition_label_image'),
  cateringMiniDisabled: boolean('catering_mini_disabled'),
  miniDisabled: boolean('mini_disabled'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const cookiesRelations = relations(cookiesTable, ({ many }) => ({
  weekCookies: many(weekCookiesTable),
}));

export const weeksTable = pgTable('weeks', {
  id: serial('id').primaryKey(),
  start: date('start', { mode: 'string' }).unique().notNull(),
  // end: date('end', { mode: 'string' }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const weeksRelations = relations(weeksTable, ({ many }) => ({
  cookies: many(weekCookiesTable),
}));

export const weekCookiesTable = pgTable(
  'week_cookies',
  {
    id: serial('id').primaryKey(),
    weekId: integer('week_id')
      .references(() => weeksTable.id, { onDelete: 'cascade' })
      .notNull(),
    cookieId: integer('cookie_id').references(() => cookiesTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isNew: boolean('is_new').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.weekId, table.cookieId, table.name).nullsNotDistinct(),
  }),
);

export const weekCookiesRelations = relations(weekCookiesTable, ({ one }) => ({
  week: one(weeksTable, {
    fields: [weekCookiesTable.weekId],
    references: [weeksTable.id],
  }),
  cookie: one(cookiesTable, {
    fields: [weekCookiesTable.cookieId],
    references: [cookiesTable.id],
  }),
}));
