import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export const cookiesRelations = relations(cookiesTable, ({ many }) => ({
  weekCookies: many(weekCookiesTable),
}));

export const weeksTable = pgTable('weeks', {
  id: serial('id').primaryKey(),
  start: timestamp('start', { withTimezone: true }).unique().notNull(),
  end: timestamp('end', { withTimezone: true }).unique().notNull(),
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
