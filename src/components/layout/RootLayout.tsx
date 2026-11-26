import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    // The provider spans the header so the sidebar trigger can live there (like GitHub).
    <TooltipProvider>
      <SidebarProvider className="min-h-0 flex-col [--header-height:3.5rem] sm:[--header-height:4rem]">
        <main className="min-h-svh">
          <Outlet />
        </main>
        <Toaster position="bottom-center" offset={90} />
      </SidebarProvider>
    </TooltipProvider>
  );
}
