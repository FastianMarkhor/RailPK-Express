import { Link } from "react-router-dom";
import { Clock, Wifi, Utensils, Zap, BedDouble, ArrowRight } from "lucide-react";
import SeatIndicator from "./SeatIndicator";
import { CLASSES, getAvailableSeats } from "../data/trains";
import "./TrainCard.css";

const AMENITY_ICONS = {
  WiFi: <Wifi size={13} />,
  "Dining Car": <Utensils size={13} />,
  "Charging Ports": <Zap size={13} />,
  "Sleeping Berths": <BedDouble size={13} />,
};

export default function TrainCard({ route, selectedClass }) {
  const cls       = selectedClass || "economy";
  const clsInfo   = CLASSES[cls];
  const available = getAvailableSeats(route, cls);
  const isFull    = available === 0;

  return (
    <article className="train-card card">
      <div className="train-card-header">
        <div>
          <span className="train-number badge badge-slate">{route.trainNumber}</span>
          <h3 className="train-name">{route.trainName}</h3>
          <div className="train-days">{route.days.join(" · ")}</div>
        </div>
        <div className="train-fare">
          <span className="fare-from">from</span>
          {/* Problem 1 Fix: show full class name + abbreviation */}
          <span className="fare-amount">
            PKR {Math.round(route.baseFare * clsInfo.multiplier).toLocaleString("en-PK")}
          </span>
          <span className="fare-class">
            {clsInfo.icon} {clsInfo.label}
            <em className="fare-abbr">({clsInfo.abbr})</em>
          </span>
        </div>
      </div>

      <div className="train-card-route">
        <div className="route-point">
          <span className="route-time">{route.departureTime}</span>
          <span className="route-city">{route.from}</span>
        </div>
        <div className="route-line">
          <div className="route-dot" />
          <div className="route-track">
            <Clock size={12} />
            <span>{route.duration}</span>
          </div>
          <div className="route-dot" />
        </div>
        <div className="route-point right">
          <span className="route-time">{route.arrivalTime}</span>
          <span className="route-city">{route.to}</span>
        </div>
      </div>

      <div className="train-card-footer">
        <div className="amenities">
          {route.amenities.map((a) => (
            <span key={a} className="amenity-tag">
              {AMENITY_ICONS[a] || null}
              {a}
            </span>
          ))}
        </div>

        <div className="train-card-actions">
          <div className="seat-preview">
            <SeatIndicator route={route} selectedClass={cls} />
          </div>
          <Link
            to={`/train/${route.id}`}
            className={`btn ${isFull ? "btn-ghost" : "btn-primary"}`}
            aria-label={`View details for ${route.trainName}`}
          >
            {isFull ? "View (Class Full)" : "Book Now"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
