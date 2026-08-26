import { useId, useState, type FormEvent } from "react"
import { validateForm, type FormErrors } from "../lib/validation"

interface SettingsFormProps {
  onSaved?: (values: { name: string; email: string }) => void
}

export function SettingsForm({ onSaved }: SettingsFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [saved, setSaved] = useState(false)

  const nameId = useId()
  const emailId = useId()
  const nameErrorId = useId()
  const emailErrorId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(false)

    const nextErrors = validateForm(name, email)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaved(true)
    onSaved?.({ name, email })
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Account settings">
      <div>
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? nameErrorId : undefined}
        />
        {errors.name && (
          <p id={nameErrorId} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? emailErrorId : undefined}
        />
        {errors.email && (
          <p id={emailErrorId} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <button type="submit">Save</button>
      {saved && <p role="status">Saved!</p>}
    </form>
  )
}
