import { expect, test } from "@playwright/test"

test("sending a chat message shows the reply end to end", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Message").fill("What's the weather like?")
  await page.getByRole("button", { name: "Send" }).click()

  // The user's own message appears immediately.
  await expect(page.getByText("What's the weather like?")).toBeVisible()

  // The assistant reply streams in from the real (non-mocked) fake API.
  await expect(page.getByText("Echo: What's the weather like?")).toBeVisible({ timeout: 5000 })
})
