# Master Project Specification (`SPEC.md`)

> **For AI Agents & Engineers:** Read this file first before making any code, style, or content changes to `joycekyang.com`.

## 1. Project Overview & Tech Stack
* **Owner:** Joyce Yang (Instructional Designer, Learning Experience Designer, UX Designer, Graphic Designer)
* **Framework:** Astro 5 (`@astrojs/mdx`) compiling to zero-overhead static HTML/CSS with native View Transitions (`<ClientRouter />`).
* **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` (`Source: GitHub Actions`).
* **Local Live Preview:** Vite HMR dev server (`npm.cmd run dev` on Windows / `npm run dev` on macOS/Linux) running at `http://localhost:4321`, pre-configured in `.vscode/tasks.json` and `.vscode/launch.json`.

---

## 2. Folder Structure & Single-Responsibility Architecture

```text
joyce-website/
├── .vscode/                    # Live preview server auto-start & browser launch config
├── .github/workflows/deploy.yml# GitHub Pages automated build & deployment
├── _legacy_squarespace/        # Archived original Squarespace HTML blocks (read-only reference)
├── cspell.json                 # Custom spellcheck dictionary for LXD/UXD/ID domain terms
├── scripts/qa-check.mjs        # Automated internal route, URL, schema & accessibility validator
├── SPEC.md                     # Master architecture & 6-Lens AI workflow rules (THIS FILE)
├── DESIGN_SYSTEM.md            # Visual tokens, typography, motion & WCAG accessibility rules
├── PLAYBOOK.md                 # Human & Agent how-to guide (Git, VS Code, media, recipes)
├── public/
│   ├── images/                 # Self-hosted static project images & thumbnails
│   ├── resume/                 # Self-hosted Resume PDF files
│   └── videos/                 # Short (<10 MB) silent UI loop videos
└── src/
    ├── content.config.ts       # Strict Zod schema validating all project .mdx frontmatter
    ├── content/projects/       # All portfolio projects (.mdx files, 1 file per project)
    ├── styles/tokens.css       # Tier 1 Global CSS Design Tokens (site-wide variables)
    ├── layouts/
    │   ├── BaseLayout.astro    # HTML head, Google Fonts, View Transitions, Navbar/Footer toggle
    │   ├── SectionLayout.astro # Shared 2-column gallery layout for LXD, UXD & Graphic Design
    │   └── CaseStudyLayout.astro # Shared case study layout (Hero + 5-col MetaGrid + Prose + Gallery)
    ├── components/
    │   ├── Navbar.astro        # Sticky top header with dropdowns & mobile drawer
    │   ├── Footer.astro        # Dark glassmorphic footer
    │   ├── HeroJY.astro        # Home page animated "JY" square + bio + 3 category buttons
    │   ├── ProjectCard.astro   # Single reusable accessible project card
    │   └── MetaGrid.astro      # 5-column case study metadata grid
    └── pages/
        ├── index.astro                 # Home (/), intentionally has showNavbar={false}
        ├── all-lxd-projects.astro      # Learning Experience Design (/all-lxd-projects)
        ├── all-ux-projects.astro       # User Experience Design (/all-ux-projects)
        ├── all-graphic-design.astro    # Graphic Design (/all-graphic-design)
        ├── resume.astro                # Resume (/resume)
        └── [slug].astro                # Dynamic Case Study sub-pages (/firesafety, /billingtraining, etc.)
```

---

## 3. Architectural Guardrails (Anti-Monolith & 3-Tier Style Isolation)

### A. Cohesion Over Arbitrary Line Limits
* **One Component = One Cohesive Job:** Keep markup and its scoped `<style>` together in a single `.astro` file when they serve one cohesive concept (e.g., `Navbar.astro`, `ProjectCard.astro`). Only split files when a component takes on multiple unrelated responsibilities.
* **Strict Data Separation:** Never hardcode repeated project cards or case study text inside `.astro` components. All project data and case study copy belong in `src/content/projects/*.mdx`.

### B. The 3-Tier Style Isolation System (Preventing Accidental Cross-Page Style Bleed)
1. **Tier 1: Global Site Tokens (`src/styles/tokens.css`):**
   * Controls the **entire website** (`--primary-blue`, fonts, surface colors).
   * **Rule:** Never edit `src/styles/tokens.css` unless the user explicitly asks for a **site-wide** change.
2. **Tier 2: Component / Section Scoped CSS (`<style>` inside `.astro` files):**
   * Astro automatically compiles `<style>` blocks with a unique cryptographic scope attribute (`data-astro-cid-*`), guaranteeing that styles in one component (`HeroJY.astro`, `resume.astro`) **cannot leak** to other pages.
   * **Rule:** Edit a shared component (`ProjectCard.astro`, `CaseStudyLayout.astro`) only when the user wants all cards or all case studies updated.
3. **Tier 3: Single-Page / Single-Project Overrides:**
   * When the user wants a custom accent color or bespoke interactive block on **only one project page** (e.g., `/firesafety`), set `accentColor` in that project's `.mdx` frontmatter or import a dedicated component inside that `.mdx` file, leaving every other page untouched.

### C. Smart Question Protocol & Cross-Page Parallelism Audit (SOP)
* **Never Download Videos Into the Repo or Over-Engineer Missing Content (Ask the User for Links):**
  * **Videos must NEVER be downloaded into the Git repository** (to prevent repo bloat and slow builds). All videos must be embedded via external **YouTube** or **Google Drive** links (`youtubeEmbedUrl` in `.mdx` frontmatter).
  * If a video, image, PDF, or text block is missing or hosted inside Squarespace's native video player, **NEVER install tools (like `ffmpeg`) or download video files**. Simply ask the user for the **Google Drive or YouTube URL** (or original image file).
* **Always Flag Inconsistencies Across Sibling Pages/Components:**
  * During **Pass 1 (UX/Visual Designer)** and **Pass 4 (General QA)**, agents must explicitly audit **Cross-Page Parallelism**: compare page `<h1>` headings, browser `<title>` tags, Navbar dropdown labels, card CTA labels, and metadata labels across all sibling pages/sections (`LXD`, `UXD`, `Graphic Design`, and Case Studies).
  * **Never blindly copy legacy inconsistencies** from old HTML/Squarespace pages without questioning them.
  * **When Unsure, Flag & Ask Permission:** If an agent spots a naming, label, or structural inconsistency across pages or components and isn't 100% sure whether it was intentional, the agent **must flag it to the user and ask permission to standardize it** rather than ignoring it or silently changing content.
* **Always Ask on Scope & Intent:**
  * When the **blast radius** of a style or layout request is ambiguous (e.g., *"Change the blue heading"* -> ask: *"Should this apply only to this page, or across all pages?"*).
  * Before making any major structural or content change the user did not ask for.
* **Do Not Bombard on Minor Technical Polish:**
  * Apply professional UX and web engineering defaults automatically for responsive breakpoints, keyboard focus states, `alt` text, and obvious spelling typos, and report them in the post-change summary.
* **Copy & Human Voice Guardrails (No AI-Sounding Text):**
  * **No em-dashes (`—`) anywhere** in site copy, project `.mdx` files, `<title>` tags, or documentation. Use commas, periods, colons, parentheses, or `|` / `·` for title and subtitle separators.
  * **Keep headings and descriptions natural and direct:** Avoid inflated phrasing or unnecessary academic name-dropping when plain language says it better (e.g., use **"Custom JavaScript"** instead of *"Custom JavaScript Rotational Physics"*; write **"To lower cognitive load..."** instead of citing *"Sweller's Cognitive Load Theory"*; skip terms like *"Temporal Contiguity"* or *"Mayer's Signaling & Segmenting Principles"* unless genuinely needed).
* **Continuous SOP Evolution Rule:**
  * Whenever the user points out a process improvement, missed pattern, or workflow preference, the agent **must immediately update `SPEC.md`, `DESIGN_SYSTEM.md`, `PLAYBOOK.md`, and/or `scripts/qa-check.mjs`** in the same turn so all future agents permanently inherit that SOP.

---

## 4. The 6-Lens Review System (2-Tier QA Policy)

* **Tier 1: Fast Iteration Mode (Default for live back-and-forth CSS, layout, copy, or single-project tweaks):**
  * **Skip the browser subagent** (the user already has `http://localhost:4321` open live via Vite HMR).
  * Run only the fast ~3-second CLI checks (`npm.cmd run qa:spell; npm.cmd run qa:links`) when content/code changes.
  * Keep the reply concise (no need to print a full 6-Lens Scorecard for tiny edits).
* **Tier 2: Full Review & Consolidated Browser QA (Major Milestones & Pre-Deploy Only):**
  * Trigger live browser subagent verification **only** when: (a) building a brand-new component or major layout overhaul, (b) doing a single consolidated Desktop + Mobile sweep right before deploying to GitHub Pages, or (c) when the user explicitly asks to verify in the browser / check mobile.
  * Evaluate across all 6 lenses:
  1. **Pass 1: UX / Graphic Designer (Proactive Visual Critique & Live Render Check):**
     * **Never Rubber-Stamp Major Visual Changes:** On Tier 2 milestones, visually inspect the live browser render (Desktop + Mobile) to verify CSS rules loaded cleanly and catch subtle layout/blend/overflow bugs.
     * **Have Strong Design Opinions:** Actively critique spacing, visual hierarchy (e.g., primary vs. secondary button weight, "button soup" next to pill tags, awkward line-wrapping at mid-sized viewports), alignment, and proportion, and proactively offer cleaner UX alternatives whenever a layout feels crowded or unbalanced.
     * **Cross-Page Copy & Label Parallelism:** Audit headings, dropdowns, and CTAs across sibling pages (`DESIGN_SYSTEM.md`), plus responsive behavior (Desktop/Tablet/Mobile) and WCAG 2.1 AA accessibility.
  2. **Pass 2: Principal Web Dev:** Smoothness (`60fps` transitions), zero iframe polling hacks, clean Astro patterns, and GitHub Pages compatibility.
  3. **Pass 3: Software Architect:** Single responsibility, 3-Tier Style Isolation compliance, and zero duplicated data.
  4. **Pass 4: General QA (`npm.cmd run qa:spell` + `npm.cmd run qa:links`, plus `astro build` pre-deploy):** Automated spellcheck (`cspell`), internal/external broken link validation (`scripts/qa-check.mjs`), and cross-page naming consistency check. *(Avoid running `astro build` while `astro dev` is active to prevent `.astro/` cache collisions.)*
  5. **Pass 5: Docs & Playbook Sync:** Verify `SPEC.md`, `DESIGN_SYSTEM.md`, and `PLAYBOOK.md` remain accurate.
  6. **Pass 6: LXD / UXD / ID Career Advisor ("The Subtle Mentor"):** Non-blocking, **1–2 sentences max** at the bottom of milestone summaries (`💡 Career Advisor Note`).

### Post-Change Summary Format
* **Tier 1 (Small Tweaks):** Brief, direct summary of what changed (1–3 bullets).
* **Tier 2 (Major Milestones):** Concise summary + **Pass 1–5 Scorecard** (1 line each) + optional **💡 Career Advisor Note** (1–2 sentences max).
