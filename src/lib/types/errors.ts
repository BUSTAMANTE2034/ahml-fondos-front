export class ApiError<TPayload = unknown> extends Error {
  readonly status: number;
  readonly payload: TPayload | null;

  constructor(message: string, status: number, payload: TPayload | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export const isAbortError = (e: unknown): e is DOMException =>
  e instanceof DOMException && e.name === 'AbortError';

export function getApiMessage(err: ApiError | unknown): string | undefined {
  if (err instanceof ApiError) {
    const p = err.payload as any;
    if (p && typeof p === 'object' && 'message' in p) {
      return String(p.message);
    }
  }
  return undefined;
}

export function messageForStatus(err: ApiError): string {
  const backendMsg = getApiMessage(err);
  switch (err.status) {
    // case 401: return 'No autorizado.';
    case 403: return 'Permisos denegados.';
    case 422: return backendMsg || 'Datos inválidos.';
    case 400: return backendMsg || 'Error en la solicitud.';
    default:
      if (err.status >= 500) return 'Error en el servidor.';
      return backendMsg || err.message || 'Error desconocido.';
  }
}


export function getStandarMessageError(err: unknown): string | null {
  if (isAbortError(err)) return null;
  if (!(err instanceof ApiError)) return null;

  if (err.status === 401 || err.status === 403 || err.status === 422 || err.status >= 500) {
    return messageForStatus(err);
  }

  return null;
}
