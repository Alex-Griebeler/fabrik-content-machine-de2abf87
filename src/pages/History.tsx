import { useState } from "react";
import { useJobs, type JobStatus } from "@/hooks/useJobs";
import { FormatBadge } from "@/components/FormatBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FilterTab = "all" | "approved" | "rejected" | "published";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "approved", label: "Aprovados" },
  { key: "rejected", label: "Rejeitados" },
  { key: "published", label: "Publicados" },
];

const HistoryPage = () => {
  const { jobs, loading } = useJobs();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div>
      <h1 className="text-3xl font-serif mb-1">Histórico</h1>
      <p className="text-muted-foreground mb-6">Todos os conteúdos gerados</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-brand text-primary-foreground"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((job, i) => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-brand transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{job.hook}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FormatBadge format={job.format} />
                  {job.scheduled_at && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(job.scheduled_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={job.status} />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJobId(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{selectedJob?.hook}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 mt-2">
              <div className="flex gap-2">
                <FormatBadge format={selectedJob.format} />
                <StatusBadge status={selectedJob.status} />
                <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full">{selectedJob.pilar}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Corpo</p>
                <p className="text-sm text-foreground">{selectedJob.body}</p>
              </div>
              {selectedJob.closing && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fechamento</p>
                  <p className="text-sm text-foreground">{selectedJob.closing}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">CTA</p>
                <p className="text-sm text-foreground">{selectedJob.cta}</p>
              </div>
              {selectedJob.visual_notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notas visuais</p>
                  <p className="text-sm text-foreground">{selectedJob.visual_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
