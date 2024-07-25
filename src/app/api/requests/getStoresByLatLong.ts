import { z } from 'zod';
import { crumblGqlApi } from './shared';

const ResponseSchema = z.object({
  data: z.object({
    stores: z
      .object({
        storesAndItemsForMap: z.array(
          z.object({
            store: z.object({
              storeId: z.string(),
              // name: z.string(),
              // address: z.string(),
              // city: z.string(),
              // state: z.string(),
              // zip: z.string(),
              // latitude: z.string(),
              // longitude: z.string(),
              // timezone: z.string(),
            }),
            testingItems: z.array(
              z.object({
                cookieId: z.string(),
                aerialImage: z.string().nullable(),
              }),
            ),
            timedSpecialItems: z.array(
              z.object({
                metadata: z.object({
                  cookieId: z.string(),
                }),
              }),
            ),
          }),
        ),
      })
      .nullable(),
  }),
});

export async function getStoresByLatLong(latitude: string, longitude: string) {
  const response = await crumblGqlApi(`#graphql
      query TestStoresAndItems {
        stores {
          storesAndItemsForMap(
            testingType: COOKIE_FLAVOR
            timezone: "America/Chicago"
            latitude: ${latitude}
            longitude: ${longitude}
          ) {
            store {
              storeId
              name
              address
              city
              state
              zip
              latitude
              longitude
              timezone
            }
            testingItems {
              ... on PublicCookieFlavor {
                cookieId
                aerialImage
              }
            }
            timedSpecialItems {
              metadata {
                cookieId
              }
            }
          }
        }
      }`);

  const parsedData = ResponseSchema.parse(response);
  const stores = parsedData.data.stores?.storesAndItemsForMap
    .map(({ store: { storeId }, testingItems }) => ({
      id: storeId,
      testCookieIds: testingItems.filter(({ aerialImage }) => aerialImage).map(({ cookieId }) => cookieId),
    }))
    .filter(({ testCookieIds }) => testCookieIds.length);

  return stores ?? [];
}
