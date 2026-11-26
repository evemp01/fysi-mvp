import { toast } from "sonner";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TASKS } from "@/data/feedback";
import type { FeedbackEntry } from "@/data/types";
import { formatTime } from "@/lib/dates";

function toTable(entries: FeedbackEntry[]) {
  const clean = (s: unknown) => String(s ?? "").replace(/[\t\n]+/g, " ");
  const head = ["Tid", "Roll", "Ålder", ...TASKS.flatMap((t) => [`${t.id} resultat`, `${t.id} lätthet`]), "Bra", "Saknas", "Osäker"];
  const rows = [...entries].sort((a, b) => a.time - b.time).map((e) => [formatTime(e.time), e.role, e.age, ...TASKS.flatMap((t) => [e.tasks[t.id]?.result, e.tasks[t.id]?.ease]), e.good, e.missing, e.unsure].map(clean).join("\t"));
  return [head.join("\t"), ...rows].join("\n");
}

export function FeedbackTableDialog({ entries, onClose }: { entries: FeedbackEntry[]; onClose: () => void }) {
  const text = toTable(entries);
  return (
    <SheetDialog open onClose={onClose} title="Feedback som tabell">
      <p className="text-[.9rem] text-muted-foreground">Tabbseparerad text, klistra in i Excel eller Google Kalkylark.</p>
      <Textarea readOnly className="min-h-55" value={text} />
      <Button
        variant="default"
        onClick={() =>
          navigator.clipboard.writeText(text).then(
            () => toast.success("Kopierat."),
            () => toast.warning("Markera texten och kopiera manuellt."),
          )
        }>
        Kopiera
      </Button>
    </SheetDialog>
  );
}
