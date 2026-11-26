import { ListPlus } from 'lucide-react'
import { useState } from 'react'
import { useBlocker, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ExerciseLibrary } from '@/components/exercise/library/ExerciseLibrary'
import { NewExerciseDialog } from '@/components/exercise/NewExerciseDialog'
import { ProgramItemCard } from '@/components/fysio/program/ProgramItemCard'
import { ProgramSettings } from '@/components/fysio/program/ProgramSettings'
import type { ProgramDraft } from '@/components/fysio/program/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { TEMPLATES } from '@/data/templates'
import type { Exercise, Patient, ProgramItem } from '@/data/types'
import { TODAY_KEY } from '@/lib/dates'
import { frequencyText } from '@/lib/stats'
import { useApp, useExercises, usePatient } from '@/state/app-context'

const toDraft = (p: Patient): ProgramDraft => ({ ...structuredClone(p.program), weeks: p.weeks, painLimit: p.painLimit })
const newItem = (e: Exercise): ProgramItem => ({ exerciseId: e.id, sets: 3, reps: e.unit === 'sek' ? 30 : 10, note: '' })

export function ProgramTab() {
  const patient = usePatient(useParams().patientId)
  const { update } = useApp()
  const { getExercise } = useExercises()
  // Arriving from the exercise bank with "add to program".
  const addFromBank = (useLocation().state as { add?: string } | null)?.add

  const [saved, setSaved] = useState(() => JSON.stringify(toDraft(patient)))
  const [draft, setDraft] = useState<ProgramDraft>(() => {
    const d = toDraft(patient)
    const e = addFromBank && getExercise(addFromBank)
    if (e && !d.items.some((it) => it.exerciseId === e.id)) d.items.push(newItem(e))
    return d
  })
  const [editingText, setEditingText] = useState<string | null>(null)
  const [creating, setCreating] = useState<string | null>(null)
  const dirty = JSON.stringify(draft) !== saved
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)

  const change = (changes: Partial<ProgramDraft>) => setDraft((d) => ({ ...d, ...changes }))
  const setItems = (fn: (items: ProgramItem[]) => ProgramItem[]) => setDraft((d) => ({ ...d, items: fn(d.items) }))

  const add = (e: Exercise) => {
    setItems((items) => [...items, newItem(e)])
    update((d) => void (d.recent = [e.id, ...d.recent.filter((x) => x !== e.id)].slice(0, 8)))
    toast.success(`${e.name} tillagd`)
  }
  const toggle = (id: string) => {
    const e = getExercise(id)
    if (!e) return
    if (draft.items.some((it) => it.exerciseId === id)) setItems((items) => items.filter((it) => it.exerciseId !== id))
    else add(e)
  }
  const applyTemplate = (index: number) => {
    const t = TEMPLATES[index]
    const missing = t.items.filter((it) => !draft.items.some((x) => x.exerciseId === it.exerciseId))
    setDraft((d) => ({
      ...d,
      ...(d.items.length ? {} : { perWeek: t.perWeek, frequency: t.frequency, perDay: t.perDay ?? d.perDay }),
      items: [...d.items, ...missing.map((it) => ({ ...it, note: '' }))],
    }))
    toast(missing.length ? `Mallen ${t.name.toLowerCase()} är tillagd. Justera vid behov.` : 'Övningarna finns redan i programmet.')
  }
  const swap = (index: number, exerciseId: string) => {
    const next = getExercise(exerciseId)
    if (!next) return
    if (draft.items.some((x) => x.exerciseId === exerciseId)) return toast.info(`${next.name} finns redan i programmet.`)
    setItems((items) =>
      items.map((it, i) => {
        if (i !== index) return it
        const sameUnit = getExercise(it.exerciseId)?.unit === next.unit
        return { ...it, exerciseId, steps: undefined, tip: undefined, reps: sameUnit ? it.reps : next.unit === 'sek' ? 30 : 10 }
      }),
    )
    setEditingText(null)
    toast.success(`Bytt till ${next.name}.`)
  }

  const save = () => {
    const { weeks, painLimit, ...program } = draft
    const clean = {
      ...program,
      perWeek: program.frequency === 'day' ? 7 * program.perDay : program.perWeek,
      items: program.items.map((it) => ({ ...it, steps: it.steps?.map((s) => s.trim()).filter(Boolean) })),
    }
    update((d) => {
      const p = d.patients[patient.id]
      Object.assign(p, { program: clean, weeks, painLimit, since: p.since ?? TODAY_KEY, seenByPatient: false })
      p.messages.push({ from: 'physio', time: Date.now(), text: `Hej ${p.firstName}! Jag har uppdaterat ditt träningsprogram: ${frequencyText(clean)} i ${weeks} veckor. Du hittar övningarna under Idag.` })
    })
    setSaved(JSON.stringify(draft))
    toast.success(`Programmet är skickat till ${patient.firstName}.`)
  }

  return (
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <ExerciseLibrary mode="program" selected={draft.items.map((it) => it.exerciseId)} onToggle={toggle} onTemplate={applyTemplate} onCreate={setCreating} />

      <div className="grid content-start gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2>Program för {patient.firstName}</h2>
          {dirty ? <Badge variant="warning">Osparade ändringar</Badge> : <Badge variant="success">Sparat</Badge>}
        </div>
        <ProgramSettings draft={draft} onChange={change} />
        <p className="text-[.9rem] text-muted-foreground">Ett pass = alla övningar nedan · {draft.items.length} övningar</p>
        {draft.items.length ? (
          draft.items.map((item, i) => {
            const exercise = getExercise(item.exerciseId)
            return exercise ? (
              <ProgramItemCard
                key={item.exerciseId}
                item={item}
                exercise={exercise}
                patientName={patient.firstName}
                isFirst={i === 0}
                isLast={i === draft.items.length - 1}
                editingText={editingText === item.exerciseId}
                getExercise={getExercise}
                onChange={(c) => setItems((items) => items.map((it, k) => (k === i ? { ...it, ...c } : it)))}
                onMove={(dir) =>
                  setItems((items) => {
                    const next = [...items]
                    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
                    return next
                  })
                }
                onRemove={() => setItems((items) => items.filter((_, k) => k !== i))}
                onSwap={(id) => swap(i, id)}
                onToggleEditText={() => setEditingText(editingText === item.exerciseId ? null : item.exerciseId)}
              />
            ) : null
          })
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListPlus />
              </EmptyMedia>
              <EmptyTitle>Passet är tomt</EmptyTitle>
              <EmptyDescription>Välj övningar i biblioteket eller börja från en mall.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2.5 border-t bg-background py-3">
          <Button variant="default" disabled={!dirty || !draft.items.length} onClick={save}>Spara och skicka till {patient.firstName}</Button>
          {dirty && <Button onClick={() => setDraft(JSON.parse(saved))}>Ångra ändringar</Button>}
        </div>
      </div>

      {creating != null && (
        <NewExerciseDialog
          initialName={creating}
          forPatient={patient.firstName}
          onClose={() => setCreating(null)}
          onSaved={(e) => {
            setCreating(null)
            setItems((items) => [...items, newItem(e)])
            toast.success(`${e.name} är skapad och tillagd i programmet.`)
          }}
        />
      )}

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        onOpenChange={(open) => !open && blocker.state === 'blocked' && blocker.reset()}
        title="Osparade ändringar"
        description={`Du har ändrat ${patient.firstName}s program men inte sparat.`}
        confirmLabel={`Spara och skicka till ${patient.firstName}`}
        onConfirm={() => { save(); blocker.proceed?.() }}
        altLabel="Släng ändringarna"
        onAlt={() => blocker.proceed?.()}
        cancelLabel="Stanna kvar"
      />
    </div>
  )
}
