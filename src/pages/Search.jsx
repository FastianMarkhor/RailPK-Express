import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Train } from "lucide-react";
import TrainCard from "../components/TrainCard";
import { ROUTES, CITIES, CLASSES } from "../data/trains";
import "./Search.css";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const today = new Date().toISOString().split("T")[0];

  const [from,     setFrom]     = useState(params.get("from") || "");
  const [to,       setTo]       = useState(params.get("to")   || "");
  const [date,     setDate]     = useState(params.get("date") || today);
  const [seatClass,setSeatClass]= useState("economy");
  const [sortBy,   setSortBy]   = useState("departure");
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(!!params.get("from"));
  const [results,  setResults]  = useState([]);

  useEffect(() => {
    if (!params.get("from") && !params.get("to")) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const f = ROUTES.filter((r) => {
        const matchFrom = !from || r.from.toLowerCase() === from.toLowerCase();
        const matchTo   = !to   || r.to.toLowerCase()   === to.toLowerCase();
        return matchFrom && matchTo;
      });
      setResults(f);
      setLoading(false);
      setSearched(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [params]); // eslint-disable-line

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === "price")     return (a.baseFare * CLASSES[seatClass].multiplier) - (b.baseFare * CLASSES[seatClass].multiplier);
      if (sortBy === "duration")  return a.duration.localeCompare(b.duration);
      return 0;
    });
  }, [results, sortBy, seatClass]);

  function handleSearch(e) {
    e.preventDefault();
    if (from && to && from === to) return;
    setParams({ from, to, date });
    setSearched(false);
    setResults([]);
  }

  return (
    <div className="search-page container">
      {/* Search bar */}
      <form className="search-bar card" onSubmit={handleSearch}>
        <div className="sb-fields">
          <div className="form-group">
            <label htmlFor="sb-from">From</label>
            <select id="sb-from" value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Any city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sb-to">To</label>
            <select id="sb-to" value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">Any city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sb-date">Date</label>
            <input id="sb-date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          <Search size={16} /> Search
        </button>
      </form>

      {/* Controls */}
      {searched && (
        <div className="search-controls">
          <div className="results-meta">
            {!loading && (
              <span>
                {sorted.length} train{sorted.length !== 1 ? "s" : ""} found
                {from && to ? ` · ${from} → ${to}` : from ? ` from ${from}` : to ? ` to ${to}` : ""}
              </span>
            )}
          </div>
          <div className="controls-row">
            {/* Problem 1 fix: class filter shows full name + abbr */}
            <div className="form-group mb0">
              <label htmlFor="class-filter">Class</label>
              <select id="class-filter" value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
                {Object.entries(CLASSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label} ({v.abbr})</option>
                ))}
              </select>
            </div>
            <div className="form-group mb0">
              <label htmlFor="sort-filter">Sort by</label>
              <select id="sort-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="departure">Departure Time</option>
                <option value="price">Price (Low → High)</option>
                <option value="duration">Journey Duration</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <h3>Searching trains…</h3>
          <p>Checking real-time availability across all routes.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && sorted.length === 0 && (
        <div className="state-box">
          <Train size={48} />
          <h3>No trains found</h3>
          <p>
            {from && to
              ? `No direct trains between ${from} and ${to}. Try different cities.`
              : "Select a departure or destination city to search."}
          </p>
          <button className="btn btn-secondary" onClick={() => { setFrom(""); setTo(""); setParams({}); setSearched(false); }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && sorted.length > 0 && (
        <div className="results-list">
          {sorted.map((route) => (
            <TrainCard key={route.id} route={route} selectedClass={seatClass} />
          ))}
        </div>
      )}

      {/* Initial empty state */}
      {!searched && !loading && (
        <div className="state-box">
          <Train size={48} />
          <h3>Search for a train</h3>
          <p>Select your cities and date above to see available trains and live seat counts.</p>
        </div>
      )}
    </div>
  );
}
