import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wifi, Utensils, Zap, BedDouble, AlertTriangle, CheckCircle } from "lucide-react";
import {
  ROUTES, CLASSES, PASSENGER_TYPES,
  getAvailableSeats, isSeatAvailable, calculateFare
} from "../data/trains";
import ClassCard from "../components/ClassCard";
import SeatPicker from "../components/SeatPicker";
import FareCalculator from "../components/FareCalculator";
import SeatIndicator from "../components/SeatIndicator";
import "./TrainDetail.css";

const AMENITY_ICONS = {
  WiFi: <Wifi size={16} />,
  "Dining Car": <Utensils size={16} />,
  "Charging Ports": <Zap size={16} />,
  "Sleeping Berths": <BedDouble size={16} />,
};

export default function TrainDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = ROUTES.find((r) => r.id === id);

  const today = new Date().toISOString().split("T")[0];
  const [seatClass,     setSeatClass]     = useState("economy");
  const [travelDate,    setTravelDate]    = useState(today);
  const [luggageKg,     setLuggageKg]     = useState(23);
  const [passengers,    setPassengers]    = useState([{ type: "adult", count: 1 }]);
  const [selectedSeats, setSelectedSeats] = useState([]);    // Problem 2
  const [added,         setAdded]         = useState(false);
  const [errors,        setErrors]        = useState({});

  if (!route) {
    return (
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="state-box">
          <h3>Train not found</h3>
          <button className="btn btn-primary" onClick={() => navigate("/search")}>Back to Search</button>
        </div>
      </div>
    );
  }

  const totalPassengers = passengers.reduce((s, p) => s + p.count, 0);
  const available       = getAvailableSeats(route, seatClass);
  const isFull          = available === 0;
  const isInsufficient  = !isSeatAvailable(route, seatClass, totalPassengers);

  function handlePassengerChange(type, count) {
    setPassengers((prev) => {
      const existing = prev.find((p) => p.type === type);
      if (existing) return prev.map((p) => p.type === type ? { ...p, count: Math.max(0, count) } : p);
      return [...prev, { type, count: Math.max(0, count) }];
    });
    // Reset seat selection when quantity changes
    setSelectedSeats([]);
  }

  function getCount(type) {
    return passengers.find((p) => p.type === type)?.count || 0;
  }

  function handleClassChange(cls) {
    setSeatClass(cls);
    setSelectedSeats([]);   // Reset seats on class change
    setErrors({});
  }

  function validate() {
    const e = {};
    if (totalPassengers === 0)       e.passengers = "Select at least 1 passenger";
    if (!travelDate)                 e.date       = "Select a travel date";
    if (new Date(travelDate) < new Date(today)) e.date = "Date cannot be in the past";
    if (isInsufficient)              e.seats      = `Only ${available} seat${available !== 1 ? "s" : ""} left in ${CLASSES[seatClass]?.label}`;
    if (selectedSeats.length < totalPassengers && totalPassengers > 0)
      e.seatPick = `Please select all ${totalPassengers} seat${totalPassengers > 1 ? "s" : ""} from the seat map`;
    return e;
  }

  function handleBook() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const fare    = calculateFare({ route, seatClass, passengers, travelDate, luggageKg });
    const booking = {
      route, seatClass, passengers, travelDate, luggageKg,
      selectedSeats, fare, id: Date.now(),
    };
    onAddToCart(booking);
    setAdded(true);
    setTimeout(() => navigate("/cart"), 1200);
  }

  const fare = calculateFare({ route, seatClass, passengers, travelDate, luggageKg });

  return (
    <div className="detail-page container">
      <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="detail-layout">
        {/* ── Left: train info ── */}
        <div className="detail-info">
          <div className="card detail-header-card">
            <div className="detail-train-id">
              <span className="badge badge-slate">{route.trainNumber}</span>
              <span className="badge badge-green">{route.days.join(" · ")}</span>
            </div>
            <h1 className="detail-train-name">{route.trainName}</h1>

            <div className="detail-route">
              <div className="dr-point">
                <span className="dr-time">{route.departureTime}</span>
                <span className="dr-city">{route.from}</span>
              </div>
              <div className="dr-line">
                <div className="dr-track" />
                <span className="dr-duration">{route.duration}</span>
              </div>
              <div className="dr-point right">
                <span className="dr-time">{route.arrivalTime}</span>
                <span className="dr-city">{route.to}</span>
              </div>
            </div>

            <div className="amenities-list">
              {route.amenities.map((a) => (
                <span key={a} className="amenity-tag">
                  {AMENITY_ICONS[a] || null} {a}
                </span>
              ))}
            </div>
          </div>

          {/* Live seat availability */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 14, fontSize: "1rem" }}>Live Seat Availability</h3>
            <SeatIndicator route={route} />
          </div>

          {/* Fare breakdown */}
          <FareCalculator
            route={route}
            seatClass={seatClass}
            passengers={passengers.filter((p) => p.count > 0)}
            travelDate={travelDate}
            luggageKg={luggageKg}
          />
        </div>

        {/* ── Right: booking form ── */}
        <div className="detail-booking card">
          <h2>Book Your Seat</h2>

          {/* Problem 1 Fix: Class selector with full names + descriptions */}
          <div style={{ marginBottom: 18 }}>
            <ClassCard
              route={route}
              selectedClass={seatClass}
              onSelect={handleClassChange}
            />
          </div>

          {/* Business Rule 1: capacity warnings */}
          {isFull && (
            <div className="alert alert-error">
              <AlertTriangle size={16} />
              <span>No seats in {CLASSES[seatClass]?.label}. Select a different class above.</span>
            </div>
          )}
          {!isFull && available <= 10 && (
            <div className="alert alert-warning">
              <AlertTriangle size={16} />
              <span>Only {available} seats remaining — book soon!</span>
            </div>
          )}
          {errors.seats && (
            <div className="alert alert-error"><AlertTriangle size={16} /><span>{errors.seats}</span></div>
          )}

          {/* Travel date */}
          <div className="form-group">
            <label htmlFor="travel-date">Travel Date</label>
            <input
              id="travel-date" type="date"
              value={travelDate} min={today}
              onChange={(e) => { setTravelDate(e.target.value); setErrors({}); }}
              className={errors.date ? "invalid" : ""}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>

          {/* Business Rule 2: Passenger types (eligibility discounts) */}
          <fieldset className="passengers-fieldset">
            <legend>
              Passengers
              <span className="legend-sub"> — discounts auto-applied</span>
            </legend>
            {PASSENGER_TYPES.map(({ id, label }) => (
              <div key={id} className="passenger-row">
                <label htmlFor={`p-${id}`}>{label}</label>
                <div className="counter">
                  <button type="button" onClick={() => handlePassengerChange(id, getCount(id) - 1)}>−</button>
                  <input
                    id={`p-${id}`} type="number" min="0" max="10"
                    value={getCount(id)}
                    onChange={(e) => handlePassengerChange(id, parseInt(e.target.value) || 0)}
                    aria-label={`Number of ${label}`}
                  />
                  <button type="button" onClick={() => handlePassengerChange(id, getCount(id) + 1)}>+</button>
                </div>
              </div>
            ))}
            {errors.passengers && <span className="error-msg">{errors.passengers}</span>}
          </fieldset>

          {/* Problem 2 Fix: Seat picker — select all seats in one interface */}
          {totalPassengers > 0 && !isFull && (
            <div style={{ marginBottom: 18 }}>
              <SeatPicker
                route={route}
                seatClass={seatClass}
                quantity={totalPassengers}
                selectedSeats={selectedSeats}
                onSeatsChange={setSelectedSeats}
              />
              {errors.seatPick && (
                <div className="alert alert-error" style={{ marginTop: 8 }}>
                  <AlertTriangle size={16} /><span>{errors.seatPick}</span>
                </div>
              )}
            </div>
          )}

          {/* Luggage — Business Rule 3 pricing */}
          <div className="form-group">
            <label htmlFor="luggage">Luggage Weight (kg)</label>
            <input
              id="luggage" type="number" min="0" max="100"
              value={luggageKg}
              onChange={(e) => setLuggageKg(parseInt(e.target.value) || 0)}
            />
            <span className="form-hint">First 23 kg free · Extra PKR 50/kg</span>
          </div>

          {/* Business Rule 3: last-minute surcharge warning */}
          {fare.isLastMinute && (
            <div className="alert alert-warning">
              <AlertTriangle size={16} />
              <span>Departure is less than 2 hours away — a 15% last-minute surcharge applies.</span>
            </div>
          )}

          <div className="fare-total">
            <span>Total</span>
            <span>PKR {fare.total.toLocaleString("en-PK")}</span>
          </div>

          {added ? (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              <span>Added to cart! Redirecting…</span>
            </div>
          ) : (
            <button
              className="btn btn-primary book-btn"
              onClick={handleBook}
              disabled={isFull}
            >
              {isFull ? "Class Full — Choose Another" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
