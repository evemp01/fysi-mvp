import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useApp } from "@/state/app-context";

export function Footer() {
  const { reset } = useApp();
  const [confirming, setConfirming] = useState(false);
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t bg-card px-[max(3vw,16px)] py-3.5 text-[.88rem] text-muted-foreground">
      <span>Fysi · MVP för användartester. Patienter, meddelanden och loggar är påhittade exempel.</span>
      <Button variant="link" size="inline-sm" onClick={() => setConfirming(true)}>
        Återställ demodata
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Återställa demodata?"
        description="Alla pass, program och meddelanden du har ändrat i testet tas bort och exempeldatan kommer tillbaka. Inskickad feedback påverkas inte."
        confirmLabel="Återställ"
        destructive
        onConfirm={() => {
          reset();
          toast.success("Demodatan är återställd.");
        }}
      />
    </footer>
  );
}
