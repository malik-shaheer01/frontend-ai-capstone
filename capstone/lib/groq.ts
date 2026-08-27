import type { ComposeResult } from "./types"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "openai/gpt-oss-120b"

const SYSTEM_PROMPT = `You write Conventional Commit messages from a git diff.
Respond with ONLY a JSON object, no prose, matching exactly this shape:
{"type": "feat|fix|docs|style|refactor|test|chore", "scope": string or null, "subject": string (max 72 chars, imperative mood, no trailing period), "body": string or null (1-3 sentences explaining why, or null if the diff is trivial)}`

/**
 * Calls Groq's OpenAI-compatible chat completions API. Network/HTTP failures
 * and malformed model output are both normal, expected outcomes here, not
 * exceptions — callers (the route handler, tests) branch on `ComposeResult`
 * rather than catching thrown errors.
 */
export async function composeCommitMessage(diff: string): Promise<ComposeResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return { ok: false, error: "Server is missing a Groq API key." }
  }

  let response: Response
  try {
    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: diff },
        ],
      }),
    })
  } catch {
    return { ok: false, error: "Couldn't reach Groq. Check your connection and try again." }
  }

  if (response.status === 429) {
    return { ok: false, error: "Rate limited by Groq. Wait a moment and try again." }
  }
  if (!response.ok) {
    return { ok: false, error: `Groq returned an error (${response.status}).` }
  }

  const data: unknown = await response.json()
  return parseCommitMessage(extractContent(data))
}

function extractContent(data: unknown): unknown {
  if (typeof data !== "object" || data === null || !("choices" in data)) return undefined
  const choices = (data as { choices: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return undefined
  const first: unknown = choices[0]
  if (typeof first !== "object" || first === null || !("message" in first)) return undefined
  const message = (first as { message: unknown }).message
  if (typeof message !== "object" || message === null || !("content" in message)) return undefined
  return (message as { content: unknown }).content
}

/** Exported separately so its parsing/validation logic is unit-testable without a network call. */
export function parseCommitMessage(raw: unknown): ComposeResult {
  if (typeof raw !== "string") {
    return { ok: false, error: "Groq returned an unexpected response shape." }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: "Groq didn't return valid JSON." }
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "Groq's response wasn't a JSON object." }
  }

  const candidate = parsed as Record<string, unknown>
  if (typeof candidate.type !== "string" || typeof candidate.subject !== "string") {
    return { ok: false, error: "Groq's response was missing required fields." }
  }

  return {
    ok: true,
    message: {
      type: candidate.type,
      subject: candidate.subject,
      scope: typeof candidate.scope === "string" && candidate.scope.length > 0 ? candidate.scope : null,
      body: typeof candidate.body === "string" && candidate.body.length > 0 ? candidate.body : null,
    },
  }
}
