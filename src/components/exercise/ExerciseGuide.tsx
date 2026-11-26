import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid list-none gap-2.5 p-0">
      {steps.map((s, i) => (
        <li key={i} className="grid grid-cols-[36px_1fr] items-start gap-2.5 text-[1.08rem]">
          <span className="grid size-8 place-items-center rounded-full bg-brand-muted font-extrabold text-brand">{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}

export function DoDont({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <Alert variant={ok ? "success" : "danger"} className="items-center rounded-xl px-3 py-2.5 *:[svg]:row-span-1 *:[svg]:mt-0">
      {ok ? <CheckCircleIcon className="size-6" /> : <XCircleIcon className="size-6" />}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
