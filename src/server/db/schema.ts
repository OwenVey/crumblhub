import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

const decimalNumber = customType<{ data: number }>({
  dataType() {
    return 'decimal';
  },
  fromDriver(value) {
    return Number(value);
  },
});

export const servingMethodEnum = pgEnum('serving_method', ['Warm', 'Chilled', 'Bakery Temp']);

export const cookiesTable = pgTable('cookies', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  nameWithoutPartner: text('name_without_partner'),
  featuredPartner: text('featured_partner'),
  description: text('description'),
  calories: integer('calories'),
  allergies: text('allergies'),
  averageRating: decimalNumber('average_rating').notNull(),
  totalReviews: integer('total_reviews').notNull(),
  totalVotes: integer('total_votes').notNull(),
  featuredPartnerLogo: text('featured_partner_logo'),
  aerialImage: text('aerial_image').notNull(),
  miniAerialImage: text('mini_aerial_image'),
  nutritionLabelImage: text('nutrition_label_image'),
  miniNutritionLabelImage: text('mini_nutrition_label_image'),
  servingMethod: servingMethodEnum('serving_method'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cookiesRelations = relations(cookiesTable, ({ many }) => ({
  weekCookies: many(weekCookiesTable),
}));

export const weeksTable = pgTable('weeks', {
  id: serial('id').primaryKey(),
  start: date('start', { mode: 'string' }).unique().notNull(),
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
    cookieId: text('cookie_id').references(() => cookiesTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isNew: boolean('is_new').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
