import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("home page has no automatically-detectable WCAG 2.1 A/AA violations", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})
