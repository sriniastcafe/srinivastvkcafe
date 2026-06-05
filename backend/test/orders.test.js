import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function startServer() {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return { server, base: `http://localhost:${port}` };
}

test("GET /api/menu returns menu items", async () => {
  const { server, base } = await startServer();
  try {
    const res = await fetch(`${base}/api/menu`);
    assert.equal(res.status, 200);
    const menu = await res.json();
    assert.ok(Array.isArray(menu));
    assert.ok(menu.length > 0);
    assert.ok(menu[0].id && menu[0].name);
  } finally {
    server.close();
  }
});

test("POST /api/orders creates an order with correct total", async () => {
  const { server, base } = await startServer();
  try {
    const res = await fetch(`${base}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Test User",
        items: [{ id: "masala-chai", quantity: 2 }],
      }),
    });
    assert.equal(res.status, 201);
    const order = await res.json();
    assert.equal(order.total, 80);
    assert.equal(order.status, "received");
    assert.match(order.id, /^ORD-/);
  } finally {
    server.close();
  }
});

test("POST /api/orders rejects empty order", async () => {
  const { server, base } = await startServer();
  try {
    const res = await fetch(`${base}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test("POST /api/orders rejects unavailable item", async () => {
  const { server, base } = await startServer();
  try {
    const res = await fetch(`${base}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "biscuit-cookie", quantity: 1 }] }),
    });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});
