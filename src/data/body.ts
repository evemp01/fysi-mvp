export type BodyView = "fram" | "bak";
/** name, cx, cy, rx, ry */
export type Region = [string, number, number, number, number];

/** Tappable regions on the full-body figure (viewBox 0 0 160 300). */
export const REGIONS: Record<BodyView, Region[]> = {
  fram: [
    ["Höger axel", 52, 64, 11, 10],
    ["Vänster axel", 108, 64, 11, 10],
    ["Bröst", 80, 84, 19, 11],
    ["Mage", 80, 120, 17, 13],
    ["Höger handled", 37, 150, 8, 8],
    ["Vänster handled", 123, 150, 8, 8],
    ["Höger höft", 64, 146, 10, 9],
    ["Vänster höft", 96, 146, 10, 9],
    ["Höger lår", 65, 180, 10, 15],
    ["Vänster lår", 95, 180, 10, 15],
    ["Höger knä", 64, 214, 10, 10],
    ["Vänster knä", 96, 214, 10, 10],
    ["Höger fotled", 62, 276, 8, 8],
    ["Vänster fotled", 98, 276, 8, 8],
  ],
  bak: [
    ["Nacke", 80, 47, 9, 7],
    ["Vänster skulderblad", 61, 78, 9, 12],
    ["Höger skulderblad", 99, 78, 9, 12],
    ["Övre rygg", 80, 92, 8, 12],
    ["Ländrygg", 80, 124, 16, 10],
    ["Vänster säte", 66, 151, 12, 10],
    ["Höger säte", 94, 151, 12, 10],
    ["Vänster baksida lår", 65, 185, 10, 15],
    ["Höger baksida lår", 95, 185, 10, 15],
    ["Vänster vad", 63, 242, 9, 14],
    ["Höger vad", 97, 242, 9, 14],
    ["Vänster häl", 62, 284, 8, 6],
    ["Höger häl", 98, 284, 8, 6],
  ],
};

export interface ZoomGroup {
  title: string;
  /** x, y, width, height of the zoomed viewBox */
  box: [number, number, number, number];
  /** Midline group (back/neck): zone names are not prefixed with a side. */
  mid?: boolean;
  fram?: Region[];
  bak?: Region[];
}

/** Fine zones per body part, written for the right side (front) / left side (back). */
export const ZOOM_GROUPS: Record<string, ZoomGroup> = {
  knee: {
    title: "knä och lår",
    box: [42, 158, 46, 102],
    fram: [
      ["lår, framsida", 65, 182, 6, 11],
      ["lår, utsida", 56, 184, 3.5, 10],
      ["lår, insida", 74, 184, 3.5, 10],
      ["knäskål", 64, 212, 5.5, 5.5],
      ["knä, utsida", 55, 213, 3.5, 6],
      ["knä, insida", 73, 213, 3.5, 6],
      ["knä, under knäskålen", 64, 225, 5, 4],
      ["smalben", 63, 247, 5, 12],
    ],
    bak: [
      ["lår, baksida", 65, 184, 6, 12],
      ["lår, utsida", 56, 184, 3.5, 10],
      ["lår, insida", 74, 184, 3.5, 10],
      ["knäveck", 64, 214, 6, 5],
      ["knä, utsida", 55, 213, 3.5, 6],
      ["knä, insida", 73, 213, 3.5, 6],
      ["vad", 63, 243, 6, 13],
    ],
  },
  hip: {
    title: "höft och säte",
    box: [40, 120, 52, 74],
    fram: [
      ["höft, framsida", 63, 142, 6, 5],
      ["ljumske", 72, 153, 4, 4],
      ["höft, utsida", 51, 147, 3.5, 8],
      ["lår, framsida", 65, 176, 6, 10],
      ["lår, utsida", 56, 177, 3.5, 9],
    ],
    bak: [
      ["säte", 66, 148, 9, 7],
      ["sittben", 71, 160, 4, 3.5],
      ["höft, utsida", 51, 147, 3.5, 8],
      ["lår, baksida", 65, 180, 6, 10],
    ],
  },
  arm: {
    title: "axel och arm",
    box: [20, 40, 66, 124],
    fram: [
      ["axel, ovansida", 59, 58, 6, 3.5],
      ["axel, framsida", 55, 67, 5, 5],
      ["axel, utsida", 46, 69, 3.5, 6],
      ["överarm", 44, 92, 5, 11],
      ["armbåge", 41, 111, 4, 4],
      ["underarm", 39, 133, 4, 10],
      ["handled", 37, 152, 4, 4],
    ],
    bak: [
      ["skuldra", 67, 57, 6, 3.5],
      ["skulderblad", 62, 82, 7, 10],
      ["axel, baksida", 51, 67, 5, 5],
      ["överarm, baksida", 44, 92, 5, 11],
      ["armbåge", 41, 111, 4, 4],
    ],
  },
  foot: {
    title: "fot och fotled",
    box: [40, 252, 44, 46],
    fram: [
      ["fotled, framsida", 62, 272, 4, 4],
      ["fotled, utsida", 54, 277, 3, 4],
      ["fotled, insida", 70, 277, 3, 4],
      ["fotrygg", 57, 289, 6, 3.5],
    ],
    bak: [
      ["hälsena", 62, 265, 3.5, 7],
      ["fotled, utsida", 54, 278, 3, 4],
      ["fotled, insida", 70, 278, 3, 4],
      ["häl", 60, 290, 6, 4],
    ],
  },
  back: {
    title: "Rygg och nacke",
    box: [42, 32, 76, 124],
    mid: true,
    bak: [
      ["Nacke", 80, 47, 6, 6],
      ["Mellan skulderbladen", 80, 78, 5, 8],
      ["Bröstrygg, vänster sida", 69, 96, 5, 8],
      ["Bröstrygg, höger sida", 91, 96, 5, 8],
      ["Ländrygg, mitten", 80, 124, 5, 7],
      ["Ländrygg, vänster sida", 68, 124, 5, 7],
      ["Ländrygg, höger sida", 92, 124, 5, 7],
      ["Korsrygg", 80, 142, 7, 5],
    ],
  },
};

/** Which zoom group a region (without side prefix) opens. */
export const REGION_GROUP: Record<string, string> = {
  axel: "arm",
  handled: "arm",
  skulderblad: "arm",
  höft: "hip",
  säte: "hip",
  lår: "knee",
  knä: "knee",
  "baksida lår": "knee",
  vad: "knee",
  fotled: "foot",
  häl: "foot",
};

export const PAIN_TYPES = [
  {
    name: "Molande",
    description: "Dov, ihållande värk",
  },
  {
    name: "Huggande",
    description: "Plötslig och skarp",
  },
  {
    name: "Brännande",
    description: "Het eller svidande",
  },
  {
    name: "Stickande",
    description: "Som nålar",
  },
  {
    name: "Pirrande",
    description: "Myrkrypningar eller domning",
  },
  {
    name: "Strålande",
    description: "Sprider sig ut",
  },
  {
    name: "Stelt",
    description: "Svårt att röra sig",
  },
  {
    name: "Krampande",
    description: "Drar ihop sig",
  },
] as const;
