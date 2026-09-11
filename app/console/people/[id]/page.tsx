import { rows } from '@/lib/hr/seed'
import { PersonProfileView } from './person-profile-view'

export function generateStaticParams() {
  return rows.map((r) => ({
    id: r.id,
  }))
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PersonProfileView id={id} />
}
