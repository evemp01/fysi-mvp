import type { ReactNode } from "react";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { Stepper } from "@/components/common/Stepper";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import type { Frequency } from "@/data/types";
import type { ProgramDraft } from "./types";

const Box = ({ label, children, hint }: { label: string; children: ReactNode; hint: string }) => (
  <Field className="gap-1.5 rounded-[14px] bg-brand-soft p-3 *:w-auto">
    <FieldTitle className="text-[.9rem]">{label}</FieldTitle>
    {children}
    <FieldDescription>{hint}</FieldDescription>
  </Field>
);

/** How often, how long, and the pain limit. */
export function ProgramSettings({ draft, onChange }: { draft: ProgramDraft; onChange: (changes: Partial<ProgramDraft>) => void }) {
  const daily = draft.frequency === "day";
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3">
      <Field className="col-span-full flex-row flex-wrap items-center gap-x-3 gap-y-2 rounded-[14px] bg-brand-soft p-3 *:w-auto">
        <FieldTitle className="basis-full text-[.9rem]">Hur ofta?</FieldTitle>
        <SegmentedControl<Frequency>
          className="flex-[0_1_240px]"
          value={draft.frequency}
          onChange={(frequency) => onChange({ frequency, perDay: frequency === "day" && draft.perDay < 2 ? 2 : draft.perDay })}
          options={[
            { value: "week", label: "Per vecka" },
            { value: "day", label: "Per dag" },
          ]}
        />
        <Stepper label="Antal pass" value={daily ? draft.perDay : draft.perWeek} min={1} max={daily ? 4 : 7} onChange={(v) => onChange(daily ? { perDay: v } : { perWeek: v })} />
        <FieldDescription className="flex-[1_1_160px]">{daily ? "pass om dagen, varje dag. Passar t.ex. tidigt efter operation." : "pass i veckan. Patienten väljer själv vilka dagar."}</FieldDescription>
      </Field>
      <Box label="Programlängd" hint="veckor">
        <Stepper label="Programlängd" value={draft.weeks} min={1} max={26} onChange={(weeks) => onChange({ weeks })} />
      </Box>
      <Box label="Smärtgräns" hint="av 10 på VAS">
        <Stepper label="Smärtgräns" value={draft.painLimit} min={1} max={10} onChange={(painLimit) => onChange({ painLimit })} />
      </Box>
    </div>
  );
}
