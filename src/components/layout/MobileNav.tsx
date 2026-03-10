import { NavLink } from "react-router-dom";
import { Clock, List, Plus, Settings } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";

const navItems = [
  { to: "/", label: "Fila", icon: Clock, hasBadge: true },
  { to: "/history", label: "Histórico", icon: List },
  { to: "/input", label: "Novo", icon: Plus },
  { to: "/settings", label: "Config", icon: Settings },
];

export function MobileNav() {
  const { pendingCount } = useJobs();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-border z-30 flex justify-around py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors relative ${
              isActive ? "text-brand" : "text-muted-foreground"
            }`
          }
        >
          <div className="relative">
            <item.icon className="w-5 h-5" />
            {item.hasBadge && pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
