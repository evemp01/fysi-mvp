import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SheetDialogProps {
  open: boolean;
  /** Called when the user tries to close (close button, Esc, backdrop). */
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/** The app's modal: bottom sheet on phones, centered card on larger screens. */
export function SheetDialog({ open, onClose, title, children, className }: SheetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className={cn(
          "top-auto bottom-0 grid max-h-[94svh] w-full max-w-140 translate-y-0 gap-3 overflow-auto rounded-t-3xl rounded-b-none bg-background px-4.5 pt-4.5 pb-5.5 text-[1.0625rem] text-foreground sm:max-w-140",
          "min-[700px]:top-1/2 min-[700px]:bottom-auto min-[700px]:-translate-y-1/2 min-[700px]:rounded-3xl",
          className,
        )}>
        <DialogHeader className="sticky -top-4.5 z-10 flex-row items-center justify-between gap-2.5 bg-background py-1.5">
          <DialogTitle className="text-[1.15rem] leading-snug font-extrabold">{title}</DialogTitle>
          <DialogClose asChild>
            <Button size="icon" aria-label="Stäng">
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
