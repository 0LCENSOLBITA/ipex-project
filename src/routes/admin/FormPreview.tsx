import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/FormPreview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/FormPreview"!</div>
}
