# Agent Instructions (`AGENTS.md`)

This file is automatically loaded by AI coding agents when working in this repository (`joycekyang.com`).

## 1. Required Reading Before Making Changes
Before editing code, styles, or content, review the project docs as needed:
* `SPEC.md`: Architecture, 3-Tier Style Isolation, Smart Question Protocol, and 2-Tier QA Policy.
* `DESIGN_SYSTEM.md`: Visual tokens, typography, responsive breakpoints, accessibility, and copy standards.
* `PLAYBOOK.md`: Daily workflow, media placement rules, and step-by-step content recipes.

## 2. Mandatory QA After Content or Code Changes
Always run the project QA checks automatically after editing `.astro`, `.mdx`, `.md`, `.ts`, or `.mjs` files:
* **Fast iteration check (after every edit):**
  * macOS / Linux: `npm run qa:spell && npm run qa:links`
  * Windows PowerShell: `npm.cmd run qa:spell; npm.cmd run qa:links`
* **Full pre-deploy / pre-push check:**
  * macOS / Linux: `npm run qa` (runs `cspell`, `scripts/qa-check.mjs`, and `astro build`)
  * Windows PowerShell: `npm.cmd run qa`
* If `npm` is not on the default shell `PATH` on macOS, load `nvm` first (`source "$HOME/.nvm/nvm.sh"`).
* Avoid running `astro build` while `astro dev` is running to prevent `.astro/` cache collisions.

## 3. Non-Negotiable Guardrails
* **3-Tier Style Isolation:**
  * Never edit `src/styles/tokens.css` (Tier 1) unless the user asks for a site-wide change.
  * Edit shared `.astro` components (Tier 2) only when the user wants all cards/case studies updated.
  * Use `.mdx` frontmatter or single-page overrides (Tier 3) for one-page changes.
  * If scope is ambiguous, ask before editing.
* **Copy & Human Voice (No AI-Sounding Text):**
  * **No em-dashes** in site copy, project `.mdx` files, `<title>` tags, or docs. Use commas, periods, colons, parentheses, or `|` / `·` for title and subtitle separators.
  * Keep headings and descriptions direct and natural. Avoid inflated phrasing or unnecessary academic name-dropping when plain language works better (for example, write **"Custom JavaScript"** instead of *"Custom JavaScript Rotational Physics"*, and **"To lower cognitive load..."** instead of citing *"Sweller's Cognitive Load Theory"*).
* **Media & Video Rules:**
  * Never download videos into Git. Embed videos externally via YouTube or Google Drive links.
  * Store project images in `public/images/projects/<slug>/`.
* **Cross-Page Parallelism:**
  * Keep `<h1>` headings, `<title>` tags (`All <Section> Projects | Joyce Yang`), Navbar dropdowns, and card CTAs consistent across LXD, UXD, and Graphic Design pages. Flag any inconsistency to the user before silently changing it.
* **Continuous SOP Evolution:**
  * Whenever the user introduces a new preference, convention, or workflow rule, update `AGENTS.md`, `SPEC.md`, `DESIGN_SYSTEM.md`, `PLAYBOOK.md`, and/or `scripts/qa-check.mjs` in the same turn so future sessions inherit it automatically.
