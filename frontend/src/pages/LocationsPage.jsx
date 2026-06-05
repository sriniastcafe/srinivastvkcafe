const LOCATIONS = [
  {
    id: "hyd",
    name: "Banjara Hills — Hyderabad",
    image: "/images/cafe-interior.jpg",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
    phone: "+91 98765 43210",
    hours: "7:00 AM – 10:00 PM",
    flagship: true,
  },
  {
    id: "blr",
    name: "Koramangala — Bengaluru",
    image: "/images/tea2.jpg",
    address: "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    phone: "+91 98765 11223",
    hours: "7:30 AM – 11:00 PM",
    flagship: false,
  },
];

export default function LocationsPage() {
  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Our Cafe Locations</h1>
        <p className="page__sub">Drop by for a fresh cup — we&apos;d love to host you.</p>
      </div>

      <div className="locations">
        {LOCATIONS.map((loc) => (
          <article key={loc.id} className="location-card">
            <div className="location-card__media">
              <img src={loc.image} alt={loc.name} />
              {loc.flagship && <span className="location-card__flag">Flagship</span>}
            </div>
            <div className="location-card__body">
              <h2>{loc.name}</h2>
              <p className="location-card__row">📍 {loc.address}</p>
              <p className="location-card__row">📞 {loc.phone}</p>
              <p className="location-card__row">🕒 {loc.hours}</p>
              <a
                className="btn btn--add"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
