import { CameraIcon, CheckIcon, LinkSimpleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { AttachmentGrid } from "@/components/chat/AttachmentGrid";
import { Chip } from "@/components/common/Chip";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Disclosure } from "@/components/common/Disclosure";
import { FileButton } from "@/components/common/FileButton";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AREAS } from "@/data/exercises";
import type { Exercise, MediaItem, Unit } from "@/data/types";
import { capitalize } from "@/lib/dates";
import { filesToMedia, isTouchDevice, linkToMedia } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useApp } from "@/state/app-context";
import { ExerciseFigure } from "./ExerciseFigure";

const POSE_CHOICES: [string, string][] = [
  ["squat", "Knäböj"],
  ["lunge", "Utfall"],
  ["stepUp", "Trappsteg"],
  ["kneeExt", "Sittande"],
  ["balance", "Balans"],
  ["calf", "Tåhävning"],
  ["bridge", "Liggande rygg"],
  ["plank", "Planka"],
  ["sideLeg", "Sidoliggande"],
  ["armRaise", "Armlyft"],
  ["wallPush", "Mot vägg"],
  ["chin", "Nacke"],
];
const POSITION_BY_POSE: Record<string, string> = { kneeExt: "Sittande", chin: "Sittande", bridge: "Liggande", plank: "Liggande", sideLeg: "Liggande" };

interface Props {
  /** Edit this custom exercise instead of creating one. */
  editing?: Exercise;
  initialName?: string;
  /** Shown in the intro when the new exercise also goes into a patient's program. */
  forPatient?: string;
  onClose: () => void;
  onSaved: (exercise: Exercise) => void;
}

export function NewExerciseDialog({ editing, initialName = "", forPatient, onClose, onSaved }: Props) {
  const { update } = useApp();
  const [name, setName] = useState(editing?.name ?? initialName);
  const [area, setArea] = useState(editing?.area ?? "Knä & höft");
  const [unit, setUnit] = useState<Unit>(editing?.unit ?? "rep");
  const [pose, setPose] = useState(editing?.pose ?? "squat");
  const [media, setMedia] = useState<MediaItem[]>(editing?.media ?? []);
  const [link, setLink] = useState("");
  const [steps, setSteps] = useState(editing?.steps.join("\n") ?? "");
  const [tip, setTip] = useState(editing?.tip ?? "");
  const [avoid, setAvoid] = useState(editing?.avoid ?? "");
  const [why, setWhy] = useState(editing?.why ?? "");
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const addFiles = (files: File[]) => {
    const { items, skipped } = filesToMedia(files);
    setMedia((m) => [...m, ...items]);
    toast(`${items.length === 1 ? "1 fil tillagd." : `${items.length} filer tillagda.`}${skipped ? ` ${skipped} hoppades över (fel format eller för stor).` : ""}`);
  };
  const addLink = () => {
    if (!link.trim()) return toast.warning("Klistra in en länk först.");
    const item = linkToMedia(link);
    if (!item) return toast.warning("Länken ska börja med https://");
    setMedia((m) => [...m, item]);
    setLink("");
    toast.success("Videolänken är tillagd.");
  };

  const save = () => {
    const stepList = steps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!name.trim()) return toast.warning("Skriv ett namn på övningen.");
    if (!stepList.length) return toast.warning("Skriv minst ett steg under Så gör du.");
    const exercise: Exercise = {
      id: editing?.id ?? `c${Date.now().toString(36)}`,
      name: capitalize(name.trim()),
      area,
      unit,
      pose,
      media,
      steps: stepList,
      tip: tip.trim() || "Rör dig lugnt och kontrollerat.",
      avoid: avoid.trim(),
      why: why.trim(),
      position: POSITION_BY_POSE[pose] ?? "Stående",
      equipment: ["Ingen"],
      level: 1,
      goals: [],
      synonyms: "",
      diagnoses: "",
      tags: `${name} ${area}`.toLowerCase(),
      custom: true,
    };
    update((d) => void (d.customExercises = [...d.customExercises.filter((x) => x.id !== exercise.id), exercise]));
    onSaved(exercise);
  };

  const requestClose = () => (!editing && (name.trim() || steps.trim() || media.length) ? setConfirmDiscard(true) : onClose());

  return (
    <>
      <SheetDialog open onClose={requestClose} title={editing ? "Ändra egen övning" : "Ny egen övning"}>
        <p className="text-[.9rem] text-muted-foreground">
          {editing
            ? "Ändringarna gäller i alla program där övningen används."
            : forPatient
              ? `Övningen läggs till i ${forPatient}s program och sparas i din övningsbank, så att du kan använda den för alla patienter.`
              : "Övningen sparas i din övningsbank och kan användas för alla patienter."}
        </p>

        <Card className="p-4">
          <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nx-name">Namn på övningen *</FieldLabel>
            <Input id="nx-name" autoFocus={!initialName} value={name} placeholder="T.ex. Gång baklänges" onChange={(e) => setName(e.target.value)} />
          </Field>
          <FieldSet>
            <FieldLegend variant="label" className="mb-0">Kroppsdel</FieldLegend>
            <div className="flex flex-wrap gap-1.5">
              {AREAS.map((a) => (
                <Chip key={a} size="md" selected={area === a} onSelect={() => setArea(a)}>
                  {a}
                </Chip>
              ))}
            </div>
          </FieldSet>
          <FieldSet>
            <FieldLegend variant="label" className="mb-0">Mäts i</FieldLegend>
            <SegmentedControl
              className="max-w-80"
              value={unit}
              onChange={setUnit}
              options={[
                { value: "rep", label: "Repetitioner" },
                { value: "sek", label: "Sekunder" },
              ]}
            />
          </FieldSet>
          </FieldGroup>
        </Card>

        <Card className="grid gap-2.5 p-4">
          <CardHeader className="mb-0">
            <CardTitle className="text-base">
              Bilder och video <span className="text-[.9rem] font-medium text-muted-foreground">(valfritt)</span>
            </CardTitle>
            <CardDescription>Ladda upp en eller flera bilder och videor på en gång. Den första blir omslagsbild.{isTouchDevice() && " Du kan också fota eller filma direkt."}</CardDescription>
          </CardHeader>
          <AttachmentGrid items={media} onRemove={(i) => setMedia(media.filter((_, k) => k !== i))} onMakeCover={(i) => setMedia([media[i], ...media.filter((_, k) => k !== i)])} />
          <div className="flex flex-wrap gap-2">
            {isTouchDevice() && (
              <FileButton primary capture onFiles={addFiles}>
                <CameraIcon className="size-4.5" />
                Fota eller filma
              </FileButton>
            )}
            <FileButton primary={!isTouchDevice()} multiple onFiles={addFiles}>
              <UploadSimpleIcon className="size-4.5" />
              {media.length ? "Lägg till fler" : "Ladda upp bilder eller video"}
            </FileButton>
          </div>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="nx-url" className="text-[.9rem] font-medium text-muted-foreground">
              Länk till YouTube eller annan video
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LinkSimpleIcon />
              </InputGroupAddon>
              <InputGroupInput id="nx-url" inputMode="url" placeholder="https://youtu.be/…" value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLink()} />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="sm" variant="outline" onClick={addLink}>
                  Lägg till
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          {!media.length && (
            <div className="grid gap-2 border-t pt-2.5">
              <span className="text-[.9rem] text-muted-foreground">Utan bilder visas en animerad figur. Välj den som liknar övningen mest.</span>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-2">
                {POSE_CHOICES.map(([key, label]) => (
                  <Button
                    key={key}
                    variant="outline"
                    aria-pressed={pose === key}
                    onClick={() => setPose(key)}
                    className={cn("grid h-auto gap-1.5 rounded-[14px] p-1.5 text-center text-[.9rem] font-medium", pose === key && "border-brand bg-brand-soft hover:bg-brand-soft")}>
                    <div className="aspect-4/3 overflow-hidden rounded-xl bg-brand-soft">
                      <ExerciseFigure pose={key} animated={pose === key} />
                    </div>
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="grid gap-2.5 p-4">
          <Field>
            <FieldLabel htmlFor="nx-steps">Så gör du *</FieldLabel>
            <FieldDescription>Ett steg per rad. Skriv som du skulle säga det till patienten.</FieldDescription>
            <Textarea id="nx-steps" autoFocus={!!initialName} placeholder={"Stå med fötterna höftbrett isär.\nGå långsamt bakåt tio steg.\nVänd och gå tillbaka."} value={steps} onChange={(e) => setSteps(e.target.value)} />
          </Field>
          <Disclosure summary="Fler fält (valfritt)" defaultOpen={!!(tip || avoid || why)}>
            <FieldGroup className="mt-1.5 gap-3">
              <TextField id="nx-tip" label="Tänk på" value={tip} onChange={setTip} placeholder="T.ex. Titta framåt, inte ner i golvet" />
              <TextField id="nx-avoid" label="Undvik" value={avoid} onChange={setAvoid} placeholder="T.ex. Släpa inte fötterna" />
              <TextField id="nx-why" label="Varför den här övningen?" value={why} onChange={setWhy} placeholder="T.ex. Tränar balans och koordination" />
            </FieldGroup>
          </Disclosure>
        </Card>

        <Button variant="default" size="xl" className="w-full" onClick={save}>
          <CheckIcon className="size-5" weight="bold" /> {editing ? "Spara ändringarna" : forPatient ? "Spara och lägg till i programmet" : "Spara i övningsbanken"}
        </Button>
        <p className="text-center text-[.9rem] text-muted-foreground">* måste fyllas i</p>
      </SheetDialog>
      <ConfirmDialog open={confirmDiscard} onOpenChange={setConfirmDiscard} title="Kasta övningen?" description="Det du har fyllt i sparas inte." confirmLabel="Kasta övningen" onConfirm={onClose} cancelLabel="Fortsätt redigera" />
    </>
  );
}

function TextField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
