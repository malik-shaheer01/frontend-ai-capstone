import { expect, test } from "@playwright/test"

test("composing a commit message from a pasted diff shows the result", async ({ page }) => {
  // Intercept the API route so this test never depends on a real Groq key or network call.
  await page.route("**/api/compose", async (route) => {
    await route.fulfill({
      json: {
        ok: true,
        message: {
          type: "feat",
          scope: "compose",
          subject: "add commit message composer",
          body: "Writing good commit messages by hand is slow and inconsistent.",
        },
      },
    })
  })

  await page.goto("/")

  await page.getByLabel("Paste your git diff").fill("diff --git a/app/page.tsx b/app/page.tsx\n+ ...")
  await page.getByRole("button", { name: "Compose commit message" }).click()

  await expect(page.getByText("add commit message composer")).toBeVisible()
  await expect(page.getByText(/feat/)).toBeVisible()
})

test("an empty submission shows a validation error and never calls the API", async ({ page }) => {
  let apiCalled = false
  await page.route("**/api/compose", async (route) => {
    apiCalled = true
    await route.fulfill({ json: { ok: false, error: "should not be called" } })
  })

  await page.goto("/")
  await page.getByRole("button", { name: "Compose commit message" }).click()

  await expect(page.getByText("Paste a diff first.")).toBeVisible()
  expect(apiCalled).toBe(false)
})
