import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events')({
  component: EventsPage
})

function EventsPage() {
  return (
    <div className="p-4">
      <h1>Events Page</h1>
      <p>This is the placeholder for the Events section. You can build out the CMS and blog features here.</p>
    </div>
  )
}
