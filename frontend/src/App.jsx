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

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

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

  const cartCount = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.quantity, 0),
    [cartLines]
  );

  const allCategories = useMemo(() => {
    const seen = [];
    for (const item of menu) if (!seen.includes(item.category)) seen.push(item.category);
    return seen;
  }, [menu]);

  const visibleSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    const map = new Map();
    for (const item of menu) {
      if (activeCategory !== "All" && item.category !== activeCategory) continue;
      if (vegOnly && !item.veg) continue;
      if (q && !`${item.name} ${item.description} ${item.category}`.toLowerCase().includes(q)) continue;
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    }
    return [...map.entries()];
  }, [menu, search, activeCategory, vegOnly]);

  const resultCount = useMemo(
    () => visibleSections.reduce((sum, [, items]) => sum + items.length, 0),
    [visibleSections]
  );

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

  function scrollToCart() {
    document.getElementById("cart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__brand">
            <img src="/images/logo.png" alt="Tvk Cafe logo" className="nav__logo" />
            <div className="nav__brand-text">
              <span className="nav__name">Srinivas TVK Tea Cafe</span>
              <span className="nav__sub">Chai • Coffee • Snacks</span>
            </div>
          </div>
          <button type="button" className="nav__cart" onClick={scrollToCart}>
            <span className="nav__cart-icon" aria-hidden="true">🛒</span>
            <span className="nav__cart-label">
              {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""} • ₹${total}` : "Cart"}
            </span>
            {cartCount > 0 && <span className="nav__cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero__inner">
          <span className="hero__eyebrow">★ 4.7 • Freshly brewed • 100% Veg kitchen</span>
          <h1 className="hero__title">Your love, your tea.</h1>
          <p className="hero__tag">
            Authentic chai, artisan coffee &amp; hot snacks — brewed fresh and delivered to your table.
          </p>
          <div className="hero__search">
            <span className="hero__search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={search}
              placeholder="Search for chai, coffee, snacks…"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search the menu"
            />
          </div>
        </div>
      </header>

      <div className="filters">
        <div className="chips" role="tablist" aria-label="Menu categories">
          <button
            type="button"
            className={`chip ${activeCategory === "All" ? "chip--active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="veg-toggle">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          <span className="veg-dot" aria-hidden="true" />
          Veg only
        </label>
      </div>

      <main className="layout">
        <section className="menu" aria-label="Menu">
          {loading && <p className="status">Brewing the menu… 🫖</p>}
          {loadError && <p className="status status--error">Failed to load menu: {loadError}</p>}

          {!loading && !loadError && resultCount === 0 && (
            <p className="status">No items match “{search}”. Try another search.</p>
          )}

          {!loading &&
            !loadError &&
            visibleSections.map(([category, items]) => (
              <div key={category} className="menu-section">
                <div className="menu-section__head">
                  <h2 className="menu-section__title">{category}</h2>
                  <span className="menu-section__count">{items.length} items</span>
                </div>
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

        <div className="sidebar" id="cart">
          <Cart
            lines={cartLines}
            total={total}
            count={cartCount}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            submitting={submitting}
          />

          {cartLines.length > 0 && (
            <div className="customer">
              <h3 className="customer__title">Your details</h3>
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

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <strong>Srinivas TVK Tea Cafe</strong>
            <p>Open daily • 7:00 AM – 10:00 PM</p>
          </div>
          <p className="footer__note">Made with ☕ &amp; 🍵 — your love, your tea.</p>
        </div>
      </footer>

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
