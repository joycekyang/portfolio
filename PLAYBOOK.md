# Portfolio Operations Playbook (`PLAYBOOK.md`)

> **For Both the Human Owner & AI Agents:** This guide explains step-by-step how to preview changes live in VS Code, pull/push with Git, deploy to GitHub Pages, add projects/media/resumes, scope style changes safely, and plan animations.

---

## 1. Daily Workflow in VS Code / Antigravity (Pull → Live Preview → Push)

### Step A: Pull Latest Changes (If You Edited From Another Computer or GitHub)
* **In VS Code UI:** Click the **Source Control** icon on the left sidebar → click the `...` menu → **Pull**.
* **Or in Terminal:**
  ```powershell
  git pull
  ```

### Step B: View Changes Live While Editing (`http://localhost:4321`)
* **Automatic Startup:** Because of `.vscode/tasks.json`, opening this folder in VS Code / Antigravity automatically starts the Astro live preview server in the background.
* **Manual Startup (if needed):** Run in the terminal:
  ```powershell
  npm.cmd run dev
  ```
  *(Note for Windows PowerShell: Using `npm.cmd` avoids Windows PowerShell's script execution policy error.)*
* **Open Side-by-Side Preview:** Open `http://localhost:4321` in your browser or Antigravity's built-in browser tab. Every time you (or an AI agent) save a file, the page updates in **under 100ms** without losing your scroll position.

### Step C: Run Quality Checks (`npm.cmd run qa`) & Push to GitHub
Before pushing, ask the agent to run QA (or run it yourself):
```powershell
npm.cmd run qa
```
This single command checks **spelling (`cspell`)**, **all internal/external links & schemas (`scripts/qa-check.mjs`)**, and **builds the site (`astro build`)**.

To publish your changes to GitHub:
```powershell
git add .
git commit -m "Describe your update"
git push
```

---

## 2. How to Deploy on GitHub Pages (The 1 Setting Change for Astro)

Previously, when hosting plain `.html` files on GitHub Pages, GitHub looked for a raw `index.html` file in your repo branch.
Because Astro compiles `.astro` and `.mdx` files into optimized HTML automatically via `.github/workflows/deploy.yml`, you only need to change **one dropdown setting once** in your GitHub repository:

1. Push this folder to your GitHub repository (`main` branch).
2. On GitHub.com, open your repository and go to **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, change the dropdown from `Deploy from a branch` to **`GitHub Actions`**.
4. *(Optional: Custom Domain):* In that same **Pages** settings screen, type `www.joycekyang.com` under **Custom domain** and click **Save**.

From that moment on, every time you `git push` to `main`, GitHub Actions automatically runs `.github/workflows/deploy.yml`, builds your Astro site into static `index.html` pages, and publishes them live in ~45 seconds!

---

## 3. Where Every Type of Media Goes (Resume, Images, Videos, Storyline, Figma)

| Media Type | Where to Put It / Host It | How to Prompt the Agent |
| :--- | :--- | :--- |
| **Resume (PDF + Image)** | Drop your PDF in `public/resume/Joyce_Yang_Resume.pdf` (or use Google Drive) and your resume preview PNG in `public/images/resume.png`. | *"I dropped a new resume image in `public/images/resume.png` and PDF in `public/resume/`. Update the Resume page."* |
| **Project Images & Mockups (`PNG`, `JPG`, `WebP`, `GIF`)** | **Put inside the repo** in `public/images/projects/<project-name>/`. Local repo images never expire when you cancel Squarespace. | *"Add `public/images/projects/firesafety/screen1.png` to the Fire Safety gallery."* |
| **Short UI Video Loops (< 10 MB, 3–8 sec, silent)** | Can be placed directly in `public/videos/`. | *"Embed `public/videos/demo-loop.mp4` as a muted auto-playing loop on the Billing Training page."* |
| **Full Videos / Camtasia Demos (> 10 MB, narrated)** | **Always host externally** on **YouTube (Public or Unlisted)**, **Vimeo**, or **Loom**. *(GitHub caps files at 100 MB and raw videos slow down mobile visitors.)* | *"Embed this YouTube video `https://www.youtube.com/embed/...` on the Camtasia project page."* |
| **Articulate Storyline / Rise / Captivate Courses** | Host the exported Storyline/Rise web folder in its own dedicated GitHub Pages repo (like `joycekyang.github.io/FireSafetyTraining/`) or Articulate Review link, and set `launchUrl` in the project's `.mdx` file. | *"Add a Launch Experience button pointing to `https://joycekyang.github.io/MyNewCourse/` on this project page."* |
| **Figma Interactive Prototypes** | Set `figmaEmbedUrl` in the project's `.mdx` frontmatter (or embed via `<iframe>`). | *"Embed my Figma prototype URL on the WeConcile case study page."* |

> **Rule for AI Agents When Media Is Missing:** Never use complex conversion tools (like `ffmpeg`) or workarounds to extract missing media. Always ask the user for their original file and tell them which `public/` folder to drop it into.

---

## 4. How to Add Content (Projects, Links, Sections, Pages)

### Recipe A: Add a New Project to LXD, UXD, or Graphic Design
You **never** need to edit HTML grid code to add a project!
1. Create a new `.mdx` file in `src/content/projects/` (for example, `src/content/projects/new-onboarding-course.mdx`).
2. Copy the frontmatter header from an existing file (like `src/content/projects/firesafety.mdx` or `producttrainings.mdx`):
   ```mdx
   ---
   title: "New Employee Onboarding Simulation"
   subtitle: "Articulate Storyline 360"
   category: "lxd"           # Choose "lxd", "uxd", or "gd"
   order: 3                  # Controls sort order in the gallery (1 = first)
   description: "Short 1-2 sentence summary shown on the project card and case study hero."
   image: "/images/projects/onboarding-mockup.png"
   imageAlt: "Laptop mockup showing the onboarding simulation"
   tags:
     - "Articulate Storyline"
     - "Figma"
   ctaLabel: "View Case Study Details"
   launchUrl: "https://joycekyang.github.io/OnboardingSim/"
   launchLabel: "Launch Experience"
   meta:
     - label: "Role"
       value: "Lead Instructional Designer"
     - label: "Impact"
       value: "Reduced onboarding ramp time by 35%"
   ---

   ## Overview & Process
   Write your case study paragraphs, bullet points, and numbered steps here in normal Markdown!
   ```
3. Save the file. Astro automatically:
   * Adds the project card to `/all-lxd-projects` in the right order.
   * Adds the project to the top `Navbar.astro` dropdown menu in the right order (using the exact `title` from your `.mdx` file so they never drift out of sync).
   * Creates the full case study sub-page at `/new-onboarding-course`.

### Recipe B: Hide or Remove a Project (Without Breaking Grid Alignment)
Because the 2-column project grid and the top `Navbar.astro` dropdowns are generated automatically from `src/content/projects/`, **you never have to touch HTML or CSS grid alignment**:
* **To Temporarily Hide a Project (Keep the page & URL intact):** Add `listed: false` to the frontmatter of that project's `.mdx` file. It disappears from the gallery and Navbar dropdown immediately, and the remaining cards auto-reflow cleanly.
* **To Permanently Remove a Project:** Delete its `.mdx` file in `src/content/projects/` (e.g., `src/content/projects/old-project.mdx`), and optionally delete its unused image folder in `public/images/projects/<slug>/`. Both the gallery grid and the Navbar dropdown update automatically.

### Recipe C: Add a Brand-New Section or Standalone Page
* Prompt the agent: *"Create a new standalone page at `/speaking` using `BaseLayout.astro` and add it to the top `Navbar.astro`."*

---

## 5. How to Prompt for Style Changes Safely (Without Breaking Other Pages)

Because our codebase uses **3-Tier Style Isolation** (see `SPEC.md`), tell the agent **which scope** you want when asking for visual changes:

1. **For the Entire Website (Tier 1: `src/styles/tokens.css`):**
   * *Prompt:* `"Across the entire site, change the primary blue accent color from #3321FF to #2563EB."`
2. **For One Component or Gallery Type (Tier 2: Scoped `.astro` Component):**
   * *Prompt:* `"On all project cards, make the skill tag pills have a soft blue background with dark blue text."` *(Only `ProjectCard.astro` changes).*
3. **For Only One Specific Page or Project (Tier 3: Single-Page Override):**
   * *Prompt:* `"On ONLY the Fire Safety case study page, change the accent color to crimson (#E11D48) and add a 3-card callout box under Visual Direction."` *(Only `firesafety.mdx` changes, with zero impact on any other page).*

> **Agent Enforcement Rule:** If you ask for a style change without specifying whether it is for *one page* or *all pages*, the agent is required by `SPEC.md` to ask you a quick 1-question scope check before editing code.

---

## 6. How to Design & Build New Animations (Plan → Execute Workflow)

When you want to add a rich new animation (e.g., scroll-triggered storyboards, interactive before/after sliders, or micro-interactions in Phase 2):

1. **Step 1: Planning & Storyboarding Prompt:**
   * Tell the agent: *"Let's plan an animation for [page/section]. Don't write code yet; propose 2 options with how it triggers (scroll/hover/load), how fast it moves, and how it behaves on mobile."*
2. **Step 2: Isolated Component Execution & Live Preview:**
   * Once you pick an option, the agent builds it as a self-contained component in `src/components/animations/` (with `@media (prefers-reduced-motion: reduce)` built in) so you can preview it live in VS Code at `http://localhost:4321` without touching any other page's styles.
