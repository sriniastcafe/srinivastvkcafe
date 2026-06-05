export default function Cart({ lines, total, count, onAdd, onRemove, onCheckout, submitting, ctaLabel }) {
  return (
    <aside className="cart" aria-label="Your order">
      <div className="cart__head">
        <h2 className="cart__title">Your Order</h2>
        {count > 0 && <span className="cart__count">{count} item{count > 1 ? "s" : ""}</span>}
      </div>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <span className="cart__empty-emoji" aria-hidden="true">🛒</span>
          <p>Your cart is empty.</p>
          <p className="cart__empty-sub">Add something tasty from the menu!</p>
        </div>
      ) : (
        <>
          <ul className="cart__list">
            {lines.map((line) => (
              <li key={line.id} className="cart__item">
                <img className="cart__thumb" src={line.image} alt={line.name} />
                <div className="cart__item-info">
                  <span className="cart__item-name">{line.name}</span>
                  <span className="cart__item-price">
                    ₹{line.price} × {line.quantity} = <strong>₹{line.price * line.quantity}</strong>
                  </span>
                </div>
                <div className="qty qty--sm">
                  <button
                    type="button"
                    className="qty__btn"
                    aria-label={`Remove one ${line.name}`}
                    onClick={() => onRemove(line)}
                  >
                    −
                  </button>
                  <span className="qty__count">{line.quantity}</span>
                  <button
                    type="button"
                    className="qty__btn"
                    aria-label={`Add one ${line.name}`}
                    onClick={() => onAdd(line)}
                  >
                    +
                  </button>
                </div>
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
              <span data-testid="cart-total">₹{total}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn--checkout"
            onClick={onCheckout}
            disabled={submitting}
          >
            {submitting ? "Placing order…" : ctaLabel || `Place order • ₹${total}`}
          </button>
        </>
      )}
    </aside>
  );
}
