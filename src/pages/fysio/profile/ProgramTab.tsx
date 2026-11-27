import { CursorClickIcon, ListPlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useBlocker, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ExerciseLibrary } from '@/components/exercise/library/ExerciseLibrary'
import { NewExerciseDialog } from '@/components/exercise/NewExerciseDialog'
import { ProgramItemEditor } from '@/components/fysio/program/ProgramItemEditor'
import { ProgramItemRow } from '@/components/fysio/program/ProgramItemRow'
import { ProgramSettings } from '@/components/fysio/program/ProgramSettings'
import type { ProgramDraft } from '@/components/fysio/program/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import { TEMPLATES } from '@/data/templates'
import type { Exercise, Patient, ProgramItem } from '@/data/types'
import { TODAY_KEY } from '@/lib/dates'
import { frequencyText } from '@/lib/stats'
import { useApp, useExercises, usePatient } from '@/state/app-context'

const toDraft = (p: Patient): ProgramDraft => ({ ...structuredClone(p.program), weeks: p.weeks, painLimit: p.painLimit })
const newItem = (e: Exercise): ProgramItem => ({ exerciseId: e.id, sets: 3, reps: e.unit === 'sek' ? 30 : 10, note: '' })

/** Exercise being set up in the middle column. `from` is its id in the program, or null if it's not added yet. */
interface Editing {
  from: string | null
  item: ProgramItem
}

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
  const [editing, setEditing] = useState<Editing | null>(() => {
    const e = addFromBank && getExercise(addFromBank)
    return e ? { from: e.id, item: draft.items.find((it) => it.exerciseId === e.id) ?? newItem(e) } : null
  })
  const [creating, setCreating] = useState<string | null>(null)
  const dirty = JSON.stringify(draft) !== saved
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)

  const change = (changes: Partial<ProgramDraft>) => setDraft((d) => ({ ...d, ...changes }))
  const setItems = (fn: (items: ProgramItem[]) => ProgramItem[]) => setDraft((d) => ({ ...d, items: fn(d.items) }))
  const editItem = (changes: Partial<ProgramItem>) => setEditing((ed) => ed && { ...ed, item: { ...ed.item, ...changes } })

  /** Opens an exercise in the editor: its current setup if it's in the program, otherwise a default dose. */
  const pick = (id: string) => {
    const e = getExercise(id)
    if (!e) return
    const existing = draft.items.find((it) => it.exerciseId === id)
    setEditing({ from: existing ? id : null, item: existing ? structuredClone(existing) : newItem(e) })
  }

  const submit = () => {
    if (!editing) return
    const { from, item } = editing
    const name = getExercise(item.exerciseId)?.name ?? 'Övningen'
    const inProgram = from != null && draft.items.some((it) => it.exerciseId === from)
    if (inProgram) {
      setItems((items) => items.map((it) => (it.exerciseId === from ? item : it)))
      toast.success(`${name} är uppdaterad.`)
    } else {
      setItems((items) => [...items, item])
      update((d) => void (d.recent = [item.exerciseId, ...d.recent.filter((x) => x !== item.exerciseId)].slice(0, 8)))
      toast.success(`${name} är tillagd i programmet.`)
    }
    setEditing(null)
  }

  const remove = (id: string) => {
    setItems((items) => items.filter((it) => it.exerciseId !== id))
    if (editing?.from === id) setEditing(null)
  }

  const move = (index: number, dir: -1 | 1) =>
    setItems((items) => {
      const next = [...items]
      ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
      return next
    })

  const swap = (exerciseId: string) => {
    const next = getExercise(exerciseId)
    if (!editing || !next) return
    if (draft.items.some((x) => x.exerciseId === exerciseId && x.exerciseId !== editing.from)) return toast.info(`${next.name} finns redan i programmet.`)
    const sameUnit = getExercise(editing.item.exerciseId)?.unit === next.unit
    editItem({ exerciseId, steps: undefined, tip: undefined, reps: sameUnit ? editing.item.reps : next.unit === 'sek' ? 30 : 10 })
    toast.success(`Bytt till ${next.name}.`)
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

  const editingExercise = editing && getExercise(editing.item.exerciseId)

  return (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <ExerciseLibrary mode="program" selected={draft.items.map((it) => it.exerciseId)} active={editing?.item.exerciseId} onPick={pick} onTemplate={applyTemplate} onCreate={setCreating} />

      <div className="grid content-start gap-3">
        <h2>Ställ in övningen</h2>
        {editing && editingExercise ? (
          <ProgramItemEditor
            key={editing.from ?? `new-${editing.item.exerciseId}`}
            item={editing.item}
            exercise={editingExercise}
            patientName={patient.firstName}
            isNew={editing.from == null}
            getExercise={getExercise}
            onChange={editItem}
            onSwap={swap}
            onSubmit={submit}
            onCancel={() => setEditing(null)}
            onRemove={() => editing.from && remove(editing.from)}
          />
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CursorClickIcon />
              </EmptyMedia>
              <EmptyTitle>Välj en övning</EmptyTitle>
              <EmptyDescription>Välj en övning i biblioteket för att ställa in set, repetitioner och instruktioner. Tryck på pennan i programmet för att ändra en övning som redan finns där.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <div className="grid content-start gap-3 lg:col-span-2 xl:col-span-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2>Program för {patient.firstName}</h2>
          {dirty ? <Badge variant="warning">Osparade ändringar</Badge> : <Badge variant="success">Sparat</Badge>}
        </div>
        <ProgramSettings draft={draft} onChange={change} />
        <p className="text-[.9rem] text-muted-foreground">Ett pass = alla övningar nedan · {draft.items.length} övningar</p>
        {draft.items.length ? (
          <ItemGroup className="gap-2">
            {draft.items.map((item, i) => {
              const exercise = getExercise(item.exerciseId)
              return exercise ? (
                <ProgramItemRow
                  key={item.exerciseId}
                  index={i}
                  item={item}
                  exercise={exercise}
                  active={editing?.from === item.exerciseId}
                  isFirst={i === 0}
                  isLast={i === draft.items.length - 1}
                  onEdit={() => pick(item.exerciseId)}
                  onMove={(dir) => move(i, dir)}
                  onRemove={() => remove(item.exerciseId)}
                />
              ) : null
            })}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListPlusIcon />
              </EmptyMedia>
              <EmptyTitle>Passet är tomt</EmptyTitle>
              <EmptyDescription>Välj övningar i biblioteket eller börja från en mall.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2.5 border-t bg-background py-3">
          <Button variant="default" disabled={!dirty || !draft.items.length} onClick={save}>Spara och skicka till {patient.firstName}</Button>
          {dirty && <Button onClick={() => { setDraft(JSON.parse(saved)); setEditing(null) }}>Ångra ändringar</Button>}
        </div>
      </div>

      {creating != null && (
        <NewExerciseDialog
          initialName={creating}
          forPatient={patient.firstName}
          onClose={() => setCreating(null)}
          onSaved={(e) => {
            setCreating(null)
            setEditing({ from: null, item: newItem(e) })
            toast.success(`${e.name} är skapad. Ställ in dosen och lägg till den i programmet.`)
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
