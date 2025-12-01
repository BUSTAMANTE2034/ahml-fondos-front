// '@/lib/types/client.ts'
const BASE = import.meta.env.VITE_API_URL
import { ApiError } from './errors'

type ParseMode = 'auto' | 'json' | 'text' | 'blob'

let unauthorizedHandler: null | (() => void | Promise<void>) = null

export function setUnauthorizedHandler(
  fn: (() => void | Promise<void>) | null
) {
  unauthorizedHandler = fn
}

interface ApiInit extends Omit<RequestInit, 'body' | 'headers'> {
  body?: Record<string, any> | string
  headers?: Record<string, string>
  parse?: ParseMode
  /** Para evitar que ciertas peticiones disparen el logout automático */
  skipAuthHandling?: boolean
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: ApiInit = {}
) {
  const {
    body,
    headers,
    parse = 'auto',
    skipAuthHandling = false,
    ...rest
  } = opts

  const finalHeaders = new Headers(headers ?? {})

  let finalBody: BodyInit | undefined
  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json')
    finalBody = typeof body === 'string' ? body : JSON.stringify(body)
  }

  let res: Response

  // -------------------------------------------------------------
  //  TRY / CATCH PARA DETECTAR ERRORES DE RED (NO HAY RESPUESTA)
  // -------------------------------------------------------------
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      headers: finalHeaders,
      ...rest,
      body: finalBody,
    })
    
  } catch (err: any) {
    const offline = !navigator.onLine

    // ------------------------------------------
    // 🔥 1) Sin conexión a internet
    // ------------------------------------------
    if (offline) {
      window.dispatchEvent(new Event('offline'))

      throw new ApiError(
        'No hay conexión a internet.',
        0,
        null
      )
    }

    // ------------------------------------------
    // 🔥 2) Servidor caído / no responde
    // fetch lanza TypeError cuando NO hay respuesta HTTP
    // ------------------------------------------
    if (err instanceof TypeError) {
      window.dispatchEvent(new Event('server-down'))

      throw new ApiError(
        'El servidor no está disponible. Inténtalo más tarde.',
        0,
        null
      )
    }

    // ------------------------------------------
    // Otros errores raros
    // ------------------------------------------
    throw err
  }

  // -------------------------------------------------------------
  //  AQUI YA HAY RESPUESTA HTTP (status code)
  // -------------------------------------------------------------
  const ct = res.headers.get('content-type') || ''

  const parseAuto = async () => {
    if (ct.includes('application/json')) {
      try {
        return await res.json()
      } catch {
        return null
      }
    }
    if (ct.startsWith('text/')) return await res.text()
    return null
  }

  const data =
    parse === 'json'
      ? await res.json().catch(() => null)
      : parse === 'text'
      ? await res.text()
      : parse === 'blob'
      ? await res.blob()
      : await parseAuto()

  // ------------------------------------------
  // 🔐 3) Manejo global de 401
  // ------------------------------------------
  if (res.status === 401 && !skipAuthHandling && unauthorizedHandler) {
    try {
      void unauthorizedHandler()
    } catch {}
  }

  // ------------------------------------------
  // ⚠️ 4) Errores HTTP normales (400, 500, etc.)
  // ------------------------------------------
  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'message' in (data as any)
        ? (data as any).message
        : typeof data === 'string'
        ? data
        : `HTTP ${res.status}`

    throw new ApiError(message, res.status, data)
  }

  return data as T
}
