export type Unit = "rep" | "sek";
export type Effort = "Lätt" | "Lagom" | "Tungt";
export type Flag = "Gjorde ont" | "Kändes fel" | "För tungt" | "För lätt";
export type Frequency = "week" | "day";
export type Tone = "brand" | "success" | "warning" | "danger" | "info";

/** Image/video attached to an exercise or a message. Lives in memory only. */
export type MediaItem = { kind: "image"; url: string; name?: string } | { kind: "video"; url: string; name?: string } | { kind: "youtube"; id: string } | { kind: "link"; url: string };

export interface Exercise {
  id: string;
  name: string;
  area: string;
  unit: Unit;
  pose: string;
  steps: string[];
  tip: string;
  why: string;
  avoid: string;
  position: string;
  equipment: string[];
  level: number;
  goals: string[];
  synonyms: string;
  diagnoses: string;
  easier?: string;
  harder?: string;
  tags: string;
  custom?: boolean;
  media?: MediaItem[];
}

export interface ProgramItem {
  exerciseId: string;
  sets: number;
  reps: number;
  note: string;
  /** Patient-specific overrides of the library text. */
  steps?: string[];
  tip?: string;
  media?: MediaItem[];
}

export interface Program {
  frequency: Frequency;
  perWeek: number;
  perDay: number;
  items: ProgramItem[];
}

export interface ProgramTemplate {
  name: string;
  perWeek: number;
  frequency: Frequency;
  perDay?: number;
  keywords: string;
  items: { exerciseId: string; sets: number; reps: number }[];
}

export interface PainReport {
  pain: number;
  area: string[];
  type: string[];
}

export interface ExerciseResult {
  /** Reps (or seconds) done per set. */
  sets: number[];
  flag: Flag | null;
  comment: string;
}

export interface SessionLog {
  id: string;
  date: string;
  items: Record<string, ExerciseResult>;
  pain: number | null;
  area: string[];
  type: string[];
  note: string;
  effort: Effort | null;
}

export interface Message {
  from: "patient" | "physio";
  text: string;
  time: number;
  media?: MediaItem[];
  pain?: PainReport | null;
}

export interface Note {
  text: string;
  time: number;
}

export interface Reminder {
  on: boolean;
  time: string;
  days: number[];
  onlyIfNotTrained: boolean;
}

export interface Patient {
  id: string;
  name: string;
  firstName: string;
  age: number;
  diagnosis: string;
  nextVisit: string;
  since: string | null;
  weeks: number;
  painLimit: number;
  program: Program;
  logs: SessionLog[];
  messages: Message[];
  unread: number;
  seenByPatient: boolean;
  booking: string | null;
  physioNotes: Note[];
  patientNotes: Record<string, Note[]>;
  reminder: Reminder;
}

export interface FeedbackEntry {
  id: string;
  time: number;
  role: string;
  age: string;
  tasks: Record<string, { result?: string; ease?: number }>;
  good: string;
  missing: string;
  unsure: string;
}
