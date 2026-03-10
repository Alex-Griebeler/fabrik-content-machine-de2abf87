import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  name: string;
  description: string;
  connected: boolean;
  comingSoon?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { name: "Instagram API", description: "Publicação automática de posts", connected: true },
  { name: "Telegram Bot", description: "Notificações e aprovação rápida", connected: true },
  { name: "Supabase", description: "Banco de dados e armazenamento", connected: true },
  { name: "HeyGen", description: "Geração de vídeos com IA", connected: false, comingSoon: true },
];

const SettingsPage = () => {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTesting(false);
    toast.success("Todas as conexões estão funcionando!");
  };

  return (
    <div>
      <h1 className="text-3xl font-serif mb-1">Configurações</h1>
      <p className="text-muted-foreground mb-8">Gerencie suas integrações e conta</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {INTEGRATIONS.map((integration) => (
          <div
            key={integration.name}
            className="bg-card border border-border rounded-xl p-5 hover:border-brand transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-foreground font-medium">{integration.name}</h3>
              {integration.comingSoon ? (
                <span className="text-xs bg-surface text-muted-foreground px-2 py-1 rounded-full">
                  Em breve
                </span>
              ) : integration.connected ? (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" /> Conectado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                  <X className="w-3 h-3" /> Desconectado
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h3 className="text-foreground font-medium mb-3">Informações da Conta</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account ID Instagram</span>
            <span className="text-foreground font-mono">@alexgriebeler</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telegram Bot</span>
            <span className="text-foreground font-mono">@fabrik_content_bot</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleTest}
        disabled={testing}
        className="bg-brand hover:bg-brand-hover text-primary-foreground"
      >
        {testing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Testando conexões...
          </>
        ) : (
          "Testar conexões"
        )}
      </Button>
    </div>
  );
};

export default SettingsPage;
