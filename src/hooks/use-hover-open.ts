import { useEffect, useRef, useState, type PointerEvent } from "react";

/**
 * Open state for a Radix menu (e.g. shadcn `DropdownMenu`) that also opens on mouse hover.
 * Click, touch and keyboard keep working as normal; hover only reacts to a mouse.
 * The close delay lets the pointer cross the gap between trigger and content.
 *
 * Use with `modal={false}` so the rest of the page keeps receiving pointer events:
 *   const menu = useHoverOpen();
 *   <DropdownMenu modal={false} open={menu.open} onOpenChange={menu.onOpenChange}>
 *     <DropdownMenuTrigger {...menu.triggerProps}>…
 *     <DropdownMenuContent {...menu.contentProps}>…
 */
export function useHoverOpen({ openDelay = 80, closeDelay = 200 } = {}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const closedByHover = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = (next: boolean, delay = 0, byHover = false) => {
    window.clearTimeout(timer.current);
    const apply = () => {
      closedByHover.current = byHover && !next;
      setOpen(next);
    };
    if (delay) timer.current = window.setTimeout(apply, delay);
    else apply();
  };

  const isMouse = (e: PointerEvent) => e.pointerType === "mouse";
  const hover = {
    onPointerEnter: (e: PointerEvent) => isMouse(e) && set(true, open ? 0 : openDelay),
    onPointerLeave: (e: PointerEvent) => isMouse(e) && set(false, closeDelay, true),
  };

  return {
    open,
    onOpenChange: (next: boolean) => set(next),
    triggerProps: {
      ...hover,
      // Radix toggles on pointerdown; a click on an already hover-opened menu should keep it open.
      onPointerDown: (e: PointerEvent) => {
        if (!isMouse(e)) return;
        e.preventDefault();
        set(true);
      },
    },
    contentProps: {
      ...hover,
      // Don't move focus back to the trigger (and show its focus ring) when the mouse just left.
      onCloseAutoFocus: (e: Event) => closedByHover.current && e.preventDefault(),
    },
  };
}
