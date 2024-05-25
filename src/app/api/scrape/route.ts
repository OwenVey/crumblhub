import { chromium, type Locator } from 'playwright';

const UNKNOWN_IMAGE = 'https://friconix.com/png/fi-cnsuxx-question-mark.png';
export async function GET() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://crumblcookies.com/nutrition');

  const flavorLocators = await page.locator('.bg-white.p-5.pb-0.mb-2\\.5.rounded-lg').all();
  const flavors = await Promise.all(
    flavorLocators.map(async (flavorLocator) => {
      const optimizedImage = await flavorLocator.locator('img').first().getAttribute('src');
      const image = optimizedImage ? getOriginalUrl(optimizedImage) : UNKNOWN_IMAGE;
      const name = await flavorLocator.locator('b').first().innerText();
      const description = await flavorLocator.locator('p').first().innerText();
      const contains = (await flavorLocator.locator('span').first().innerText()).split(', ');
      const nutritionImage = await getNutritionInfoImage(flavorLocator);

      return { name, description, image, contains, nutritionImage };
    }),
  );

  return Response.json({ flavors });
}

function getOriginalUrl(url: string) {
  return url.substring(url.indexOf('https://', 8));
}

async function getNutritionInfoImage(parent: Locator) {
  const viewNutritionDiv = parent.getByText('View Nutritional Facts').locator('xpath=..');
  let nutritionLabelImage = UNKNOWN_IMAGE;
  if (await viewNutritionDiv.isVisible()) {
    await viewNutritionDiv.dispatchEvent('click');
    const optimizedNutritionLabelImage = await parent.getByAltText('Nutrition Facts label').getAttribute('src');
    if (optimizedNutritionLabelImage) nutritionLabelImage = getOriginalUrl(optimizedNutritionLabelImage);
  } else {
    console.warn('No nutrition info found');
  }

  return nutritionLabelImage;
}
