import { rows } from '@/lib/hr/seed'
import { PersonProfileView } from './person-profile-view'

export function generateStaticParams() {
  const seeded = rows.map((r) => ({ id: r.id }))
  // Pre-generate slots for newly hired employees (e26 to e50) so direct links never 404 in static export
  const extra = Array.from({ length: 25 }, (_, i) => ({
    id: `e${String(26 + i).padStart(2, '0')}`,
  }))
  return [...seeded, ...extra]
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PersonProfileView id={id} />
}
