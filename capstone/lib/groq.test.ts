import { describe, expect, it } from "vitest"
import { parseCommitMessage } from "./groq"

describe("parseCommitMessage", () => {
  it("parses a complete, well-formed response", () => {
    const result = parseCommitMessage(
      JSON.stringify({
        type: "feat",
        scope: "auth",
        subject: "add password reset flow",
        body: "Users had no way to recover a lost password.",
      })
    )
    expect(result).toEqual({
      ok: true,
      message: {
        type: "feat",
        scope: "auth",
        subject: "add password reset flow",
        body: "Users had no way to recover a lost password.",
      },
    })
  })

  it("defaults scope and body to null when absent", () => {
    const result = parseCommitMessage(JSON.stringify({ type: "chore", subject: "bump deps" }))
    expect(result).toEqual({
      ok: true,
      message: { type: "chore", scope: null, subject: "bump deps", body: null },
    })
  })

  it("rejects a response missing the required subject field", () => {
    const result = parseCommitMessage(JSON.stringify({ type: "fix" }))
    expect(result.ok).toBe(false)
  })

  it("rejects malformed JSON instead of throwing", () => {
    const result = parseCommitMessage("not json at all")
    expect(result).toEqual({ ok: false, error: "Groq didn't return valid JSON." })
  })

  it("rejects a non-string payload instead of throwing", () => {
    const result = parseCommitMessage(undefined)
    expect(result.ok).toBe(false)
  })
})
