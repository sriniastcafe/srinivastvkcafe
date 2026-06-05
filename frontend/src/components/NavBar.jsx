import { NavLink, Link, useNavigate } from "react-router-dom";

export default function NavBar({ cartCount, total }) {
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`;

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <img src="/images/logo.png" alt="Tvk Cafe logo" className="nav__logo" />
          <div className="nav__brand-text">
            <span className="nav__name">Srinivas TVK Tea Cafe</span>
            <span className="nav__sub">Chai • Coffee • Snacks</span>
          </div>
        </Link>

        <div className="nav__links">
          <NavLink to="/" end className={linkClass}>
            Menu
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/locations" className={linkClass}>
            Locations
          </NavLink>
        </div>

        <button
          type="button"
          className="nav__cart"
          onClick={() => navigate(cartCount > 0 ? "/payment" : "/")}
        >
          <span className="nav__cart-icon" aria-hidden="true">🛒</span>
          <span className="nav__cart-label">
            {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""} • ₹${total}` : "Cart"}
          </span>
          {cartCount > 0 && <span className="nav__cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
