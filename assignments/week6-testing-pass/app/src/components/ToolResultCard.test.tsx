import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ToolResultCard } from "./ToolResultCard"

describe("ToolResultCard", () => {
  it("lists each field of a successful result", () => {
    render(
      <ToolResultCard
        toolName="get_weather"
        result={{ status: "success", data: { city: "Lahore", temp: "24C" } }}
      />
    )
    expect(screen.getByText("Lahore")).toBeInTheDocument()
    expect(screen.getByText("24C")).toBeInTheDocument()
  })

  it("announces a failed result as an alert naming the tool", () => {
    render(
      <ToolResultCard toolName="get_weather" result={{ status: "error", message: "City not found" }} />
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("get_weather failed")
    expect(alert).toHaveTextContent("City not found")
  })
})
