import { Bell, Check, ChevronRight, ClipboardList, Phone, Play } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { ExerciseInstructionsDialog } from "@/components/patient/ExerciseInstructionsDialog";
import { ExerciseRow } from "@/components/patient/ExerciseRow";
import { LogSessionDialog } from "@/components/patient/LogSessionDialog";
import { RemindersDialog } from "@/components/patient/RemindersDialog";
import { RunSessionDialog, type SessionResult } from "@/components/patient/RunSessionDialog";
import { WeekHeroCard } from "@/components/patient/WeekHeroCard";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { TODAY_KEY } from "@/lib/dates";
import { isDaily, logsOn, reminderText, shareDone } from "@/lib/stats";
import { usePatient, useExercises } from "@/state/app-context";

type LogDialog = { logId?: string; fromRun?: SessionResult };

export function TodayPage() {
  const patient = usePatient(useParams().patientId);
  const { getExercise } = useExercises();
  const navigate = useNavigate();
  const [instructionsFor, setInstructionsFor] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogDialog | null>(null);
  const [remindersOpen, setRemindersOpen] = useState(false);

  if (!patient.program.items.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardList />
          </EmptyMedia>
          <EmptyTitle>Inget program ännu</EmptyTitle>
          <EmptyDescription>Din fysioterapeut har inte skickat några övningar till dig än. De dyker upp här när de är klara.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  const todaysLogs = logsOn(patient, TODAY_KEY);
  const lastLog = todaysLogs.at(-1);
  const perDay = patient.program.perDay || 1;
  const moreToday = isDaily(patient.program) && todaysLogs.length < perDay;
  const latestFromErik = patient.messages.findLast((m) => m.from === "physio");

  return (
    <>
      <WeekHeroCard patient={patient} />

      {lastLog && (
        <Item variant="card">
          <ItemMedia variant="icon" className="rounded-full bg-success text-white">
            <Check strokeWidth={3} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{todaysLogs.length === 1 ? "Du har tränat i dag" : `Du har tränat ${todaysLogs.length} pass i dag`}</ItemTitle>
            <ItemDescription>
              {lastLog.pain == null ? "Ingen smärta angiven" : `Smärta ${lastLog.pain} av 10`}
              {todaysLogs.length > 1 && " i senaste passet"}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" onClick={() => setLog({ logId: lastLog.id })}>
              Ändra
            </Button>
          </ItemActions>
        </Item>
      )}

      {!lastLog || moreToday ? (
        <>
          <Button variant="default" size="lg" className="w-full" onClick={() => setRunning(true)}>
            <Play className="fill-current" /> {moreToday && lastLog ? `Starta pass ${todaysLogs.length + 1} av ${perDay}` : "Starta träningspass"}
          </Button>
          <Button variant="link" size="inline" className="-mt-2 justify-self-center" onClick={() => setLog({})}>
            Har du redan tränat? Logga passet
          </Button>
        </>
      ) : (
        <div className="-mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Button size="sm" onClick={() => setRunning(true)}>
            <Play className="size-4 fill-current" /> Träna ett pass till
          </Button>
          <Button variant="link" size="inline-sm" onClick={() => setLog({})}>
            Logga ett pass till
          </Button>
        </div>
      )}

      <Item asChild size="sm" className="min-h-10 px-1 py-0.5 hover:bg-transparent">
        <button type="button" onClick={() => setRemindersOpen(true)}>
          <ItemMedia variant="icon" className="size-auto text-muted-foreground">
            <Bell className="size-4.5" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>{reminderText(patient)}</ItemDescription>
          </ItemContent>
          <ItemActions className="font-bold text-brand underline">Ändra</ItemActions>
        </button>
      </Item>

      {latestFromErik && !patient.seenByPatient && (
        <Item asChild variant="outline" className="rounded-2xl border-warning/45 bg-warning-soft [a]:hover:bg-warning-soft">
          <Link to="chat">
            <ItemMedia>
              <InitialsAvatar className="size-10">E</InitialsAvatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Nytt från Erik</ItemTitle>
              <ItemDescription className="line-clamp-2 text-foreground">{latestFromErik.text}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="size-5.5 text-muted-foreground" />
            </ItemActions>
          </Link>
        </Item>
      )}

      <div className="mt-1 flex items-baseline justify-between gap-2.5">
        <h2>Ditt pass</h2>
        <span className="text-[.9rem] text-muted-foreground">{patient.program.items.length} övningar</span>
      </div>
      {patient.program.items.map((item) => {
        const exercise = getExercise(item.exerciseId);
        if (!exercise) return null;
        return (
          <ExerciseRow
            key={item.exerciseId}
            exercise={exercise}
            item={item}
            doneToday={!!lastLog && shareDone(item, todaysLogs[0]?.items[item.exerciseId]) >= 0.9}
            lastNote={patient.patientNotes[item.exerciseId]?.at(-1)?.text}
            onOpen={() => setInstructionsFor(item.exerciseId)}
          />
        );
      })}

      {patient.booking && (
        <Item variant="card">
          <ItemMedia variant="icon" className="rounded-full bg-brand-muted text-brand">
            <Phone />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Telefonmöte med Erik</ItemTitle>
            <ItemDescription>{patient.booking}</ItemDescription>
          </ItemContent>
        </Item>
      )}

      <ExerciseInstructionsDialog patient={patient} exerciseId={instructionsFor} onClose={() => setInstructionsFor(null)} onAsk={(name) => navigate("chat", { state: { prefill: `Fråga om ${name.toLowerCase()}: ` } })} />
      {running && (
        <RunSessionDialog
          patient={patient}
          onClose={() => setRunning(false)}
          onLog={(fromRun) => {
            setRunning(false);
            setLog({ fromRun });
          }}
        />
      )}
      {log && <LogSessionDialog patient={patient} logId={log.logId} fromRun={log.fromRun} onClose={() => setLog(null)} />}
      <RemindersDialog patient={patient} open={remindersOpen} onClose={() => setRemindersOpen(false)} />
    </>
  );
}
