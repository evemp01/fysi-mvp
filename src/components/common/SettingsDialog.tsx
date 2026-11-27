import { ChatCircleIcon, DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TODAY, capitalize, formatLong } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { TEXT_SIZES, useApp } from "@/state/app-context";

const THEMES = [
  { value: "light", label: "Ljust", icon: SunIcon },
  { value: "dark", label: "Mörkt", icon: MoonIcon },
  { value: "system", label: "Som enheten", icon: DesktopIcon },
] as const;
type ThemeChoice = (typeof THEMES)[number]["value"];

const isThemeChoice = (v: string): v is ThemeChoice => THEMES.some((t) => t.value === v);
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Sample of the physio view for the preview. */
function PhysioPreview() {
  return (
    <>
      <div className="leading-tight">
        <p className="text-[1.15rem] font-extrabold">God morgon, Erik</p>
        <p className="text-[.85rem] text-muted-foreground">{capitalize(formatLong(TODAY))}</p>
      </div>
      <Item variant="card" size="sm">
        <ItemMedia variant="icon" className="bg-warning-soft text-warning-foreground">
          <ChatCircleIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Anna väntar på svar</ItemTitle>
          <ItemDescription>Svara senast i morgon kl 16.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Svara</Button>
        </ItemActions>
      </Item>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">På spår</Badge>
        <Badge variant="danger">Över smärtgräns</Badge>
        <Badge variant="info">På plats</Badge>
      </div>
    </>
  );
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the preview shows. Defaults to a sample of the physio view. */
  preview?: ReactNode;
}

/** Text size and theme. Changes show in a preview first and only apply on "Spara". */
export function SettingsDialog({ open, onOpenChange, preview }: SettingsDialogProps) {
  const [saving, setSaving] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent showCloseButton={!saving} className="max-h-[92svh] overflow-y-auto sm:max-w-xl">
        {/* Content unmounts when the dialog closes, so the drafts start from the saved values on every open. */}
        <SettingsForm saving={saving} setSaving={setSaving} preview={preview} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface SettingsFormProps {
  saving: boolean;
  setSaving: (saving: boolean) => void;
  preview?: ReactNode;
  onDone: () => void;
}

function SettingsForm({ saving, setSaving, preview = <PhysioPreview />, onDone }: SettingsFormProps) {
  const { textSize, setTextSize } = useApp();
  const { theme = "system", systemTheme, setTheme } = useTheme();
  const [size, setSize] = useState(textSize);
  const [themeDraft, setThemeDraft] = useState<ThemeChoice>(isThemeChoice(theme) ? theme : "system");

  const previewScheme = themeDraft === "system" ? (systemTheme ?? "light") : themeDraft;
  // The whole UI is sized in rem, so zooming the preview by new/current root size shows the real result.
  const zoom = parseFloat(TEXT_SIZES[size].value) / parseFloat(TEXT_SIZES[textSize].value);

  async function save() {
    setSaving(true);
    await nextFrame(); // paint the spinner before the whole page re-lays out
    setTheme(themeDraft);
    setTextSize(size);
    await nextFrame(); // the new root size is applied and laid out...
    await nextFrame(); // ...and painted
    setSaving(false);
    onDone();
    toast.success("Inställningarna är sparade");
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Inställningar</DialogTitle>
        <DialogDescription>Anpassa appen så att den känns rätt för dig.</DialogDescription>
      </DialogHeader>

      <FieldSet disabled={saving}>
        <FieldLegend>Tema</FieldLegend>
        <ToggleGroup
          type="single"
          spacing={1}
          aria-label="Tema"
          value={themeDraft}
          onValueChange={(v) => v && setThemeDraft(v as ThemeChoice)}
          className="grid w-full grid-cols-3 gap-1 rounded-[14px] border bg-background p-1">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem key={value} variant="seg" size="seg" value={value}>
              <Icon /> {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <FieldSet disabled={saving}>
        <FieldLegend>Textstorlek</FieldLegend>
        <FieldDescription>Gäller hela appen, både patientappen och fysioterapeutens vy.</FieldDescription>
        <RadioGroup value={String(size)} onValueChange={(v) => setSize(Number(v))} aria-label="Textstorlek" className="grid-cols-2 sm:grid-cols-4">
          {TEXT_SIZES.map((s, i) => (
            <FieldLabel key={s.value} htmlFor={`settings-text-size-${i}`}>
              <Field orientation="horizontal">
                <RadioGroupItem value={String(i)} id={`settings-text-size-${i}`} />
                <FieldContent>
                  {/* Fixed px so each option shows its own size, whatever is selected. */}
                  <span aria-hidden="true" className="leading-none font-extrabold" style={{ fontSize: `${(parseFloat(s.value) / 100) * 22}px` }}>
                    Aa
                  </span>
                  <FieldTitle className="font-medium">{s.label}</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Förhandsvisning</FieldLegend>
        <FieldDescription>Så här ser appen ut med dina val. Inget ändras förrän du sparar.</FieldDescription>
        {/* color-scheme drives the light-dark() palette; the class covers shadcn's dark: variants. */}
        <div className={cn("overflow-hidden rounded-[14px] border", previewScheme === "dark" && "dark")} style={{ colorScheme: previewScheme }}>
          <div inert className="grid gap-3 bg-background p-3.5 text-foreground" style={{ zoom }}>
            {preview}
          </div>
        </div>
      </FieldSet>

      <DialogFooter>
        <DialogClose asChild>
          <Button disabled={saving}>Avbryt</Button>
        </DialogClose>
        <Button variant="default" onClick={save} disabled={saving}>
          {saving && <Spinner />}
          {saving ? "Sparar…" : "Spara"}
        </Button>
      </DialogFooter>
    </>
  );
}
