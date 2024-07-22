import { z } from 'zod';
import { COOKIE_GQL_SCHEMA, CookieResponseSchema, crumblGqlFetch, formatCookie } from './shared';

const ResponseSchema = z.object({
  data: z.object({
    cookies: z.object({
      publicCookieSearch: z
        .array(
          z.object({
            publicCookieFlavor: CookieResponseSchema,
          }),
        )
        .nullable(),
    }),
  }),
});

export async function searchCookie(searchTerm: string) {
  const response = await crumblGqlFetch(`#graphql
      query PublicCookieSearch {
        cookies {
          publicCookieSearch(searchTerm: "${searchTerm}") {
            publicCookieFlavor {
              ${COOKIE_GQL_SCHEMA}
            }
          }
        }
      }`);

  const parsedData = ResponseSchema.parse(await response.json());

  const formattedCookies = parsedData.data.cookies.publicCookieSearch?.map(({ publicCookieFlavor }) =>
    formatCookie(publicCookieFlavor),
  );

  return formattedCookies ?? [];
}
