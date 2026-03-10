

## Problema

O código atual assume colunas que não existem nas tabelas externas. Precisa alinhar com o schema real:

**content_jobs (externo):** `id`, `input_id`, `format`, `pilar`, `status`, `scheduled_at`, `approved_at`
- Não tem: `created_at`, `updated_at`, `input_type`, `raw_content`, `hook`, `caption`, `hashtags`, `cta`, `pillar`

**content_outputs (externo):** `job_id`, `hook`, `body`, `closing`, `visual_notes`, `cta`, `gatilho`, `pilar`
- Não tem: `id`, `caption`, `hashtags`, `format`, `created_at`, `pillar`, `trigger`

**Lovable Cloud content_jobs** (tabela interna, separada) tem schema diferente -- não é usada.

## Plano

### 1. `src/hooks/useJobs.ts` — Reescrever interfaces e merge

- **ContentOutput**: campos `job_id`, `hook`, `body`, `closing`, `visual_notes`, `cta`, `gatilho`, `pilar`
- **ContentJob**: campos do job (`id`, `input_id`, `format`, `pilar`, `status`, `scheduled_at`, `approved_at`) + campos do primeiro output para conveniência (`hook`, `body`, `closing`, `visual_notes`, `cta`, `gatilho`)
- Remover `ContentFormat` type (format vem como text livre do job)
- `mergeJobWithOutput`: mapear campos corretos, usar `body` em vez de `caption`
- Remover `hashtags` de tudo
- Ordenar por `scheduled_at` desc se disponível

### 2. `src/components/FormatBadge.tsx` — Aceitar string genérica

- Mudar prop de `ContentFormat` para `string`
- Manter mapeamento visual mas com fallback para formatos desconhecidos

### 3. `src/components/QueueCard.tsx` — Ajustar campos

- `job.caption` → `job.body`
- `job.pillar` → `job.pilar`
- `job.created_at` → `job.scheduled_at`
- Remover bloco de hashtags
- Adicionar `closing` e `visual_notes` se disponíveis

### 4. `src/pages/History.tsx` — Ajustar campos

- `job.created_at` → `job.scheduled_at`
- `job.pillar` → `job.pilar`
- `job.caption` → `job.body`
- Remover hashtags do dialog
- Adicionar `closing` no dialog

### 5. `src/pages/Editor.tsx` — Ajustar campos

- Remover campo hashtags
- `caption` → `body` (label "Corpo do post")
- Adicionar campos `closing` e `visual_notes`
- Preview: mostrar body em vez de caption, remover hashtags

### Resumo de mapeamento

| Código atual | Campo real |
|---|---|
| `caption` | `body` (da content_outputs) |
| `pillar` | `pilar` (da content_jobs E content_outputs) |
| `trigger` | `gatilho` (da content_outputs) |
| `created_at` | `scheduled_at` (da content_jobs) |
| `hashtags` | **removido** — não existe |
| `format` | `format` (da content_jobs, text livre) |
| `raw_content` | **removido** |
| `input_type` | `input_id` (uuid) |

