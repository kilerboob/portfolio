export const API_BASE = "http://127.0.0.1:8000";

export type Tokens = { access: string; refresh: string };

export async function login(email: string, password: string): Promise<Tokens> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    // FastAPI обычно шлёт {detail: "..."}
    throw new Error(data?.detail || "Login failed");
  }
  return data as Tokens;
}
