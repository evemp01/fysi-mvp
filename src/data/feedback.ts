export type Role = "Fysioterapeut" | "Patient";

export const TASKS: { id: string; role: Role; text: string }[] = [
  {
    id: "f1",
    role: "Fysioterapeut",
    text: "Skapa ett program med 3 övningar åt Lisa: välj övningar, set, repetitioner och hur många pass i veckan.",
  },
  {
    id: "f2",
    role: "Fysioterapeut",
    text: "Ta reda på hur det går för Olof. Har han tränat, och hur har smärtan ändrats?",
  },
  {
    id: "f3",
    role: "Fysioterapeut",
    text: "Lägg till en egen övning som inte finns i biblioteket.",
  },
  {
    id: "f4",
    role: "Fysioterapeut",
    text: "Hitta en övning genom att söka på en muskel eller diagnos, t.ex. ”quadriceps” eller ”hälsena”.",
  },
  {
    id: "f5",
    role: "Fysioterapeut",
    text: "Gå till Övningsbanken, gör en övning till favorit och lägg till den i en patients program.",
  },
  {
    id: "f6",
    role: "Fysioterapeut",
    text: "Skriv en anteckning om Olof och exportera en sammanfattning till journalen.",
  },
  {
    id: "f7",
    role: "Fysioterapeut",
    text: "Lägg till en egen video till en övning för en viss patient.",
  },
  {
    id: "p1",
    role: "Patient",
    text: "Hitta instruktionerna för en av övningarna i ditt pass.",
  },
  {
    id: "p2",
    role: "Patient",
    text: "Logga ett pass: hur mycket du gjorde och hur ont du har. Flagga en övning som kändes konstig.",
  },
  {
    id: "p3",
    role: "Patient",
    text: "Skriv ett meddelande till din fysioterapeut.",
  },
  {
    id: "p4",
    role: "Patient",
    text: "Beskriv din smärta för fysioterapeuten: var det gör ont och hur det känns.",
  },
  {
    id: "p5",
    role: "Patient",
    text: "Lägg till en egen anteckning på en övning, något du vill komma ihåg.",
  },
  {
    id: "p6",
    role: "Patient",
    text: "Kör ett träningspass med timern och logga det efteråt.",
  },
  {
    id: "p7",
    role: "Patient",
    text: "Ändra tiden för din påminnelse, eller stäng av den.",
  },
];

export const RESULTS = ["Klarade det", "Med lite hjälp", "Klarade inte"] as const;
