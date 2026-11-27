import { TODAY, addDays, toKey, weekStart } from "@/lib/dates";
import { EXERCISES } from "./exercises";
import type { Effort, Patient, Program } from "./types";

const at = (days: number, offsetMs = 0) => addDays(TODAY, days).getTime() + offsetMs;

function patient(p: Partial<Patient> & Pick<Patient, "id" | "name" | "firstName" | "age" | "diagnosis" | "nextVisit" | "program">): Patient {
  return {
    since: null,
    weeks: 6,
    painLimit: 4,
    logs: [],
    messages: [],
    unread: 0,
    seenByPatient: false,
    booking: null,
    physioNotes: [],
    patientNotes: {},
    reminder: { on: true, time: "18:00", days: [0, 1, 2, 3, 4, 5, 6], onlyIfNotTrained: true },
    ...p,
  };
}

const program = (perWeek: number, items: [string, number, number, string?][]): Program => ({
  frequency: "week",
  perWeek,
  perDay: 1,
  items: items.map(([exerciseId, sets, reps, note = ""]) => ({ exerciseId, sets, reps, note })),
});

/** Deterministic fake training history. */
function addLogs(p: Patient, days: number, rate: number, painFrom: number, painTo: number, area: string, type: string, random: () => number) {
  for (let i = days; i >= 1; i--) {
    if (random() > rate) continue;
    const date = toKey(addDays(TODAY, -i));
    const items: Patient["logs"][number]["items"] = {};
    for (const it of p.program.items) {
      const q = random();
      const isSec = EXERCISES.find((e) => e.id === it.exerciseId)?.unit === "sek";
      const sets = q < 0.1 ? it.sets - 1 : it.sets;
      const reps = q > 0.85 ? Math.max(1, it.reps - (isSec ? 10 : 3)) : it.reps;
      items[it.exerciseId] = { sets: Array(sets).fill(reps), flag: null, comment: "" };
    }
    const pain = Math.max(0, Math.min(10, Math.round(painFrom + ((painTo - painFrom) * (days - i)) / days + (random() - 0.5) * 1.6)));
    const q = random();
    const effort: Effort = q < 0.25 ? "Lätt" : q < 0.85 ? "Lagom" : "Tungt";
    p.logs.push({ id: `${date}-a`, date, items, pain, area: pain ? [area] : [], type: pain ? [type] : [], note: "", effort });
  }
}

export interface AppData {
  patients: Record<string, Patient>;
  order: string[];
}

export function createSeed(): AppData {
  let s = 11;
  const random = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // Olof started on the Monday three weeks before this one, so week 1 is a full week and he's in week 4.
  const olofStart = addDays(weekStart(TODAY), -21);

  const olof = patient({
    id: "olof",
    name: "Olof Berg",
    firstName: "Olof",
    age: 71,
    diagnosis: "Knäartros, höger knä",
    nextVisit: toKey(addDays(TODAY, 8)),
    since: toKey(olofStart),
    weeks: 8,
    program: program(4, [
      ["knaboj", 3, 10, "Använd köksstolen. Gå bara så djupt som känns okej."],
      ["knastrack", 3, 12],
      ["balans", 3, 30, "Stå vid diskbänken så du kan ta stöd."],
    ]),
    messages: [
      { from: "physio", text: "Hej Olof! Ditt program ligger nu i appen. Hör av dig om något känns konstigt.", time: olofStart.getTime() },
      { from: "patient", text: "Det knakar lite i knät när jag gör knäböjen. Är det farligt?", time: at(-10, -1.3e7) },
      { from: "physio", text: "Knakande utan smärta är vanligt och ofarligt. Fortsätt som vanligt, och minska djupet om det gör ont.", time: at(-9, -0.9e7) },
    ],
    physioNotes: [{ text: "Telefonuppföljning: knät känns stabilare och han går i trappor utan stöd. Fortsätter samma program två veckor till.", time: at(-9, -0.8e7) }],
    patientNotes: { knaboj: [{ text: "Lägg en kudde på stolen, då blir det lagom djupt.", time: at(-6) }] },
  });
  const anna = patient({
    id: "anna",
    name: "Anna Sjöberg",
    firstName: "Anna",
    age: 52,
    diagnosis: "Subakromiell smärta, vänster axel",
    nextVisit: toKey(addDays(TODAY, 13)),
    since: toKey(addDays(TODAY, -17)),
    unread: 1,
    program: program(3, [
      ["armlyft", 3, 10],
      ["vaggarm", 2, 12],
      ["nacke", 2, 10, "Gärna vid datorn under arbetsdagen."],
    ]),
    messages: [
      { from: "physio", text: "Hej Anna! Här är dina övningar för axeln.", time: at(-17) },
      { from: "patient", text: "Det gör ondare i axeln efter armlyften senaste veckan. Ska jag fortsätta?", time: at(-1, -1.1e7), pain: { pain: 5, area: ["Vänster axel, utsida", "Vänster skulderblad"], type: ["Huggande", "Strålande"] } },
    ],
  });
  const karin = patient({
    id: "karin",
    name: "Karin Holm",
    firstName: "Karin",
    age: 63,
    diagnosis: "Hälsenetendinopati, höger",
    nextVisit: toKey(addDays(TODAY, 6)),
    since: toKey(addDays(TODAY, -30)),
    weeks: 10,
    program: program(3, [
      ["tahavning", 3, 15, "Gör nedåtfasen på ett ben."],
      ["balans", 2, 30],
      ["trappsteg", 2, 10],
    ]),
    messages: [{ from: "physio", text: "Hej Karin! Bra jobbat hittills. Vi ökar tåhävningarna till 15 repetitioner.", time: at(-12) }],
  });
  const lisa = patient({
    id: "lisa",
    name: "Lisa Ek",
    firstName: "Lisa",
    age: 34,
    diagnosis: "Långvarig ländryggssmärta",
    nextVisit: toKey(addDays(TODAY, 21)),
    program: program(3, []),
  });

  addLogs(olof, 24, 0.47, 6.3, 2.8, "Höger knä, insida", "Molande", random);
  addLogs(anna, 17, 0.36, 3, 5.6, "Vänster axel, framsida", "Huggande", random);
  addLogs(karin, 30, 0.42, 5, 2, "Höger hälsena", "Stelt", random);

  // Week 1: all 4 sessions (Mon, Wed, Fri, Sun), built from his earliest logs so pain still starts high.
  const week1End = toKey(addDays(olofStart, 6));
  const week1 = [0, 2, 4, 6].map((d, i) => {
    const date = toKey(addDays(olofStart, d));
    return { ...structuredClone(olof.logs[i]), id: `${date}-a`, date };
  });
  olof.logs = [...week1, ...olof.logs.filter((l) => l.date > week1End)];

  const ol = olof.logs,
    al = anna.logs;
  ol[ol.length - 6].items.knaboj = { sets: [8, 8], flag: "Kändes fel", comment: "Knät vek sig lite inåt på sista setet." };
  ol[ol.length - 2].note = "Lättare att gå i trappan nu.";
  Object.assign(al[al.length - 1], { pain: 6, effort: "Tungt" });
  al[al.length - 1].items.armlyft = { sets: [6, 6], flag: "Gjorde ont", comment: "Hugger till när armen kommer över axelhöjd." };
  al[al.length - 2].items.armlyft.flag = "Gjorde ont";

  return { patients: { olof, anna, karin, lisa }, order: ["olof", "anna", "karin", "lisa"] };
}
