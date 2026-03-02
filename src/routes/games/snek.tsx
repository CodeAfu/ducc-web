import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/snek')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/snek"!</div>
}
