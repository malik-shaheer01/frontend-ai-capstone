import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ChatThread } from "./ChatThread"
import * as chatApi from "../lib/chat"

// Mock the AI route module — no test here ever makes a real call.
vi.mock("../lib/chat")

describe("ChatThread", () => {
  it("sends a message and renders the mocked assistant reply", async () => {
    vi.mocked(chatApi.sendMessage).mockResolvedValue({
      id: "assistant-1",
      role: "assistant",
      status: "complete",
      parts: [{ type: "text", text: "Echo: hi there" }],
    })

    const user = userEvent.setup()
    render(<ChatThread />)

    await user.type(screen.getByLabelText("Message"), "hi there")
    await user.click(screen.getByRole("button", { name: "Send" }))

    expect(await screen.findByText("Echo: hi there")).toBeInTheDocument()
    expect(chatApi.sendMessage).toHaveBeenCalledWith("hi there")
  })

  it("shows an error state when the mocked route rejects", async () => {
    vi.mocked(chatApi.sendMessage).mockRejectedValue(new Error("Rate limited"))

    const user = userEvent.setup()
    render(<ChatThread />)

    await user.type(screen.getByLabelText("Message"), "hello")
    await user.click(screen.getByRole("button", { name: "Send" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("Rate limited")
  })
})
