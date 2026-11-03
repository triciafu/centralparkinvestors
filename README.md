# Central Park Investors

Standalone static site migrated from Shopify.

## Local website updates

The rebuild is portable: all HTML sources live in `source/site/`, and shared images,
video, CSS, JavaScript, favicon, and PDFs live in `assets/`. The sources were
copied from the existing site to preserve its current content exactly; the old
Shopify exports and theme ZIP are no longer needed.

Edit HTML in `source/site/index.html`, `source/site/404.html`, or
`source/site/cases/.../index.html` or `source/site/legal/.../index.html`. Edit shared styling and behavior directly in
`assets/styles.css` and `assets/site.js`. API functions remain in `api/`.
Do not edit generated root/page HTML directly: a rebuild replaces matching files.
For shared header/footer changes, update the source HTML pages together.

Use Node.js 22 or newer; no npm packages are required:

```sh
node scripts/build-cpi-site.mjs --check
node scripts/build-cpi-site.mjs
```

The script resolves paths from its own location, validates all HTML and local
linked files before writing, and never deletes the pages folder. Only changed
HTML files are written. If a source is removed or renamed, remove its old output
explicitly after reviewing incoming links; rebuilding does not delete old outputs.
Commit source HTML and generated HTML together when you choose to publish changes.
Keep Vercel serving the repository root; `source/site/` is not the deployment root.
A basic static preview will not execute the Vercel API functions; form testing
requires a Vercel environment with the variables below.

Node may not be on this Mac's shell PATH yet. Codex's bundled runtime was used to
verify this rebuild; install a standalone Node.js runtime for normal terminal use.

## Rebuilding the PDF downloads

PDFs are generated from the same `source/site/cases/` HTML as the website. After
editing a case or exhibit, rebuild both HTML and PDFs before publishing:

```sh
python3 -m venv /tmp/cpi-pdf-env
/tmp/cpi-pdf-env/bin/python -m pip install -r scripts/requirements-pdf.txt
node scripts/build-cpi-site.mjs
/tmp/cpi-pdf-env/bin/python scripts/build-cpi-pdfs.py
```

The PDF builder checks complete body text and all supporting link destinations
before replacing any of the eight downloads in `assets/documents/`. It includes
no prepared-date line. Historical dates within the case records remain intact.
Use `--output-dir /tmp/cpi-pdf-preview` to generate a review copy first. Review
pagination visually after content changes, and include updated PDFs in the commit.
The HTML rebuild alone does not rebuild PDFs. No PDF tools are required on Vercel
because the generated PDFs are published as static files.

PDFs embed Montserrat, matching the case pages' font family, with light body text,
regular titles, and heavier section headings and references. Font files and their
SIL Open Font License are included in `assets/fonts/montserrat/`; rebuilds need
no font downloads or system font installation. Print sizing and pagination are
adapted to the PDF page dimensions.

## Vercel Environment Variables

Set these in the Vercel project before using the forms.

### Authorized Users

For one PIN, use:

- `CPI_ACCESS_PIN`: the PIN users enter on `/pages/authorized-users/`
- `CPI_ACCESS_REDIRECT_URL`: the URL users are sent to after a valid PIN

For multiple PINs, use `CPI_ACCESS_ROUTES` instead. Enter one PIN-to-URL pair per line:

```text
731604=https://centralparkinvestors.com/cases/cc01/
248913=https://centralparkinvestors.com/cases/cc01/exhibita/
582201=https://centralparkinvestors.com/cases/cc01/exhibith/
```

The PINs are checked by `/api/cpi-access` and are not stored in public browser code.

### Contact Us

The contact form posts to `/api/contact` and sends email through Resend.

- `RESEND_API_KEY`: Resend API key used by the serverless function
- `CONTACT_FROM_EMAIL`: verified sender address, for example `Central Park Investors <no-reply@centralparkinvestors.com>`
- `CONTACT_TO_EMAIL`: recipient address; defaults to `ops@centralparkinvestors.com` if omitted

## Page locations and legacy links

Privacy Policy and Terms and Conditions live under `/legal/`. Case pages and their exhibits live under `/cases/`. Contact and Authorized Access
remain under `/pages/`. Other `/pages/` HTML sources are legacy redirect fallbacks;
edit case and legal content in the new locations.
`vercel.json` permanently redirects migrated page URLs and their explicit
`index.html` variants directly to the new locations. Legacy exhibit aliases are
covered as well. Keep these redirects so existing bookmarks continue to work.
Existing Vercel PIN destination environment variables using old URLs remain
usable through redirects; optionally update them to the new `/cases/` URLs.
