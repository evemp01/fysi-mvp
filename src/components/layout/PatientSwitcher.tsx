import { useLocation, useNavigate } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/state/app-context";

/** Pick which demo patient the patient app shows; keeps the current tab. */
export function PatientSwitcher({ patientId }: { patientId: string }) {
  const { state } = useApp();
  const navigate = useNavigate();
  const section = useLocation().pathname.split("/")[3] ?? "";
  return (
    <Select value={patientId} onValueChange={(id) => navigate(`/patient/${id}${section ? `/${section}` : ""}`)}>
      <SelectTrigger aria-label="Testa som patient" className="min-h-10 gap-1 bg-card px-2.5 text-[.95rem] sm:min-h-11 sm:gap-2 sm:px-3 sm:text-base">
        <span className="hidden text-muted-foreground md:inline">Testa som</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {state.order.map((id) => (
          <SelectItem key={id} value={id}>
            {state.patients[id].firstName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
