import { syncJobs } from '@/mocks/pipeline';

/**
 * API client.
 *
 * Today every resource function resolves against the in-memory mock db through `mockRequest`.
 * To connect the real Express API, replace a function body with an `http()` call, e.g.
 *   export const listCourses = (filters) => http<CourseSummary[]>(`/courses?${toQuery(filters)}`);
 * Hooks and components do not need to change.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api';

/** Optional fault injection for testing error states, e.g. VITE_MOCK_ERROR_RATE=0.3 */
const MOCK_ERROR_RATE = Number(import.meta.env.VITE_MOCK_ERROR_RATE ?? 0);

const randomDelay = () => 300 + Math.random() * 300;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Runs a mock handler after 300–600 ms and returns a deep copy, like a network round trip. */
export async function mockRequest<T>(handler: () => T): Promise<T> {
  await sleep(randomDelay());
  if (MOCK_ERROR_RATE > 0 && Math.random() < MOCK_ERROR_RATE) {
    throw new ApiError('Simulated network error. Please try again.', 503);
  }
  // Simulates the server's background worker advancing AI jobs between requests.
  syncJobs();
  return structuredClone(handler());
}

export function notFound(entity: string): never {
  throw new ApiError(`${entity} not found`, 404);
}

/** Real HTTP helper for when the Express API is connected. */
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    credentials: 'include',
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(body?.message ?? response.statusText, response.status);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}

export function toQuery(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => search.append(key, String(v)));
    else search.set(key, String(value));
  }
  return search.toString();
}
