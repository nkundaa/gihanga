# GIHANGA — design system

Use this as a brief for a designer, or paste it directly into a coding assistant (Claude Code, etc.) working on the GIHANGA codebase. It defines one consistent design language and applies it page by page, so nothing drifts.

---

## 1. Brand foundation

**Subject:** GIHANGA is a marketplace connecting shoppers with verified independent fashion boutiques across Kigali, Rwanda. The tone should feel like a trusted local institution, not a generic template store — confident, warm, unmistakably Kigali.

### Color tokens
```
--ink        #14171F   primary text, headers, primary buttons
--paper      #FAF9F5   page background
--stone      #EFECE3   card/section fill, muted surfaces
--blue       #2C5A82   primary brand accent, links, active states
--blue-deep  #1C3C57   hover state for blue, dark UI surfaces
--gold       #C6912E   secondary accent — badges, highlights, ratings
--clay       #B5502E   tertiary accent — eyebrows, "new/limited" badges
--clay-deep  #7A3319   hover/dark variant of clay
--line       rgba(20,23,31,0.10)   default hairline border
--muted      rgba(20,23,31,0.62)  secondary text
```
Never introduce a new accent color outside this set. Blue = primary action/trust. Gold = value/quality signal. Clay = urgency/freshness signal. Each color should always mean the same thing across every page.

### Typography
- **Display accent:** Instrument Serif, italic — used only for single words inside a heading (the site's signature move, e.g. "Browse what *you* love"). Never set full sentences in it.
- **Headings/UI:** Manrope, weights 700–800. Tight letter-spacing (-0.01 to -0.02em) at large sizes.
- **Body:** Manrope 400/500, line-height 1.6–1.7.
- **Type scale:** 64 / 38 / 24 / 17 / 15.5 / 13 / 11.5px. Pick from this scale — don't invent in-between sizes.

### Spacing, radius, elevation
- Base unit: 8px. All padding/margin/gaps are multiples of 8 (8, 16, 24, 32, 48, 64, 96).
- Card radius: 14–16px. Button/input radius: 10px. Pills/badges: fully rounded.
- Shadows: none by default. Only on hover-lift for cards (`0 12px 28px rgba(20,23,31,0.08)`) and on the sticky nav after scroll.
- Borders: 1px, `var(--line)`, never heavier unless indicating an active/selected state.

### Motion
- 150–200ms ease transitions only, on transform and opacity. No bouncy easing, no page-load animation sequences. Hover = 3–4px lift + shadow, nothing more.

---

## 2. Global rules (apply to every page)

1. **Tap targets ≥ 44px.** Every button, icon button, checkbox, and nav item — no exceptions. This matters most on mobile, which is most of GIHANGA's traffic.
2. **One primary button per view.** Everything else is secondary/ghost. Never two solid dark buttons competing on the same screen.
3. **Loading states are designed, not blank.** Every async view (product grid, store list, checkout submit) gets a skeleton or spinner state — never a flash of empty white before content pops in.
4. **Empty states are an invitation, not an apology.** "No pieces match yet — try a different category" with a clear action, never a bare "No results."
5. **Errors say what happened and what to do next**, in plain language, no raw system text (e.g. never show "422" or a stack trace to a shopper).
6. **Badges/labels are sentence case**, not ALL CAPS in body copy — reserve caps + letterspacing for eyebrows and category pills only, and keep that usage consistent.
7. **Every card in a grid has identical anatomy**: image → badge → favorite icon → store name (label style) → item name → price → cart icon. Don't let this vary page to page.
8. **Verified-store badge** is a fixed visual: dark pill, small dot, "Verified" — same treatment everywhere a store is referenced (grid, profile, checkout, footer mention).

---

## 3. Page-by-page direction

### Homepage
Hero establishes the whole system: eyebrow label → large heading with one italic accent word → short supporting line → primary + ghost CTA pair → a real product card floated over the hero image. Follow with: category grid (5 cards, consistent aspect ratio, icon-badge top-left, name bottom-left), a curated product edit (4-up grid), a trust stat band (dark, 4 stats), then footer.

### Shop / category listing
Sticky filter bar directly under a slim category-context header (not a full hero — this page needs to get to browsing fast). Category pills + search + store dropdown, all in one row on desktop, stacked and horizontally scrollable on mobile. Product grid uses the same card anatomy as the homepage "edit." Show a live result count ("12 pieces") so filtering feels responsive. Filtering/searching updates the grid with a brief skeleton state, not a jarring reflow.

### Product detail
Two-column: image gallery left (large, zoomable, thumbnail strip), info right (store name → product name → price → size/variant selector → quantity → primary "Add to cart" button, full width, 48px tall → secondary "Message store" ghost button). Below the fold: description, delivery estimate, and a "More from this store" row using the same card anatomy again.

### Stores directory
Grid of store cards: cover image, verified badge, avatar, category label, store name, one-line description, rating + piece count + neighborhood. Filtering by category uses the same pill pattern as the shop page — reuse the component, don't rebuild it. Each card's "Visit boutique" action is a full-width ghost button at the bottom of the card, not just the whole card being clickable with no visible affordance.

### Store profile
Cover banner + avatar overlapping it (standard boutique-profile layout) → store name, verified badge, rating, location, short bio → "Visit boutique" primary button → category filter pills scoped to this store's catalog → product grid (same card anatomy).

### Become a seller / onboarding
This is a trust-critical, multi-step flow — treat it with more restraint than the shopping pages, not less. Fixed step indicator at top ("Step 2 of 3", progress bar, percentage) stays visible throughout. One task per screen. Field labels above inputs, not placeholder-only. File upload fields show a clear success state (green check + filename) once uploaded — never leave ambiguous whether a file attached. Submission errors appear inline, above the submit button, in plain language ("This email's already registered — log in instead?") rather than a generic red banner. Never let a user reach a submit failure without a visible, specific next step.

### Login / create account
Centered single card, max 420px wide, generous vertical padding. Icon + heading + one-line subtext → form fields → primary submit (full width) → secondary link to the alternate flow ("Already have an account? Log in"). No marketing content on this screen — it's a task, not a pitch.

### Cart / checkout
Left: line items grouped by store (since this is a multi-vendor marketplace — make that grouping visually clear with a store-name subheader per group). Right: sticky order summary card (subtotal, delivery, total, promo code field, primary "Place order" button). Delivery method and payment method (mobile money provider, cash on delivery) use the same select/dropdown styling as the seller-onboarding flow — one dropdown component across the whole site, not several different-looking ones.

### Account / orders
Left sidebar nav (Orders, Wishlist, Addresses, Payment methods) on desktop; horizontal scrollable tab bar on mobile. Order cards show store, items, status badge (use color meaningfully: gold = pending, blue = in transit, ink = delivered — never red/green for routine status, reserve those for actual errors/success).

---

## 4. How to use this prompt

Hand this whole document to whoever builds the next page. The rule of thumb: **if a pattern already exists on another page (a card, a badge, a dropdown, a button), reuse it exactly rather than styling a new one.** Consistency across pages is what turns "nice individual screens" into a 9-10/10 product — it's the thing a one-off mockup can't fix on its own.
