export const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Peshawar",
  "Quetta", "Multan", "Faisalabad", "Rawalpindi",
  "Hyderabad", "Sukkur"
];

// ── Problem 1 Fix: Full class info instead of abbreviations ─────────────────
export const CLASSES = {
  economy: {
    label: "Economy Class",
    abbr: "EC",
    multiplier: 1.0,
    totalSeats: 80,
    seatsPerRow: 4, // 2+2 layout
    description: "Comfortable padded seats in an air-conditioned coach. Ideal for budget-conscious travellers.",
    facilities: ["Air Conditioning", "Padded Seats", "Overhead Storage"],
    seatLayout: "2+2 rows",
    icon: "🪑",
  },
  acstandard: {
    label: "AC Standard",
    abbr: "ACSS",
    multiplier: 1.8,
    totalSeats: 40,
    seatsPerRow: 4,
    description: "Air-conditioned coach with extra legroom and reclining seats. Great value for longer journeys.",
    facilities: ["Air Conditioning", "Reclining Seats", "Charging Ports", "Snack Service"],
    seatLayout: "2+2 reclining",
    icon: "💺",
  },
  acsleeper: {
    label: "AC Sleeper",
    abbr: "ACSL",
    multiplier: 2.6,
    totalSeats: 24,
    seatsPerRow: 2,
    description: "Private sleeping berths with bedding included. Perfect for overnight journeys.",
    facilities: ["Air Conditioning", "Sleeping Berths", "Bedding", "Privacy Curtain", "Charging Ports"],
    seatLayout: "Upper & lower berths",
    icon: "🛏️",
  },
  firstclass: {
    label: "First Class",
    abbr: "ACSB",
    multiplier: 3.4,
    totalSeats: 12,
    seatsPerRow: 2,
    description: "Premium cabin with widest seats, full meal service, and dedicated attendant.",
    facilities: ["Air Conditioning", "Wide Luxury Seats", "Full Meal", "Attendant Service", "WiFi", "Charging Ports"],
    seatLayout: "1+1 luxury",
    icon: "⭐",
  },
};

// Generate seat grid for a class (Problem 2 Fix: visual seat selection)
export function generateSeats(route, seatClass) {
  const cls = CLASSES[seatClass];
  if (!cls) return [];
  const total = cls.totalSeats;
  const booked = route.bookedSeats[seatClass] || 0;
  // Mark first N seats as booked (simulate real data)
  return Array.from({ length: total }, (_, i) => ({
    id: `${seatClass}-${i + 1}`,
    number: i + 1,
    label: `${cls.abbr}${i + 1}`,
    isBooked: i < booked,
  }));
}

export const ROUTES = [
  {
    id: "r1",
    trainName: "Karachi Express",
    trainNumber: "KE-101",
    from: "Karachi",
    to: "Lahore",
    departureTime: "08:00",
    arrivalTime: "22:00",
    duration: "14h 00m",
    baseFare: 3500,
    bookedSeats: { economy: 62, acstandard: 30, acsleeper: 14, firstclass: 8 },
    amenities: ["WiFi", "Dining Car", "AC", "Charging Ports"],
    days: ["Mon", "Wed", "Fri", "Sun"],
  },
  {
    id: "r2",
    trainName: "Lahore Rawal Express",
    trainNumber: "LR-202",
    from: "Lahore",
    to: "Islamabad",
    departureTime: "07:30",
    arrivalTime: "11:30",
    duration: "4h 00m",
    baseFare: 1200,
    bookedSeats: { economy: 70, acstandard: 35, acsleeper: 18, firstclass: 10 },
    amenities: ["AC", "Charging Ports", "Snack Bar"],
    days: ["Daily"],
  },
  {
    id: "r3",
    trainName: "Green Line",
    trainNumber: "GL-303",
    from: "Karachi",
    to: "Peshawar",
    departureTime: "18:00",
    arrivalTime: "20:00",
    duration: "26h 00m",
    baseFare: 5200,
    bookedSeats: { economy: 55, acstandard: 22, acsleeper: 10, firstclass: 5 },
    amenities: ["WiFi", "Dining Car", "AC", "Sleeping Berths", "Charging Ports"],
    days: ["Tue", "Thu", "Sat"],
  },
  {
    id: "r4",
    trainName: "Quetta Mail",
    trainNumber: "QM-404",
    from: "Islamabad",
    to: "Quetta",
    departureTime: "20:00",
    arrivalTime: "16:00",
    duration: "20h 00m",
    baseFare: 4800,
    bookedSeats: { economy: 40, acstandard: 15, acsleeper: 5, firstclass: 3 },
    amenities: ["AC", "Dining Car", "Sleeping Berths"],
    days: ["Mon", "Thu", "Sat"],
  },
  {
    id: "r5",
    trainName: "Multan Shuttle",
    trainNumber: "MS-505",
    from: "Lahore",
    to: "Multan",
    departureTime: "09:00",
    arrivalTime: "13:30",
    duration: "4h 30m",
    baseFare: 950,
    bookedSeats: { economy: 50, acstandard: 20, acsleeper: 8, firstclass: 4 },
    amenities: ["AC", "Snack Bar"],
    days: ["Daily"],
  },
  {
    id: "r6",
    trainName: "Hyderabad Local",
    trainNumber: "HL-606",
    from: "Karachi",
    to: "Hyderabad",
    departureTime: "06:30",
    arrivalTime: "09:30",
    duration: "3h 00m",
    baseFare: 450,
    bookedSeats: { economy: 75, acstandard: 38, acsleeper: 20, firstclass: 10 },
    amenities: ["AC"],
    days: ["Daily"],
  },
  {
    id: "r7",
    trainName: "Rawalpindi Express",
    trainNumber: "RE-707",
    from: "Faisalabad",
    to: "Rawalpindi",
    departureTime: "10:00",
    arrivalTime: "14:30",
    duration: "4h 30m",
    baseFare: 1100,
    bookedSeats: { economy: 30, acstandard: 10, acsleeper: 4, firstclass: 2 },
    amenities: ["AC", "Charging Ports"],
    days: ["Mon", "Wed", "Fri"],
  },
  {
    id: "r8",
    trainName: "Chenab Express",
    trainNumber: "CE-808",
    from: "Lahore",
    to: "Faisalabad",
    departureTime: "07:00",
    arrivalTime: "09:30",
    duration: "2h 30m",
    baseFare: 650,
    bookedSeats: { economy: 45, acstandard: 18, acsleeper: 7, firstclass: 3 },
    amenities: ["AC", "Snack Bar"],
    days: ["Daily"],
  },
  {
    id: "r9",
    trainName: "Sukkur Night Express",
    trainNumber: "SN-909",
    from: "Multan",
    to: "Sukkur",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 00m",
    baseFare: 1800,
    bookedSeats: { economy: 60, acstandard: 28, acsleeper: 12, firstclass: 6 },
    amenities: ["AC", "Sleeping Berths", "Dining Car"],
    days: ["Tue", "Thu", "Sun"],
  },
  {
    id: "r10",
    trainName: "Khyber Commuter",
    trainNumber: "KC-010",
    from: "Peshawar",
    to: "Rawalpindi",
    departureTime: "06:00",
    arrivalTime: "09:00",
    duration: "3h 00m",
    baseFare: 780,
    bookedSeats: { economy: 20, acstandard: 8, acsleeper: 2, firstclass: 1 },
    amenities: ["AC"],
    days: ["Daily"],
  },
];

// ── Business Rule Helpers ────────────────────────────────────────────────────

export function getAvailableSeats(route, seatClass) {
  const total = CLASSES[seatClass]?.totalSeats || 0;
  const booked = route.bookedSeats[seatClass] || 0;
  return Math.max(0, total - booked);
}

export function isSeatAvailable(route, seatClass, quantity) {
  return getAvailableSeats(route, seatClass) >= quantity;
}

export const PASSENGER_TYPES = [
  { id: "adult",   label: "Adult",                   discount: 0    },
  { id: "child",   label: "Child (under 3, free)",   discount: 1.0  },
  { id: "student", label: "Student (25% off)",        discount: 0.25 },
  { id: "senior",  label: "Senior 60+ (20% off)",     discount: 0.20 },
];

export function getDiscount(passengerType) {
  const pt = PASSENGER_TYPES.find((p) => p.id === passengerType);
  return pt ? pt.discount : 0;
}

export function getLastMinuteSurcharge(travelDate, departureTime) {
  if (!travelDate || !departureTime) return false;
  const [h, m] = departureTime.split(":").map(Number);
  const departure = new Date(travelDate);
  departure.setHours(h, m, 0, 0);
  const now = new Date();
  const diffHours = (departure - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours < 2;
}

export function calculateFare({ route, seatClass, passengers, travelDate, luggageKg = 0 }) {
  if (!route || !seatClass || !CLASSES[seatClass]) return { subtotal: 0, surcharge: 0, luggageFee: 0, total: 0 };
  const base = route.baseFare * CLASSES[seatClass].multiplier;
  let subtotal = 0;
  passengers.forEach(({ type, count }) => {
    const discount = getDiscount(type);
    subtotal += base * (1 - discount) * count;
  });
  const luggageFee   = luggageKg > 23 ? (luggageKg - 23) * 50 : 0;
  const isLastMinute = getLastMinuteSurcharge(travelDate, route.departureTime);
  const surcharge    = isLastMinute ? subtotal * 0.15 : 0;
  const total        = subtotal + surcharge + luggageFee;
  return {
    base,
    subtotal:    Math.round(subtotal),
    surcharge:   Math.round(surcharge),
    luggageFee:  Math.round(luggageFee),
    total:       Math.round(total),
    isLastMinute,
  };
}
