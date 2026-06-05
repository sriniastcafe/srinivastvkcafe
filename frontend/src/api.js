const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function fetchMenu() {
  return fetch(`${BASE}/menu`).then(handle);
}

export function fetchOrders() {
  return fetch(`${BASE}/orders`).then(handle);
}

export function placeOrder(payload) {
  return fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);
}
