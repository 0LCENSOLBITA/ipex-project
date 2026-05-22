import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/CreateUserModal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/CreateUserModal"!</div>
}
