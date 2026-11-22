import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import "./Cart.css";

function fmt(n) { return `PKR ${n.toLocaleString("en-PK")}`; }

export default function Cart({ cart, onRemove, onClearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", cnic: "", payMethod: "card" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((s, b) => s + b.fare.total, 0);

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "Full name required (at least 3 characters)";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || !/^(\+92|0)?[0-9]{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Valid Pakistani phone number required (e.g. 03001234567)";
    if (!form.cnic.trim() || !/^\d{5}-\d{7}-\d$/.test(form.cnic))
      e.cnic = "CNIC required in format: 12345-1234567-1";
    return e;
  }

  function handleCheckout(e) {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const booking = {
        bookings: cart,
        passenger: form,
        total,
        ref: `RPK-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
      };
      localStorage.setItem("lastBooking", JSON.stringify(booking));
      onClearCart();
      navigate("/confirmation");
    }, 1500);
  }

  const set = (k) => (ev) => { setForm({ ...form, [k]: ev.target.value }); setErrors((prev) => ({ ...prev, [k]: undefined })); };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="state-box">
          <ShoppingCart size={48} />
          <h3>Your cart is empty</h3>
          <p>Find a train and add it to your cart to continue.</p>
          <Link to="/search" className="btn btn-primary">Find Trains</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items">
          {cart.map((booking) => (
            <div key={booking.id} className="cart-item card">
              <div className="ci-header">
                <div>
                  <span className="badge badge-slate">{booking.route.trainNumber}</span>
                  <h3 className="ci-name">{booking.route.trainName}</h3>
                  <div className="ci-route">
                    {booking.route.from} → {booking.route.to} · {booking.travelDate} · {booking.seatClass}
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(booking.id)}
                  aria-label="Remove booking"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="ci-breakdown">
                {booking.passengers.filter(p => p.count > 0).map(({ type, count }) => (
                  <div key={type} className="ci-line">
                    <span>{type} × {count}</span>
                  </div>
                ))}
                {booking.fare.luggageFee > 0 && (
                  <div className="ci-line"><span>Extra luggage</span><span>{fmt(booking.fare.luggageFee)}</span></div>
                )}
                {booking.fare.surcharge > 0 && (
                  <div className="ci-line surcharge"><span>Last-minute surcharge</span><span>{fmt(booking.fare.surcharge)}</span></div>
                )}
                <div className="ci-line total"><span>Subtotal</span><span>{fmt(booking.fare.total)}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        <div className="checkout-form card">
          <h2>Passenger Details</h2>
          <form onSubmit={handleCheckout} noValidate>

            <div className="form-group">
              <label htmlFor="p-name">Full Name</label>
              <input
                id="p-name" type="text" placeholder="Muhammad Ali Khan"
                value={form.name} onChange={set("name")}
                className={errors.name ? "invalid" : ""}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="p-email">Email Address</label>
              <input
                id="p-email" type="email" placeholder="ali@example.com"
                value={form.email} onChange={set("email")}
                className={errors.email ? "invalid" : ""}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="p-phone">Phone Number</label>
              <input
                id="p-phone" type="tel" placeholder="03001234567"
                value={form.phone} onChange={set("phone")}
                className={errors.phone ? "invalid" : ""}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="p-cnic">CNIC Number</label>
              <input
                id="p-cnic" type="text" placeholder="12345-1234567-1"
                value={form.cnic} onChange={set("cnic")}
                className={errors.cnic ? "invalid" : ""}
              />
              {errors.cnic && <span className="error-msg">{errors.cnic}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pay-method">Payment Method</label>
              <select id="pay-method" value={form.payMethod} onChange={set("payMethod")}>
                <option value="card">Credit / Debit Card</option>
                <option value="easypaisa">Easypaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="cart-total">
              <span>Grand Total</span>
              <span>{fmt(total)}</span>
            </div>

            <button type="submit" className="btn btn-gold checkout-btn" disabled={loading}>
              {loading ? <><div className="spinner sm" />Processing…</> : <>Confirm Booking <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
