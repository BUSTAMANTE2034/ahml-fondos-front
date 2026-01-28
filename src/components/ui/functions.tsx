export const formatFecha = (isoString: string|null) => {
  if (!isoString)return
  const date = new Date(isoString)

  const day = date.getDate().toString().padStart(2, '0')
  const monthIndex = date.getMonth() // 0-11
  const year = date.getFullYear()

  const meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ]

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'

  hours = hours % 12
  if (hours === 0) hours = 12 // 0 -> 12

  return `${day}-${meses[monthIndex]}-${year} (${hours}:${minutes}${ampm})`
}
export const invertDate = (iso: string | null): string | null => {
  if (!iso) return null

  // iso = "2025-11-26"
  const [year, month, day] = iso.split("-")

  return `${day}-${month}-${year}`
}

export const getRoleLabel = (role: 'admin' | 'manager' | 'archivist' | 'visitor'): string => {
  const roles: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gestor',
    archivist: 'Archivista',
    visitor: 'Visitante',
  }

  return roles[role] ?? 'Desconocido'
}

export const getEntyityLabel = (role: 'fund' | 'section' | 'series' ): string => {
  const roles: Record<string, string> = {
    fund: 'Fondo',
    section: 'Sección',
    series: 'Serie',
  }

  return roles[role] ?? 'Desconocido'
}

export const getAvailabilityLabel = (d: 'available' | 'on_loan' | 'under_review' |'unavailable'): string => {
  const roles: Record<string, string> = {
    available: 'Disponible',
    on_loan: 'Préstamo',
    under_review: 'Revisión',
        unavailable: 'No disponible',
  }

  return roles[d] ?? 'Desconocido'
}
export const addOneDay = (date: string | null | undefined) => {
  if (!date) return undefined
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)  // YYYY-MM-DD
}

export const formatInputDate = (iso: string): string => {
  const d = new Date(iso)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Convierte un string tipo "carta,oficio,media_carta"
 * a un texto legible en español: "Carta, Oficio y Media carta".
 */
export function getReadableDocumentSizes(value?: string | null): string {
  if (!value || value.trim() === "") return "—";

  const items = value
    .split(",")
    .map((item) =>
      item
        .trim()
        .replace(/_/g, " ")              // media_carta → media carta
        .toLowerCase()
    )
    .filter(Boolean);

  if (items.length === 0) return "—";

  // Capitalizar cada uno
  const capitalized = items.map(
    (t) => t.charAt(0).toUpperCase() + t.slice(1)
  );

  // Si es solo uno
  if (capitalized.length === 1) return capitalized[0];

  // Si son dos → "Carta y Oficio"
  if (capitalized.length === 2)
    return `${capitalized[0]} y ${capitalized[1]}`;

  // Si son más → "Carta, Oficio y Media carta"
  return (
    capitalized.slice(0, -1).join(", ") +
    " y " +
    capitalized[capitalized.length - 1]
  );
}

export function parseDocumentSizesToList(value?: string | null): string[] {
  if (!value || value.trim() === "") return [];

  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
export const DOCUMENT_SIZES = [
  { id: "carta", label: "Carta" },
  { id: "oficio", label: "Oficio" },
  { id: "legal", label: "Legal" },
  { id: "media_carta", label: "Media carta" },
  { id: "doble_carta", label: "Doble carta" }
];

// catalog_diagnosis-concepts.ts
export const DIAGNOSIS_CONCEPTS = [
  { id: 'unidades_documentales', label: 'Unidades documentales' },
  { id: 'deterioros_sustrato', label: 'Deterioros del sustrato' },
  { id: 'material_sustentado', label: 'Material sustentado' },
  { id: 'otro', label: 'Otro' },
]


export function isDateBeforeOrToday(dateString: string): boolean {
  if (!dateString) return false;

  const inputDate = new Date(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate <= today;
}


export const recordFileGrid = `
  grid
  gap-1

  grid-cols-[1.4fr_0.6fr_0.6fr_0.2fr]

  /* MD */
  md:grid-cols-[0.8fr_0.2fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.3fr_0.2fr]

  /* LG */
  lg:grid-cols-[0.8fr_0.2fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.3fr_0.3fr_0.3fr_0.2fr]
`;
