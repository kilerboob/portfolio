export const API_BASE = (import.meta as unknown as { env: { VITE_API_BASE?: string } }).env.VITE_API_BASE?.replace(/\/+$/, "") ?? "";
// Крошечный API-клиент для фронта портфолио
export type Service = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  base_price?: number | null;
  currency?: string | null;
  delivery_days?: number | null;
};

// API_BASE уже экспортирован выше

function authHeader() {
  try {
    const t = localStorage.getItem("access");
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}

function apiUrl(path: string) {
  if (!API_BASE) return path;           // dev: фронт и бэк на одном origin через прокси/напрямую
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function apiGet<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json", ...authHeader() as Record<string, string> };
  if (init?.headers) Object.assign(headers, init.headers as Record<string, string>);
  const res = await fetch(apiUrl(path), { method: "GET", headers: headers as HeadersInit, ...init });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T = unknown>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json", ...authHeader() as Record<string, string> };
  if (init?.headers) Object.assign(headers, init.headers as Record<string, string>);
  const res = await fetch(apiUrl(path), { method: "POST", headers: headers as HeadersInit, body: JSON.stringify(body), ...init });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} → ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export { apiUrl };
