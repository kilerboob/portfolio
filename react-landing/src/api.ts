const RAW_BASE = (import.meta as unknown as { env: { VITE_API_BASE?: string } }).env.VITE_API_BASE;
export const API_BASE = (RAW_BASE ?? "").replace(/\/+$/, "") || "";

export type Tokens = { access: string; refresh: string };

export async function login(email: string, password: string): Promise<Tokens> {
  const res = await fetch(`${API_BASE || ''}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Login failed");
  }
  return data as Tokens;
}

export async function register(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE || ''}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Registration failed");
  }
}
