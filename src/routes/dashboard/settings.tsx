import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p>Settings page content goes here.</p>
    </div>
  )
}
