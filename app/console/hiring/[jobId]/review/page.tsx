import { jobs } from '@/lib/data'
import { RecruiterSwipeView } from './recruiter-swipe-view'

export function generateStaticParams() {
  return jobs.map((j) => ({
    jobId: j.id,
  }))
}

export default async function RecruiterReviewPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  return <RecruiterSwipeView jobId={jobId} />
}
