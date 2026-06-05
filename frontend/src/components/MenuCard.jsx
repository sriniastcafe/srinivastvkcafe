export default function MenuCard({ item, quantity, onAdd, onRemove }) {
  return (
    <article className={`card ${item.available ? "" : "card--unavailable"}`}>
      <div className="card__media">
        <img className="card__img" src={item.image} alt={item.name} loading="lazy" />
        {item.tags?.includes("Bestseller") && (
          <span className="card__badge card__badge--best">★ Bestseller</span>
        )}
        {item.tags?.includes("Healthy") && (
          <span className="card__badge card__badge--healthy">Healthy</span>
        )}
        {item.tags?.includes("Seasonal") && (
          <span className="card__badge card__badge--season">Seasonal</span>
        )}
        {!item.available && <span className="card__soldout-tag">Sold out</span>}
      </div>

      <div className="card__body">
        <div className="card__top">
          <span className={`veg-mark ${item.veg ? "veg-mark--veg" : "veg-mark--nonveg"}`} title={item.veg ? "Veg" : "Non-veg"} />
          <span className="card__rating">★ {item.rating?.toFixed(1)}</span>
          <span className="card__time">⏱ {item.prepMins} min</span>
        </div>

        <h3 className="card__name">{item.name}</h3>
        <p className="card__desc">{item.description}</p>

        <div className="card__foot">
          <span className="card__price">₹{item.price}</span>

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
                Add +
              </button>
            )
          ) : (
            <span className="card__soldout">Unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}
