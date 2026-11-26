import { MagnifyingGlassIcon, PlusIcon, StarIcon, XIcon } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { TEMPLATES } from "@/data/templates";
import type { Exercise } from "@/data/types";
import { EMPTY_FILTERS, filterCount, matchesFilters, searchExercises, type Filters } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useApp, useExercises } from "@/state/app-context";
import { LibraryFilters } from "./LibraryFilters";
import { LibraryTile, NewExerciseTile } from "./LibraryTile";

export type BankTab = "alla" | "fav" | "egna";

type Props =
  | {
      mode: "program";
      /** Exercise ids already in the program being edited. */
      selected: string[];
      onToggle: (id: string) => void;
      onTemplate: (index: number) => void;
      onCreate: (name: string) => void;
    }
  | { mode: "bank"; tab: BankTab; onOpen: (id: string) => void; onCreate: (name: string) => void };

const SectionTitle = ({ children }: { children: ReactNode }) => <h4 className="col-span-full mt-1">{children}</h4>;
const Info = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("col-span-full mt-1 text-[.9rem] text-muted-foreground", className)}>{children}</div>;

/** Searchable exercise grid, used by the program builder and the exercise bank. */
export function ExerciseLibrary(props: Props) {
  const { state, update } = useApp();
  const { exercises, getExercise } = useExercises();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const bank = props.mode === "bank";

  const inTab = (e: Exercise) => !bank || props.tab === "alla" || (props.tab === "fav" ? state.favorites.includes(e.id) : !!e.custom);
  const visible = (e: Exercise) => matchesFilters(e, filters) && inTab(e);
  const result = query.trim() ? searchExercises(query, exercises) : null;
  const hits = result ? result.hits.filter((h) => visible(h.exercise)) : exercises.filter(visible).map((exercise) => ({ exercise, why: undefined }));
  const usedIn = (id: string) => state.order.filter((pid) => state.patients[pid].program.items.some((it) => it.exerciseId === id)).length;

  const toggleFavorite = (e: Exercise) => {
    const fav = state.favorites.includes(e.id);
    update((d) => void (d.favorites = fav ? d.favorites.filter((x) => x !== e.id) : [...d.favorites, e.id]));
    toast(fav ? "Borttagen från favoriter." : `${e.name} är en favorit.`);
  };

  const tile = (e: Exercise, why?: string, key = e.id) =>
    props.mode === "bank" ? (
      <LibraryTile key={key} exercise={e} why={why} usedIn={usedIn(e.id)} favorite={state.favorites.includes(e.id)} actionLabel="Visa" onClick={() => props.onOpen(e.id)} onFavorite={() => toggleFavorite(e)} />
    ) : (
      <LibraryTile
        key={key}
        exercise={e}
        why={why}
        selected={props.selected.includes(e.id)}
        favorite={state.favorites.includes(e.id)}
        actionLabel={props.selected.includes(e.id) ? "Ta bort" : "Lägg till"}
        onClick={() => props.onToggle(e.id)}
        onFavorite={() => toggleFavorite(e)}
      />
    );

  const openFirst = () => {
    const first = hits[0]?.exercise;
    if (!first) return;
    if (props.mode === "bank") return props.onOpen(first.id);
    if (props.selected.includes(first.id)) return toast.info(`${first.name} finns redan i programmet.`);
    props.onToggle(first.id);
    setQuery("");
  };

  const filtering = !!query.trim() || filterCount(filters) > 0 || filters.area !== "Alla";
  let content: ReactNode;
  if (filtering) {
    content = (
      <>
        <Info>
          <strong>
            {hits.length} {hits.length === 1 ? "träff" : "träffar"}
          </strong>
          {result?.corrections.length ? ` · Visar träffar för ”${result.corrections.join("”, ”")}”` : ""}
          {result?.partial && " · Ingen övning matchade alla ord, här är de närmaste"}{" "}
          <Button
            variant="link"
            size="inline-sm"
            onClick={() => {
              setQuery("");
              setFilters(EMPTY_FILTERS);
            }}>
            Rensa
          </Button>
        </Info>
        {props.mode === "program" && result && result.templates.length > 0 && (
          <Info className="flex flex-wrap gap-1.5">
            {result.templates.map((i) => (
              <Button key={i} variant="chip" size="chip-sm" onClick={() => props.onTemplate(i)}>
                Använd mallen {TEMPLATES[i].name}
              </Button>
            ))}
          </Info>
        )}
        {hits.map((h) => tile(h.exercise, h.why))}
        {!(bank && props.tab === "fav") && <NewExerciseTile query={query.trim()} onClick={() => props.onCreate(query.trim())} />}
        {!hits.length && <Info>Ingen övning matchar. Skapa den som egen övning, eller ta bort några filter.</Info>}
      </>
    );
  } else if (props.mode === "bank") {
    const list = exercises.filter(visible);
    content =
      props.tab === "fav" && !list.length ? (
        <Empty className="col-span-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <StarIcon />
            </EmptyMedia>
            <EmptyTitle>Inga favoriter än</EmptyTitle>
            <EmptyDescription>Tryck på stjärnan på en övning för att spara den här.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {props.tab !== "fav" && <NewExerciseTile query="" onClick={() => props.onCreate("")} />}
          {list.map((e) => tile(e))}
          {props.tab === "egna" && !list.length && <Info>Du har inga egna övningar än. Övningar du skapar, i banken eller för en patient, hamnar här och kan användas för alla patienter.</Info>}
        </>
      );
  } else {
    const favorites = state.favorites.map(getExercise).filter((e): e is Exercise => !!e);
    const recent = state.recent
      .map(getExercise)
      .filter((e): e is Exercise => !!e && !state.favorites.includes(e.id))
      .slice(0, 6);
    content = (
      <>
        <div className="col-span-full mt-1">
          <span className="text-[.9rem] text-muted-foreground">Snabbstart med en mall</span>
          <div className="mt-1 flex gap-1.5 overflow-x-auto pb-0.5">
            {TEMPLATES.map((t, i) => (
              <Button key={t.name} variant="chip" size="chip-sm" className="flex-none" onClick={() => props.onTemplate(i)}>
                <PlusIcon className="size-4" /> {t.name}
              </Button>
            ))}
          </div>
        </div>
        {favorites.length > 0 && (
          <>
            <SectionTitle>Mina favoriter</SectionTitle>
            {favorites.map((e) => tile(e, undefined, `fav-${e.id}`))}
          </>
        )}
        {recent.length > 0 && (
          <>
            <SectionTitle>Senast använda</SectionTitle>
            {recent.map((e) => tile(e, undefined, `recent-${e.id}`))}
          </>
        )}
        <SectionTitle>Alla övningar</SectionTitle>
        <NewExerciseTile query="" onClick={() => props.onCreate("")} />
        {exercises.map((e) => tile(e))}
      </>
    );
  }

  return (
    <Card className="grid gap-2.5 self-start">
      {!bank && (
        <div className="flex items-center justify-between gap-3">
          <h3>Övningsbibliotek</h3>
          <span className="text-[.9rem] text-muted-foreground">{exercises.length} övningar</span>
        </div>
      )}
      <InputGroup className="min-h-13">
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label="Sök övning"
          value={query}
          placeholder="Övning, muskel eller diagnos"
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), openFirst())}
          className="text-[1.02rem] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" aria-label="Rensa sökningen" onClick={() => setQuery("")}>
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <p className="-mt-1 text-[.9rem] text-muted-foreground">
        Förstår synonymer, latin och stavfel, t.ex. ”quadriceps”, ”hälsena” eller ”impingment”. <Kbd>Enter</Kbd> {bank ? "öppnar första träffen." : "lägger till första träffen."}
      </p>
      <LibraryFilters filters={filters} onChange={setFilters} />
      <div className={cn("grid gap-2.5 overflow-auto p-0.5", bank ? "grid-cols-[repeat(auto-fill,minmax(170px,1fr))]" : "max-h-155 grid-cols-[repeat(auto-fill,minmax(130px,1fr))]")}>{content}</div>
    </Card>
  );
}
