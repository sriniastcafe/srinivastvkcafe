import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders } from "../api.js";

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function OrdersPage({ refreshKey }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Your Orders</h1>
        <p className="page__sub">Track everything you&apos;ve ordered with us.</p>
      </div>

      {loading && <p className="status">Loading orders…</p>}
      {error && <p className="status status--error">Failed to load orders: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <span className="empty-state__emoji" aria-hidden="true">🍵</span>
          <h2>No orders yet</h2>
          <p>When you place an order it will show up here.</p>
          <Link to="/" className="btn btn--add">Start ordering</Link>
        </div>
      )}

      <div className="orders">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__head">
              <div>
                <span className="order-card__id">{order.id}</span>
                <span className="order-card__time">{formatTime(order.createdAt)}</span>
              </div>
              <span className={`order-status order-status--${order.status}`}>{order.status}</span>
            </div>
            <ul className="order-card__items">
              {order.items.map((it) => (
                <li key={it.id}>
                  <span>{it.quantity} × {it.name}</span>
                  <span>₹{it.subtotal}</span>
                </li>
              ))}
            </ul>
            <div className="order-card__foot">
              <span>
                {order.customerName}
                {order.table ? ` • Table ${order.table}` : ""}
              </span>
              <strong>Total ₹{order.total}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
