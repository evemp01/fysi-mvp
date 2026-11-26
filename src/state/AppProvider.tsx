import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSeed } from "@/data/seed";
import { AppContext, TEXT_SIZES, type AppState } from "./app-context";

const initialState = (): AppState => ({
  ...createSeed(),
  customExercises: [],
  favorites: ["knaboj", "bro", "armlyft"],
  recent: ["tahavning", "balans", "nacke"],
  feedback: [],
  messageInfoSeen: false,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [textSize, setTextSize] = useState(0);

  useEffect(() => {
    document.documentElement.style.fontSize = TEXT_SIZES[textSize].value;
  }, [textSize]);

  const update = useCallback((fn: (draft: AppState) => void) => {
    setState((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({ ...initialState(), customExercises: prev.customExercises, feedback: prev.feedback }));
  }, []);

  const value = useMemo(() => ({ state, update, reset, textSize, setTextSize }), [state, update, reset, textSize]);
  return <AppContext value={value}>{children}</AppContext>;
}
