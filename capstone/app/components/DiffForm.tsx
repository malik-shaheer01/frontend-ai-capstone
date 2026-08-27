"use client"

import { useId, useState, type FormEvent } from "react"
import type { CommitMessage } from "@/lib/types"

type Status = "idle" | "loading" | "success" | "error"

export function DiffForm() {
  const [diff, setDiff] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<CommitMessage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const diffId = useId()
  const validationId = useId()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (diff.trim().length === 0) {
      setValidationError("Paste a diff first.")
      return
    }
    setValidationError(null)

    if (status === "loading") return // guard against double-submit

    setStatus("loading")
    setError(null)

    try {
      const response = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      })
      const result = await response.json()

      if (result.ok) {
        setMessage(result.message)
        setStatus("success")
      } else {
        setError(result.error ?? "Something went wrong.")
        setStatus("error")
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
      setStatus("error")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor={diffId}>Paste your git diff</label>
        <textarea
          id={diffId}
          rows={12}
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? validationId : undefined}
          placeholder={"diff --git a/src/foo.ts b/src/foo.ts\n..."}
        />
        {validationError && (
          <p id={validationId} role="alert">
            {validationError}
          </p>
        )}

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Composing…" : "Compose commit message"}
        </button>
      </form>

      <div aria-live="polite">
        {status === "error" && error && <p role="alert">{error}</p>}

        {status === "success" && message && (
          <div>
            <p>
              <strong>
                {message.type}
                {message.scope ? `(${message.scope})` : ""}:
              </strong>{" "}
              {message.subject}
            </p>
            {message.body && <p>{message.body}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
