import { useState, useMemo } from "react";

export type JobStatus = "pending_approval" | "approved" | "rejected" | "published";
export type ContentFormat = "CARROSSEL" | "REEL" | "STORY";

export interface ContentJob {
  id: string;
  format: ContentFormat;
  pillar: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  status: JobStatus;
  created_at: string;
}

const MOCK_JOBS: ContentJob[] = [
  {
    id: "1",
    format: "CARROSSEL",
    pillar: "Treino",
    hook: "5 exercícios que vão transformar seu shape em 30 dias",
    caption: "Se você está cansado de treinar sem ver resultado, presta atenção nesses 5 exercícios que são verdadeiros divisores de água. Cada um deles foi escolhido com base na ciência do treinamento resistido e na experiência de mais de 10 anos na Fabrik.",
    hashtags: ["#fabrik", "#treino", "#fitness", "#shape", "#academia"],
    cta: "Salve esse post e comece amanhã 💪",
    status: "pending_approval",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    format: "REEL",
    pillar: "Nutrição",
    hook: "O café da manhã que está sabotando seus resultados",
    caption: "Você acha que está comendo saudável de manhã, mas esse combo clássico pode estar te atrapalhando. Veja o que trocar para acelerar sua evolução sem passar fome.",
    hashtags: ["#fabrik", "#nutrição", "#cafédamanhã", "#dieta"],
    cta: "Comenta CAFÉ que eu te mando o cardápio completo",
    status: "pending_approval",
    created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    format: "STORY",
    pillar: "Lifestyle",
    hook: "A rotina matinal de quem leva o shape a sério",
    caption: "Acordar cedo não é sobre sofrer. É sobre criar o ambiente perfeito pro seu corpo responder melhor aos estímulos do treino e da alimentação.",
    hashtags: ["#fabrik", "#rotina", "#lifestyle", "#disciplina"],
    cta: "Arrasta pra cima e veja a rotina completa",
    status: "pending_approval",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    format: "CARROSSEL",
    pillar: "Treino",
    hook: "Supino reto: o guia definitivo para peito grosso",
    caption: "O supino é rei, mas você está fazendo certo? Nesse carrossel eu mostro os 4 erros mais comuns e como corrigir cada um deles.",
    hashtags: ["#fabrik", "#supino", "#peito", "#musculação"],
    cta: "Marca aquele amigo que precisa ver isso",
    status: "approved",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    format: "REEL",
    pillar: "Motivação",
    hook: "Desistir não é opção quando você tem um porquê forte",
    caption: "Todo mundo passa por fases difíceis. A diferença está em quem encontra força no propósito.",
    hashtags: ["#fabrik", "#motivação", "#foco", "#disciplina"],
    cta: "Compartilha com quem precisa ouvir isso hoje",
    status: "rejected",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    format: "CARROSSEL",
    pillar: "Nutrição",
    hook: "3 snacks proteicos que cabem na bolsa",
    caption: "Praticidade é tudo. Esses 3 lanches têm mais de 20g de proteína e você prepara em menos de 5 minutos.",
    hashtags: ["#fabrik", "#proteína", "#snack", "#mealprep"],
    cta: "Salva pra fazer no domingo!",
    status: "published",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useJobs() {
  const [jobs, setJobs] = useState<ContentJob[]>(MOCK_JOBS);

  const pendingCount = useMemo(
    () => jobs.filter((j) => j.status === "pending_approval").length,
    [jobs]
  );

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  return { jobs, pendingCount, updateJobStatus };
}
