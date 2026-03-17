import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Camera, Loader2 } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { Save } from "lucide-react";
import { toast } from "sonner";

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const { jobs, loading, updateJobStatus, updateJobContent } = useJobs();
  const [saving, setSaving] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  const [hook, setHook] = useState("");
  const [body, setBody] = useState("");
  const [closing, setClosing] = useState("");
  const [cta, setCta] = useState("");
  const [visualNotes, setVisualNotes] = useState("");

  useEffect(() => {
    if (job) {
      setHook(job.hook);
      setBody(job.body);
      setClosing(job.closing);
      setCta(job.cta);
      setVisualNotes(job.visual_notes);
    }
  }, [job]);

  const handleSaveDraft = async () => {
    if (!jobId) return;
    setSaving(true);
    const ok = await updateJobContent(jobId, { hook, body, closing, cta, visual_notes: visualNotes });
    setSaving(false);
    if (ok) {
      toast.success("Rascunho salvo com sucesso!");
    } else {
      toast.error("Erro ao salvar rascunho.");
    }
  };

  const handleSaveApprove = async () => {
    if (!jobId) return;
    setSaving(true);
    await updateJobContent(jobId, { hook, body, closing, cta, visual_notes: visualNotes });
    await updateJobStatus(jobId, "approved");
    setSaving(false);
    toast.success("Post aprovado com sucesso!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg">Job não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-1">Editor</h1>
      <p className="text-muted-foreground mb-8">
        Editando job #{jobId?.slice(0, 8)}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Hook</label>
            <Input value={hook} onChange={(e) => setHook(e.target.value)} className="bg-input border-border text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Corpo do post</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="bg-input border-border text-foreground resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Fechamento</label>
            <Textarea value={closing} onChange={(e) => setClosing(e.target.value)} rows={2} className="bg-input border-border text-foreground resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">CTA</label>
            <Input value={cta} onChange={(e) => setCta(e.target.value)} className="bg-input border-border text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Notas visuais</label>
            <Textarea value={visualNotes} onChange={(e) => setVisualNotes(e.target.value)} rows={2} className="bg-input border-border text-foreground resize-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveDraft} variant="outline" disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Salvando..." : "Salvar Rascunho"}
            </Button>
            <Button onClick={handleSaveApprove} disabled={saving} className="bg-brand hover:bg-brand-hover text-primary-foreground flex-1">
              {saving ? "Salvando..." : "Salvar e Aprovar"}
            </Button>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground mt-2 w-full" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 h-fit">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Preview Instagram</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-xs font-bold text-primary-foreground">AG</div>
            <span className="text-sm font-medium text-foreground">@alexgriebeler</span>
          </div>
          <div className="aspect-square rounded-lg bg-gradient-to-br from-brand/40 to-background flex items-center justify-center mb-4">
            <Camera className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-foreground font-medium">{hook}</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{body}</p>
            {closing && <p className="text-sm text-muted-foreground italic">{closing}</p>}
            <button className="text-xs text-muted-foreground hover:text-foreground">ver mais</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
