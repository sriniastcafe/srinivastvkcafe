import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <strong>Srinivas TVK Tea Cafe</strong>
          <p>Open daily • 7:00 AM – 10:00 PM</p>
          <p>📞 +91 98765 43210</p>
        </div>
        <div className="footer__col">
          <span className="footer__head">Explore</span>
          <Link to="/">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/about">About Us</Link>
          <Link to="/locations">Locations</Link>
        </div>
        <div className="footer__col">
          <span className="footer__head">Visit us</span>
          <p>Banjara Hills, Hyderabad</p>
          <p>Koramangala, Bengaluru</p>
          <p className="footer__note">Made with ☕ &amp; 🍵 — your love, your tea.</p>
        </div>
      </div>
    </footer>
  );
}
