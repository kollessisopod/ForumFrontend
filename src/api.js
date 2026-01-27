const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function httpJson(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = `HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`;
    throw new Error(msg);
  }

  // Some POST endpoints may return empty body; handle safely
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  return res.json();
}

export function fetchEntries() {
  return httpJson("/api/entries");
}

export function fetchEntry(id) {
  return httpJson(`/api/entries/${encodeURIComponent(id)}`);
}

export function fetchComments(entryId) {
  return httpJson(`/api/entries/${encodeURIComponent(entryId)}/comments`);
}

export function createEntry({ header, description, author }) {
  return httpJson("/api/entries", {
    method: "POST",
    body: JSON.stringify({ header, description, author }),
  });
}

export function createComment(entryId, { content, author }) {
  return httpJson(`/api/entries/${encodeURIComponent(entryId)}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, author }),
  });
}
