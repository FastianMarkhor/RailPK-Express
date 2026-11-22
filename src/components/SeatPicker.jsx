import { useEffect } from "react";
import { Users, Info } from "lucide-react";
import { CLASSES, generateSeats } from "../data/trains";
import "./SeatPicker.css";

export default function SeatPicker({ route, seatClass, quantity, selectedSeats, onSeatsChange }) {
  const cls = CLASSES[seatClass];
  const seats = generateSeats(route, seatClass);
  const seatsPerRow = cls?.seatsPerRow || 4;

  // Auto-deselect extras if quantity decreased
  useEffect(() => {
    if (selectedSeats.length > quantity) {
      onSeatsChange(selectedSeats.slice(0, quantity));
    }
  }, [quantity]); // eslint-disable-line

  function toggleSeat(seat) {
    if (seat.isBooked) return;
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) {
      onSeatsChange(selectedSeats.filter((s) => s !== seat.id));
    } else {
      if (selectedSeats.length < quantity) {
        onSeatsChange([...selectedSeats, seat.id]);
      }
    }
  }

  if (!cls || seats.length === 0) return null;

  // Split seats into rows
  const rows = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  const needed = quantity - selectedSeats.length;

  return (
    <div className="seat-picker">
      <div className="sp-header">
        <h4><Users size={15} /> Choose Your Seats</h4>
        <span className={`sp-status ${needed === 0 ? "done" : ""}`}>
          {needed === 0
            ? `✓ ${quantity} seat${quantity > 1 ? "s" : ""} selected`
            : `Select ${needed} more seat${needed > 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Problem 2 fix: show all selected seats together — no restart needed */}
      {selectedSeats.length > 0 && (
        <div className="sp-selected-row">
          <span className="sp-sel-label">Selected:</span>
          {selectedSeats.map((id) => {
            const seat = seats.find((s) => s.id === id);
            return (
              <button
                key={id}
                className="sp-sel-tag"
                onClick={() => onSeatsChange(selectedSeats.filter((s) => s !== id))}
                aria-label={`Remove seat ${seat?.label}`}
              >
                {seat?.label} ×
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="sp-legend">
        <span className="sp-leg available" /> Available
        <span className="sp-leg selected" />  Selected
        <span className="sp-leg booked" />    Booked
      </div>

      {/* Seat grid — Problem 2 fix: select multiple without restarting */}
      <div className="sp-coach">
        <div className="sp-front-label">🚂 Front of Train</div>
        <div className="sp-grid" style={{ "--cols": seatsPerRow }}>
          {rows.map((row, ri) => (
            <div key={ri} className="sp-row">
              <span className="sp-row-num">{ri + 1}</span>
              {row.map((seat, si) => (
                <>
                  {/* Aisle gap in middle */}
                  {si === Math.floor(seatsPerRow / 2) && (
                    <span key={`aisle-${ri}`} className="sp-aisle" />
                  )}
                  <button
                    key={seat.id}
                    className={`sp-seat
                      ${seat.isBooked  ? "booked"   : ""}
                      ${selectedSeats.includes(seat.id) ? "selected" : ""}
                      ${!seat.isBooked && !selectedSeats.includes(seat.id) && selectedSeats.length >= quantity ? "maxed" : ""}
                    `}
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.isBooked}
                    aria-label={`Seat ${seat.label}, ${seat.isBooked ? "booked" : selectedSeats.includes(seat.id) ? "selected" : "available"}`}
                    aria-pressed={selectedSeats.includes(seat.id)}
                  >
                    {seat.number}
                  </button>
                </>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="sp-note">
        <Info size={12} />
        You can select any {quantity} available seat{quantity > 1 ? "s" : ""}. Tap a selected seat to deselect it.
      </p>
    </div>
  );
}
