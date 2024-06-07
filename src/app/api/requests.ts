import { cleanCookieName } from '@/lib/utils';
import { z } from 'zod';
import { crumblGqlFetch } from './crumblGqlFetch';

const CATEGORIES = ['this_week', 'last_week', 'popular', 'graveyard', 'peanut_butter', 'classics', 'chilled'] as const;
type Category = (typeof CATEGORIES)[number];

const COOKIE_GQL_SCHEMA = `#graphql
... on PublicCookieFlavor {
  cookieId
  name
  aerialImage
  miniAerialImage
  nutritionLabelImage
  miniNutritionLabelImage
  featuredPartner
  featuredPartnerLogo
  nameWithoutPartner
  servingMethod
  description
  isMysteryCookie
  newRecipeCallout
  stats {
    averageRating
    totalReviews
    totalVotes
  }
  calorieInformation {
    total
    perServing
    servingSize
  }
  allergyInformation {
    description
  }
}`;

const CookieResponseSchema = z.object({
  cookieId: z.string(),
  name: z.string(),
  nameWithoutPartner: z.string().nullable(),
  description: z.string().nullable(),
  featuredPartner: z.string().nullable(),
  featuredPartnerLogo: z.string().nullable(),
  aerialImage: z.string(),
  miniAerialImage: z.string().nullable(),
  nutritionLabelImage: z.string().nullable(),
  miniNutritionLabelImage: z.string().nullable(),
  servingMethod: z.union([z.literal('Warm'), z.literal('Chilled'), z.literal('Bakery Temp')]).nullable(),
  isMysteryCookie: z
    .boolean()
    .nullable()
    .transform((v) => v ?? false),
  newRecipeCallout: z
    .boolean()
    .nullable()
    .transform((v) => v ?? false),
  stats: z.object({
    averageRating: z.number(),
    totalReviews: z.number(),
    totalVotes: z.number(),
  }),
  calorieInformation: z
    .object({
      total: z.string().nullable(),
      perServing: z.string().nullable(),
      servingSize: z.string().nullable(),
    })
    .nullable(),
  allergyInformation: z.object({
    description: z.string(),
  }),
});

export async function getAppCookies() {
  const cookies = (await Promise.all(CATEGORIES.map(fetchCookiesByCategory))).flat();
  const uniqueCookies = cookies.filter(({ id }, index, self) => index === self.findIndex((t) => t.id === id));

  return uniqueCookies;
}

export async function fetchCookiesByCategory(category: Category) {
  const ResponseSchema = z.object({
    data: z.object({
      menuItems: z.object({
        itemsForCategory: z.array(CookieResponseSchema),
      }),
    }),
  });

  const response = await crumblGqlFetch(`#graphql
    query ItemsForCategory {
      menuItems {
        itemsForCategory(categoryId: "${category}", type: COOKIES) {
          ${COOKIE_GQL_SCHEMA}
        }
      }
    }`);

  const parsedData = ResponseSchema.parse(await response.json());

  return parsedData.data.menuItems.itemsForCategory.map(formatCookie);
}

function formatCookie(cookie: z.infer<typeof CookieResponseSchema>) {
  const {
    name,
    nameWithoutPartner,
    featuredPartner,
    calorieInformation,
    allergyInformation,
    stats,
    cookieId,
    ...rest
  } = cookie;
  return {
    id: cookieId,
    name: cleanCookieName(name),
    nameWithoutPartner: nameWithoutPartner?.replace('ft.', '').trim() ?? null,
    featuredPartner:
      featuredPartner
        ?.replace('ft.', '')
        .replace('featuring', '')
        .replace(`'S`, `'s`)
        .replace('®', '')
        .replace('™', '')
        .trim() ?? null,
    calories: +(calorieInformation?.total ?? 0),
    allergies: allergyInformation.description,
    ...stats,
    ...rest,
  };
}

export async function searchCookie(searchTerm: string) {
  const ResponseSchema = z.object({
    data: z.object({
      cookies: z.object({
        publicCookieSearch: z.array(
          z.object({
            publicCookieFlavor: CookieResponseSchema,
          }),
        ),
      }),
    }),
  });

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

  const formattedCookies = parsedData.data.cookies.publicCookieSearch.map(({ publicCookieFlavor }) =>
    formatCookie(publicCookieFlavor),
  );

  return formattedCookies;
}

// export async function getThisWeeksCookies() {
//   const ResponseSchema = z.object({
//     data: z.object({
//       thisWeeksCookies: z.array(CookieResponseSchema.extend({ stats: z.undefined() })),
//       cookieIfMysteryCookieWeek: CookieResponseSchema.extend({ stats: z.undefined() }).nullable(),
//     }),
//   });

//   const cookieGql = `#graphql
//     cookieId
//     name
//     aerialImage
//     miniAerialImage
//     nutritionLabelImage
//     miniNutritionLabelImage
//     featuredPartner
//     featuredPartnerLogo
//     nameWithoutPartner
//     servingMethod
//     description
//     isMysteryCookie
//     newRecipeCallout
//     calorieInformation {
//       total
//       perServing
//       servingSize
//     }
//     allergyInformation {
//       description
//     }
//   `;

//   const response = await crumblGqlFetch(
//     `#graphql
//     query ThisWeeksCookies {
//       thisWeeksCookies {
//         ${cookieGql}
//       }
//       cookieIfMysteryCookieWeek {
//         ${cookieGql}
//       }
//     }`,
//     { url: 'https://backend.crumbl.com/graphql' },
//   );
//   const parsedData = ResponseSchema.parse(await response.json());
//   return parsedData.data.thisWeeksCookies.map(formatCookie);
// }
