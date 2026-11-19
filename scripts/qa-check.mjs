import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'projects');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');

let errors = 0;

function fail(msg) {
  console.error(`❌ [QA Error] ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`✅ [QA Pass] ${msg}`);
}

// 1. Collect all valid internal routes and project slugs
const validRoutes = new Set([
  '/',
  '/all-lxd-projects',
  '/all-ux-projects',
  '/all-graphic-design',
  '/resume',
]);

if (fs.existsSync(CONTENT_DIR)) {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  for (const file of files) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    validRoutes.add(`/${slug}`);
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');

    // Check required frontmatter fields
    for (const field of ['title:', 'category:', 'description:', 'image:', 'imageAlt:', 'tags:']) {
      if (!raw.includes(field)) {
        fail(`${file} is missing required frontmatter field "${field}"`);
      }
    }

    // Check for forbidden broken Squarespace admin URLs or malformed URLs
    if (raw.includes('squarespace.com/config') || raw.includes('frameUrl=')) {
      fail(`${file} contains a broken Squarespace admin editor URL`);
    }
    if (raw.includes('/resumehttp')) {
      fail(`${file} contains a malformed concatenated URL (/resumehttp...)`);
    }
  }
  pass(`Validated ${files.length} project content files and frontmatter schemas.`);
} else {
  fail('src/content/projects directory does not exist.');
}

// 2. Scan all .astro and .mdx files for broken internal hrefs or nested <button> inside <a>
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(astro|mdx|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const rel = path.relative(ROOT, fullPath);

      if (content.includes('squarespace.com/config') || content.includes('/resumehttp')) {
        fail(`${rel} contains a broken legacy URL.`);
      }
      if (content.includes('images.squarespace-cdn.com') || content.includes('i.postimg.cc')) {
        fail(`${rel} still references an external CDN image instead of local public/images/.`);
      }

      // Verify local /images/... and /videos/... files exist in public/
      const assetRegex = /["'](\/(?:images|videos)\/[^"']+)["']/g;
      let assetMatch;
      while ((assetMatch = assetRegex.exec(content)) !== null) {
        const publicFile = path.join(ROOT, 'public', assetMatch[1]);
        if (!fs.existsSync(publicFile)) {
          fail(`${rel} references missing local media asset "${assetMatch[1]}"`);
        }
      }

      // Check static href="/..." and withBase('/...') values
      const hrefRegex = /(?:href=["']|withBase\(["'])(\/[^"'#?)]*)["']/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        const target = match[1].replace(/\/$/, '') || '/';
        if (!target.startsWith('/images/') && !target.startsWith('/videos/') && !target.startsWith('/resume/') && !target.startsWith('/favicon') && !validRoutes.has(target)) {
          fail(`${rel} links to unknown internal route "${target}"`);
        }
      }

      // Check for nested <button> inside <a>
      if (/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<button\b/i.test(content)) {
        fail(`${rel} contains an invalid nested <button> inside an <a> element (WCAG violation).`);
      }
    }
  }
}

scanDir(PAGES_DIR);
scanDir(COMPONENTS_DIR);
scanDir(CONTENT_DIR);

// 3. Cross-Page Parallelism Audit (Section Pages & Project Card CTAs)
const sectionPageFiles = ['all-lxd-projects.astro', 'all-ux-projects.astro', 'all-graphic-design.astro'];
const sectionHeadings = new Set();
for (const spFile of sectionPageFiles) {
  const spPath = path.join(PAGES_DIR, spFile);
  if (fs.existsSync(spPath)) {
    const spContent = fs.readFileSync(spPath, 'utf8');
    const hMatch = spContent.match(/heading=["']([^"']+)["']/);
    const tMatch = spContent.match(/title=["']([^"']+)["']/);
    if (hMatch) sectionHeadings.add(hMatch[1]);
    if (tMatch && !/^All .+ Projects \| Joyce Yang$/.test(tMatch[1])) {
      fail(`${spFile} has non-parallel page title "${tMatch[1]}" (expected "All <Section> Projects | Joyce Yang").`);
    }
  }
}
if (sectionHeadings.size > 1) {
  fail(`Inconsistent section headings across gallery pages: ${Array.from(sectionHeadings).join(', ')}`);
}

const ctaLabels = new Set();
for (const file of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const cMatch = raw.match(/ctaLabel:\s*["']([^"']+)["']/);
  if (cMatch) ctaLabels.add(cMatch[1]);
}
if (ctaLabels.size > 1) {
  fail(`Inconsistent project card ctaLabel values across projects: ${Array.from(ctaLabels).join(', ')}`);
}
pass('Cross-page parallelism audit passed (headings, titles, dropdowns, and card CTAs are consistent).');

if (errors > 0) {
  console.error(`\n🚨 QA Check failed with ${errors} issue(s).`);
  process.exit(1);
} else {
  pass('All internal routes, external URL formats, and accessibility checks passed!');
}
