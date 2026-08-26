import { useState } from "react"
import { Modal } from "./components/custom/Modal"
import { Tabs } from "./components/custom/Tabs"
import { Disclosure } from "./components/custom/Disclosure"
import { Button } from "./components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs"

const tabItems = [
  { id: "profile", label: "Profile", panel: "Profile settings go here." },
  { id: "billing", label: "Billing", panel: "Billing details go here." },
  { id: "team", label: "Team", panel: "Team member list goes here." },
]

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="mx-auto max-w-2xl space-y-10 p-6">
      <h1 className="text-xl font-semibold text-neutral-900">
        FE-04: Accessible Component Fundamentals
      </h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-neutral-900">
          1. Modal dialog (hand-built)
        </h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          Open modal
        </button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          titleId="custom-modal-title"
          title="Delete item"
        >
          <p className="mb-4 text-sm text-neutral-600">
            This can't be undone. Are you sure you want to delete this item?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-neutral-900">
          2. Tabs (hand-built)
        </h2>
        <Tabs label="Account settings" items={tabItems} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-neutral-900">
          3. Disclosure (hand-built)
        </h2>
        <Disclosure label="What is a disclosure widget?">
          A disclosure is a button that shows or hides a section of content.
          Its state is exposed with aria-expanded.
        </Disclosure>
        <Disclosure label="Why build these by hand first?">
          Because reviewing AI-generated components requires knowing what
          correct keyboard behavior and ARIA wiring actually look like.
        </Disclosure>
      </section>

      <hr className="border-neutral-200" />

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-neutral-900">
          shadcn/ui comparison — Dialog
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open shadcn dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete item</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This can't be undone. Are you sure you want to delete this item?
            </p>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-neutral-900">
          shadcn/ui comparison — Tabs
        </h2>
        <ShadcnTabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">Profile settings go here.</TabsContent>
          <TabsContent value="billing">Billing details go here.</TabsContent>
          <TabsContent value="team">Team member list goes here.</TabsContent>
        </ShadcnTabs>
      </section>
    </main>
  )
}

export default App
