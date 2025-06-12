import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p>Analytics page content goes here.</p>
    </div>
  )
}
