# Student Research Portfolio

A single-page academic portfolio site. Plain HTML, CSS, and a small amount of
JavaScript — no build step, no dependencies to install.

```
index.html    all page content
styles.css    all styling (light + dark, responsive, print)
main.js       mobile menu, nav highlighting, scroll reveals
```

## Viewing it locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Editing the content

Everything is written directly in `index.html`, grouped into commented sections
(`<!-- ===== RESEARCH ===== -->` and so on). To edit an activity, find its
`<article class="entry">` block and change the text:

```html
<article class="entry">
  <div class="entry__meta">
    <p class="entry__date">2025 – Present</p>     <!-- dates -->
    <p class="entry__place">Bellevue, WA</p>      <!-- location -->
  </div>
  <div class="entry__body">
    <h3 class="entry__title">Link Crew</h3>       <!-- organization -->
    <p class="entry__sub">Project Manager</p>     <!-- role -->
    <ul class="entry__list">
      <li>One accomplishment per bullet.</li>
    </ul>
  </div>
</article>
```

Copy a whole `<article>` block to add a new entry; delete one to remove it.
Section numbers (`01`, `02`, …) are hand-written in the `<h2>` tags, so renumber
them if sections are added or reordered.

To add a section to the nav, add a `<li><a href="#your-id">Label</a></li>` to
`.nav__menu` and give the new `<section>` that matching `id`.

## Privacy

The site deliberately carries no name, email, phone number, or street address,
and `index.html` includes `<meta name="robots" content="noindex, nofollow">` so
search engines skip it. If you later want it indexed, remove that meta tag.

## Colors and fonts

The palette lives in the `:root` block at the top of `styles.css` — change
`--accent` to recolor the whole site. Dark mode values are in the
`@media (prefers-color-scheme: dark)` block just below it.

## Deploying

`.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push
to `main`. Enable it once under **Settings → Pages → Build and deployment →
Source: GitHub Actions**.
