/**
 * Runtime configuration.
 *
 * The API origin is injected at build time via `VITE_WP_API_URL` and validated
 * before any request is made. We only accept absolute HTTPS origins so the
 * showcase can never be pointed at a plaintext or relative endpoint by mistake.
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function resolveApiBase(raw: string | undefined): URL {
  if (!raw || raw.trim() === '') {
    throw new ConfigError(
      'VITE_WP_API_URL no está definida. Copia .env.example a .env y configura la URL del sitio WordPress.',
    );
  }
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new ConfigError(`VITE_WP_API_URL no es una URL válida: "${raw}"`);
  }
  if (url.protocol !== 'https:') {
    throw new ConfigError('VITE_WP_API_URL debe usar https://');
  }
  // Normalise: strip any path/query so callers always build from the origin.
  return new URL(`${url.origin}/`);
}

export const API_BASE: URL = resolveApiBase(import.meta.env.VITE_WP_API_URL);
