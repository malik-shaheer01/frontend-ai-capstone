import { ChatThread } from "./components/ChatThread"
import { SettingsForm } from "./components/SettingsForm"

function App() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>FE-06B: Testing Pass</h1>

      <section>
        <h2>Chat</h2>
        <ChatThread />
      </section>

      <section>
        <h2>Account settings</h2>
        <SettingsForm />
      </section>
    </main>
  )
}

export default App
