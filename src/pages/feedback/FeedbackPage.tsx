import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Chip } from "@/components/common/Chip";
import { FeedbackSummary } from "@/components/feedback/FeedbackSummary";
import { TaskRating } from "@/components/feedback/TaskRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { TASKS } from "@/data/feedback";
import type { FeedbackEntry } from "@/data/types";
import { formatTime } from "@/lib/dates";
import { useApp } from "@/state/app-context";

type Form = Omit<FeedbackEntry, "id" | "time">;
const EMPTY: Form = { role: "", age: "", tasks: {}, good: "", missing: "", unsure: "" };

export function FeedbackPage() {
  const { state, update } = useApp();
  const [form, setForm] = useState<Form>(EMPTY);
  const set = (changes: Partial<Form>) => setForm((f) => ({ ...f, ...changes }));
  const entries = [...state.feedback].sort((a, b) => b.time - a.time);
  const tasks = TASKS.filter((t) => !form.role || form.role === "Annat" || t.role === form.role);

  const submit = () => {
    if (!form.role && !Object.keys(form.tasks).length && !form.good && !form.missing && !form.unsure) return toast.warning("Fyll i något först.");
    update((d) => void d.feedback.push({ ...form, id: `fb${Date.now().toString(36)}`, time: Date.now() }));
    setForm(EMPTY);
    window.scrollTo(0, 0);
    toast.success("Tack! Din feedback är sparad.");
  };

  const choices = (key: "role" | "age", legend: string, options: string[]) => (
    <FieldSet>
      <FieldLegend variant="label" className="mb-0">
        {legend}
      </FieldLegend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Chip key={o} selected={form[key] === o} onSelect={() => set({ [key]: form[key] === o ? "" : o })}>
            {o}
          </Chip>
        ))}
      </div>
    </FieldSet>
  );
  const text = (key: "good" | "missing" | "unsure", label: string) => (
    <Field>
      <FieldLabel htmlFor={`fb-${key}`}>{label}</FieldLabel>
      <Textarea id={`fb-${key}`} value={form[key]} onChange={(e) => set({ [key]: e.target.value })} />
    </Field>
  );

  return (
    <div className="mx-auto max-w-7xl px-[max(3vw,16px)] pt-6 pb-10">
      <h1>Hur gick testet?</h1>
      <p className="max-w-[62ch] text-muted-foreground">Gör uppgifterna i appen först. Fyll sedan i hur det gick. Det finns inga fel svar, vi testar appen och inte dig.</p>
      <div className="mt-4.5 grid grid-cols-1 items-start gap-6.5 min-[901px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}>
            <FieldGroup>
              {choices("role", "Jag testade som", ["Fysioterapeut", "Patient", "Annat"])}
              {choices("age", "Ålder", ["Under 30", "30–49", "50–64", "65+"])}
              <FieldSet className="gap-0">
                <FieldLegend className="mb-0 text-[1.15rem]">Uppgifter</FieldLegend>
                {tasks.map((t) => (
                  <TaskRating key={t.id} role={t.role} text={t.text} value={form.tasks[t.id] ?? {}} onChange={(v) => set({ tasks: { ...form.tasks, [t.id]: v } })} />
                ))}
              </FieldSet>
              {text("good", "Vad var bra?")}
              {text("missing", "Vad saknas?")}
              {text("unsure", "Var blev du osäker eller fastnade?")}
              <Button type="submit" variant="default" size="xl">
                <SendHorizontal className="size-5" />
                Skicka feedback
              </Button>
            </FieldGroup>
          </form>
        </Card>
        <div className="grid gap-3.5">
          <FeedbackSummary entries={entries} />
          {entries.slice(0, 12).map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge>{e.role || "Okänd roll"}</Badge>
                <Badge>{e.age || "Ålder ej angiven"}</Badge>
                <span className="text-[.9rem] text-muted-foreground">{formatTime(e.time)}</span>
              </div>
              {e.good && (
                <p>
                  <strong>Bra:</strong> {e.good}
                </p>
              )}
              {e.missing && (
                <p>
                  <strong>Saknas:</strong> {e.missing}
                </p>
              )}
              {e.unsure && (
                <p>
                  <strong>Osäker:</strong> {e.unsure}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
