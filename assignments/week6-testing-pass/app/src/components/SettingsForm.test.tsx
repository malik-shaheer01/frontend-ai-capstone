import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SettingsForm } from "./SettingsForm"

describe("SettingsForm", () => {
  it("shows validation errors instead of saving on an empty submit", async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByText("Name is required.")).toBeInTheDocument()
    expect(screen.getByText("Email is required.")).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("rejects an email missing an @ without saving", async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Shaheer")
    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument()
  })

  it("marks the invalid field with aria-invalid for assistive tech", async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("aria-invalid", "true")
  })

  it("saves and calls onSaved when both fields are valid", async () => {
    const user = userEvent.setup()
    const onSaved = vi.fn()
    render(<SettingsForm onSaved={onSaved} />)

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Shaheer Nawaz")
    await user.type(screen.getByLabelText("Email"), "shaheer@example.com")
    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByRole("status")).toHaveTextContent("Saved!")
    expect(onSaved).toHaveBeenCalledWith({ name: "Shaheer Nawaz", email: "shaheer@example.com" })
  })
})
