import { type Page, expect } from '@playwright/test';

const IFRAME_SELECTOR = 'iframe[data-test-id="preview-iframe"]';

/**
 * Navigate to a specific Histoire story variant and wait for it to render.
 *
 * Histoire serves stories inside an iframe sandbox. This helper navigates
 * to the story URL and waits for the sandbox iframe content to be ready.
 */
export async function navigateToVariant(
  page: Page,
  storyId: string,
  variantIndex: number,
): Promise<void> {
  const variantId = `${storyId}-${variantIndex}`;
  const url = `/story/${storyId}?variantId=${variantId}`;

  await page.goto(url);

  // Wait for the Histoire sandbox iframe to render the component
  const iframe = page.frameLocator(IFRAME_SELECTOR);
  await iframe.locator('body').waitFor({ state: 'visible', timeout: 15_000 });

  // Allow CSS animations and transitions to settle before screenshotting
  await page.waitForTimeout(500);
}

/**
 * Take a screenshot of the sandbox iframe content (the rendered component only).
 */
export async function screenshotVariant(
  page: Page,
  name: string,
): Promise<void> {
  const iframe = page.frameLocator(IFRAME_SELECTOR);
  const body = iframe.locator('body');

  await body.waitFor({ state: 'visible' });
  await expect(body).toHaveScreenshot(`${name}.png`, {
    animations: 'disabled',
  });
}

/**
 * Convenience: navigate to a variant and screenshot it in one call.
 */
export async function testVariant(
  page: Page,
  storyId: string,
  variantIndex: number,
  screenshotName: string,
): Promise<void> {
  await navigateToVariant(page, storyId, variantIndex);
  await screenshotVariant(page, screenshotName);
}
