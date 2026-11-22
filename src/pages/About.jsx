import { BookOpen, Users, Smartphone } from "lucide-react";
import { CLASSES } from "../data/trains";
import "./About.css";

export default function About() {
  return (
    <div className="about-page container">
      <div className="about-hero">
        <h1>About RailPK Express</h1>
        <p>Built to fix three real usability problems on Pakistan's existing railway booking website.</p>
      </div>

      {/* Problems We Solved */}
      <section className="problems-section">
        <h2 className="section-title">Problems We Solved</h2>
        <div className="problems-grid">
          {[
            {
              icon: <BookOpen size={28} />,
              number: "Problem 1",
              title: "Unclear Train Class Abbreviations",
              original: "https://www.pakrailways.gov.pk/ displays abbreviations like ACSB, ACSS, ACLZ, PC, ACSL, EC, ECS with no explanation. New users cannot understand what each class means, what facilities it includes, or how the classes differ.",
              solution: "Every class now shows its full name, abbreviation, icon, seat layout, and a full facilities list behind an ⓘ info button — visible before you book a single seat.",
            },
            {
              icon: <Users size={28} />,
              number: "Problem 2",
              title: "Difficult Multiple-Seat Selection",
              original: "On https://www.pakrailways.gov.pk/, adding a second seat of the same class requires restarting the entire selection from the beginning. There is no way to pick multiple seats in one flow.",
              solution: "Our interactive seat map lets you pick all seats in one screen. Selected seats appear as removable tags at the top. No restart needed — deselect and re-pick at any time.",
            },
            {
              icon: <Smartphone size={28} />,
              number: "Problem 3",
              title: "Poor Mobile Experience",
              original: "The https://www.pakrailways.gov.pk/ website uses a fixed-width desktop layout. Forms overflow on small screens, buttons are too small to tap accurately, and the seat map is completely unusable on mobile.",
              solution: "Fully responsive mobile-first layout with 44px+ tap targets, collapsible navigation, touch-friendly seat grid, and proper input labels for screen readers.",
            },
          ].map((p) => (
            <div key={p.number} className="problem-card card">
              <div className="problem-icon">{p.icon}</div>
              <span className="badge badge-red" style={{ marginBottom: 10 }}>{p.number}</span>
              <h3>{p.title}</h3>
              <div className="problem-block original">
                <strong>Original problem:</strong> {p.original}
              </div>
              <div className="problem-block solution">
                <strong>Our solution:</strong> {p.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Class Guide — Problem 1 reference */}
      <section className="class-guide-section">
        <h2 className="section-title">Travel Class Guide</h2>
        <p className="section-sub">On pr.gov.pk these are listed as unexplained abbreviations. Here we show you exactly what each class means.</p>
        <div className="class-guide-grid">
          {Object.entries(CLASSES).map(([key, cls]) => (
            <div key={key} className="class-guide-card card">
              <div className="cg-top">
                <span className="cg-icon">{cls.icon}</span>
                <div>
                  <div className="cg-name">{cls.label}</div>
                  <code className="cg-abbr">{cls.abbr}</code>
                </div>
              </div>
              <p className="cg-desc">{cls.description}</p>
              <ul className="cg-features">
                {cls.facilities.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <div className="cg-layout">Layout: {cls.seatLayout} · {cls.totalSeats} seats</div>
            </div>
          ))}
        </div>
      </section>

      {/* Business rules */}
      <section>
        <h2 className="section-title">Business Rules</h2>
        <div className="about-rules">
          {[
            { n: "Rule 1", title: "Capacity Rule", desc: "Each train class has a fixed limit — Economy 80, AC Standard 40, AC Sleeper 24, First Class 12. Bookings are blocked when a class is full. Seat availability is shown live on every listing." },
            { n: "Rule 2", title: "Eligibility Rule", desc: "Children under 3 travel free. Students with valid ID get 25% off. Senior citizens (60+) get 20% off. Discounts are calculated and shown automatically at booking." },
            { n: "Rule 3", title: "Pricing Rule", desc: "Bookings made less than 2 hours before departure carry a 15% last-minute surcharge. Extra luggage beyond 23 kg is charged at PKR 50 per kg." },
          ].map((r) => (
            <div key={r.n} className="rule-card card">
              <div className="rule-num">{r.n}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
