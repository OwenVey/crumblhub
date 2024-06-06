import { cleanCookieName } from '@/lib/utils';
import { z } from 'zod';

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

  const response = await fetch('https://services.crumbl.com/customer', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({
      query: `#graphql
      query ItemsForCategory {
        menuItems {
          itemsForCategory(categoryId: "${category}", type: COOKIES) {
            ${COOKIE_GQL_SCHEMA}
          }
        }
      }`,
    }),
  });

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
    featuredPartner: featuredPartner?.replace('ft.', '').trim() ?? null,
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

  const token =
    'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNDY3ZmU1ZS1iZDg0LTRiMzctYWRkNi1hODRhZmVjOTlmMDhVc2VyIiwiYXBwIjoiQ3VzdG9tZXIiLCJwbGF0Zm9ybSI6ImlPUyIsImJyYW5kSWQiOiJiOTJlOTAxMC03NGU2LTExZWQtOTUxOC1hYjI2NWRiZmI2OTE6QnJhbmQiLCJyZWdpb24iOiJVUyIsImV4cCI6MTcxODIyNzI4MiwiaWF0IjoxNzE3NjIyNDgyfQ.AYPFZpu_MxszTsrBJTpku1rfahgho9VBeKpJ9BzJ-YOKyIriRLRyVVLTc4hISeZIbtD_IlF2SYowuzg6PdK3N1e2AJMDa1DjhvtnZk1TGrWBG63jOkqLd00Cxu48Gduj9sUlJ5wNnD7R73WmiH1us5Tqpm-YqyAzKE4qmxCIy1Dm4tQQ';
  const response = await fetch('https://services.crumbl.com/customer', {
    method: 'POST',
    headers: {
      'x-crumbl-token': token,
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({
      query: `#graphql
      query PublicCookieSearch {
        cookies {
          publicCookieSearch(searchTerm: "${searchTerm}") {
            publicCookieFlavor {
              ${COOKIE_GQL_SCHEMA}
            }
          }
        }
      }`,
    }),
  });

  const parsedData = ResponseSchema.parse(await response.json());

  const formattedCookies = parsedData.data.cookies.publicCookieSearch.map(({ publicCookieFlavor }) =>
    formatCookie(publicCookieFlavor),
  );

  return formattedCookies;
}

export async function getWebCookies() {
  const ResponseCookieSchema = z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    miniImage: z.string().nullable(),
    nutritionLabelImage: z.string().nullable(),
    miniNutritionLabelImage: z.string().nullable(),
    cateringMiniDisabled: z
      .boolean()
      .nullable()
      .transform((v) => v ?? false),
    miniDisabled: z
      .boolean()
      .nullable()
      .optional()
      .transform((v) => v ?? false),
    description: z.string(),
    allergyInformation: z.object({
      description: z.string(),
    }),
  });

  const ResponseSchema = z.object({
    pageProps: z.object({
      catering: z.array(ResponseCookieSchema),
      cookies: z.array(ResponseCookieSchema),
    }),
  });

  const response = await fetch(
    'https://crumblcookies.com/_next/data/oC5Wps_ZcvR_2AulHlXyf/en-US/nutrition/regular.json',
    {
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  );

  const parsedData = ResponseSchema.parse(await response.json());

  const allCookies = [...parsedData.pageProps.cookies, ...parsedData.pageProps.catering];
  const uniqueCookies = allCookies.filter(({ id }, index, self) => index === self.findIndex((t) => t.id === id));

  const formattedCookies = uniqueCookies.map(({ allergyInformation, id, ...cookie }) => ({
    ...cookie,
    crumblId: id,
    name: cleanCookieName(cookie.name),
    allergies: allergyInformation.description,
  }));

  return formattedCookies;
}

const response = await fetch('https://services.crumbl.com/customer', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  body: JSON.stringify({
    query: `#graphql
      query ThisWeeksCookies {
  thisWeeksCookies {
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
    calorieInformation {
      total
      perServing
      servingSize
    }
    homepageImage
    newAerialImage
    classicStackImage
    iconImage
    type
    allergyInformation {
      description
    }
    newRecipeCallout
    servingMethod
  }
  cookieIfMysteryCookieWeek {
    __typename
    cookieId
    name
    servingMethod
    calorieInformation {
      __typename
      total
      perServing
      servingSize
    }
    homepageImage
    aerialImage
    newAerialImage
    miniAerialImage
    nutritionLabelImage
    classicStackImage
    iconImage
    description
    type
    isMysteryCookie
    miniNutritionLabelImage
    allergyInformation {
      description
    }
    nameWithoutPartner
    featuredPartner
  }
}
`,
  }),
});
