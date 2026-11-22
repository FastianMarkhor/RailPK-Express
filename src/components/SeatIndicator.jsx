import { CLASSES, getAvailableSeats } from "../data/trains";

export default function SeatIndicator({ route, selectedClass }) {
  const classes = selectedClass ? [selectedClass] : Object.keys(CLASSES);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {classes.map((cls) => {
        const info      = CLASSES[cls];
        const total     = info.totalSeats;
        const available = getAvailableSeats(route, cls);
        const pct       = ((total - available) / total) * 100;
        const color     = available === 0 ? "#c0392b" : available <= 8 ? "#c8922a" : "#1a7a4a";
        const label     = available === 0 ? "Full" : `${available} left`;

        return (
          <div key={cls}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4, alignItems: "center" }}>
              <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span>{info.icon}</span>
                {info.label}
                <span style={{
                  fontSize: "0.65rem", background: "var(--slate-light)",
                  padding: "1px 5px", borderRadius: 4, fontWeight: 700, color: "var(--slate-mid)"
                }}>{info.abbr}</span>
              </span>
              <span style={{ color, fontWeight: 700 }}>{label}</span>
            </div>
            <div className="seat-bar-track">
              <div className="seat-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
