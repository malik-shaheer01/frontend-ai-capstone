export interface FormErrors {
  name?: string
  email?: string
}

export function validateName(name: string): string | undefined {
  if (name.trim().length === 0) return "Name is required."
  return undefined
}

export function validateEmail(email: string): string | undefined {
  if (email.trim().length === 0) return "Email is required."
  if (/\s/.test(email)) return "Email can't contain spaces."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address."
  return undefined
}

export function validateForm(name: string, email: string): FormErrors {
  const errors: FormErrors = {}
  const nameError = validateName(name)
  const emailError = validateEmail(email)
  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  return errors
}
