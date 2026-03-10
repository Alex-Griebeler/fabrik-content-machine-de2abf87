const formatConfig: Record<string, { label: string; className: string }> = {
  CARROSSEL: { label: "Carrossel", className: "bg-blue-500/10 text-blue-400" },
  REEL: { label: "Reel", className: "bg-purple-500/10 text-purple-400" },
  STORY: { label: "Story", className: "bg-amber-500/10 text-amber-400" },
};

const fallback = { label: "", className: "bg-muted text-muted-foreground" };

export function FormatBadge({ format }: { format: string }) {
  const upper = format?.toUpperCase() ?? "";
  const config = formatConfig[upper] ?? { ...fallback, label: format || "—" };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
