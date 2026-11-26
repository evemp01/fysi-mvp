import type { Program } from "@/data/types";

/** Program being edited, plus the patient-level settings saved with it. */
export interface ProgramDraft extends Program {
  weeks: number;
  painLimit: number;
}
