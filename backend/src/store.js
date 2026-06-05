import { menu } from "./data/menu.js";

// Simple in-memory order store. Replace with a database for production use.
const orders = [];
let orderSeq = 1000;

export function getMenu() {
  return menu;
}

export function getMenuItem(id) {
  return menu.find((item) => item.id === id);
}

export function listOrders() {
  return orders;
}

export function getOrder(id) {
  return orders.find((order) => order.id === id);
}

/**
 * Validate and create an order from a list of { id, quantity } items.
 * Returns { order } on success or { error } on validation failure.
 */
export function createOrder({ items, customerName, table, paymentMethod }) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Order must contain at least one item." };
  }

  const lineItems = [];
  for (const entry of items) {
    const quantity = Number(entry?.quantity ?? 0);
    if (!entry?.id || !Number.isInteger(quantity) || quantity <= 0) {
      return { error: `Invalid line item: ${JSON.stringify(entry)}` };
    }
    const menuItem = getMenuItem(entry.id);
    if (!menuItem) {
      return { error: `Unknown menu item: ${entry.id}` };
    }
    if (!menuItem.available) {
      return { error: `${menuItem.name} is currently unavailable.` };
    }
    lineItems.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      subtotal: menuItem.price * quantity,
    });
  }

  const total = lineItems.reduce((sum, li) => sum + li.subtotal, 0);
  const order = {
    id: `ORD-${orderSeq++}`,
    customerName: (customerName || "Guest").toString().slice(0, 80),
    table: table ? table.toString().slice(0, 20) : null,
    items: lineItems,
    total,
    paymentMethod: paymentMethod ? paymentMethod.toString().slice(0, 20) : "upi",
    status: "received",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  return { order };
}
