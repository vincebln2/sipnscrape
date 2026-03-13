const API_BASE = "http://localhost:8000";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

function withDefaultHeaders(headers?: HeadersInit): HeadersInit {
  if (!headers) return DEFAULT_HEADERS;

  if (headers instanceof Headers) {
    const merged = new Headers(DEFAULT_HEADERS);
    headers.forEach((value, key) => merged.set(key, value));
    return merged;
  }

  if (Array.isArray(headers)) {
    return [...Object.entries(DEFAULT_HEADERS), ...headers];
  }

  return { ...DEFAULT_HEADERS, ...headers };
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: withDefaultHeaders(init.headers),
  });

  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export interface Bean {
  id: number;
  name: string;
  roaster: string;
  roast_type: string;
  taste_notes: string[];
  vibe_score: number;
  country: string;
  process: string;
  elevation: number | null;
  hyperlink: string;
}

export async function fetchBeans(): Promise<Bean[]> {
  return apiFetch<Bean[]>("/beans");
}

export async function searchBeans(query: string): Promise<Bean[]> {
  return apiFetch<Bean[]>(`/search?q=${encodeURIComponent(query)}`);
}

export async function getRecommendations(id: number): Promise<Bean[]> {
  return apiFetch<Bean[]>(`/beans/${id}/recommendations`);
}

