# Fysi MVP

Clickable MVP for user tests: a home-exercise platform for physiotherapy (patient app, physio view, feedback form). Swedish UI. All data is fake mock data in memory.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui (style `radix-nova`, config in `components.json`, components in `src/components/ui/`)
- Always use the latest stable release of packages (no previews/betas).

## UI rule: shadcn first

**Before writing any UI element, check the shadcn registry for a matching component. Do not use plain HTML tags for things shadcn covers.**

- Look it up: `npx shadcn@latest search @shadcn -q "<thing>"` or `npx shadcn@latest view @shadcn/<name>`, or browse https://ui.shadcn.com/docs/components.
- Add it: `npx shadcn@latest add <name>` (never hand-copy component code).
- Use `Button` instead of `<button>`, `Input`/`Textarea`/`Select`/`Switch`/`Checkbox`/`RadioGroup` instead of form tags, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardAction`) instead of card divs, `Badge` for tags, `Dialog`/`AlertDialog` for modals, `Tabs`, `Toggle`/`ToggleGroup` for pressable chips and segmented controls, `Table` for tables, `Collapsible` instead of `<details>`, `Progress` for bars, `Avatar` for initials, `sonner` (`toast`, `toast.success`, `toast.warning`, `toast.info`) for toasts.
- Forms: `Field`, `FieldLabel`, `FieldDescription`, `FieldSet`/`FieldLegend`, `FieldGroup`. Inputs with an icon or button inside: `InputGroup`. Joined buttons (− 4 +): `ButtonGroup`.
- Lists of rows (avatar/icon + title + description + action): `Item` (`ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`) inside `ItemGroup`. A whole clickable row is `Item asChild` around a `<button>` or `Link`.
- Callouts and info boxes: `Alert` with a tone variant (`brand`, `success`, `warning`, `danger`, `info`), a lucide icon as first child, and `AlertTitle`/`AlertDescription`. Wrap mixed inline content in `AlertDescription` (Alert is a grid).
- Empty states: `Empty` (`EmptyHeader`, `EmptyMedia variant="icon"`, `EmptyTitle`, `EmptyDescription`).
- Chat: `MessageGroup`/`Message`/`MessageHeader`/`MessageFooter` with `Bubble`/`BubbleContent` (variants `hero` for own messages, `card` for the other side), `Attachment*` for picked files, `Marker` for status lines. Keyboard hints: `Kbd`.
- Icons are lucide components, never text glyphs (`×`, `+`, `−`, `↑`, `›`): glyphs don't centre.
- If the look must differ, add a variant or size to the component in `src/components/ui/` (as done for `Button`, `Toggle`, `Badge`, `Card`, `Switch`, `Alert`, `Item`, `Bubble`, `Field`, `InputGroup`) rather than bypassing it. Adding with the CLI: answer "no" to overwriting existing files so the customisations stay.
- Plain tags are fine for layout (`div`, `section`, `nav`, headings, text) and for SVG figures/charts.

## Project layout

Frontend-only prototype: all data is mock data in memory, a reload resets it. No backend, no persistence.

- `src/router.tsx` – React Router (hash router, works on GitHub Pages). Routes: `/`, `/patient/:patientId/(progress|chat)`, `/fysio` (overview, patients, `patients/:patientId/(program|messages)`, bank, messages), `/feedback`, `/settings` (text size).
- The header holds the role switch, the test-patient picker (only on patient routes) and the settings link.
- `src/pages/` – one file per route, grouped by section (`patient/`, `fysio/`, `fysio/profile/`, `feedback/`). Pages compose components; keep logic out of them where possible.
- `src/components/` – feature components (`patient/`, `fysio/`, `chat/`, `exercise/`, `pain/`, `charts/`, `progress/`, `feedback/`, `layout/`) and small shared ones in `common/`. `ui/` is shadcn only.
- `src/state/` – `AppProvider` (React context + `useState`) and hooks `useApp`, `usePatient`, `useExercises`. Text size (`textSize`, `TEXT_SIZES`) lives here too, outside the demo data so "reset" keeps it. Change data with `update((draft) => { ... })`; keep toasts and other side effects outside the callback. UI-only state (forms, open dialogs, drafts) stays local in components.
- `src/data/` – types, mock seed, exercise library, poses, body-map regions, templates, feedback tasks.
- `src/lib/` – pure helpers: dates, stats (adherence, pain trend…), search, body-map geometry, media.
- `src/hooks/` – custom hooks.
- Charts use shadcn `chart` (recharts).
- Styling: Tailwind classes only. Theme tokens (palette, radius, font) live in `src/index.css`; use them as `bg-brand-soft`, `text-warning-foreground`, `bg-danger-soft` etc. No separate CSS files.
- `legacy/index.html` – the original single-file version, kept for reference only.

## Commands

- `npm run dev` – dev server
- `npm run build` – typecheck + production build (`dist/`, relative paths so it works on GitHub Pages)
- `npm run lint` – ESLint (typescript-eslint, react-hooks, react-refresh)

TypeScript is pinned to 6.0.x because typescript-eslint does not support TS 7 yet.
