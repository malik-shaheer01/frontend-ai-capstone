import { DiffForm } from "./components/DiffForm"

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">Commit Message Composer</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Paste a <code>git diff</code>, get back a properly-formatted{" "}
        <a
          href="https://www.conventionalcommits.org/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Conventional Commit
        </a>{" "}
        message.
      </p>
      <div className="mt-8">
        <DiffForm />
      </div>
    </main>
  )
}
