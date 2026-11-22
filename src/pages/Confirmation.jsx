import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Train, Home } from "lucide-react";
import "./Confirmation.css";

function fmt(n) { return `PKR ${n.toLocaleString("en-PK")}`; }

export default function Confirmation() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("lastBooking");
    if (data) setBooking(JSON.parse(data));
  }, []);

  if (!booking) {
    return (
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="state-box">
          <Train size={48} />
          <h3>No booking found</h3>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-page container">
      <div className="confirm-card card">
        <div className="confirm-header">
          <div className="confirm-icon">
            <CheckCircle size={48} />
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been booked successfully. A confirmation will be sent to your email.</p>
          <div className="confirm-ref">
            Booking Reference: <strong>{booking.ref}</strong>
          </div>
        </div>

        <div className="confirm-details">
          <h3>Booking Summary</h3>
          {booking.bookings.map((b, i) => (
            <div key={i} className="confirm-ticket">
              <div className="ct-header">
                <span className="badge badge-green">{b.route.trainNumber}</span>
                <strong>{b.route.trainName}</strong>
              </div>
              <div className="ct-route">
                <div className="ct-point">
                  <span className="ct-time">{b.route.departureTime}</span>
                  <span className="ct-city">{b.route.from}</span>
                </div>
                <div className="ct-line" />
                <div className="ct-point right">
                  <span className="ct-time">{b.route.arrivalTime}</span>
                  <span className="ct-city">{b.route.to}</span>
                </div>
              </div>
              <div className="ct-meta">
                <span>Date: {b.travelDate}</span>
                <span>Class: {b.seatClass}</span>
                <span>Fare: {fmt(b.fare.total)}</span>
              </div>
            </div>
          ))}

          <div className="confirm-passenger">
            <h4>Passenger</h4>
            <p>{booking.passenger.name}</p>
            <p>{booking.passenger.email}</p>
            <p>{booking.passenger.phone}</p>
          </div>

          <div className="confirm-total">
            <span>Total Paid</span>
            <span>{fmt(booking.total)}</span>
          </div>
        </div>

        <div className="confirm-actions">
          <Link to="/" className="btn btn-secondary">
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/search" className="btn btn-primary">
            <Train size={16} /> Book Another Train
          </Link>
        </div>
      </div>
    </div>
  );
}
