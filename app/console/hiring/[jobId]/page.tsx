import { jobs } from '@/lib/data'
import { PipelineView } from './pipeline-view'

export function generateStaticParams() {
  return jobs.map((j) => ({
    jobId: j.id,
  }))
}

export default async function JobPipelinePage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  return <PipelineView jobId={jobId} />
}
