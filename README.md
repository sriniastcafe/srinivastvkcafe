# Srinivas TVK Tea Cafe ☕🍵

A full-stack **Tea Cafe** ordering app built with a **React (Vite)** frontend and a
**Node.js / Express** backend. Browse the menu, add items to your cart, and place an order.

## Project structure

```
.
├── backend/    # Express REST API (menu, orders)
└── frontend/   # React + Vite single-page app
```

## Features

- 📋 Menu grouped by category (Hot Tea, Cold Tea, Coffee, Snacks)
- 🛒 Cart with quantity steppers and live total
- 🧾 Order placement with server-side validation (rejects empty / unavailable items)
- ✅ Order confirmation with generated order ID
- 🎨 Responsive, cafe-themed UI

## Backend API

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| GET    | `/api/health`      | Health check                      |
| GET    | `/api/menu`        | List all menu items               |
| GET    | `/api/menu/:id`    | Get a single menu item            |
| GET    | `/api/orders`      | List placed orders                |
| GET    | `/api/orders/:id`  | Get a single order                |
| POST   | `/api/orders`      | Place an order                    |

`POST /api/orders` body:

```json
{
  "customerName": "Asha",
  "table": "5",
  "items": [{ "id": "masala-chai", "quantity": 2 }]
}
```

## Getting started

### 1. Backend (port 4000)

```bash
cd backend
npm install
npm start        # or: npm run dev  (auto-reload)
```

Run the backend tests:

```bash
cd backend
npm test
```

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to the backend at `http://localhost:4000`,
so run both servers together during development. Open http://localhost:5173.

### Production build (frontend)

```bash
cd frontend
npm run build    # outputs to frontend/dist
npm run preview
```

## Notes

- Menu and orders are stored **in memory** for simplicity — restarting the backend
  resets order history. Swap `backend/src/store.js` for a database to persist data.
