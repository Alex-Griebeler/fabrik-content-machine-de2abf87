import { NavLink } from "react-router-dom";
import { Clock, List, Plus, Settings } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";

const navItems = [
  { to: "/", label: "Fila", icon: Clock, hasBadge: true },
  { to: "/history", label: "Histórico", icon: List },
  { to: "/input", label: "Novo Input", icon: Plus },
  { to: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const { pendingCount } = useJobs();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-sidebar border-r border-border z-30">
      <div className="px-6 py-8">
        <h1 className="font-serif text-2xl tracking-tight text-foreground">
          <span className="text-brand">F</span>ABRIK
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">Content Machine</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.hasBadge && pendingCount > 0 && (
              <span className="ml-auto bg-brand/20 text-brand text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
            AG
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Alex Griebeler</p>
            <p className="text-xs text-muted-foreground">@alexgriebeler</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
