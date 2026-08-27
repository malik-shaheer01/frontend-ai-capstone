import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DiffForm } from "./DiffForm"

describe("DiffForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("shows a validation error instead of submitting when the diff is empty", async () => {
    const user = userEvent.setup()
    render(<DiffForm />)

    await user.click(screen.getByRole("button", { name: "Compose commit message" }))

    expect(screen.getByRole("alert")).toHaveTextContent("Paste a diff first.")
    expect(fetch).not.toHaveBeenCalled()
  })

  it("renders the composed commit message on a successful response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        ok: true,
        message: { type: "fix", scope: "api", subject: "handle empty diffs", body: null },
      }),
    } as Response)

    const user = userEvent.setup()
    render(<DiffForm />)

    await user.type(screen.getByLabelText("Paste your git diff"), "diff --git a/x b/x")
    await user.click(screen.getByRole("button", { name: "Compose commit message" }))

    expect(await screen.findByText(/handle empty diffs/)).toBeInTheDocument()
    expect(screen.getByText(/fix/)).toBeInTheDocument()
  })

  it("shows the server's error message as an alert when the route reports failure", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ ok: false, error: "Rate limited by Groq. Wait a moment and try again." }),
    } as Response)

    const user = userEvent.setup()
    render(<DiffForm />)

    await user.type(screen.getByLabelText("Paste your git diff"), "diff --git a/x b/x")
    await user.click(screen.getByRole("button", { name: "Compose commit message" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("Rate limited by Groq")
  })

  it("shows a network error message when fetch itself rejects", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"))

    const user = userEvent.setup()
    render(<DiffForm />)

    await user.type(screen.getByLabelText("Paste your git diff"), "diff --git a/x b/x")
    await user.click(screen.getByRole("button", { name: "Compose commit message" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't reach the server")
  })

  it("disables the submit button while the request is in flight", async () => {
    let resolveFetch: (value: Response | PromiseLike<Response>) => void = () => {}
    vi.mocked(fetch).mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      }) as Promise<Response>
    )

    const user = userEvent.setup()
    render(<DiffForm />)

    await user.type(screen.getByLabelText("Paste your git diff"), "diff --git a/x b/x")
    await user.click(screen.getByRole("button", { name: "Compose commit message" }))

    expect(screen.getByRole("button", { name: "Composing…" })).toBeDisabled()

    resolveFetch({ json: async () => ({ ok: false, error: "done" }) } as Response)
  })
})
