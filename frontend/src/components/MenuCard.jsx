export default function MenuCard({ item, quantity, onAdd, onRemove }) {
  return (
    <div className={`menu-card ${item.available ? "" : "menu-card--unavailable"}`}>
      <div className="menu-card__emoji" aria-hidden="true">
        {item.image}
      </div>
      <div className="menu-card__body">
        <div className="menu-card__head">
          <h3 className="menu-card__name">{item.name}</h3>
          <span className="menu-card__price">₹{item.price}</span>
        </div>
        <span className="menu-card__category">{item.category}</span>
        <p className="menu-card__desc">{item.description}</p>

        {item.available ? (
          quantity > 0 ? (
            <div className="qty">
              <button
                type="button"
                className="qty__btn"
                aria-label={`Remove one ${item.name}`}
                onClick={() => onRemove(item)}
              >
                −
              </button>
              <span className="qty__count" data-testid={`qty-${item.id}`}>
                {quantity}
              </span>
              <button
                type="button"
                className="qty__btn"
                aria-label={`Add one ${item.name}`}
                onClick={() => onAdd(item)}
              >
                +
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--add" onClick={() => onAdd(item)}>
              Add to cart
            </button>
          )
        ) : (
          <span className="menu-card__soldout">Sold out</span>
        )}
      </div>
    </div>
  );
}
