import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TASKS } from "@/data/feedback";
import type { FeedbackEntry } from "@/data/types";
import { FeedbackTableDialog } from "./FeedbackTableDialog";

/** Average ease per task across all submitted feedback. */
export function FeedbackSummary({ entries }: { entries: FeedbackEntry[] }) {
  const [tableOpen, setTableOpen] = useState(false);
  return (
    <Card>
      <h3>Inkommen feedback ({entries.length})</h3>
      <p className="text-[.9rem] text-muted-foreground">Sparas bara i den här sessionen. Snittbetyg för hur lätt uppgiften var (1–5):</p>
      <div className="mt-2.5 grid gap-2.5">
        {TASKS.map((t) => {
          const scores = entries.map((e) => e.tasks[t.id]?.ease).filter((x): x is number => !!x);
          const avg = scores.length ? scores.reduce((s, x) => s + x, 0) / scores.length : 0;
          return (
            <div key={t.id}>
              <span className="text-[.9rem]">{t.text}</span>
              <div className="grid grid-cols-[minmax(0,1fr)_3.2em] items-center gap-2 text-[.92rem]">
                <Progress value={(avg / 5) * 100} className="h-3 bg-border" indicatorClassName="bg-brand" />
                <span className="text-right tabular-nums">{scores.length ? avg.toFixed(1) : "–"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Button size="sm" className="mt-3" disabled={!entries.length} onClick={() => setTableOpen(true)}>
        Kopiera allt som tabell
      </Button>
      {tableOpen && <FeedbackTableDialog entries={entries} onClose={() => setTableOpen(false)} />}
    </Card>
  );
}
