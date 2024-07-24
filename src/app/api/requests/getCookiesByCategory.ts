import { type CookieCategory } from '@/types';
import { z } from 'zod';
import { COOKIE_GQL_SCHEMA, CookieResponseSchema, crumblGqlApi, formatCookie } from './shared';

const ResponseSchema = z.object({
  data: z.object({
    menuItems: z.object({
      itemsForCategory: z.array(CookieResponseSchema),
    }),
  }),
});

export async function getCookiesByCategory(category: CookieCategory) {
  const response = await crumblGqlApi(`#graphql
      query ItemsForCategory {
        menuItems {
          itemsForCategory(categoryId: "${category}", type: COOKIES) {
            ${COOKIE_GQL_SCHEMA}
          }
        }
      }`);

  const parsedData = ResponseSchema.parse(response);

  return parsedData.data.menuItems.itemsForCategory.map(formatCookie);
}
