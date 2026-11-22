import { calculateFare, CLASSES } from "../data/trains";
import { AlertTriangle } from "lucide-react";

function fmt(n) { return `PKR ${n.toLocaleString("en-PK")}`; }

export default function FareCalculator({ route, seatClass, passengers, travelDate, luggageKg }) {
  if (!route || !seatClass || !passengers?.length) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center" }}>
          Select a class and passengers to see your fare.
        </p>
      </div>
    );
  }

  const cls  = CLASSES[seatClass];
  const fare = calculateFare({ route, seatClass, passengers, travelDate, luggageKg });

  return (
    <div className="card" style={{ padding: 20 }}>
      <h4 style={{ fontFamily: "var(--font-display)", marginBottom: 14, fontSize: "1rem" }}>
        Fare Breakdown
      </h4>

      {fare.isLastMinute && (
        <div className="alert alert-warning" style={{ marginBottom: 14 }}>
          <AlertTriangle size={16} />
          <span>Last-minute booking — 15% surcharge applies (departure &lt; 2 hrs away).</span>
        </div>
      )}

      {/* Class info line */}
      {cls && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: "0.8rem", color: "var(--text-muted)",
          marginBottom: 12, padding: "6px 10px",
          background: "var(--slate-light)", borderRadius: 6
        }}>
          <span>{cls.icon}</span>
          <strong style={{ color: "var(--slate)" }}>{cls.label} ({cls.abbr})</strong>
          <span>· {cls.seatLayout}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.9rem" }}>
        {passengers.map(({ type, count }) =>
          count > 0 ? (
            <div key={type} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>
                {type} × {count}
              </span>
              <span>
                {fmt(calculateFare({
                  route, seatClass, passengers: [{ type, count }],
                  travelDate, luggageKg: 0
                }).subtotal)}
              </span>
            </div>
          ) : null
        )}

        {fare.luggageFee > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Extra luggage fee</span>
            <span>{fmt(fare.luggageFee)}</span>
          </div>
        )}
        {fare.surcharge > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold)" }}>
            <span>Last-minute surcharge (15%)</span>
            <span>{fmt(fare.surcharge)}</span>
          </div>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between",
          borderTop: "2px solid var(--border)", paddingTop: 10, marginTop: 4,
          fontWeight: 700, fontSize: "1rem"
        }}>
          <span>Total</span>
          <span style={{ color: "var(--green)" }}>{fmt(fare.total)}</span>
        </div>
      </div>
    </div>
  );
}
