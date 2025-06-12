import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <p>Users page content goes here.</p>
    </div>
  )
}
