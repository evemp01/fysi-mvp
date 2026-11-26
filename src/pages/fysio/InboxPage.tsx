import { useSearchParams } from "react-router";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { PhysioThread } from "@/components/fysio/PhysioThread";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { replyBy, waitingMessage } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useApp } from "@/state/app-context";

export function InboxPage() {
  const { state } = useApp();
  const [params, setParams] = useSearchParams();
  const selected = state.patients[params.get("p") ?? "anna"] ?? state.patients[state.order[0]];

  return (
    <>
      <h1>Meddelanden</h1>
      <div className="grid min-h-130 grid-cols-1 overflow-hidden rounded-[18px] border bg-card md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="grid content-start md:border-r">
          {state.order.map((id) => {
            const p = state.patients[id];
            const last = p.messages.at(-1);
            const waiting = waitingMessage(p);
            return (
              <Item key={id} asChild className={cn("flex-nowrap rounded-none border-0 border-b hover:bg-muted", p.id === selected.id && "bg-brand-soft hover:bg-brand-soft")}>
                <button type="button" aria-current={p.id === selected.id} onClick={() => setParams({ p: id })}>
                  <ItemMedia>
                    <InitialsAvatar>{p.firstName[0]}</InitialsAvatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{p.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1">{last ? last.text : "Inga meddelanden"}</ItemDescription>
                  </ItemContent>
                  {waiting && (
                    <ItemActions>
                      <Badge variant={replyBy(waiting.time) < new Date() ? "danger" : "warning"} dot={false}>
                        Väntar
                      </Badge>
                    </ItemActions>
                  )}
                </button>
              </Item>
            );
          })}
        </div>
        <div className="bg-background p-4">
          <PhysioThread key={selected.id} patient={selected} showProfileLink />
        </div>
      </div>
    </>
  );
}
