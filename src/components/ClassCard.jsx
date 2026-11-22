import { useState } from "react";
import { Info, X, Check } from "lucide-react";
import { CLASSES, getAvailableSeats } from "../data/trains";
import "./ClassCard.css";

export default function ClassCard({ route, selectedClass, onSelect }) {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="class-cards">
      <p className="class-cards-label">Select Travel Class</p>
      <div className="class-grid">
        {Object.entries(CLASSES).map(([key, cls]) => {
          const available = getAvailableSeats(route, key);
          const isFull    = available === 0;
          const isActive  = selectedClass === key;
          const fare      = Math.round(route.baseFare * cls.multiplier);

          return (
            <div key={key} className={`class-card ${isActive ? "active" : ""} ${isFull ? "full" : ""}`}>
              {/* Info button — Problem 1 fix */}
              <button
                className="info-btn"
                aria-label={`Info about ${cls.label}`}
                onClick={(e) => { e.stopPropagation(); setTooltip(tooltip === key ? null : key); }}
              >
                <Info size={14} />
              </button>

              {/* Tooltip with full class description */}
              {tooltip === key && (
                <div className="class-tooltip" role="dialog" aria-label={`${cls.label} details`}>
                  <button className="tooltip-close" onClick={() => setTooltip(null)}><X size={12} /></button>
                  <strong>{cls.label} ({cls.abbr})</strong>
                  <p>{cls.description}</p>
                  <ul>
                    {cls.facilities.map((f) => (
                      <li key={f}><Check size={11} /> {f}</li>
                    ))}
                  </ul>
                  <span className="tooltip-layout">Layout: {cls.seatLayout}</span>
                </div>
              )}

              <button
                className="class-card-inner"
                onClick={() => !isFull && onSelect(key)}
                disabled={isFull}
                aria-pressed={isActive}
                aria-label={`${cls.label}, PKR ${fare.toLocaleString("en-PK")}, ${available} seats available`}
              >
                <div className="cc-top">
                  <span className="cc-icon">{cls.icon}</span>
                  <div className="cc-abbr-badge">{cls.abbr}</div>
                </div>
                <div className="cc-name">{cls.label}</div>
                <div className="cc-fare">PKR {fare.toLocaleString("en-PK")}</div>
                <div className={`cc-avail ${available <= 5 ? "low" : ""} ${isFull ? "none" : ""}`}>
                  {isFull ? "Class Full" : `${available} seats left`}
                </div>
                {isActive && <div className="cc-selected-tick"><Check size={14} /></div>}
              </button>
            </div>
          );
        })}
      </div>
      <p className="class-hint">
        <Info size={12} /> Tap the <strong>ⓘ</strong> icon on any class to see full facilities and seating layout.
      </p>
    </div>
  );
}
