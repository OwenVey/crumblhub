import { cleanCookieName } from '@/lib/utils';
import ky from 'ky';
import { z } from 'zod';

export const CookieResponseSchema = z.object({
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
  servingMethod: z.string().nullable(),
  isMysteryCookie: z
    .boolean()
    .nullable()
    .transform((v) => v ?? false),
  newRecipeCallout: z
    .boolean()
    .nullable()
    .transform((v) => v ?? false),
  stats: z
    .object({
      averageRating: z.coerce.string(),
      totalReviews: z.number(),
      totalVotes: z.number(),
    })
    .nullable(),
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

export const COOKIE_GQL_SCHEMA = `#graphql
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

export function formatCookie(cookie: z.infer<typeof CookieResponseSchema>) {
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
    ...(stats ? stats : { averageRating: '0', totalReviews: 0, totalVotes: 0 }),
    ...rest,
  };
}
export const api = ky.create({
  cache: 'no-cache',
  headers: {
    'Cache-Control': 'no-cache',
    'x-crumbl-token':
      'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNDY3ZmU1ZS1iZDg0LTRiMzctYWRkNi1hODRhZmVjOTlmMDhVc2VyIiwiYXBwIjoiQ3VzdG9tZXIiLCJwbGF0Zm9ybSI6ImlPUyIsImJyYW5kSWQiOiJiOTJlOTAxMC03NGU2LTExZWQtOTUxOC1hYjI2NWRiZmI2OTE6QnJhbmQiLCJyZWdpb24iOiJVUyIsImV4cCI6MTcxODIyNzI4MiwiaWF0IjoxNzE3NjIyNDgyfQ.AYPFZpu_MxszTsrBJTpku1rfahgho9VBeKpJ9BzJ-YOKyIriRLRyVVLTc4hISeZIbtD_IlF2SYowuzg6PdK3N1e2AJMDa1DjhvtnZk1TGrWBG63jOkqLd00Cxu48Gduj9sUlJ5wNnD7R73WmiH1us5Tqpm-YqyAzKE4qmxCIy1Dm4tQQ',
  },
  retry: 1,
  hooks: {
    beforeRetry: [
      ({ request }) => {
        console.log(`Retrying request for [${request.url}]`);
      },
    ],
  },
});

export async function crumblGqlApi(query: string) {
  return api
    .post('https://services.crumbl.com/customer', {
      json: { query },
    })
    .json();
}
