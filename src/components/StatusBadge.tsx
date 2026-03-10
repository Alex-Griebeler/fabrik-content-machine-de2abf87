import { type JobStatus } from "@/hooks/useJobs";

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  pending_approval: { label: "Pendente", className: "bg-amber-500/10 text-amber-400" },
  approved: { label: "Aprovado", className: "bg-emerald-500/10 text-emerald-400" },
  rejected: { label: "Rejeitado", className: "bg-red-500/10 text-red-400" },
  published: { label: "Publicado", className: "bg-blue-500/10 text-blue-400" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  );
}
