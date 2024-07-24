import { z } from 'zod';
import { COOKIE_GQL_SCHEMA, CookieResponseSchema, crumblGqlApi, formatCookie } from './shared';

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
  const response = await crumblGqlApi(`#graphql
      query PublicCookieSearch {
        cookies {
          publicCookieSearch(searchTerm: "${searchTerm}") {
            publicCookieFlavor {
              ${COOKIE_GQL_SCHEMA}
            }
          }
        }
      }`);

  const parsedData = ResponseSchema.parse(response);

  const formattedCookies = parsedData.data.cookies.publicCookieSearch?.map(({ publicCookieFlavor }) =>
    formatCookie(publicCookieFlavor),
  );

  return formattedCookies ?? [];
}
