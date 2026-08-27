import { describe, expect, it } from "vitest"
import { composeCommitMessage } from "./groq"

/**
 * Real call against Groq's live API — no mocking. Skipped automatically when
 * GROQ_API_KEY isn't set (e.g. in CI), so it never blocks the pipeline on a
 * live credential, but it's the one thing in this suite that actually proves
 * the integration works end to end rather than "matches what the docs say."
 */
describe.skipIf(!process.env.GROQ_API_KEY)("composeCommitMessage (live Groq call)", () => {
  it("returns a valid Conventional Commit message for a real diff", async () => {
    const diff = `diff --git a/lib/groq.ts b/lib/groq.ts
--- a/lib/groq.ts
+++ b/lib/groq.ts
@@ -1,3 +1,3 @@
-export async function composeCommitMessage(diff: string) {
+export async function composeCommitMessage(diff: string): Promise<ComposeResult> {
   // ...
 }`

    const result = await composeCommitMessage(diff)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(typeof result.message.type).toBe("string")
      expect(result.message.type.length).toBeGreaterThan(0)
      expect(typeof result.message.subject).toBe("string")
      expect(result.message.subject.length).toBeGreaterThan(0)
    }
  }, 15_000)
})
