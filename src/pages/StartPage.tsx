import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { ExerciseFigure } from "@/components/exercise/ExerciseFigure";
import { cn } from "@/lib/utils";

function RoleCard({ to, title, text, art, hero }: { to: string; title: string; text: string; art: ReactNode; hero?: boolean }) {
  return (
    <Link to={to} className={cn("grid gap-2.5 rounded-[22px] border-[1.5px] p-6 hover:border-brand", hero ? "border-hero bg-hero text-white" : "bg-card text-foreground")}>
      <div className={cn("grid h-37.5 place-items-center rounded-[14px] text-brand", hero ? "bg-white/10" : "bg-brand-soft")}>{art}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </Link>
  );
}

export function StartPage() {
  return (
    <div className="mx-auto max-w-7xl px-[max(3vw,16px)] pt-6 pb-10">
      <h1>Välkommen till Fysi</h1>
      <p className="max-w-[60ch] text-[1.12rem] text-muted-foreground">Hemträning som hänger ihop: fysioterapeuten skapar programmet, patienten tränar och loggar, och båda ser hur det går. Välj vem du testar som.</p>
      <div className="mt-5.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4.5">
        <RoleCard hero to="/patient" title="Jag är patient" text="Se dina övningar, logga dina pass och skriv till din fysioterapeut." art={<ExerciseFigure pose="squat" animated inverted />} />
        <RoleCard to="/fysio" title="Jag är fysioterapeut" text="Skapa träningsprogram på några sekunder och följ dina patienters träning och smärta." art={<ExerciseFigure pose="wallPush" animated />} />
        <RoleCard to="/feedback" title="Ge feedback" text="Berätta vad som var enkelt, svårt eller saknas efter testet." art={<MessageSquareText className="size-24 opacity-70" strokeWidth={1.5} />} />
      </div>
    </div>
  );
}
