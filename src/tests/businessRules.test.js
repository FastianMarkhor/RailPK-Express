/**
 * RailPK Express — Business Rule Tests
 * Run with: node src/tests/businessRules.test.js
 */

// ── Inline business logic (mirrors src/data/trains.js) ───────────────────────

const CLASSES = {
  economy:    { label: "Economy Class",  abbr: "EC",   multiplier: 1.0, totalSeats: 80 },
  acstandard: { label: "AC Standard",   abbr: "ACSS", multiplier: 1.8, totalSeats: 40 },
  acsleeper:  { label: "AC Sleeper",    abbr: "ACSL", multiplier: 2.6, totalSeats: 24 },
  firstclass: { label: "First Class",   abbr: "ACSB", multiplier: 3.4, totalSeats: 12 },
};

const PASSENGER_TYPES = [
  { id: "adult",   discount: 0    },
  { id: "child",   discount: 1.0  },
  { id: "student", discount: 0.25 },
  { id: "senior",  discount: 0.20 },
];

function getAvailableSeats(route, seatClass) {
  const total  = CLASSES[seatClass]?.totalSeats || 0;
  const booked = route.bookedSeats[seatClass]  || 0;
  return Math.max(0, total - booked);
}

function isSeatAvailable(route, seatClass, quantity) {
  return getAvailableSeats(route, seatClass) >= quantity;
}

function getDiscount(passengerType) {
  const pt = PASSENGER_TYPES.find((p) => p.id === passengerType);
  return pt ? pt.discount : 0;
}

function getLastMinuteSurcharge(travelDate, departureTime) {
  if (!travelDate || !departureTime) return false;
  const [h, m]   = departureTime.split(":").map(Number);
  const departure = new Date(travelDate);
  departure.setHours(h, m, 0, 0);
  const diffHours = (departure - new Date()) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours < 2;
}

function calculateFare({ route, seatClass, passengers, travelDate, luggageKg = 0 }) {
  if (!CLASSES[seatClass]) return { subtotal: 0, surcharge: 0, luggageFee: 0, total: 0 };
  const base = route.baseFare * CLASSES[seatClass].multiplier;
  let subtotal = 0;
  passengers.forEach(({ type, count }) => {
    subtotal += base * (1 - getDiscount(type)) * count;
  });
  const luggageFee   = luggageKg > 23 ? (luggageKg - 23) * 50 : 0;
  const isLastMinute = getLastMinuteSurcharge(travelDate, route.departureTime);
  const surcharge    = isLastMinute ? subtotal * 0.15 : 0;
  const total        = subtotal + surcharge + luggageFee;
  return {
    subtotal:    Math.round(subtotal),
    surcharge:   Math.round(surcharge),
    luggageFee:  Math.round(luggageFee),
    total:       Math.round(total),
    isLastMinute,
  };
}

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0, failed = 0;

function test(description, fn) {
  try { fn(); console.log(`  ✓  ${description}`); passed++; }
  catch (err) { console.error(`  ✗  ${description}\n     ${err.message}`); failed++; }
}
function assert(condition, message) { if (!condition) throw new Error(message || "Assertion failed"); }
function assertEqual(a, b) { if (a !== b) throw new Error(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

// ── Sample routes ─────────────────────────────────────────────────────────────

const fullRoute = {
  baseFare: 1000, departureTime: "08:00",
  bookedSeats: { economy: 80, acstandard: 40, acsleeper: 24, firstclass: 12 },
};
const partialRoute = {
  baseFare: 1000, departureTime: "08:00",
  bookedSeats: { economy: 70, acstandard: 5, acsleeper: 0, firstclass: 0 },
};
const emptyRoute = {
  baseFare: 1000, departureTime: "08:00",
  bookedSeats: { economy: 0, acstandard: 0, acsleeper: 0, firstclass: 0 },
};

// ── RULE 1: Capacity ──────────────────────────────────────────────────────────

console.log("\n── Business Rule 1: Capacity ─────────────────────────────────");

test("Economy (80 seats) reports 0 when fully booked", () => {
  assertEqual(getAvailableSeats(fullRoute, "economy"), 0);
});
test("AC Standard reports 35 available when 5 booked", () => {
  assertEqual(getAvailableSeats(partialRoute, "acstandard"), 35);
});
test("AC Sleeper reports all 24 available when none booked", () => {
  assertEqual(getAvailableSeats(partialRoute, "acsleeper"), 24);
});
test("First Class reports all 12 available when empty", () => {
  assertEqual(getAvailableSeats(emptyRoute, "firstclass"), 12);
});
test("isSeatAvailable returns false when class is full", () => {
  assertEqual(isSeatAvailable(fullRoute, "economy", 1), false);
});
test("isSeatAvailable returns false when requesting more than available (economy has 10 left)", () => {
  assertEqual(isSeatAvailable(partialRoute, "economy", 11), false);
});
test("isSeatAvailable returns true for exactly the remaining count", () => {
  assertEqual(isSeatAvailable(partialRoute, "economy", 10), true);
});
test("Available seats never go below zero (overbooked guard)", () => {
  const over = { ...fullRoute, bookedSeats: { economy: 999, acstandard: 0, acsleeper: 0, firstclass: 0 } };
  assertEqual(getAvailableSeats(over, "economy"), 0);
});

// ── RULE 2: Eligibility / Discounts ──────────────────────────────────────────

console.log("\n── Business Rule 2: Eligibility Discounts ───────────────────");

test("Adult: no discount (0%)", () => assertEqual(getDiscount("adult"), 0));
test("Child: 100% discount (free)", () => assertEqual(getDiscount("child"), 1.0));
test("Student: 25% discount", () => assertEqual(getDiscount("student"), 0.25));
test("Senior: 20% discount", () => assertEqual(getDiscount("senior"), 0.20));
test("Unknown type: no discount (safe fallback)", () => assertEqual(getDiscount("vip"), 0));

test("Child fare is PKR 0 (free travel)", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "child", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(fare.subtotal, 0);
});
test("Student pays 75% of base (1000 × 1.0 × 0.75 = 750)", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "student", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(fare.subtotal, 750);
});
test("Senior pays 80% of base (1000 × 1.0 × 0.80 = 800)", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "senior", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(fare.subtotal, 800);
});
test("Adult + Student = 1000 + 750 = 1750", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "adult", count: 1 }, { type: "student", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(fare.subtotal, 1750);
});

// ── RULE 3: Pricing & Surcharges ─────────────────────────────────────────────

console.log("\n── Business Rule 3: Pricing & Surcharges ────────────────────");

test("No surcharge for future departure date (2030)", () => {
  assertEqual(getLastMinuteSurcharge("2030-01-01", "08:00"), false);
});
test("No surcharge for past departure (not last-minute)", () => {
  assertEqual(getLastMinuteSurcharge("2000-01-01", "08:00"), false);
});
test("No luggage fee at exactly 23 kg (boundary)", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01", luggageKg: 23 });
  assertEqual(fare.luggageFee, 0);
});
test("Luggage fee: 1 kg over = PKR 50", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01", luggageKg: 24 });
  assertEqual(fare.luggageFee, 50);
});
test("Luggage fee: 10 kg over = PKR 500", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01", luggageKg: 33 });
  assertEqual(fare.luggageFee, 500);
});
test("AC Standard multiplier is 1.8× economy for same route", () => {
  const ec  = calculateFare({ route: emptyRoute, seatClass: "economy",    passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01" });
  const ac  = calculateFare({ route: emptyRoute, seatClass: "acstandard", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(ac.subtotal, Math.round(ec.subtotal * 1.8));
});
test("First Class multiplier is 3.4× economy", () => {
  const ec  = calculateFare({ route: emptyRoute, seatClass: "economy",    passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01" });
  const fc  = calculateFare({ route: emptyRoute, seatClass: "firstclass", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01" });
  assertEqual(fc.subtotal, Math.round(ec.subtotal * 3.4));
});
test("Total = subtotal + surcharge + luggageFee", () => {
  const fare = calculateFare({ route: emptyRoute, seatClass: "economy", passengers: [{ type: "adult", count: 1 }], travelDate: "2030-01-01", luggageKg: 33 });
  assertEqual(fare.total, fare.subtotal + fare.surcharge + fare.luggageFee);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("\n─────────────────────────────────────────────────────────────");
console.log(`  Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed > 0) { console.error("  Some tests FAILED."); process.exit(1); }
else              console.log("  All tests passed ✓");
