export interface CommitMessage {
  type: string
  scope: string | null
  subject: string
  body: string | null
}

export type ComposeResult =
  | { ok: true; message: CommitMessage }
  | { ok: false; error: string }
