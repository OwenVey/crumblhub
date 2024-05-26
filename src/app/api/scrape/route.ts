import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { revalidatePath } from 'next/cache';
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

  const allCookies = [...parsedData.pageProps.cookies, ...parsedData.pageProps.catering];
  const uniqueCookies = allCookies.filter(({ id }, index, self) => index === self.findIndex((t) => t.id === id));

  console.log({ all: allCookies.length, unique: uniqueCookies.length });

  const formattedCookies = uniqueCookies.map(({ allergyInformation, id, ...cookie }) => ({
    ...cookie,
    crumblId: id,
    name: cookie.name.replace('’', `'`).trim(),
    allergies: allergyInformation.description,
  }));

  await Promise.all(formattedCookies.map((cookie) => db.insert(cookiesTable).values(cookie).onConflictDoNothing()));

  revalidatePath('/');
  revalidatePath('/weeks');

  return Response.json(formattedCookies);
}
