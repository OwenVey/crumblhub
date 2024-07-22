import { z } from 'zod';
import { COOKIE_GQL_SCHEMA, CookieResponseSchema, crumblGqlFetch, formatCookie } from './shared';

const ResponseSchema = z.object({
  data: z.object({
    cookies: z.object({
      cookieDetails: CookieResponseSchema,
    }),
  }),
});

export async function getCookieById(cookieId: string) {
  const response = await crumblGqlFetch(`#graphql
      query CookieDetails {
        cookies {
          cookieDetails(cookieId: "${cookieId}") {
            ${COOKIE_GQL_SCHEMA}
          }
        }
      }`);

  const parsedData = ResponseSchema.parse(await response.json());

  return formatCookie(parsedData.data.cookies.cookieDetails);
}
