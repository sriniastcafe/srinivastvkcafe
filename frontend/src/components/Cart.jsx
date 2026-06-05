export default function Cart({ lines, total, onAdd, onRemove, onCheckout, submitting }) {
  return (
    <aside className="cart" aria-label="Your order">
      <h2 className="cart__title">Your Order</h2>

      {lines.length === 0 ? (
        <p className="cart__empty">Your cart is empty. Add something tasty! 🍵</p>
      ) : (
        <>
          <ul className="cart__list">
            {lines.map((line) => (
              <li key={line.id} className="cart__item">
                <div className="cart__item-info">
                  <span className="cart__item-name">{line.name}</span>
                  <span className="cart__item-price">
                    ₹{line.price} × {line.quantity} = ₹{line.price * line.quantity}
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

          <div className="cart__total">
            <span>Total</span>
            <span data-testid="cart-total">₹{total}</span>
          </div>

          <button
            type="button"
            className="btn btn--checkout"
            onClick={onCheckout}
            disabled={submitting}
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </>
      )}
    </aside>
  );
}
