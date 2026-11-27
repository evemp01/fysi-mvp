import { ChatCircleIcon, HouseIcon, TrendUpIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router";
import { SettingsDialog } from "@/components/common/SettingsDialog";
import { WeekHeroCard } from "@/components/patient/WeekHeroCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TODAY, capitalize, formatLong } from "@/lib/dates";
import { initials } from "@/lib/patient";
import { cn } from "@/lib/utils";
import { usePatient } from "@/state/app-context";

const TABS = [
  { to: "", label: "Idag", icon: HouseIcon },
  { to: "progress", label: "Framsteg", icon: TrendUpIcon },
  { to: "chat", label: "Chatt", icon: ChatCircleIcon },
];

/** Phone-sized frame with the patient's bottom navigation. */
export function PatientLayout() {
  const { patientId } = useParams();
  const patient = usePatient(patientId);
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const section = pathname.split("/")[3] ?? "";
  const title = section === "progress" ? "Dina framsteg" : section === "chat" ? "Chatt med Erik" : `Hej ${patient.firstName}!`;
  const lastMessage = patient.messages.at(-1);
  const unread = lastMessage?.from === "physio" && !patient.seenByPatient && section !== "chat";

  return (
    <div className="mx-auto my-4.5 mb-7.5 flex min-h-[min(840px,calc(100svh-110px))] max-w-120 flex-col overflow-hidden rounded-[30px] border bg-background max-sm:m-0 max-sm:min-h-[calc(100svh-64px)] max-sm:rounded-none max-sm:border-0">
      <div className="flex items-start justify-between gap-3 px-4.5 pt-4.5 pb-1.5">
        <div className="grid gap-1">
          <span className="text-[.9rem] text-muted-foreground">{capitalize(formatLong(TODAY))}</span>
          <h1>{title}</h1>
        </div>
        <Button variant="ghost" size="icon" className="size-11 flex-none rounded-full p-0" aria-label="Inställningar" onClick={() => setSettingsOpen(true)}>
          <Avatar className="size-11 after:hidden">
            <AvatarFallback className="bg-primary font-extrabold text-primary-foreground">{initials(patient)}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} preview={<WeekHeroCard patient={patient} />} />

      <div className="grid flex-1 content-start gap-3.5 px-4 pt-3 pb-4.5">
        <Outlet />
      </div>

      <nav aria-label="Patientmeny" className="sticky bottom-0 grid grid-cols-3 border-t bg-card">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink key={label} to={to} end className={({ isActive }) => cn("group relative grid min-h-16.5 justify-items-center gap-0.5 px-1 pt-2 pb-3 text-[.9rem] font-bold", isActive ? "text-brand" : "text-muted-foreground")}>
            <span className="grid h-8 w-14 place-items-center rounded-full group-aria-[current=page]:bg-brand-muted">
              <Icon className="size-6" />
            </span>
            {label}
            {to === "chat" && unread && (
              <Badge variant="destructive" dot={false} className="absolute top-1 left-[calc(50%+12px)] h-5 min-w-5 bg-[#b23a2d] px-1.5 text-white">
                1
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
