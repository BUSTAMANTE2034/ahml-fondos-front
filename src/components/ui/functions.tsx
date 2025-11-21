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