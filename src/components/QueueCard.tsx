import { type ContentJob } from "@/hooks/useJobs";
import { FormatBadge } from "./FormatBadge";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface QueueCardProps {
  job: ContentJob;
  onApprove: () => void;
  onReject: () => void;
}

export function QueueCard({ job, onApprove, onReject }: QueueCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-brand transition-colors group">
      <div className="flex items-center gap-2 mb-3">
        <FormatBadge format={job.format} />
        <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-medium">
          {job.pilar}
        </span>
        {job.scheduled_at && (
          <span className="ml-auto text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(job.scheduled_at), { addSuffix: true, locale: ptBR })}
          </span>
        )}
      </div>

      <h2 className="text-lg font-serif text-foreground mb-2 leading-snug">{job.hook}</h2>

      <div className="mb-3">
        <p className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}>
          {job.body}
        </p>
        {job.body && job.body.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-brand hover:underline mt-1"
          >
            {expanded ? "ver menos" : "ver mais"}
          </button>
        )}
      </div>

      {job.closing && (
        <p className="text-sm text-foreground mb-3">
          <span className="text-muted-foreground text-xs mr-1">Fechamento:</span>
          {job.closing}
        </p>
      )}

      <p className="text-sm text-foreground mb-4">
        <span className="text-muted-foreground text-xs mr-1">CTA:</span>
        {job.cta}
      </p>

      <div className="flex gap-2">
        <Button
          onClick={onApprove}
          size="sm"
          className="bg-brand hover:bg-brand-hover text-primary-foreground"
        >
          <Check className="w-4 h-4 mr-1" /> Aprovar
        </Button>
        <Button
          onClick={onReject}
          size="sm"
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <X className="w-4 h-4 mr-1" /> Rejeitar
        </Button>
        <Button
          onClick={() => navigate(`/editor?jobId=${job.id}`)}
          size="sm"
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-4 h-4 mr-1" /> Editar
        </Button>
      </div>
    </div>
  );
}
