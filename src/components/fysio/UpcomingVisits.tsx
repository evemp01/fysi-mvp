import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { formatShort, fromKey } from "@/lib/dates";
import { useApp } from "@/state/app-context";

/** Booked calls and return visits. */
export function UpcomingVisits() {
  const { state } = useApp();
  const patients = state.order.map((id) => state.patients[id]);
  return (
    <ItemGroup className="gap-2">
      {patients
        .filter((p) => p.booking)
        .map((p) => (
          <Item key={`call-${p.id}`} role="listitem" variant="outline" size="sm">
            <ItemMedia>
              <Badge variant="danger" dot={false} className="min-w-[4.5em]">
                Telefon
              </Badge>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{p.name}</ItemTitle>
              <ItemDescription>{p.booking}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      {[...patients]
        .sort((a, b) => (a.nextVisit < b.nextVisit ? -1 : 1))
        .map((p) => (
          <Item key={p.id} role="listitem" variant="outline" size="sm">
            <ItemMedia>
              <Badge dot={false} className="min-w-[4.5em]">
                {formatShort(fromKey(p.nextVisit))}
              </Badge>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{p.name}</ItemTitle>
              <ItemDescription>Återbesök</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="info" dot={false}>
                På plats
              </Badge>
            </ItemActions>
          </Item>
        ))}
    </ItemGroup>
  );
}
