import { ChatCircleIcon, FlagIcon, type Icon, PencilSimpleIcon, PulseIcon, WarningIcon } from "@phosphor-icons/react";
import { adherence, flags, painInfo, replyBy, replyByText, waitingMessage } from "@/lib/stats";
import { useApp, useExercises } from "@/state/app-context";

export type AttentionTone = "danger" | "warning" | "info";
export interface AttentionItem {
  tone: AttentionTone;
  icon: Icon;
  title: string;
  /** Bold red lead-in, e.g. a passed reply deadline. */
  alert?: string;
  detail: string;
  action: string;
  to: string;
}

/** What needs the physio's attention, most urgent first. */
export function useAttentionItems(): AttentionItem[] {
  const { state } = useApp();
  const { getExercise } = useExercises();
  const out: AttentionItem[] = [];
  for (const id of state.order) {
    const p = state.patients[id];
    const base = `/fysio/patients/${p.id}`;
    const waiting = waitingMessage(p);
    if (waiting) {
      const late = replyBy(waiting.time) < new Date();
      out.push({
        tone: late ? "danger" : "warning",
        icon: ChatCircleIcon,
        title: `${p.firstName} väntar på svar`,
        action: "Svara",
        to: `${base}/messages`,
        alert: late ? "Svarstiden har passerat. " : undefined,
        detail: `${late ? "" : `Svara senast ${replyByText(replyBy(waiting.time))}. `}${waiting.pain ? "Med smärtbeskrivning. " : ""}${waiting.text.slice(0, 60)}`,
      });
    }
    const pain = painInfo(p);
    if (pain && pain.last.pain > p.painLimit) out.push({ tone: "danger", icon: WarningIcon, title: `${p.firstName} är över smärtgränsen`, detail: `Senast ${pain.last.pain}/10, gräns ${p.painLimit}/10`, action: "Justera", to: `${base}/program` });
    const flagged = flags(p, 7).filter((f) => f.flag);
    if (flagged.length)
      out.push({
        tone: "warning",
        icon: FlagIcon,
        title: `${p.firstName} har flaggat ${flagged.length === 1 ? "en övning" : `${flagged.length} övningar`}`,
        action: "Visa",
        to: base,
        detail: [...new Set(flagged.map((f) => `${getExercise(f.exerciseId ?? "")?.name}: ${f.flag}`))].slice(0, 2).join(", "),
      });
    if (!p.program.items.length) out.push({ tone: "info", icon: PencilSimpleIcon, title: `Skapa program åt ${p.firstName}`, detail: p.diagnosis, action: "Skapa", to: `${base}/program` });
    const a = adherence(p);
    if (a.pct != null && a.pct < 60) out.push({ tone: "warning", icon: PulseIcon, title: `${p.firstName} har gjort ${a.done} av ${a.plan} pass`, detail: "Senaste 14 dagarna", action: "Skriv", to: `${base}/messages` });
  }
  return out;
}
