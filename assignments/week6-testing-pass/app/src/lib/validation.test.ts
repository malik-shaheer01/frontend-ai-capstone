import { describe, expect, it } from "vitest"
import { validateEmail, validateForm, validateName } from "./validation"

describe("validateName", () => {
  it("rejects empty and whitespace-only names", () => {
    expect(validateName("")).toBeDefined()
    expect(validateName("   ")).toBeDefined()
  })

  it("accepts a real name", () => {
    expect(validateName("Shaheer")).toBeUndefined()
  })
})

describe("validateEmail", () => {
  it("rejects missing @, missing domain, and spaces", () => {
    expect(validateEmail("shaheer")).toBeDefined()
    expect(validateEmail("shaheer@example")).toBeDefined()
    expect(validateEmail("shaheer @example.com")).toBeDefined()
  })

  it("accepts a valid address", () => {
    expect(validateEmail("shaheer@example.com")).toBeUndefined()
  })
})

describe("validateForm", () => {
  it("returns both errors independently", () => {
    const errors = validateForm("", "")
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
  })

  it("returns no errors for valid input", () => {
    expect(validateForm("Shaheer", "shaheer@example.com")).toEqual({})
  })
})
