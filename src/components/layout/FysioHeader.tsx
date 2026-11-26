import { PulseIcon, UsersIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { TODAY, capitalize, formatLong } from "@/lib/dates";

/** Top bar of the physio view: sidebar trigger, logo, greeting and the shortcut to the patient list. */
export function FysioHeader() {
  const { state } = useSidebar();
  return (
    <header data-state={state} className="group/header sticky top-0 z-20 flex h-(--header-height) flex-nowrap items-center border-b bg-card pr-2.5 sm:pr-4">
      {/*
        On desktop with the sidebar open, this block is exactly as wide as the sidebar, so the
        separator continues the sidebar's right border (which sits inside its last pixel, hence -1px).
        Collapsed to icons, the trigger and logo don't fit the rail, so the block takes its natural width.
      */}
      <div className="flex h-full shrink-0 items-center gap-2 pl-2.5 sm:gap-3 sm:pl-4 md:group-data-[state=expanded]/header:w-[calc(var(--sidebar-width)-1px)]">
        <SidebarTrigger className="size-10 border-0 sm:size-11" aria-label="Visa eller dölj meny" />
        <Link to="/" aria-label="Fysi, startsida" className="flex items-center gap-2 text-[1.4rem] font-extrabold tracking-[-0.03em] text-brand">
          <span className="grid size-8 place-items-center rounded-[9px] bg-hero">
            <PulseIcon className="size-5 text-white" weight="bold" />
          </span>
          <span className="hidden sm:inline">Fysi</span>
        </Link>
      </div>
      <Separator orientation="vertical" className="ml-2 h-full self-center md:group-data-[state=expanded]/header:ml-0" />
      <div className="ml-3 grid min-w-0 leading-tight sm:ml-4">
        <span className="truncate text-[1.05rem] font-extrabold tracking-[-0.01em] sm:text-[1.15rem]">God morgon, Erik</span>
        <span className="hidden truncate text-[.85rem] text-muted-foreground sm:block">{capitalize(formatLong(TODAY))}</span>
      </div>
      <Button asChild variant="default" className="ml-auto min-h-0 px-4 py-2 max-sm:size-10 max-sm:px-0">
        <Link to="/fysio/patients" aria-label="Mina patienter">
          <UsersIcon className="size-4.5" />
          <span className="max-sm:hidden">Mina patienter</span>
        </Link>
      </Button>
    </header>
  );
}
