import { Home, LayoutGrid, MessageCircle, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useApp } from "@/state/app-context";

/** Physio shell: sidebar (top bar under 900px) and content. */
export function FysioLayout() {
  const { state } = useApp();
  const unread = state.order.reduce((s, id) => s + state.patients[id].unread, 0);
  const links = [
    { to: "/fysio", label: "Översikt", icon: Home, end: true },
    { to: "/fysio/patients", label: "Patienter", icon: Users },
    { to: "/fysio/bank", label: "Övningsbank", icon: LayoutGrid },
    { to: "/fysio/messages", label: "Meddelanden", icon: MessageCircle, count: unread },
  ];
  return (
    <div className="grid min-h-[calc(100svh-64px)] grid-cols-1 min-[901px]:grid-cols-[230px_minmax(0,1fr)]">
      <nav aria-label="Fysioterapeutmeny" className="flex gap-1 overflow-x-auto border-b bg-card px-3 py-2 min-[901px]:grid min-[901px]:content-start min-[901px]:border-r min-[901px]:border-b-0 min-[901px]:py-4.5">
        {links.map(({ to, label, icon: Icon, end, count }) => (
          <Button key={to} asChild variant="ghost" className="min-h-11.5 flex-none justify-start gap-2.5 border-0 px-3 aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground">
            <NavLink to={to} end={end}>
              <Icon className="size-5" />
              {label}
              {!!count && (
                <Badge dot={false} className="ml-auto bg-brand-muted">
                  {count}
                </Badge>
              )}
            </NavLink>
          </Button>
        ))}
        <Item size="sm" className="mt-4.5 hidden bg-brand-soft min-[901px]:flex">
          <ItemMedia>
            <InitialsAvatar className="size-9">EL</InitialsAvatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-[.9rem]">Erik Lund</ItemTitle>
            <ItemDescription className="text-[.85rem]">
              Leg. fysioterapeut
              <br />
              Vårdcentralen Exempel
            </ItemDescription>
          </ItemContent>
        </Item>
      </nav>
      <section className="grid w-full max-w-310 content-start gap-4.5 px-[max(2.5vw,16px)] pt-6 pb-10">
        <Outlet />
      </section>
    </div>
  );
}
