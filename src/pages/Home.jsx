import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Train, ArrowRight, Shield, Clock, Smartphone, Star } from "lucide-react";
import { CITIES } from "../data/trains";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ from: "", to: "", date: today, passengers: 1 });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.from) e.from = "Select departure city";
    if (!form.to) e.to = "Select destination city";
    if (form.from && form.to && form.from === form.to) e.to = "Destination must differ from origin";
    if (!form.date) e.date = "Select travel date";
    if (new Date(form.date) < new Date(today)) e.date = "Date cannot be in the past";
    return e;
  }

  function handleSearch(e) {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length === 0) {
      navigate(`/search?from=${form.from}&to=${form.to}&date=${form.date}&passengers=${form.passengers}`);
    }
  }

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <Train size={16} /> Pakistan's Premier Rail Network
            </div>
            <h1>Travel Pakistan<br />by Train</h1>
            <p>Book seats on 10 express routes across the country — with live availability, instant fares, and no hidden charges.</p>
          </div>

          <form className="search-form card" onSubmit={handleSearch} noValidate>
            <h2>Find Your Train</h2>

            <div className="search-row">
              <div className="form-group">
                <label htmlFor="from">From</label>
                <select
                  id="from"
                  value={form.from}
                  onChange={set("from")}
                  className={errors.from ? "invalid" : ""}
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.from && <span className="error-msg">{errors.from}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="to">To</label>
                <select
                  id="to"
                  value={form.to}
                  onChange={set("to")}
                  className={errors.to ? "invalid" : ""}
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.to && <span className="error-msg">{errors.to}</span>}
              </div>
            </div>

            <div className="search-row">
              <div className="form-group">
                <label htmlFor="date">Travel Date</label>
                <input
                  id="date" type="date"
                  value={form.date} min={today}
                  onChange={set("date")}
                  className={errors.date ? "invalid" : ""}
                />
                {errors.date && <span className="error-msg">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <select id="passengers" value={form.passengers} onChange={set("passengers")}>
                  {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} passenger{n>1?"s":""}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              Search Trains <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="features container">
        <h2 className="section-title">Why RailPK Express?</h2>
        <div className="features-grid">
          {[
            { icon: <Shield size={28} />, title: "Live Seat Availability", desc: "See exactly how many seats remain in each class — before you fill any form." },
            { icon: <Clock size={28} />, title: "Instant Fare Calculator", desc: "Total price with discounts, luggage fees, and surcharges shown upfront." },
            { icon: <Smartphone size={28} />, title: "Mobile-First Design", desc: "Fully responsive — book a ticket as easily on a phone as on a desktop." },
            { icon: <Star size={28} />, title: "Passenger Discounts", desc: "Children under 3 travel free. Students get 25% off. Seniors save 20%." },
          ].map((f) => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="popular container">
        <h2 className="section-title">Popular Routes</h2>
        <div className="routes-grid">
          {[
            { from: "Karachi", to: "Lahore", fare: "3,500", duration: "14h" },
            { from: "Lahore", to: "Islamabad", fare: "1,200", duration: "4h" },
            { from: "Karachi", to: "Peshawar", fare: "5,200", duration: "26h" },
            { from: "Lahore", to: "Multan", fare: "950", duration: "4.5h" },
            { from: "Peshawar", to: "Rawalpindi", fare: "780", duration: "3h" },
            { from: "Multan", to: "Sukkur", fare: "1,800", duration: "8h" },
          ].map((r) => (
            <button
              key={r.from + r.to}
              className="route-pill card"
              onClick={() => navigate(`/search?from=${r.from}&to=${r.to}&date=${today}`)}
            >
              <div className="route-pill-cities">
                <span>{r.from}</span>
                <ArrowRight size={14} />
                <span>{r.to}</span>
              </div>
              <div className="route-pill-meta">
                <span>from PKR {r.fare}</span>
                <span>{r.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
