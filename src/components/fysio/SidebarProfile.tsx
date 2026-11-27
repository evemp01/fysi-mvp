import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useHoverOpen } from "@/hooks/use-hover-open";
import { DotsThreeVerticalIcon, SlidersIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { SettingsDialog } from "@/components/common/SettingsDialog";

export function SidebarProfile() {
  const { isMobile } = useSidebar();
  const menu = useHoverOpen();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false} open={menu.open} onOpenChange={menu.onOpenChange}>
          <DropdownMenuTrigger asChild {...menu.triggerProps}>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-brand-soft data-[state=open]:text-sidebar-accent-foreground hover:bg-brand-soft/50 py-4">
              <InitialsAvatar className="size-9">JD</InitialsAvatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">John Doe</span>
                <span className="truncate text-xs">john@doe.com</span>
              </div>
              <DotsThreeVerticalIcon />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...menu.contentProps} className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <InitialsAvatar className="size-9">JD</InitialsAvatar>
                <div className="grid flex-1 text-left text-sm leading-tight text-foreground">
                  <span className="truncate font-medium">John Doe</span>
                  <span className="truncate text-xs">john@doe.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                <SlidersIcon />
                Inställningar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
