import { useState } from "react";
import { CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  }

  const set = (k) => (ev) => { setForm({ ...form, [k]: ev.target.value }); setErrors((p) => ({ ...p, [k]: undefined })); };

  return (
    <div className="contact-page container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have a question or need help with your booking? We're here for you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info card">
          <h2>Get in Touch</h2>
          <div className="info-item"><Phone size={20} /><div><strong>Phone</strong><p>0800-RAILPK (Mon–Sat, 8am–8pm)</p></div></div>
          <div className="info-item"><Mail size={20} /><div><strong>Email</strong><p>support@railpk.pk</p></div></div>
          <div className="info-item"><MapPin size={20} /><div><strong>Head Office</strong><p>Railway House, Davis Road, Lahore, Pakistan</p></div></div>
        </div>

        <div className="contact-form card">
          {submitted ? (
            <div className="state-box">
              <CheckCircle size={48} style={{ color: "var(--green)", opacity: 1 }} />
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h2>Send a Message</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="c-name">Full Name</label>
                  <input id="c-name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} className={errors.name ? "invalid" : ""} />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} className={errors.email ? "invalid" : ""} />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-subject">Subject</label>
                  <select id="c-subject" value={form.subject} onChange={set("subject")} className={errors.subject ? "invalid" : ""}>
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Issue</option>
                    <option value="refund">Refund Request</option>
                    <option value="general">General Enquiry</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  {errors.subject && <span className="error-msg">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-message">Message</label>
                  <textarea id="c-message" rows={5} placeholder="Describe your issue or question…" value={form.message} onChange={set("message")} className={errors.message ? "invalid" : ""} />
                  {errors.message && <span className="error-msg">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px" }} disabled={loading}>
                  {loading ? <><div className="spinner sm" />Sending…</> : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
