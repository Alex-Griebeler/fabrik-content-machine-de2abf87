import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Camera, Loader2 } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { toast } from "sonner";

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const { jobs, loading, updateJobStatus } = useJobs();

  const job = jobs.find((j) => j.id === jobId);

  const [hook, setHook] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [cta, setCta] = useState("");

  useEffect(() => {
    if (job) {
      setHook(job.hook);
      setCaption(job.caption);
      setHashtags(job.hashtags?.join(" ") ?? "");
      setCta(job.cta);
    }
  }, [job]);

  const handleSaveApprove = async () => {
    if (!jobId) return;
    await updateJobStatus(jobId, "approved");
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
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Caption</label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} className="bg-input border-border text-foreground resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Hashtags</label>
            <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="bg-input border-border text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">CTA</label>
            <Input value={cta} onChange={(e) => setCta(e.target.value)} className="bg-input border-border text-foreground" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveApprove} className="bg-brand hover:bg-brand-hover text-primary-foreground flex-1">
              Salvar e Aprovar
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </div>
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
            <p className="text-sm text-muted-foreground line-clamp-3">{caption}</p>
            <button className="text-xs text-muted-foreground hover:text-foreground">ver mais</button>
            <p className="text-xs text-brand">{hashtags}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
