import { useEffect, useMemo, useState } from "react";
import { fetchMenu, placeOrder } from "./api.js";
import MenuCard from "./components/MenuCard.jsx";
import Cart from "./components/Cart.jsx";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // cart: map of itemId -> quantity
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [table, setTable] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenu(data))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item) =>
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));

  const removeFromCart = (item) =>
    setCart((c) => {
      const next = { ...c };
      const qty = (next[item.id] || 0) - 1;
      if (qty <= 0) delete next[item.id];
      else next[item.id] = qty;
      return next;
    });

  const cartLines = useMemo(
    () =>
      menu
        .filter((item) => cart[item.id])
        .map((item) => ({ ...item, quantity: cart[item.id] })),
    [menu, cart]
  );

  const total = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cartLines]
  );

  const categories = useMemo(() => {
    const map = new Map();
    for (const item of menu) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    }
    return [...map.entries()];
  }, [menu]);

  async function handleCheckout() {
    setOrderError(null);
    setSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: customerName.trim() || "Guest",
        table: table.trim() || null,
        items: cartLines.map((l) => ({ id: l.id, quantity: l.quantity })),
      });
      setConfirmedOrder(order);
      setCart({});
      setCustomerName("");
      setTable("");
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__logo-badge">
            <img src="/images/logo.png" alt="Tvk Cafe logo" className="header__logo-img" />
          </div>
          <h1 className="header__title">Srinivas TVK Tea Cafe</h1>
          <p className="header__tag">Freshly brewed chai &amp; snacks, served with love</p>
        </div>
      </header>

      <main className="layout">
        <section className="menu" aria-label="Menu">
          {loading && <p className="status">Brewing the menu… 🫖</p>}
          {loadError && <p className="status status--error">Failed to load menu: {loadError}</p>}

          {!loading &&
            !loadError &&
            categories.map(([category, items]) => (
              <div key={category} className="menu-section">
                <h2 className="menu-section__title">{category}</h2>
                <div className="menu-grid">
                  {items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onAdd={addToCart}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            ))}
        </section>

        <div className="sidebar">
          <Cart
            lines={cartLines}
            total={total}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            submitting={submitting}
          />

          {cartLines.length > 0 && (
            <div className="customer">
              <label className="customer__field">
                <span>Name</span>
                <input
                  type="text"
                  value={customerName}
                  placeholder="Your name"
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <label className="customer__field">
                <span>Table</span>
                <input
                  type="text"
                  value={table}
                  placeholder="e.g. 5"
                  onChange={(e) => setTable(e.target.value)}
                />
              </label>
            </div>
          )}

          {orderError && <p className="status status--error">{orderError}</p>}
        </div>
      </main>

      {confirmedOrder && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Order confirmed">
          <div className="modal__card">
            <div className="modal__emoji" aria-hidden="true">✅</div>
            <h2>Order placed!</h2>
            <p className="modal__id">
              Order <strong>{confirmedOrder.id}</strong>
            </p>
            <ul className="modal__items">
              {confirmedOrder.items.map((it) => (
                <li key={it.id}>
                  {it.quantity} × {it.name} — ₹{it.subtotal}
                </li>
              ))}
            </ul>
            <p className="modal__total">Total paid: ₹{confirmedOrder.total}</p>
            <button type="button" className="btn btn--add" onClick={() => setConfirmedOrder(null)}>
              Order more
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
