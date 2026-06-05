import { Link } from "react-router-dom";

const STATS = [
  { value: "2015", label: "Brewing since" },
  { value: "23+", label: "Menu items" },
  { value: "2", label: "Cafe locations" },
  { value: "4.7★", label: "Customer rating" },
];

const VALUES = [
  { icon: "🌿", title: "100% Veg kitchen", text: "Every cup and bite is prepared in a pure vegetarian kitchen." },
  { icon: "🫖", title: "Freshly brewed", text: "Tea and coffee made to order — never pre-brewed or stale." },
  { icon: "🤝", title: "Sourced with care", text: "Premium Assam & Nilgiri leaves and farm-fresh ingredients." },
  { icon: "💛", title: "Made with love", text: "Your love, your tea — hospitality is at the heart of all we do." },
];

export default function AboutPage() {
  return (
    <div className="page">
      <section className="about-hero">
        <img src="/images/logo.png" alt="Tvk Cafe logo" className="about-hero__logo" />
        <h1 className="page__title">About Srinivas TVK Tea Cafe</h1>
        <p className="about-hero__lead">
          What started as a single roadside chai stall in 2015 has grown into a much-loved
          neighbourhood cafe. We brew authentic Indian chai, artisan coffee and serve hot,
          home-style snacks — all in a warm, welcoming space. Our promise is simple:
          <em> your love, your tea.</em>
        </p>
      </section>

      <div className="stats">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="page__head">
        <h2 className="page__title page__title--sm">What we stand for</h2>
      </div>
      <div className="values">
        {VALUES.map((v) => (
          <div key={v.title} className="value-card">
            <span className="value-card__icon" aria-hidden="true">{v.icon}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </div>

      <div className="cta-banner">
        <div>
          <h2>Hungry already?</h2>
          <p>Explore our full menu of teas, coffees, shakes and snacks.</p>
        </div>
        <Link to="/" className="btn btn--add">View the menu</Link>
      </div>
    </div>
  );
}
