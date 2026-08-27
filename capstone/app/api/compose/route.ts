import { composeCommitMessage } from "@/lib/groq"

const MAX_DIFF_LENGTH = 12_000

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: "Request body must be JSON." }, { status: 400 })
  }

  const diff =
    typeof body === "object" && body !== null && "diff" in body
      ? (body as { diff: unknown }).diff
      : undefined

  if (typeof diff !== "string" || diff.trim().length === 0) {
    return Response.json({ ok: false, error: "Paste a diff first." }, { status: 400 })
  }

  if (diff.length > MAX_DIFF_LENGTH) {
    return Response.json(
      { ok: false, error: `Diff is too long (max ${MAX_DIFF_LENGTH} characters).` },
      { status: 400 }
    )
  }

  const result = await composeCommitMessage(diff)
  if (!result.ok) {
    return Response.json(result, { status: 502 })
  }
  return Response.json(result, { status: 200 })
}
