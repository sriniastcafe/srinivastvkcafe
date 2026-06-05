import { useState } from "react";
import { Link } from "react-router-dom";

const METHODS = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: "💳" },
  { id: "cash", label: "Pay at Counter", desc: "Cash on pickup", icon: "💵" },
];

export default function PaymentPage({
  cartLines,
  total,
  customerName,
  setCustomerName,
  table,
  setTable,
  onPay,
  submitting,
  orderError,
}) {
  const [method, setMethod] = useState("upi");

  if (cartLines.length === 0) {
    return (
      <div className="page page--narrow">
        <div className="empty-state">
          <span className="empty-state__emoji" aria-hidden="true">🧾</span>
          <h1>Nothing to pay for yet</h1>
          <p>Your cart is empty. Add some delicious chai and snacks first!</p>
          <Link to="/" className="btn btn--add">Browse the menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Checkout &amp; Payment</h1>
        <p className="page__sub">Review your order, add your details and choose how to pay.</p>
      </div>

      <div className="checkout">
        <section className="checkout__main">
          <div className="panel">
            <h2 className="panel__title">Your details</h2>
            <div className="form-grid">
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  value={customerName}
                  placeholder="Your name"
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Table number</span>
                <input
                  type="text"
                  value={table}
                  placeholder="e.g. 5"
                  onChange={(e) => setTable(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="panel">
            <h2 className="panel__title">Payment method</h2>
            <div className="pay-methods">
              {METHODS.map((m) => (
                <label key={m.id} className={`pay-method ${method === m.id ? "pay-method--active" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                  />
                  <span className="pay-method__icon" aria-hidden="true">{m.icon}</span>
                  <span className="pay-method__text">
                    <span className="pay-method__label">{m.label}</span>
                    <span className="pay-method__desc">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="checkout__summary">
          <div className="panel">
            <h2 className="panel__title">Order summary</h2>
            <ul className="summary-list">
              {cartLines.map((line) => (
                <li key={line.id} className="summary-item">
                  <img className="summary-item__thumb" src={line.image} alt={line.name} />
                  <span className="summary-item__name">
                    {line.name} <span className="summary-item__qty">× {line.quantity}</span>
                  </span>
                  <span className="summary-item__price">₹{line.price * line.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="cart__summary">
              <div className="cart__row">
                <span>Item total</span>
                <span>₹{total}</span>
              </div>
              <div className="cart__row cart__row--muted">
                <span>Taxes &amp; charges</span>
                <span>Included</span>
              </div>
              <div className="cart__total">
                <span>To pay</span>
                <span data-testid="pay-total">₹{total}</span>
              </div>
            </div>

            {orderError && <p className="status status--error">{orderError}</p>}

            <button
              type="button"
              className="btn btn--checkout"
              onClick={() => onPay(method)}
              disabled={submitting}
            >
              {submitting ? "Processing payment…" : `Pay ₹${total}`}
            </button>
            <Link to="/" className="checkout__back">← Add more items</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
