import { ChatCircleIcon, HouseIcon, SquaresFourIcon, UsersIcon } from "@phosphor-icons/react";
import { NavLink, Outlet, matchPath, useLocation } from "react-router";
import { FysioHeader } from "@/components/layout/FysioHeader";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { useApp } from "@/state/app-context";
import { SidebarProfile } from "@/components/fysio/SidebarProfile";
import { cn } from "@/lib/utils";

/**
 * Physio shell: shadcn sidebar and content. On desktop the sidebar collapses to an
 * icon rail (never fully hidden); on mobile it is a sheet.
 * Like GitHub, the content is centred on the whole viewport and only moves right
 * when the sidebar would otherwise cover it.
 */
export function FysioLayout() {
  const { state } = useApp();
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const unread = state.order.reduce((s, id) => s + state.patients[id].unread, 0);
  // The program builder has three columns and uses the full screen width.
  const wide = !!matchPath("/fysio/patients/:patientId/program", pathname);
  const links = [
    { to: "/fysio", label: "Översikt", icon: HouseIcon, end: true },
    { to: "/fysio/patients", label: "Patienter", icon: UsersIcon, end: false },
    { to: "/fysio/bank", label: "Övningsbank", icon: SquaresFourIcon, end: false },
    { to: "/fysio/messages", label: "Meddelanden", icon: ChatCircleIcon, end: false, count: unread },
  ];

  return (
    <div className="relative">
      <FysioHeader />
      <Sidebar collapsible="icon" className="top-(--header-height) h-[calc(100svh-var(--header-height))]">
        <SidebarContent>
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupContent>
              <nav aria-label="Fysioterapeutmeny">
                <SidebarMenu className="gap-1">
                  {links.map(({ to, label, icon: Icon, end, count }) => (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild size="nav" isActive={!!matchPath({ path: to, end }, pathname)} tooltip={count ? `${label} (${count} ${count === 1 ? "oläst" : "olästa"})` : label}>
                        <NavLink to={to} end={end} onClick={() => isMobile && setOpenMobile(false)}>
                          <Icon />
                          <span>{label}</span>
                          {!!count && <span aria-hidden className="absolute top-2 right-2 hidden size-2.5 rounded-full bg-brand ring-2 ring-sidebar group-data-[collapsible=icon]:block" />}
                        </NavLink>
                      </SidebarMenuButton>
                      {!!count && <SidebarMenuBadge className="right-2.5 rounded-full bg-brand-muted text-brand">{count}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <SidebarProfile />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <section
        className={cn(
          "grid content-start gap-4.5 pt-6 pb-10 transition-[margin] duration-200 ease-linear [--content-width:70rem] [--gutter:max(2.5vw,16px)] [--sidebar-offset:0px] md:[--sidebar-offset:var(--sidebar-width-icon)] mr-[max(var(--gutter),calc((100%-var(--content-width))/2))] ml-[max(calc(var(--sidebar-offset)+var(--gutter)),calc((100%-var(--content-width))/2))] md:peer-data-[state=expanded]:[--sidebar-offset:var(--sidebar-width)]",
          wide && "[--content-width:120rem]",
        )}>
        <Outlet />
      </section>
    </div>
  );
}
