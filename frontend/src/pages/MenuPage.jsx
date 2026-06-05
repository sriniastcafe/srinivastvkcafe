import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard.jsx";
import Cart from "../components/Cart.jsx";

export default function MenuPage({
  menu,
  loading,
  loadError,
  cart,
  addToCart,
  removeFromCart,
  cartLines,
  total,
  cartCount,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

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

  return (
    <>
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
            onCheckout={() => navigate("/payment")}
            ctaLabel={`Proceed to pay • ₹${total}`}
          />
        </div>
      </main>
    </>
  );
}
