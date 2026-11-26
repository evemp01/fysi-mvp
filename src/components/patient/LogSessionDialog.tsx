import { Check, Info, Pencil, Plus, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Chip } from "@/components/common/Chip";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Disclosure } from "@/components/common/Disclosure";
import { Alert } from "@/components/ui/alert";
import { Stepper } from "@/components/common/Stepper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { SheetDialog } from "@/components/common/Sheet";
import { PainLimitNote } from "@/components/pain/PainLimitNote";
import { PainPicker } from "@/components/pain/PainPicker";
import { VasScale } from "@/components/pain/VasScale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Effort, Exercise, Flag, Patient, ProgramItem } from "@/data/types";
import { TODAY, TODAY_KEY, addDays, capitalize, formatLong, fromKey, toKey } from "@/lib/dates";
import { doseText, logsOn, painInfo, sessionsThisWeek } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useApp, useExercises } from "@/state/app-context";
import type { SessionResult } from "./RunSessionDialog";

const FLAGS: Flag[] = ["Gjorde ont", "Kändes fel", "För tungt", "För lätt"];
const EFFORTS: Effort[] = ["Lätt", "Lagom", "Tungt"];

interface ItemForm {
  sets: number[];
  flag: Flag | null;
  comment: string;
  open: boolean;
}

interface Props {
  patient: Patient;
  /** Edit an existing log instead of creating a new one. */
  logId?: string;
  /** Filled in from a guided session. */
  fromRun?: SessionResult;
  onClose: () => void;
}

function initialForm(patient: Patient, logId?: string, fromRun?: SessionResult) {
  const log = logId ? patient.logs.find((l) => l.id === logId) : undefined;
  const items: Record<string, ItemForm> = {};
  for (const it of patient.program.items) {
    const saved = log?.items[it.exerciseId];
    items[it.exerciseId] = fromRun
      ? { sets: fromRun[it.exerciseId] ?? [], flag: null, comment: "", open: false }
      : saved
        ? { sets: [...saved.sets], flag: saved.flag, comment: saved.comment, open: !!(saved.flag || saved.comment) }
        : { sets: Array(it.sets).fill(it.reps), flag: null, comment: "", open: false };
  }
  return {
    date: log?.date ?? TODAY_KEY,
    otherDate: !!log && log.date !== TODAY_KEY,
    items,
    pain: log?.pain ?? null,
    area: log?.area ?? [],
    type: log?.type ?? [],
    effort: log?.effort ?? null,
    note: log?.note ?? "",
    noteOpen: !!log?.note,
  };
}
type Form = ReturnType<typeof initialForm>;

export function LogSessionDialog({ patient, logId, fromRun, onClose }: Props) {
  const { update } = useApp();
  const { getExercise } = useExercises();
  const [initial] = useState(() => initialForm(patient, logId, fromRun));
  const [form, setForm] = useState<Form>(initial);
  const [confirmClose, setConfirmClose] = useState(false);
  const lastPain = painInfo(patient)?.last.pain;
  const alreadyLogged = logsOn(patient, form.date).length;

  const set = (changes: Partial<Form>) => setForm((f) => ({ ...f, ...changes }));
  const setItem = (id: string, changes: Partial<ItemForm>) => setForm((f) => ({ ...f, items: { ...f.items, [id]: { ...f.items[id], ...changes } } }));

  const save = () => {
    const items = Object.fromEntries(Object.entries(form.items).map(([id, x]) => [id, { sets: x.sets.filter((v) => v > 0), flag: x.flag, comment: x.comment.trim() }]));
    const log = { id: logId ?? `${form.date}-${Date.now().toString(36)}`, date: form.date, items, pain: form.pain, area: form.area, type: form.type, note: form.note.trim(), effort: form.effort };
    const logs = [...patient.logs.filter((l) => l.id !== log.id), log].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    update((d) => void (d.patients[patient.id].logs = logs));
    const done = sessionsThisWeek({ ...patient, logs });
    const per = patient.program.perWeek;
    toast.success(done >= per ? `Pass sparat! Veckans mål på ${per} pass är nått.` : `Pass sparat! ${done} av ${per} pass den här veckan.`);
    onClose();
  };

  const requestClose = () => (fromRun || JSON.stringify(form) !== JSON.stringify(initial) ? setConfirmClose(true) : onClose());

  return (
    <>
      <SheetDialog open onClose={requestClose} title={logId ? "Ändra passet" : "Logga ditt pass"}>
        {!logId && !form.otherDate && alreadyLogged > 0 && (
          <Alert variant="info" className="text-[.9rem]">
            <Info />
            Du har redan loggat {alreadyLogged === 1 ? "ett pass" : `${alreadyLogged} pass`} i dag. Det här sparas som ett nytt pass.
          </Alert>
        )}
        {fromRun && (
          <Alert variant="success" className="text-[.9rem]">
            <Check />
            Ifyllt från passet du just körde. Ändra om något inte stämmer.
          </Alert>
        )}

        <Card className="p-4">
          <h4>När gjorde du passet?</h4>
          <div className="mt-2 flex gap-1.5">
            <Chip selected={!form.otherDate} onSelect={() => set({ date: TODAY_KEY, otherDate: false })}>
              I dag
            </Chip>
            <Chip selected={form.otherDate} onSelect={() => set({ otherDate: true, date: form.date === TODAY_KEY ? toKey(addDays(TODAY, -1)) : form.date })}>
              Välj datum
            </Chip>
          </div>
          {form.otherDate && (
            <>
              <Field className="mt-2 gap-1">
                <FieldLabel htmlFor="log-date" className="text-[.9rem] font-medium text-muted-foreground">
                  Datum för passet
                </FieldLabel>
                <Input id="log-date" type="date" className="max-w-60" value={form.date} max={TODAY_KEY} min={toKey(addDays(TODAY, -60))} onChange={(e) => e.target.value && set({ date: e.target.value > TODAY_KEY ? TODAY_KEY : e.target.value })} />
                <FieldDescription className="font-bold text-foreground">
                  {capitalize(formatLong(fromKey(form.date)))}
                  {!logId && alreadyLogged > 0 && ` · du har redan loggat ${alreadyLogged === 1 ? "ett pass" : `${alreadyLogged} pass`} den dagen, det här blir ett till`}
                </FieldDescription>
              </Field>
            </>
          )}
        </Card>

        <Card className="p-4">
          <h4>1. Hur mycket gjorde du?</h4>
          <p className="text-[.9rem] text-muted-foreground">
            {fromRun ? "Det du gjorde under passet är ifyllt, set för set. Tryck på en siffra för att skriva in ett annat antal." : "Det planerade är redan ifyllt. Tryck på en siffra för att skriva in antalet, eller använd − och +."}
          </p>
          {patient.program.items.map((it) => {
            const exercise = getExercise(it.exerciseId);
            return exercise ? <LogExercise key={it.exerciseId} item={it} exercise={exercise} value={form.items[it.exerciseId]} note={patient.patientNotes[it.exerciseId]?.at(-1)?.text} onChange={(c) => setItem(it.exerciseId, c)} /> : null;
          })}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h4>2. Hur ont har du efter passet?</h4>
            <span className="text-[.9rem] text-muted-foreground">Valfritt</span>
          </div>
          <p className="text-[.9rem] text-muted-foreground">Tryck på en siffra. 0 = ingen smärta, 10 = värsta tänkbara.</p>
          {lastPain != null && form.pain == null && (
            <Button variant="chip" size="chip-sm" className="mt-1.5" onClick={() => set({ pain: lastPain })}>
              Samma som sist: {lastPain}
            </Button>
          )}
          <VasScale value={form.pain} onChange={(pain) => set(pain ? { pain } : { pain, area: [], type: [] })} />
          {form.pain != null && (
            <Button variant="link" size="inline-sm" className="pl-0" onClick={() => set({ pain: null, area: [], type: [] })}>
              Rensa
            </Button>
          )}
          <PainLimitNote pain={form.pain} limit={patient.painLimit} />
          {!!form.pain && (
            <Disclosure summary="Visa var och hur det gör ont" defaultOpen={form.area.length > 0 || form.type.length > 0}>
              <PainPicker area={form.area} type={form.type} onChange={(v) => set(v)} />
            </Disclosure>
          )}
        </Card>

        <Card className="p-4">
          <h4>3. Hur kändes passet?</h4>
          <SegmentedControl label="Ansträngning" className="mt-2" value={form.effort} options={EFFORTS} onChange={(effort) => set({ effort })} />
        </Card>

        <Card className="p-4">
          <h4>
            4. Något speciellt? <span className="text-[.9rem] font-medium text-muted-foreground">Valfritt</span>
          </h4>
          {form.noteOpen ? (
            <Textarea autoFocus aria-label="Kommentar" className="mt-2" placeholder="T.ex. Jag var extra trött i dag" value={form.note} onChange={(e) => set({ note: e.target.value })} />
          ) : (
            <>
              <p className="text-[.9rem] text-muted-foreground">Bara om något var annorlunda än vanligt. Allt annat syns redan för Erik.</p>
              <Button variant="link" size="inline" className="pl-0" onClick={() => set({ noteOpen: true })}>
                <Plus className="size-4.5" />
                Skriv en kommentar
              </Button>
            </>
          )}
        </Card>

        <Button variant="default" size="xl" className="sticky bottom-0 w-full" onClick={save}>
          <Check className="size-5" strokeWidth={3} /> Spara och skicka till Erik
        </Button>
        <p className="text-center text-[.9rem] text-muted-foreground">Erik ser din logg direkt i sin översikt.</p>
      </SheetDialog>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="Spara passet?"
        description="Du har fyllt i passet men inte sparat det."
        confirmLabel="Spara passet"
        onConfirm={save}
        altLabel="Stäng utan att spara"
        onAlt={onClose}
        cancelLabel="Fortsätt fylla i"
      />
    </>
  );
}

interface LogExerciseProps {
  item: ProgramItem;
  exercise: Exercise;
  value: ItemForm;
  note?: string;
  onChange: (changes: Partial<ItemForm>) => void;
}

/** Sets done for one exercise, plus an optional flag. */
function LogExercise({ item, exercise, value, note, onChange }: LogExerciseProps) {
  const step = exercise.unit === "sek" ? 5 : 1;
  const setAt = (k: number, v: number) => onChange({ sets: value.sets.map((x, i) => (i === k ? Math.max(0, Math.min(300, v)) : x)) });
  return (
    <div className={cn("grid gap-2 border-t py-3 first-of-type:border-t-0", value.open && "rounded-xl border-0 bg-warning-soft p-3")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-[1.05rem]">{exercise.name}</strong>
        <span className="text-[.9rem] text-muted-foreground">Plan: {doseText(item, exercise)}</span>
      </div>
      {note && (
        <div className="flex items-start gap-1.5 text-[.9rem] font-semibold text-warning-foreground">
          <Pencil className="mt-0.75 size-3.5 flex-none" />
          <span className="line-clamp-2">Din anteckning: {note}</span>
        </div>
      )}
      {value.sets.length ? (
        <div className="grid gap-1.5">
          {value.sets.map((v, k) => (
            <div key={k} className="grid grid-cols-[4em_auto_auto_1fr] items-center gap-2.5">
              <span className="text-[.9rem] font-bold">Set {k + 1}</span>
              <Stepper value={v} onChange={(n) => setAt(k, n)} label={`Set ${k + 1}`} min={0} step={step} />
              <span className="text-[.9rem] text-muted-foreground">{exercise.unit === "sek" ? "sek" : "rep"}</span>
              <Button size="icon-sm" className="justify-self-end text-muted-foreground" aria-label={`Ta bort set ${k + 1}`} onClick={() => onChange({ sets: value.sets.filter((_, i) => i !== k) })}>
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Badge variant="warning" className="justify-self-start">
          Hoppade över
        </Badge>
      )}
      <Button variant="link" size="inline-sm" className="justify-self-start pl-0" onClick={() => onChange({ sets: [...value.sets, value.sets.at(-1) ?? item.reps] })}>
        <Plus className="size-4" />
        Lägg till set
      </Button>
      {value.open ? (
        <div className="grid gap-2">
          <span className="text-[.9rem] font-bold" id={`flag-${item.exerciseId}`}>
            Vad var det som kändes konstigt?
          </span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`flag-${item.exerciseId}`}>
            {FLAGS.map((f) => (
              <Chip key={f} selected={value.flag === f} onSelect={() => onChange({ flag: value.flag === f ? null : f })}>
                {f}
              </Chip>
            ))}
          </div>
          <Input aria-label="Kort kommentar" placeholder="Kort kommentar (valfritt)" value={value.comment} onChange={(e) => onChange({ comment: e.target.value })} />
          <Button variant="link" size="inline-sm" className="justify-self-start pl-0" onClick={() => onChange({ open: false, flag: null, comment: "" })}>
            Ta bort
          </Button>
        </div>
      ) : (
        <Button variant="link" size="inline-sm" className="justify-self-start pl-0" onClick={() => onChange({ open: true })}>
          Kändes något konstigt?
        </Button>
      )}
    </div>
  );
}
