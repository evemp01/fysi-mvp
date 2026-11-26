import { Chip } from "@/components/common/Chip";
import { Disclosure } from "@/components/common/Disclosure";
import { AREAS, FILTER_GROUPS } from "@/data/exercises";
import { filterCount, type Filters } from "@/lib/search";

const FILTER_KEYS = { pos: "position", eq: "equipment", lvl: "level", goal: "goal" } as const;

export function LibraryFilters({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const count = filterCount(filters);
  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {["Alla", ...AREAS].map((a) => (
          <Chip key={a} size="sm" selected={filters.area === a} onSelect={() => onChange({ ...filters, area: a })}>
            {a}
          </Chip>
        ))}
      </div>
      <Disclosure summary={<>Fler filter{count > 0 && ` · ${count} valda`}</>} defaultOpen={count > 0}>
        {FILTER_GROUPS.map((group) => {
          const key = FILTER_KEYS[group.key];
          const selected = filters[key];
          return (
            <div key={group.key} className="mt-2 grid gap-1">
              <span className="text-[.9rem] text-muted-foreground">{group.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {group.options.map((o) => (
                  <Chip key={o} size="sm" selected={selected.includes(o)} onSelect={() => onChange({ ...filters, [key]: selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o] })}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
          );
        })}
      </Disclosure>
    </>
  );
}
