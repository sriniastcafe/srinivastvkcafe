import express from "express";
import cors from "cors";
import { getMenu, getMenuItem, listOrders, getOrder, createOrder } from "./store.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "tea-cafe-backend" });
  });

  app.get("/api/menu", (_req, res) => {
    res.json(getMenu());
  });

  app.get("/api/menu/:id", (req, res) => {
    const item = getMenuItem(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(item);
  });

  app.get("/api/orders", (_req, res) => {
    res.json(listOrders());
  });

  app.get("/api/orders/:id", (req, res) => {
    const order = getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  });

  app.post("/api/orders", (req, res) => {
    const { items, customerName, table } = req.body ?? {};
    const { order, error } = createOrder({ items, customerName, table });
    if (error) {
      return res.status(400).json({ error });
    }
    res.status(201).json(order);
  });

  return app;
}
