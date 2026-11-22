# DECISIONS.md — RailPK Express

## Overview

This document records three frontend design decisions in RailPK Express. Each decision directly addresses a problem observed on the Pakistan Railways official website (pakrail.gov.pk / pr.gov.pk).

---

## Decision 1 — Full Class Names, Descriptions and Info Tooltips (solves Problem 1)

### Problem Identified
The Pakistan Railways website lists travel classes as bare abbreviations: **ACSB, ACSS, ACLZ, PC, ACSL, EC, ECS**. No explanation, no facilities list, no seating description appears anywhere on the results or booking pages. A first-time user or someone unfamiliar with railway terminology cannot tell whether ACSS means air-conditioned or standard, or what the difference between ACSB and ACSL is. This confusion can lead to passengers selecting the wrong class and experiencing a journey that does not match their expectations.

### Decision
Replace bare abbreviations with a **ClassCard component** that displays:
- The class's full name (e.g. "AC Standard")
- Its abbreviation (e.g. ACSS) in a small badge so users can still match it to printed tickets
- An icon and fare
- An **ⓘ info button** that opens a tooltip showing: full description, complete facilities list (AC, Reclining Seats, Charging Ports…), and seating layout (e.g. "2+2 reclining")
- Live seats-remaining count per class

The class abbreviation also appears on the search results page inside the fare line, and in the fare breakdown summary during checkout.

### Alternatives Considered
| Alternative | Reason rejected |
|---|---|
| Plain text list of class names with no extra info | Does not explain facilities; passengers still can't compare classes meaningfully |
| Separate "Classes" help page linked in the footer | Too far from the booking flow; users won't find it at the right moment |
| Expand details on click (accordion inside booking form) | Accordion hides information until opened; tooltip on a small ⓘ button is less intrusive and doesn't disrupt the form layout |

### Why This Choice
Putting the full information at the point of decision — the class selection step — eliminates the guessing and the round-trips to search "what is ACSS Pakistan Railways". The tooltip pattern is familiar from e-commerce and airline booking sites. The abbreviation badge is preserved so users can match what they see on-screen to their confirmation SMS or printed ticket, where Pakistani Railways traditionally use the short codes.

---

## Decision 2 — Interactive Seat Map with Multi-Seat Selection (solves Problem 2)

### Problem Identified
On pr.gov.pk, selecting a second seat of the same class requires restarting the entire booking process from the beginning. There is no increment control, no seat quantity step, and no way to pick multiple seats in one flow. A family of four booking economy seats must repeat the selection four separate times, with the previously chosen seat not remembered between attempts.

### Decision
Build a **SeatPicker component** that provides:
- A visual coach grid showing every seat in the selected class (colour-coded: white = available, green = selected by user, grey = already booked)
- Multi-select: the user taps/clicks any available seat; seats are added to a "selected" list at the top
- Selected seats render as removable tags so the user can deselect any individual seat without touching the others
- The picker automatically enforces the quantity chosen in the Passengers fieldset (e.g. if 3 passengers are selected, exactly 3 seats must be chosen)
- Changing the class resets the selection cleanly

### Alternatives Considered
| Alternative | Reason rejected |
|---|---|
| Simple numeric counter ("how many seats?") with no seat map | Does not let travellers choose specific seats, e.g. adjacent seats for a family |
| Dropdown "choose seat number" for each passenger | Creates N separate selects that do not show occupied seats visually; still requires repeated steps |
| Seat map only, no quantity enforcer | Users can accidentally select too many or too few seats before proceeding |

### Why This Choice
A visual seat map is the industry-standard solution (used by airlines, buses, and international rail). It solves both sub-problems: (a) selecting multiple seats in one flow without restarting, and (b) giving users control over *which* seats they get (window vs aisle, together vs separate). The removable-tag display of selected seats above the grid gives immediate confirmation of the current state without scrolling.

---

## Decision 3 — Mobile-First Responsive Layout with Accessible Controls (solves Problem 3)

### Problem Identified
The pr.gov.pk website is built for desktop. On mobile devices: forms overflow their containers, buttons are smaller than a fingertip, the seat selection interface does not render, dropdowns require precise tapping, and no labels are linked to their inputs (failing basic accessibility). Pakistan has over 190 million mobile internet users; a website that breaks on mobile is not viable.

### Decision
Build the entire application **mobile-first**:
- Base CSS targets mobile (max-width), then overrides for wider screens using `min-width` breakpoints
- Every seat in the SeatPicker is **40 × 40px minimum** (mobile-safe tap target per WCAG 2.1)
- Navigation collapses to a touch-friendly slide-in drawer on mobile
- Two-column layouts (detail page, cart page, about page) stack to a single column below 900px
- Every `<input>`, `<select>` and `<textarea>` has an explicit `<label>` linked by `htmlFor` / `id`
- Focus styles (`outline: 3px solid var(--gold)`) are visible on all interactive elements for keyboard users
- Class grid on the detail page switches from 4 columns to 2 columns below 700px

### Alternatives Considered
| Alternative | Reason rejected |
|---|---|
| Desktop-first with mobile overrides | Requires overriding many more rules; mobile is left as an afterthought; produces heavier, more conflicting CSS |
| Separate mobile site (m.railpk.pk) | Doubles maintenance; content drifts out of sync; not recommended practice since responsive CSS became standard |
| Use a UI framework (Material UI, Ant Design, Bootstrap) | Adds 200–400 kB of CSS/JS; slower on 3G/4G connections common in Pakistan; overrides the custom visual identity |

### Why This Choice
Mobile-first guarantees the core experience works on the least capable device first. Enhancements are layered on for bigger screens. This keeps the CSS minimal and avoids the class of bugs where desktop styles leak onto mobile. Explicit labels and 44px tap targets are not gold-plating — they are the minimum for a usable mobile experience, and they benefit motor-impaired users and screen-reader users regardless of device.

---

## Summary

| # | Problem on pr.gov.pk | Our solution | Key component |
|---|---|---|---|
| 1 | Unexplained class abbreviations | Full name + facilities + ⓘ tooltip | `ClassCard` |
| 2 | Restarting to book multiple seats | Visual coach seat map with multi-select | `SeatPicker` |
| 3 | Broken mobile layout | Mobile-first CSS, 40px tap targets, labelled inputs | Responsive CSS + accessibility |
