import type { ProgramTemplate } from "./types";

export const TEMPLATES: ProgramTemplate[] = [
  {
    name: "Knäartros",
    perWeek: 3,
    frequency: "week",
    keywords: "knäartros artros gonartros knä knäprotes",
    items: [
      {
        exerciseId: "knaboj",
        sets: 3,
        reps: 10,
      },
      {
        exerciseId: "knastrack",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "trappsteg",
        sets: 3,
        reps: 10,
      },
      {
        exerciseId: "balans",
        sets: 3,
        reps: 30,
      },
    ],
  },
  {
    name: "Ländrygg",
    perWeek: 3,
    frequency: "week",
    keywords: "ländrygg ländryggssmärta lumbago ryggont rygg",
    items: [
      {
        exerciseId: "bro",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "planka",
        sets: 3,
        reps: 20,
      },
      {
        exerciseId: "benlyft",
        sets: 2,
        reps: 12,
      },
    ],
  },
  {
    name: "Axel",
    perWeek: 3,
    frequency: "week",
    keywords: "axel impingement subakromiell axelsmärta",
    items: [
      {
        exerciseId: "armlyft",
        sets: 3,
        reps: 10,
      },
      {
        exerciseId: "vaggarm",
        sets: 2,
        reps: 12,
      },
      {
        exerciseId: "nacke",
        sets: 2,
        reps: 10,
      },
    ],
  },
  {
    name: "Balans och fallprevention",
    perWeek: 4,
    frequency: "week",
    keywords: "balans fallprevention fall äldre yrsel",
    items: [
      {
        exerciseId: "balans",
        sets: 3,
        reps: 20,
      },
      {
        exerciseId: "tahavning",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "knaboj",
        sets: 2,
        reps: 10,
      },
      {
        exerciseId: "utfall",
        sets: 2,
        reps: 8,
      },
    ],
  },
  {
    name: "Hälsena",
    perWeek: 4,
    frequency: "week",
    keywords: "hälsena achilles tendinopati hälseneinflammation",
    items: [
      {
        exerciseId: "excentrisk",
        sets: 3,
        reps: 15,
      },
      {
        exerciseId: "vadstretch",
        sets: 3,
        reps: 30,
      },
      {
        exerciseId: "balans",
        sets: 2,
        reps: 30,
      },
    ],
  },
  {
    name: "Höftartros",
    perWeek: 3,
    frequency: "week",
    keywords: "höftartros coxartros höft",
    items: [
      {
        exerciseId: "mussla",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "bro",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "hoftfall",
        sets: 3,
        reps: 10,
      },
      {
        exerciseId: "balans",
        sets: 2,
        reps: 30,
      },
    ],
  },
  {
    name: "Nacke och hållning",
    perWeek: 3,
    frequency: "week",
    keywords: "nacke nacksmärta hållning bröstrygg",
    items: [
      {
        exerciseId: "nacke",
        sets: 2,
        reps: 10,
      },
      {
        exerciseId: "rodd",
        sets: 3,
        reps: 12,
      },
      {
        exerciseId: "katt",
        sets: 2,
        reps: 10,
      },
    ],
  },
  {
    name: "Efter knäoperation",
    perWeek: 14,
    frequency: "day",
    perDay: 2,
    keywords: "knäprotes protes operation korsband acl menisk",
    items: [
      {
        exerciseId: "ankelpump",
        sets: 3,
        reps: 20,
      },
      {
        exerciseId: "halglid",
        sets: 3,
        reps: 10,
      },
      {
        exerciseId: "raktben",
        sets: 3,
        reps: 10,
      },
    ],
  },
];
