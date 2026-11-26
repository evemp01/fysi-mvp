import { createContext, useContext, useMemo } from "react";
import { EXERCISES } from "@/data/exercises";
import type { AppData } from "@/data/seed";
import type { Exercise, FeedbackEntry } from "@/data/types";

/** Everything the prototype shows. Lives in memory; a reload resets it. */
export interface AppState extends AppData {
  customExercises: Exercise[];
  favorites: string[];
  recent: string[];
  feedback: FeedbackEntry[];
  /** Patient has read "Innan du skriver" once this session. */
  messageInfoSeen: boolean;
}

/** Root font sizes for the "Textstorlek" setting. Everything is sized in rem, so this scales the whole UI. */
export const TEXT_SIZES = [
  { label: "Normal", value: "87.5%" },
  { label: "Större", value: "100%" },
  { label: "Ännu större", value: "112.5%" },
  { label: "Störst", value: "125%" },
] as const;

export interface AppContextValue {
  state: AppState;
  /** Index into TEXT_SIZES. Not part of the demo data, so "reset" keeps it. */
  textSize: number;
  setTextSize: (index: number) => void;
  /** Mutate a copy of the state. Keep side effects (toasts) outside the callback. */
  update: (fn: (draft: AppState) => void) => void;
  reset: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function usePatient(id: string | undefined) {
  const { state } = useApp();
  const patient = id ? state.patients[id] : undefined;
  if (!patient) throw new Error(`Unknown patient: ${id}`);
  return patient;
}

/** Library exercises plus the physio's own. */
export function useExercises() {
  const { state } = useApp();
  return useMemo(() => {
    const exercises = [...EXERCISES, ...state.customExercises];
    const byId = new Map(exercises.map((e) => [e.id, e]));
    return { exercises, getExercise: (id: string) => byId.get(id) };
  }, [state.customExercises]);
}
