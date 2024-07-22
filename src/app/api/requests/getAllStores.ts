import { parseHTML } from 'linkedom';
import { z } from 'zod';

const ResponseSchema = z.object({
  props: z.object({
    pageProps: z.object({
      stores: z.array(
        z.object({
          storeId: z.string(),
          name: z.string(),
          slug: z.string(),
          address: z.string(),
          state: z.string(),
          phone: z.string(),
          email: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          storeHours: z.object({
            description: z.string(),
            startDate: z.coerce.date(),
          }),
        }),
      ),
    }),
  }),
});

export async function getAllStores() {
  const response = await fetch('https://crumblcookies.com/stores', {
    cache: 'no-cache',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  const { document } = parseHTML(await response.text());
  const nextData = document.getElementById('__NEXT_DATA__')?.textContent;

  if (!nextData) {
    throw new Error('No __NEXT_DATA__');
  }

  const stores = ResponseSchema.parse(JSON.parse(nextData)).props.pageProps.stores;

  return stores.map(({ storeId, storeHours, ...rest }) => ({
    id: storeId,
    started: storeHours.startDate,
    hours: storeHours.description,
    ...rest,
  }));
}
