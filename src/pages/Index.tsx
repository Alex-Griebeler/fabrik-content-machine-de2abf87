import { useJobs, type ContentJob } from "@/hooks/useJobs";
import { QueueCard } from "@/components/QueueCard";

const QueuePage = () => {
  const { jobs, updateJobStatus } = useJobs();
  const pendingJobs = jobs.filter(
    (j) => j.status === "pending_approval"
  );

  return (
    <div>
      <h1 className="text-3xl font-serif mb-1">Fila de Aprovação</h1>
      <p className="text-muted-foreground mb-8">
        {pendingJobs.length} post{pendingJobs.length !== 1 ? "s" : ""} aguardando sua revisão
      </p>

      {pendingJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6">
            <span className="font-serif text-2xl text-brand">F</span>
          </div>
          <p className="text-muted-foreground text-lg">Nenhum post aguardando aprovação</p>
          <p className="text-muted-foreground text-sm mt-2">Novos posts aparecerão aqui automaticamente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingJobs.map((job, i) => (
            <div
              key={job.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <QueueCard
                job={job}
                onApprove={() => updateJobStatus(job.id, "approved")}
                onReject={() => updateJobStatus(job.id, "rejected")}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueuePage;
