# Design System & Visual Guidelines (`DESIGN_SYSTEM.md`)

This document captures the visual identity, typography, motion principles, and accessibility standards for **Joyce Yang’s Portfolio (`joycekyang.com`)**.

---

## 1. Brand Personality ("The Soul")
* **Editorial Minimalism + Tactile Clarity:** Crisp high-contrast black and white framing (`JY` monogram box, circular portrait ring) paired with **Electric Indigo (`#3321FF`)** interactive accents and floating device mockups.
* **Learner-Centered Scannability:** Every page guides the viewer's eye cleanly from **Visual Hook (Mockup) → Clear Title & Summary → Skill/Tool Tags → Actionable Case Study CTA**.

---

## 2. Color Tokens (`src/styles/tokens.css`)

| Token | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `--primary-blue` | `#3321FF` | Primary brand accent: active nav links, case study H1s, skill tag pills, CTA button borders/fills |
| `--primary-blue-hover` | `#2614E6` | Hover state for primary filled buttons and links |
| `--primary-blue-soft` | `rgba(51, 33, 255, 0.08)` | Subtle tint for dropdown hover states and case study secondary pills |
| `--text-pure-black` | `#000000` | Display titles, monogram square, card headings |
| `--text-main` | `#0F172A` | Primary body text and metadata values |
| `--text-muted` | `#374151` | Case study body paragraphs and card descriptions |
| `--bg-page` | `#FFFFFF` | Main page canvas and card background |
| `--bg-surface` | `#F9FAFB` | Subtle cool surface behind case study containers and metadata cards |
| `--footer-bg` | `rgba(22, 22, 26, 0.96)` | Dark glassmorphic footer surface |

---

## 3. Typography Hierarchy

* **Heading Font (`--font-heading`):** `'Poppins', sans-serif` (Weights: `500`, `600`, `700`, `800`)
  * **Home Display Name:** `clamp(2.2rem, 6.8vw, 6.2rem)`, `800` weight, `0.08em` letter-spacing.
  * **Section Page Title (`h1`):** `clamp(32px, 6vw, 54px)`, `800` weight.
  * **Case Study Hero Title (`h1`):** `clamp(2.1rem, 4vw, 3rem)`, `800` weight, `color: var(--primary-blue)`.
  * **Project Card Title (`h2`):** `26px` (`22px` on mobile), `700` weight.
* **Body Font (`--font-body`):** `'Manrope', 'Poppins', sans-serif` (Weights: `400`, `500`, `600`, `700`)
  * **Body Copy:** `1.04rem–1.08rem`, line-height `1.65–1.8` for effortless reading.
  * **Metadata Labels:** `0.75rem`, uppercase, `700` weight, `0.05em` letter-spacing, `color: var(--primary-blue)`.

---

## 4. Layout & Responsive Breakpoints

* **Desktop (`> 1024px`):**
  * 2-column project card galleries (`max-width: 1440px`, `40px` grid gap).
  * 2-column Case Study Hero (`1.05fr 0.95fr`) + 5-column responsive `MetaGrid`.
* **Tablet (`641px – 1024px`):**
  * Collapses Navbar into an accessible hamburger drawer at `960px`.
  * Case Study Hero stacks cleanly into 1 column; `MetaGrid` wraps automatically via `repeat(auto-fit, minmax(195px, 1fr))`.
* **Mobile (`<= 640px`):**
  * 1-column project cards with comfortable `28px 22px` padding.
  * Full-width category CTA buttons on Home.

---

## 5. Motion & Animation Principles

* **Smoothness Curves:**
  * Card hover & UI transitions: `--ease-smooth: cubic-bezier(0.165, 0.84, 0.44, 1)` (`0.4s`).
  * Hero entrance (`JY` monogram): `--ease-out-expo: cubic-bezier(0.23, 1, 0.32, 1)`.
* **Hardware Acceleration:** Animate only `transform` and `opacity` (plus `box-shadow` on hover) for `60fps` performance.
* **Accessibility (`prefers-reduced-motion`):** Users with OS-level reduced motion enabled automatically receive instant transitions (`0.01ms`) defined in `src/styles/tokens.css`.

---

## 6. Accessibility & Cross-Page Consistency Checklist
1. **Cross-Page Copy & Naming Parallelism:**
   * All sibling section pages (`/all-lxd-projects`, `/all-ux-projects`, `/all-graphic-design`) must use parallel `<h1>` headings, `<title>` formats, and Navbar dropdown `"All ... Projects"` labels.
   * Any deviation in CTA button wording, heading structure, or nav naming across sibling items must be flagged to the user for approval.
2. **No Nested Interactive Elements:** Project cards use a semantic `<article>` with an `<a>` inside the `<h2>` whose `::after` pseudo-element stretches across the card, never `<a class="card"><button>...</button></a>`.
3. **Keyboard Navigation:** Visible `3px solid #3321FF` focus ring on `:focus-visible` and a `"Skip to main content"` link at the top of every page.
4. **Meaningful Alt Text:** Every `<img>` requires a descriptive `alt` attribute (verified automatically by `npm.cmd run qa`).
5. **Natural, Human Copy:** Avoid em-dashes (`—`) and overly academic or AI-sounding jargon in case study copy, titles, and docs. Use direct, plain language and standard separators (`|`, `·`, `:`, commas, or periods).
