import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-center" offset={90} />
    </>
  );
}
