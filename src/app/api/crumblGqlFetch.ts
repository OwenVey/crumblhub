type Config = {
  url: string;
};
export async function crumblGqlFetch(
  query: string,
  config: Config = { url: 'https://services.crumbl.com/customer' },
): Promise<Response> {
  const { url } = config;

  const body = JSON.stringify({ query });

  return fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-crumbl-token':
        'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNDY3ZmU1ZS1iZDg0LTRiMzctYWRkNi1hODRhZmVjOTlmMDhVc2VyIiwiYXBwIjoiQ3VzdG9tZXIiLCJwbGF0Zm9ybSI6ImlPUyIsImJyYW5kSWQiOiJiOTJlOTAxMC03NGU2LTExZWQtOTUxOC1hYjI2NWRiZmI2OTE6QnJhbmQiLCJyZWdpb24iOiJVUyIsImV4cCI6MTcxODIyNzI4MiwiaWF0IjoxNzE3NjIyNDgyfQ.AYPFZpu_MxszTsrBJTpku1rfahgho9VBeKpJ9BzJ-YOKyIriRLRyVVLTc4hISeZIbtD_IlF2SYowuzg6PdK3N1e2AJMDa1DjhvtnZk1TGrWBG63jOkqLd00Cxu48Gduj9sUlJ5wNnD7R73WmiH1us5Tqpm-YqyAzKE4qmxCIy1Dm4tQQ',
    },
    body,
  });
}
