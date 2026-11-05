export const API = "http://localhost:3000/api";

// Small fetch wrapper that always resolves with { ok, status, data }
export async function request(path, { method = "GET", body, token } = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        ...(body && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
  } catch {
    return { ok: false, status: 0, data: { message: "Cannot reach the server" } };
  }
}
