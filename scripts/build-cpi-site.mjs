import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const sourceRoot = '/Users/triciafullerton/Downloads/CPI';
const themeZip = '/Users/triciafullerton/Downloads/theme_export__centralparkinvestors-com-dawn__28MAY2026-0318pm.zip';
const heroVideo = '/Users/triciafullerton/Desktop/Miscellaneous/CPI/hero_1.mp4';

const pages = [
  {
    source: 'Private Access – CENTRAL PARK INVESTORS.html',
    output: 'pages/authorized-users/index.html',
    url: '/pages/authorized-users',
    title: 'Private Access',
    type: 'page',
  },
  {
    source: 'California Closets_ Commercial Dispute – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01/index.html',
    url: '/pages/cc01',
    title: 'California Closets: Commercial Dispute',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit A – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01-exhibita/index.html',
    url: '/pages/cc01-exhibita',
    title: 'California Closets - Exhibit A',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit B – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01-exhibitb/index.html',
    url: '/pages/cc01-exhibitb',
    title: 'California Closets - Exhibit B',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit C – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01-exhibitc/index.html',
    url: '/pages/cc01-exhibitc',
    title: 'California Closets - Exhibit C',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit D – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01-exhibitd/index.html',
    url: '/pages/cc01-exhibitd',
    title: 'California Closets - Exhibit D',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit E – CENTRAL PARK INVESTORS.html',
    output: 'pages/exhibith/index.html',
    url: '/pages/exhibith',
    title: 'California Closets - Exhibit H',
    type: 'page',
  },
  {
    source: 'Contact – CENTRAL PARK INVESTORS.html',
    output: 'pages/contact/index.html',
    url: '/pages/contact',
    title: 'Contact',
    type: 'contact',
  },
  {
    source: 'Privacy Policy – CENTRAL PARK INVESTORS.html',
    output: 'pages/privacy-policy/index.html',
    url: '/pages/privacy-policy',
    title: 'Privacy Policy',
    type: 'page',
  },
  {
    source: 'Terms and Conditions – CENTRAL PARK INVESTORS.html',
    output: 'pages/terms-and-conditions/index.html',
    url: '/pages/terms-and-conditions',
    title: 'Terms and Conditions',
    type: 'page',
  },
];

function readSource(file) {
  return fs.readFileSync(path.join(sourceRoot, file), 'utf8');
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}

function cleanHtml(html) {
  return html
    .replace(/<script>\s*document\.getElementById\('cpi-code-gate-form'\)[\s\S]*?<\/script>/, '')
    .replaceAll('https://centralparkinvestors.com/pages/exhibit-e', '/pages/exhibith')
    .replaceAll('https://centralparkinvestors.com/pages/exhibith', '/pages/exhibith')
    .replaceAll('https://centralparkinvestors.com/pages/authorized-users', '/pages/authorized-users')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibita', '/pages/cc01-exhibita')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitb', '/pages/cc01-exhibitb')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitc', '/pages/cc01-exhibitc')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitd', '/pages/cc01-exhibitd')
    .replaceAll('https://centralparkinvestors.com/pages/cc01', '/pages/cc01')
    .replaceAll('https://centralparkinvestors.com/pages/contact', '/pages/contact')
    .replaceAll('https://centralparkinvestors.com/pages/privacy-policy', '/pages/privacy-policy')
    .replaceAll('https://centralparkinvestors.com/pages/terms-and-conditions', '/pages/terms-and-conditions')
    .replaceAll('href="https://centralparkinvestors.com/pages/ops@centralparkinvestors.com"', 'href="mailto:ops@centralparkinvestors.com"')
    .replaceAll('padding: 80px 24px;', 'padding: 50px 24px;')
    .replaceAll('flex-wrap: wrap;\n  }\n\n  #cpi-access-code,', 'flex-wrap: wrap;\n    align-items: flex-end;\n  }\n\n  #cpi-access-code,')
    .replaceAll('width: 260px;', 'width: 320px;')
    .replaceAll('padding: 12px 14px;', 'padding: 12px 18px;')
    .replaceAll('padding: 12px 20px;', 'padding: 19px 20px;')
    .replaceAll('target="_blank"', '')
    .replaceAll('rel="noopener"', '');
}

function textFromHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function isEmphasisLine(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (/^\d+[.)]?\s+/.test(normalized)) return true;
  const letters = normalized.replace(/[^A-Za-z]/g, '');
  return letters.length >= 3 && letters === letters.toUpperCase();
}

function addClassToTag(tag, className) {
  if (/\bclass=/.test(tag)) {
    return tag.replace(/class="([^"]*)"/, function(_, classes) {
      return 'class="' + classes + ' ' + className + '"';
    });
  }
  return tag.replace(/>$/, ' class="' + className + '">');
}

function markEmphasisLines(html) {
  return html.replace(/<(p|li)([^>]*)>([\s\S]*?)<\/\1>/g, function(match, tagName, attrs, inner) {
    if (/\bcpi-emphasis-line\b/.test(attrs)) return match;
    return isEmphasisLine(textFromHtml(inner))
      ? addClassToTag('<' + tagName + attrs + '>', 'cpi-emphasis-line') + inner + '</' + tagName + '>'
      : match;
  });
}

function extractPageFragment(source) {
  const match = source.match(/<div class="page-width page-width--narrow[\s\S]*?<\/section>/);
  if (!match) throw new Error('Could not extract page fragment');
  return markEmphasisLines(cleanHtml(match[0].replace(/\s*<\/section>\s*$/, '')));
}

function extractContactFragment(source) {
  const match = source.match(/<div class="contact color-scheme-1 gradient[\s\S]*?<\/section>/);
  if (!match) throw new Error('Could not extract contact fragment');
  let fragment = match[0].replace(/\s*<\/section>\s*$/, '');
  fragment = fragment
    .replace(/<form method="post" action="https:\/\/centralparkinvestors\.com\/contact#ContactForm"[^>]*>/, '<form name="contact" method="post" data-netlify="true" netlify-honeypot="bot-field" id="ContactForm" class="contact__form isolate">')
    .replace('<input type="hidden" name="form_type" value="contact">', '<input type="hidden" name="form-name" value="contact"><p class="visually-hidden"><label>Do not fill this out: <input name="bot-field"></label></p>')
    .replace('<input type="hidden" name="utf8" value="✓">', '');
  return cleanHtml(fragment);
}

function openLinksInNewTab(html) {
  const footerBlocks = [];
  const protectedHtml = html.replace(/<footer class="cpi-footer"[\s\S]*?<\/footer>/g, function(footer) {
    footerBlocks.push(footer);
    return '%%CPI_FOOTER_' + (footerBlocks.length - 1) + '%%';
  });
  return protectedHtml
    .replace(/<a\b([^>]*)>/g, function(match, attrs) {
      let nextAttrs = attrs.replace(/\s+target="[^"]*"/g, '').replace(/\s+rel="[^"]*"/g, '');
      return '<a' + nextAttrs + ' target="_blank" rel="noopener">';
    })
    .replace(/%%CPI_FOOTER_(\d+)%%/g, function(_, index) {
      return footerBlocks[Number(index)];
    });
}

function layout({ title, description = '', canonicalPath, body, assetPrefix = '' }) {
  const url = canonicalPath === '/' ? 'https://centralparkinvestors.com/' : `https://centralparkinvestors.com${canonicalPath}`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - CENTRAL PARK INVESTORS</title>
  <meta name="description" content="${description || 'Central Park Investors is a privately held firm engaged in long-term investment and asset management.'}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="CENTRAL PARK INVESTORS">
  <link rel="stylesheet" href="${assetPrefix}assets/styles.css?v=20260529-footer-same-tab">
</head>
<body class="${assetPrefix ? 'page-template' : 'home-template'}">
  <div id="shopify-section-sections--25978986266913__header" class="shopify-section shopify-section-group-header-group section-header">
    <sticky-header data-sticky-type="on-scroll-up" class="header-wrapper color-scheme-1 gradient">
      <header class="header header--top-left header--mobile-center page-width">
        <h1 class="header__heading">
          <a href="/" class="header__heading-link link link--text focus-inset">
            <div class="header__brand-text-wrap">
              <span class="header__brand-title">CENTRAL PARK INVESTORS</span>
              <span class="header__brand-subtitle">PRIVATE INVESTMENT AND ASSET MANAGEMENT</span>
            </div>
          </a>
        </h1>
        <div class="header__icons header__icons--custom">
          <a href="/pages/authorized-users" class="header__authorized-users link focus-inset" rel="nofollow">
            <span class="header__authorized-users-icon svg-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="icon icon-account" viewBox="0 0 18 19"><path fill="currentColor" fill-rule="evenodd" d="M6 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15M9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35" clip-rule="evenodd"/></svg>
            </span>
            <span class="header__authorized-users-text">Authorized Users</span>
          </a>
        </div>
      </header>
    </sticky-header>
  </div>
  <main id="main">
${body}
  </main>
  <style>
    .cpi-footer {
      background: #000 !important;
      color: #fff !important;
      padding: 36px 0 !important;
      font-family: Montserrat, sans-serif !important;
    }

    .cpi-footer * {
      box-sizing: border-box;
    }

    .cpi-footer__inner {
      max-width: 110rem;
      margin: 0 auto;
      padding: 0 2.4rem 3rem;
    }

    .cpi-footer__columns {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 6rem !important;
      align-items: start;
      padding-top: 5rem;
      border-top: .1rem solid rgba(255, 255, 255, .12);
    }

    .cpi-footer__heading,
    .cpi-footer p,
    .cpi-footer li,
    .cpi-footer a,
    .cpi-footer small {
      color: #fff !important;
      font-family: Montserrat, sans-serif !important;
      font-size: 9px !important;
      line-height: 2 !important;
      letter-spacing: .08em !important;
      text-transform: uppercase !important;
    }

    .cpi-footer__heading {
      margin: 0 !important;
      font-weight: 700 !important;
      text-transform: uppercase;
    }

    .cpi-footer p,
    .cpi-footer__links {
      margin: 1.8rem 0 0 !important;
      padding: 0 !important;
      font-weight: 400 !important;
    }

    .cpi-footer__links {
      list-style: none !important;
    }

    .cpi-footer__links li + li {
      margin-top: .8rem !important;
    }

    .cpi-footer a {
      text-decoration: none !important;
    }

    .cpi-footer a:hover,
    .cpi-footer a:focus {
      text-decoration: underline !important;
      text-underline-offset: .25rem;
    }

    .cpi-footer__copyright {
      display: block !important;
      margin-top: 4.8rem !important;
      text-align: center !important;
      text-transform: uppercase;
      opacity: .8;
    }

    @media (max-width: 767px) {
      .cpi-footer {
        padding: 5.6rem 0 3.6rem !important;
      }

      .cpi-footer__columns {
        grid-template-columns: 1fr !important;
        gap: 3.2rem !important;
        padding-top: 3.2rem;
      }
    }
  </style>
  <footer class="cpi-footer">
    <div class="cpi-footer__inner">
      <div class="cpi-footer__columns">
        <section class="cpi-footer__column">
          <h3 class="cpi-footer__heading">Central Park Investors</h3>
          <p>Central Park Investors is a privately held firm engaged in long-term investment and asset management.<br><br>This site is for informational purposes only and does not constitute an offer to sell or solicitation for an offer to buy securities or investment services.<br><br>Central Park Investors is not affiliated with the Central Park Conservancy or the City of New York.<br><br>© Central Park Investors 2026</p>
        </section>
        <section class="cpi-footer__column">
          <h3 class="cpi-footer__heading">Legal Policies</h3>
          <ul class="cpi-footer__links">
            <li><a href="/pages/contact">Contact Us</a></li>
            <li><a href="/pages/privacy-policy">Privacy Policy</a></li>
            <li><a href="/pages/terms-and-conditions">Terms and Conditions</a></li>
          </ul>
        </section>
        <section class="cpi-footer__column">
          <h3 class="cpi-footer__heading">Contact</h3>
          <p><a href="mailto:ops@centralparkinvestors.com">ops@centralparkinvestors.com</a><br><br>Based in New York, NY and Miami Beach, FL.</p>
        </section>
      </div>
      <small class="cpi-footer__copyright">© 2026 CENTRAL PARK INVESTORS</small>
    </div>
  </footer>
  <script src="${assetPrefix}assets/site.js"></script>
</body>
</html>
`;
  return assetPrefix ? openLinksInNewTab(html) : html;
}

function homepage() {
  return layout({
    title: 'CENTRAL PARK INVESTORS',
    canonicalPath: '/',
    assetPrefix: '',
    body: `    <section class="hero-video" aria-label="Central Park Investors">
      <video autoplay muted loop playsinline poster="assets/0de42eea49fd4fe89478ad34f9ad8de8.thumbnail.0000000000_1100x.jpg">
        <source src="assets/hero_1.mp4" type="video/mp4">
      </video>
    </section>

    <section class="cpi-intro">
      <div class="cpi-intro__wrap">
        <div class="cpi-intro__card">
          <h1 class="cpi-intro__title">Private Asset Management</h1>
          <div class="cpi-intro__text">
            <p>Long-term ownership and disciplined capital across real estate, operating companies, and proprietary brands. Central Park Investors manages investment strategy, asset operations, and financial governance for a portfolio of privately held businesses and properties.</p>
            <p>This site is for informational purposes only and does not constitute an offer to sell or a solicitation for an offer to buy securities or investment services.</p>
          </div>
          <a class="cpi-intro__button" href="/pages/authorized-users">Authorized Users</a>
        </div>
      </div>
    </section>

    <section class="cpi-asset-areas">
      <div class="cpi-asset-areas__wrap">
        <div class="cpi-asset-areas__divider"></div>
        <h2 class="cpi-asset-areas__title">Investment Areas</h2>
        <div class="cpi-asset-areas__grid">
          <article class="cpi-asset-card">
            <img class="cpi-asset-card__image" src="assets/1a.png" alt="Real Estate">
            <div class="cpi-asset-card__body">
              <h3 class="cpi-asset-card__heading">Real Estate</h3>
              <p class="cpi-asset-card__text">Privately held, long-term ownership, includes operational oversight, financial administration, and vendor management.</p>
            </div>
          </article>
          <article class="cpi-asset-card">
            <img class="cpi-asset-card__image" src="assets/4a.png" alt="Private Business">
            <div class="cpi-asset-card__body">
              <h3 class="cpi-asset-card__heading">Private Business</h3>
              <p class="cpi-asset-card__text">Privately held operating companies, with a focus on technology, manufacturing, and creating long-term value.</p>
            </div>
          </article>
          <article class="cpi-asset-card">
            <img class="cpi-asset-card__image" src="assets/2a.png" alt="Strategic Capital">
            <div class="cpi-asset-card__body">
              <h3 class="cpi-asset-card__heading">Strategic Capital</h3>
              <p class="cpi-asset-card__text">Additional private assets and special situations where long-term fundamentals and disciplined management align.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cpi-feature">
      <div class="cpi-feature__wrap">
        <div class="cpi-feature__grid">
          <img class="cpi-feature__image" src="assets/9a.png" alt="Private Business">
          <div>
            <div class="cpi-feature__eyebrow">Investments</div>
            <h2 class="cpi-feature__title">Private Business</h2>
            <div class="cpi-feature__text">
              <p>Central Park Investors owns and operates a portfolio focused on manufacturing and supplies, supporting commercial and institutional customers across various categories.</p>
              <p>While each company is managed independently, capital allocation and governance are coordinated centrally to ensure the most efficiencies.</p>
              <p>Emphasis on enduring businesses with strong cash flow, resilient demand, and disciplined capital and risk management.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,
  });
}

function copyAsset(source, dest) {
  fs.copyFileSync(source, path.join(root, 'assets', dest));
}

fs.rmSync(path.join(root, 'pages'), { recursive: true, force: true });
fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
for (const asset of ['0de42eea49fd4fe89478ad34f9ad8de8.thumbnail.0000000000_1100x.jpg', '1a.png', '2a.png', '4a.png', '9a.png']) {
  copyAsset(path.join(sourceRoot, 'index_files', asset), asset);
}
copyAsset(heroVideo, 'hero_1.mp4');

writeFile('index.html', homepage());

for (const page of pages) {
  const source = readSource(page.source);
  let fragment = page.type === 'contact' ? extractContactFragment(source) : extractPageFragment(source);
  if (page.url === '/pages/exhibith') {
    fragment = fragment.replaceAll('California Closets - Exhibit E', 'California Closets - Exhibit H');
  }
  const body = `    <section class="${page.type === 'contact' ? 'contact-page' : 'content-page'}">\n      ${fragment}\n    </section>`;
  writeFile(page.output, layout({ title: page.title, canonicalPath: page.url, body, assetPrefix: '../../' }));
}

writeFile(
  'pages/exhibit-e/index.html',
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/exhibith"><link rel="canonical" href="https://centralparkinvestors.com/pages/exhibith"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/exhibith" target="_blank" rel="noopener">Continue to Exhibit H</a></p></body></html>\n`,
);

console.log(`Built CPI static site from ${themeZip}`);
