import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { fetchMenu, placeOrder } from "./api.js";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";

export default function App() {
  const navigate = useNavigate();

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
  const [ordersRefresh, setOrdersRefresh] = useState(0);

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

  async function handlePay(paymentMethod) {
    setOrderError(null);
    setSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: customerName.trim() || "Guest",
        table: table.trim() || null,
        items: cartLines.map((l) => ({ id: l.id, quantity: l.quantity })),
        paymentMethod,
      });
      setConfirmedOrder(order);
      setCart({});
      setCustomerName("");
      setTable("");
      setOrdersRefresh((n) => n + 1);
      navigate("/orders");
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app">
      <NavBar cartCount={cartCount} total={total} />

      <Routes>
        <Route
          path="/"
          element={
            <MenuPage
              menu={menu}
              loading={loading}
              loadError={loadError}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartLines={cartLines}
              total={total}
              cartCount={cartCount}
            />
          }
        />
        <Route
          path="/payment"
          element={
            <PaymentPage
              cartLines={cartLines}
              total={total}
              customerName={customerName}
              setCustomerName={setCustomerName}
              table={table}
              setTable={setTable}
              onPay={handlePay}
              submitting={submitting}
              orderError={orderError}
            />
          }
        />
        <Route path="/orders" element={<OrdersPage refreshKey={ordersRefresh} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/locations" element={<LocationsPage />} />
      </Routes>

      <Footer />

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
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
