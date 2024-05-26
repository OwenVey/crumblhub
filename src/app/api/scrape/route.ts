import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { z } from 'zod';

const ResponseCookieSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  miniImage: z.string().nullable(),
  nutritionLabelImage: z.string().nullable(),
  miniNutritionLabelImage: z.string().nullable(),
  cateringMiniDisabled: z.boolean().nullable(),
  miniDisabled: z.boolean().nullable().optional(),
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

export async function GET() {
  const response = await fetch(
    'https://crumblcookies.com/_next/data/oC5Wps_ZcvR_2AulHlXyf/en-US/nutrition/regular.json',
  );

  const parsedData = ResponseSchema.parse(await response.json());

  const allFlavors = [...parsedData.pageProps.cookies, ...parsedData.pageProps.catering];
  const uniqueFlavors = allFlavors.filter((flavor, index, self) => index === self.findIndex((t) => t.id === flavor.id));

  console.log({ all: allFlavors.length, unique: uniqueFlavors.length });

  const formattedFlavors = uniqueFlavors.map(({ allergyInformation, id, ...flavor }) => ({
    ...flavor,
    crumblId: id,
    name: flavor.name.replace('’', `'`).trim(),
    allergies: allergyInformation.description,
  }));

  await Promise.all(formattedFlavors.map((cookie) => db.insert(cookiesTable).values(cookie).onConflictDoNothing()));

  return Response.json(formattedFlavors);
}
