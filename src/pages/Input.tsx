import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

type InputTab = "text" | "youtube" | "file";

const InputPage = () => {
  const [tab, setTab] = useState<InputTab>("text");
  const [textContent, setTextContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    toast.success("Conteúdo enviado para geração!");
    setTextContent("");
    setYoutubeUrl("");
  };

  const tabClass = (t: InputTab) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      tab === t
        ? "bg-brand text-primary-foreground"
        : "bg-surface text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-1">Novo Conteúdo</h1>
      <p className="text-muted-foreground mb-8">Envie o conteúdo base para geração de posts</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("text")} className={tabClass("text")}>Texto</button>
        <button onClick={() => setTab("youtube")} className={tabClass("youtube")}>YouTube</button>
        <button onClick={() => setTab("file")} className={tabClass("file")}>Arquivo</button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        {tab === "text" && (
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={8}
            placeholder="Cole aqui o texto, transcrição, artigo ou qualquer conteúdo que servirá de base para os posts..."
            className="bg-input border-border text-foreground resize-none placeholder:text-muted-foreground"
          />
        )}

        {tab === "youtube" && (
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-input border-border text-foreground"
          />
        )}

        {tab === "file" && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-brand/50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">Arraste e solte seu arquivo aqui</p>
            <p className="text-sm text-muted-foreground mt-1">PDF, TXT, DOCX até 10MB</p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full bg-brand hover:bg-brand-hover text-primary-foreground text-base py-6 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Gerando conteúdo...
            </>
          ) : (
            "Gerar Conteúdo"
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputPage;
