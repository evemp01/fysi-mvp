import { Activity, Settings } from "lucide-react";
import { Link, NavLink, useMatch } from "react-router";
import { Button } from "@/components/ui/button";
import { PatientSwitcher } from "./PatientSwitcher";

const ROLES = [
  { to: "/patient", long: "Patientapp", short: "Patient" },
  { to: "/fysio", long: "Fysioterapeut", short: "Fysio" },
  { to: "/feedback", long: "Ge feedback", short: "Feedback" },
];

export function Header() {
  const patientRoute = useMatch("/patient/:patientId/*");
  return (
    <header className="sticky top-0 z-20 flex flex-nowrap items-center gap-1.5 border-b bg-card px-2.5 py-1.5 sm:gap-x-4 sm:px-[max(3vw,16px)] sm:py-2">
      <Link to="/" className="flex items-center gap-2 text-[1.4rem] font-extrabold tracking-[-0.03em] text-brand">
        <span className="grid size-8 place-items-center rounded-[9px] bg-hero">
          <Activity className="size-5 text-white" strokeWidth={2.4} />
        </span>
        <span className="hidden sm:inline">Fysi</span>
      </Link>
      <nav aria-label="Välj vy" className="flex flex-nowrap gap-1 rounded-[14px] bg-background p-0.75 sm:p-1">
        {ROLES.map((r) => (
          <Button key={r.to} asChild variant="ghost" size="sm" className="min-h-10 rounded-[10px] border-0 px-1.75 text-[.88rem] aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground sm:min-h-11 sm:px-3.5 sm:text-base">
            <NavLink to={r.to}>
              <span className="hidden sm:inline">{r.long}</span>
              <span className="sm:hidden">{r.short}</span>
            </NavLink>
          </Button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        {patientRoute?.params.patientId && <PatientSwitcher patientId={patientRoute.params.patientId} />}
        <Button asChild variant="ghost" size="icon" className="size-10 border-0 bg-transparent sm:size-11" aria-label="Inställningar">
          <NavLink to="/settings" className="aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand">
            <Settings />
          </NavLink>
        </Button>
      </div>
    </header>
  );
}
