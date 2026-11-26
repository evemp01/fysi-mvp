import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** Optional third choice, e.g. "close without saving". */
  altLabel?: string;
  onAlt?: () => void;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm, altLabel, onAlt, cancelLabel = "Avbryt", destructive }: ConfirmDialogProps) {
  // Run the action first: closing can reset state the action depends on (e.g. a route blocker).
  const close = (fn?: () => void) => () => {
    fn?.();
    onOpenChange(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-3 rounded-3xl bg-background p-4.5 sm:max-w-md">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle className="text-[1.15rem] font-extrabold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[1.08rem] text-foreground">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mx-0 mb-0 grid gap-2 border-0 bg-transparent p-0 sm:flex sm:flex-col">
          <Button variant={destructive ? "destructive" : "default"} className="w-full" onClick={close(onConfirm)}>
            {confirmLabel}
          </Button>
          {altLabel && (
            <Button className="w-full" onClick={close(onAlt)}>
              {altLabel}
            </Button>
          )}
          <Button className="w-full border-transparent" onClick={close()}>
            {cancelLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
