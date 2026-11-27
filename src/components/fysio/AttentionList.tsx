import { CheckCircleIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { AttentionItem, AttentionTone } from "@/hooks/useAttentionItems";

const toneClass: Record<AttentionTone, string> = {
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning-foreground",
  info: "bg-info-soft text-info",
};

export function AttentionList({ items }: { items: AttentionItem[] }) {
  if (!items.length)
    return (
      <Empty className="p-5">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CheckCircleIcon />
          </EmptyMedia>
          <EmptyDescription>Inget just nu.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  return (
    <ItemGroup>
      {items.map(({ tone, icon: Icon, title, alert, detail, action, to }) => (
        <Item key={title} role="listitem" variant="outline" size="sm">
          <ItemMedia variant="icon" className={toneClass[tone]}>
            <Icon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription className="line-clamp-1">
              {alert && <strong className="text-danger">{alert}</strong>}
              {detail}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button asChild size="sm">
              <Link to={to}>{action}</Link>
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
