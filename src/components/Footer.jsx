import { Train, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <Train size={22} />
            <span>RailPK <em>Express</em></span>
          </div>
          <p>Pakistan's most reliable train booking platform. Travel comfortably across the nation.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Find Trains</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><Phone size={14} /> 0800-RAILPK</li>
            <li><Mail size={14} /> support@railpk.pk</li>
            <li><MapPin size={14} /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 RailPK Express. Fictional business for academic purposes.</p>
      </div>
    </footer>
  );
}
