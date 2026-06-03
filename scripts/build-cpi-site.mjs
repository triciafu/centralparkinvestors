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
    title: 'Authorized Users',
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
    output: 'pages/cc01/exhibita/index.html',
    url: '/pages/cc01/exhibita',
    title: 'California Closets - Exhibit A',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit B – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01/exhibitb/index.html',
    url: '/pages/cc01/exhibitb',
    title: 'California Closets - Exhibit B',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit C – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01/exhibitc/index.html',
    url: '/pages/cc01/exhibitc',
    title: 'California Closets - Exhibit C',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit D – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01/exhibitd/index.html',
    url: '/pages/cc01/exhibitd',
    title: 'California Closets - Exhibit D',
    type: 'page',
  },
  {
    source: 'California Closets - Exhibit E – CENTRAL PARK INVESTORS.html',
    output: 'pages/cc01/exhibith/index.html',
    url: '/pages/cc01/exhibith',
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
    .replaceAll('https://centralparkinvestors.com/pages/exhibit-e', '/pages/cc01/exhibith')
    .replaceAll('https://centralparkinvestors.com/pages/exhibith', '/pages/cc01/exhibith')
    .replaceAll('/pages/exhibith', '/pages/cc01/exhibith')
    .replaceAll('https://centralparkinvestors.com/pages/authorized-users', '/pages/authorized-users')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibita', '/pages/cc01/exhibita')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitb', '/pages/cc01/exhibitb')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitc', '/pages/cc01/exhibitc')
    .replaceAll('https://centralparkinvestors.com/pages/cc01-exhibitd', '/pages/cc01/exhibitd')
    .replaceAll('/pages/cc01-exhibita', '/pages/cc01/exhibita')
    .replaceAll('/pages/cc01-exhibitb', '/pages/cc01/exhibitb')
    .replaceAll('/pages/cc01-exhibitc', '/pages/cc01/exhibitc')
    .replaceAll('/pages/cc01-exhibitd', '/pages/cc01/exhibitd')
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
    .replace(/<form method="post" action="https:\/\/centralparkinvestors\.com\/contact#ContactForm"[^>]*>/, '<form name="contact" method="post" action="/api/contact" id="ContactForm" class="contact__form isolate">')
    .replace('<input type="hidden" name="form_type" value="contact">', '<input type="hidden" name="form-name" value="contact"><input type="hidden" name="redirect" value="/pages/contact/?sent=1#ContactForm-message"><p class="visually-hidden"><label>Do not fill this out: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>')
    .replace('<input type="hidden" name="utf8" value="✓">', '');
  fragment = fragment.replace('</button>\n      </div></form>', '</button>\n        <div id="ContactForm-message" class="contact__message" aria-live="polite"></div>\n      </div></form>');
  return cleanHtml(fragment);
}

function openLinksInNewTab(html) {
  const protectedBlocks = [];
  const protectedHtml = html.replace(/<header class="header[^"]*"[\s\S]*?<\/header>|<footer class="cpi-footer"[\s\S]*?<\/footer>/g, function(block) {
    protectedBlocks.push(block);
    return '%%CPI_PROTECTED_' + (protectedBlocks.length - 1) + '%%';
  });

  return protectedHtml
    .replace(/<a\b([^>]*)>/g, function(match, attrs) {
      let nextAttrs = attrs.replace(/\s+target="[^"]*"/g, '').replace(/\s+rel="[^"]*"/g, '');
      const hrefMatch = nextAttrs.match(/\shref="([^"]*)"/);
      const href = hrefMatch ? hrefMatch[1] : '';
      const shouldOpenNewTab = /^https?:\/\//i.test(href)
        || /^\/pages\/cc01\/exhibit/.test(href)
        || href === '/pages/o1101/exhibita'
        || href === '/pages/authorized-users';
      return '<a' + nextAttrs + (shouldOpenNewTab ? ' target="_blank" rel="noopener"' : '') + '>';
    })
    .replace(/%%CPI_PROTECTED_(\d+)%%/g, function(_, index) {
      return protectedBlocks[Number(index)];
    });
}

function breadcrumbHtml(parentPath, parentLabel, currentLabel) {
  return '<nav class="cpi-breadcrumb" aria-label="Breadcrumb" style="max-width: 800px; margin: 0 auto 34px; font-family: Montserrat, sans-serif; font-size: 10px; line-height: 1.8; letter-spacing: .08em; text-transform: uppercase;"><a href="' + parentPath + '" style="color: #000; text-decoration: none;">' + parentLabel + '</a><span style="display: inline-block; margin: 0 8px; color: #777;">/</span><span style="color: #777;">' + currentLabel + '</span></nav>';
}

function pageDownloadHtml(pdfPath) {
  return '<p class="cpi-page-download"><a href="' + pdfPath + '" download><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg><span>Download PDF</span></a></p>';
}

function pageToolbarHtml(parentPath, parentLabel, currentLabel, pdfPath) {
  return '<div class="cpi-page-toolbar"><nav class="cpi-breadcrumb" aria-label="Breadcrumb" style="font-family: Montserrat, sans-serif; font-size: 10px; line-height: 1.8; letter-spacing: .08em; text-transform: uppercase;"><a href="' + parentPath + '" style="color: #000; text-decoration: none;">' + parentLabel + '</a><span style="display: inline-block; margin: 0 8px; color: #777;">/</span><span style="color: #777;">' + currentLabel + '</span></nav>' + pageDownloadHtml(pdfPath) + '</div>';
}

function documentPdfPathForUrl(url) {
  const paths = {
    '/pages/o1101': '/assets/documents/One11%20Residences%20-%20Injury%20Claim.pdf',
    '/pages/o1101/exhibita': '/assets/documents/One11%20Residences%20-%20Exhibit%20A.pdf',
    '/pages/cc01': '/assets/documents/California%20Closets%20-%20Commercial%20Dispute.pdf',
    '/pages/cc01/exhibita': '/assets/documents/California%20Closets%20-%20Exhibit%20A.pdf',
    '/pages/cc01/exhibitb': '/assets/documents/California%20Closets%20-%20Exhibit%20B.pdf',
    '/pages/cc01/exhibitc': '/assets/documents/California%20Closets%20-%20Exhibit%20C.pdf',
    '/pages/cc01/exhibitd': '/assets/documents/California%20Closets%20-%20Exhibit%20D.pdf',
    '/pages/cc01/exhibith': '/assets/documents/California%20Closets%20-%20Exhibit%20H.pdf',
  };
  return paths[url] || '';
}

function addBreadcrumbToFragment(fragment, parentPath, parentLabel, currentLabel) {
  return fragment.replace(/<nav class="cpi-breadcrumb"[\s\S]*?<\/nav>\n?/, '').replace(/(<div class="page-width page-width--narrow section-template--25978985873697__main-padding">\n)/, '$1  ' + breadcrumbHtml(parentPath, parentLabel, currentLabel) + '\n');
}

function addToolbarToFragment(fragment, parentPath, parentLabel, currentLabel, pdfPath) {
  return fragment
    .replace(/<div class="cpi-page-toolbar">[\s\S]*?<\/div>\n?/, '')
    .replace(/<nav class="cpi-breadcrumb"[\s\S]*?<\/nav>\n?/, '')
    .replace(/(<div class="page-width page-width--narrow section-template--25978985873697__main-padding">\n)/, '$1  ' + pageToolbarHtml(parentPath, parentLabel, currentLabel, pdfPath) + '\n');
}

function boldRecordRefs(html) {
  return html
    .replace(/<a\b([^>]*)>(Record Ref[^<]*)<\/a>/g, function(match, attrs, text) {
      return addBoldStyleToTag('<a' + attrs + '>') + text + '</a>';
    })
    .replace(/<span\b([^>]*)>(Record Ref[^<]*)<\/span>/g, function(match, attrs, text) {
      return addBoldStyleToTag('<span' + attrs + '>') + text + '</span>';
    });
}

function addBoldStyleToTag(tag) {
  if (!/style="/.test(tag)) return tag.replace(/>$/, ' style="font-weight: 700;">');
  return tag.replace(/style="([^"]*)"/, function(_, style) {
    if (/font-weight\s*:/.test(style)) return 'style="' + style + '"';
    const trimmed = style.trim();
    const sep = trimmed && !trimmed.endsWith(';') ? ';' : '';
    return 'style="' + trimmed + sep + ' font-weight: 700;"';
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
  <link rel="icon" type="image/png" href="${assetPrefix}assets/favicon.png">
  <link rel="stylesheet" href="${assetPrefix}assets/styles.css?v=20260529-header-footer-same-tab">
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
  <script src="${assetPrefix}assets/site.js?v=20260529-contact-thank-you"></script>
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
              <p>While each company is managed independently, capital allocation and governance are coordinated centrally to support operational efficiency.</p>
              <p>Emphasis on enduring businesses with strong cash flow, resilient demand, and disciplined capital and risk management.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,
  });
}

function notFoundPage() {
  const body = `    <section class="not-found-page" aria-labelledby="not-found-title">
      <div class="not-found-page__inner">
        <p class="not-found-page__eyebrow">404</p>
        <h1 id="not-found-title" class="not-found-page__title">Page Not Found</h1>
        <p class="not-found-page__text">The page you are looking for is unavailable or may not have been published yet.</p>
        <div class="not-found-page__actions">
          <a class="not-found-page__link" href="/">Return Home</a>
          <a class="not-found-page__link" href="/pages/authorized-users" rel="nofollow">Authorized Users</a>
        </div>
      </div>
    </section>`;

  return layout({
    title: 'Page Not Found',
    description: 'The requested page could not be found on Central Park Investors.',
    canonicalPath: '/404',
    body,
    assetPrefix: '/',
  });
}

function one11ExecutiveSummaryPage() {
  const body = `    <section class="content-page">
      <div class="page-width page-width--narrow section-template--25978985873697__main-padding">
  <div class="cpi-page-toolbar"><nav class="cpi-breadcrumb" aria-label="Breadcrumb" style="font-family: Montserrat, sans-serif; font-size: 10px; line-height: 1.8; letter-spacing: .08em; text-transform: uppercase;"><a href="/" style="color: #000; text-decoration: none;">Home</a><span style="display: inline-block; margin: 0 8px; color: #777;">/</span><span style="color: #777;">One11 Residences: Injury Claim</span></nav><p class="cpi-page-download"><a href="/assets/documents/One11%20Residences%20-%20Injury%20Claim.pdf" download><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg><span>Download PDF</span></a></p></div>
  <h1 class="main-page-title page-title h0 scroll-trigger animate--fade-in">
    One11 Residences: Injury Claim
  </h1>
  <div class="rte scroll-trigger animate--slide-in">
    ${"<div style=\"max-width: 800px; margin: 0 auto;\">\n<p class=\"cpi-emphasis-line\"><strong>MEMORANDUM OF FACTS AND LIABILITY SUMMARY</strong></p>\n<p>One11 Residences at The Thompson Central Park<br>111 West 56th Street, Unit 41J<br>New York, New York 10019</p>\n<p>This document serves as a factual summary of an unresolved injury and liability matter arising from the failure of a medicine cabinet installation within a newly constructed condominium unit located at 111 West 56th Street, New York, New York. The matter involves communications and resolution discussions with representatives of the Sponsor, Parker57 LLC, GFI Development Company, LLC, property management personnel, and related stakeholders.</p>\n<p class=\"cpi-emphasis-line\"><strong>BACKGROUND AND PRIOR NOTICE</strong></p>\n<p>Prior to the incident, repeated notice was provided regarding operational, construction-related, and installation-related issues associated with the medicine cabinet assembly.</p>\n<p>On September 9, 2025, a BuildingLink maintenance request was submitted reporting that the medicine cabinet door was coming off its hinge, could not properly close, and exhibited deterioration and related defects.</p>\n<p>On September 17, 2025, written notice was provided to representatives of the Sponsor, GFI Development Company, LLC, building management personnel, brokerage representatives, and counsel advising that the medicine cabinet door was falling off the top hinge, the handle had detached, and portions of the cabinet finish were deteriorating and chipping. The communication further advised that the cabinet had been identified as potentially too heavy for its hinges and that outside assistance or replacement might be required.</p>\n<p>On September 26, 2025, the owner's real estate representative, Clifford Marks of Brown Harris Stevens, transmitted a follow-up communication requesting immediate attention to the defective medicine cabinet after no substantive response had been received.</p>\n<p>On September 29, 2025, representatives of the Sponsor acknowledged the issue and directed maintenance personnel to inspect the medicine cabinet.</p>\n<p>Notice regarding the condition of the medicine cabinet existed prior to the incident.</p>\n<p class=\"cpi-emphasis-line\"><strong>THE INCIDENT</strong></p>\n<p>On September 30, 2025, a substantial glass-faced architectural panel associated with the medicine cabinet assembly detached from its mounted position and struck the owner in the head.</p>\n<p>Photographs taken immediately following the incident depict the detached component resting across the bathroom vanity area after separation from its mounted position.</p>\n<p>The incident occurred after repeated complaints regarding instability, excessive weight, hinge failure, and improper operation of the medicine cabinet assembly.</p>\n<p class=\"cpi-emphasis-line\"><strong>INITIAL MEDICAL TREATMENT</strong></p>\n<p>Following the incident, the owner sought emergency medical treatment on September 30, 2025.</p>\n<p>Medical providers evaluated the injury and diagnosed a concussion. The owner was discharged with instructions concerning monitoring for worsening symptoms and potential neurological complications.</p>\n<p class=\"cpi-emphasis-line\"><strong>SECOND EMERGENCY EVENT</strong></p>\n<p>On October 2, 2025, worsening symptoms including dizziness, lightheadedness, headache, and blurred vision required ambulance transportation and a second emergency medical evaluation. The treating physician documented a head injury occurring approximately two days earlier, noted a history of Postural Orthostatic Tachycardia Syndrome (POTS), and assessed the presentation as likely mild concussion syndrome.</p>\n<p class=\"cpi-emphasis-line\"><strong>POST-INCIDENT REPORTING AND ESCALATION</strong></p>\n<p>Upon returning from the emergency department on September 30, 2025, the incident was reported to front desk and concierge personnel.</p>\n<p>Despite the report involving a construction-related component failure resulting in personal injury, the incident was not escalated to management personnel at that time.</p>\n<p>Management did not become aware of the incident until approximately three days later when direct communications were transmitted to the property manager and broader management team.</p>\n<p class=\"cpi-emphasis-line\"><strong>STRUCTURAL ATTACHMENT SYSTEM</strong></p>\n<p>Following the incident, inspection of the medicine cabinet assembly revealed that a substantial glass-faced architectural panel associated with the installation appeared to be retained through magnetic attachment hardware.</p>\n<p>Photographs document multiple magnetic attachment points associated with the component system.</p>\n<p>Mounted components were located directly above areas where residents and guests would routinely stand or spend time, including the sink and toilet areas.</p>\n<p>The glass-faced panel that detached and struck the owner appears to have been one of these magnet-retained components.</p>\n<p class=\"cpi-emphasis-line\"><strong>DAMAGES</strong></p>\n<p>As a result of the Incident, Unit Owner incurred medical treatment expenses, ambulance transportation charges, transportation expenses, and other incident-related losses.</p>\n<p>The Incident resulted in emergency medical evaluation on September 30, 2025. Following worsening symptoms, Unit Owner required ambulance transportation and a second emergency medical evaluation on October 2, 2025. Medical providers diagnosed a concussion and documented symptoms including dizziness, lightheadedness, headache, and blurred vision.</p>\n<p>The worsening symptoms that led to the October 2, 2025 emergency medical evaluation occurred while Unit Owner was attending a musical and resulted in ambulance transportation from the theater. The Incident caused disruption to normal daily activities and forms part of the non-economic damages asserted in connection with the claim.</p>\n<p>Medical treatment and transportation associated with the Incident have generated billed charges totaling approximately $18,015.20, including emergency department treatment, ambulance transportation, diagnostic evaluation, and related medical services. Portions of these charges were submitted to and paid through insurance benefits.</p>\n<p>In addition to economic losses, Unit Owner asserts claims for physical injury, pain and suffering, emotional distress, disruption of normal daily activities, and other non-economic damages arising from the Incident.</p>\n<p>The circumstances giving rise to these damages include the occurrence of the Incident following multiple documented reports concerning instability, deterioration, and operational issues associated with the medicine cabinet assembly prior to the Incident.</p>\n<p>The full extent of damages and losses remains under evaluation.</p>\n<p class=\"cpi-emphasis-line\"><strong>SETTLEMENT DISCUSSIONS</strong></p>\n<p>Following the Incident, discussions occurred with representatives of GFI Development Company, LLC concerning resolution of claims arising from the Incident, including personal injury claims, incident-related damages, and potential settlement.</p>\n<p>On February 13, 2026, Parker57 LLC provided a proposed Settlement and Release Agreement. The proposed agreement sought a release of claims arising from the incident and identified Parker57 LLC, GFI Development Company, LLC, and a broad range of affiliated entities, investors, consultants, insurers, attorneys, and related parties as released parties.</p>\n<p class=\"cpi-emphasis-line\"><strong>CONCLUSION</strong></p>\n<p>The record reflects repeated notice concerning the condition of the medicine cabinet before the incident occurred, a subsequent component failure resulting in personal injury, emergency medical treatment, a subsequent ambulance-transported emergency evaluation, ongoing damages, and unresolved discussions concerning reimbursement, liability, and release terms.</p>\n<p>The owner remains open to a reasonable resolution and reserves all rights and remedies available under applicable law.</p>\n<p class=\"cpi-emphasis-line\"><strong>EXHIBITS</strong></p>\n<p><a href=\"/pages/o1101/exhibita\" target=\"_blank\" rel=\"noopener\">Exhibit A – Chronology of Events and Supporting Documentation</a><br><a href=\"https://drive.google.com/drive/folders/1iJS5zfOCdJZYl0RJK0We4TTtt3SCkbL2?usp=drive_link\" target=\"_blank\" rel=\"noopener\">Exhibit B – Incident Photographs</a><br><a href=\"https://drive.google.com/drive/folders/1ThlO1aZyPppR_8KuNCONv4tzt14BVX9r?usp=drive_link\" target=\"_blank\" rel=\"noopener\">Exhibit C – Mounted Panel Attachment System</a><br><a href=\"https://drive.google.com/drive/folders/1BpfF2tDJNXGQ_V9tqfDebGxvXx9u9yEg?usp=drive_link\" target=\"_blank\" rel=\"noopener\">Exhibit D – Medical Records and Billing</a><br><a href=\"https://drive.google.com/drive/folders/1yVBRwwuz61r2XnfdUr-IxeLuuGwYboDr?usp=drive_link\" target=\"_blank\" rel=\"noopener\">Exhibit E – Post-Incident Communications</a><br><a href=\"https://drive.google.com/drive/folders/1EK2DZX5rHopPO00IiFSZWuvl7R8ar_RW?usp=drive_link\" target=\"_blank\" rel=\"noopener\">Exhibit F – Settlement and Release Communications</a></p>\n</div>"}
  </div>
</div>
    </section>`;
  return layout({ title: 'One11 Residences: Injury Claim', canonicalPath: '/pages/o1101', body, assetPrefix: '../../' });
}

function one11ExhibitAPage() {
  const rows = [
  {
    "date": "Sep 9, 2025",
    "contacts": [
      "Tricia Fullerton,<br>Owner"
    ],
    "event": "BuildingLink maintenance request submitted reporting medicine cabinet instability, hinge failure, and inability to close properly.",
    "refs": [
      [
        "A1",
        "https://drive.google.com/file/d/1vS8e7dui2cf8eKhfUijtu0EnJVB8mg31/view?usp=drive_link"
      ],
      [
        "A2",
        "https://drive.google.com/file/d/13H2b7oBKuKI39l4VIzTLPKriU1XomMR0/view?usp=drive_link"
      ]
    ],
    "significance": "Earliest documented notice regarding the condition of the medicine cabinet."
  },
  {
    "date": "Sep 17, 2025",
    "contacts": [
      "Tricia Fullerton,<br>Owner"
    ],
    "event": "Written notice provided to representatives of the Sponsor, GFI Development Company, LLC, management personnel, brokerage representatives, and counsel regarding ongoing medicine cabinet defects, including concerns that the cabinet appeared too heavy for its hinges and may require replacement or outside assistance.",
    "refs": [
      [
        "A3",
        "https://drive.google.com/file/d/1hQGEKFvObDUqP4M8A5QgRB3pbRiZHxPX/view?usp=drive_link"
      ]
    ],
    "significance": "Escalated written notice identifying ongoing operational and safety concerns before the incident occurred."
  },
  {
    "date": "Sep 26, 2025",
    "contacts": [
      "Cliff Marks,<br>Real Estate Salesperson"
    ],
    "event": "Follow-up communication transmitted by the owner’s real estate representative, Clifford Marks, requesting immediate attention to the reported defects after no substantive response had been received.",
    "refs": [
      [
        "A4",
        "https://drive.google.com/file/d/1v39ZO3XiFHN0T4_7LXxJiEZms0Ru9NMt/view?usp=drive_link"
      ]
    ],
    "significance": "Demonstrates that concerns remained unresolved despite prior notice."
  },
  {
    "date": "Sep 29, 2025",
    "contacts": [
      "Alex Bass,<br>Project Manager"
    ],
    "event": "The reported condition was acknowledged and maintenance personnel were directed to inspect the medicine cabinet.",
    "refs": [
      [
        "A5",
        "https://drive.google.com/file/d/1sc6Vm36s1FDSZuv8FkM5DXcqIf8CPEgl/view?usp=drive_link"
      ]
    ],
    "significance": "Reflects awareness of the reported condition immediately before the incident."
  },
  {
    "date": "Sep 30, 2025",
    "contacts": [
      "Tricia Fullerton,<br>Owner"
    ],
    "event": "A substantial glass-faced architectural panel associated with the medicine cabinet assembly detached from its mounted position and struck the owner in the head.",
    "refs": [
      [
        "A6",
        "https://drive.google.com/drive/folders/1iJS5zfOCdJZYl0RJK0We4TTtt3SCkbL2?usp=drive_link"
      ]
    ],
    "significance": "Incident giving rise to the claim."
  },
  {
    "date": "Sep 30, 2025",
    "contacts": [
      "Tricia Fullerton,<br>Owner"
    ],
    "event": "Emergency medical treatment obtained following the incident. Medical providers diagnosed a concussion and provided discharge instructions concerning monitoring and neurological symptoms.",
    "refs": [
      [
        "A7",
        "https://drive.google.com/drive/folders/1BpfF2tDJNXGQ_V9tqfDebGxvXx9u9yEg?usp=drive_link"
      ]
    ],
    "significance": "Initial documented medical treatment resulting from the incident."
  },
  {
    "date": "Sep 30, 2025",
    "contacts": [
      "FirstService Residential"
    ],
    "event": "The incident was reported to front desk and concierge personnel upon the owner’s return from the emergency department.",
    "refs": [],
    "significance": "Establishes prompt reporting following the incident."
  },
  {
    "date": "Oct 2, 2025",
    "contacts": [
      "Tricia Fullerton,<br>Owner"
    ],
    "event": "Worsening symptoms including dizziness, lightheadedness, headache, and blurred vision required ambulance transportation and a second emergency medical evaluation. The treating physician documented a head injury occurring approximately two days earlier, noted a history of Postural Orthostatic Tachycardia Syndrome (POTS), and assessed the presentation as likely mild concussion syndrome.",
    "refs": [
      [
        "A8",
        "https://drive.google.com/drive/folders/1BpfF2tDJNXGQ_V9tqfDebGxvXx9u9yEg?usp=drive_link"
      ]
    ],
    "significance": "Documents worsening symptoms requiring ambulance transport and a second emergency evaluation following the head injury."
  },
  {
    "date": "Oct 3, 2025",
    "contacts": [
      "FirstService Residential, GFI Development Company, LLC"
    ],
    "event": "Management became aware of the incident following direct communications from the owner to the property manager and broader management team.",
    "refs": [
      [
        "A9",
        "https://drive.google.com/file/d/1ZGw7e49jA0voQN7ARJOA89785m-FeYdf/view?usp=drive_link"
      ]
    ],
    "significance": "Reflects delay between initial reporting and management notification."
  },
  {
    "date": "Feb 13, 2026",
    "contacts": [
      "GFI Development Company, LLC"
    ],
    "event": "Parker57 LLC provided a proposed Settlement and Release Agreement. The proposed agreement identified Parker57 LLC, GFI Development Company, LLC, and a broad range of affiliated entities, investors, consultants, insurers, attorneys, and related parties as released parties.",
    "refs": [
      [
        "A10",
        "https://drive.google.com/drive/folders/1EK2DZX5rHopPO00IiFSZWuvl7R8ar_RW?usp=drive_link"
      ]
    ],
    "significance": "Formal resolution discussions commenced and release terms were proposed."
  },
  {
    "date": "Present",
    "contacts": [],
    "event": "The matter remains unresolved. No settlement has been reached and no release has been executed.",
    "refs": [],
    "significance": "Current status of the matter."
  }
];
  const refsHtml = (refs) => {
    if (!refs.length) return '';
    return '<br>' + refs.map(([label, href]) => '<span style="font-size: 10px;"><a href="' + href + '" style="font-size: 10px; color: #0645ad; text-decoration: none; font-weight: 700;" target="_blank" rel="noopener">Record Ref. ' + label + '</a></span>').join('<br>');
  };
  const rowHtml = rows.map((row) => `<tr>
<td style="padding: 18px 18px 18px 0px; border-bottom: 1px solid rgb(238, 238, 238); vertical-align: top; white-space: nowrap;">${row.date}</td>
<td style="padding: 18px 18px 18px 0px; border-bottom: 1px solid rgb(238, 238, 238); vertical-align: top;">${row.contacts.length ? row.contacts.join('<br>') : '&nbsp;'}</td>
<td style="padding: 18px 18px 18px 0px; border-bottom: 1px solid rgb(238, 238, 238); vertical-align: top;">${row.event}${refsHtml(row.refs)}</td>
<td style="padding: 18px 0px; border-bottom: 1px solid rgb(238, 238, 238); vertical-align: top;">${row.significance}</td>
</tr>`).join('\n');
  const body = `    <section class="content-page">
      <div class="page-width page-width--narrow section-template--25978985873697__main-padding">
  ${pageToolbarHtml('/pages/o1101', 'One11 Residences: Injury Claim', 'Exhibit A', documentPdfPathForUrl('/pages/o1101/exhibita'))}
  <h1 class="main-page-title page-title h0 scroll-trigger animate--fade-in">
    One11 Residences - Exhibit A
  </h1>
  <div class="rte scroll-trigger animate--slide-in">
    <div style="max-width: 800px; margin: 0 auto;">
<p class="cpi-emphasis-line"><strong>CHRONOLOGY OF EVENTS AND SUPPORTING DOCUMENTATION</strong></p>
<p>This exhibit is a summary of the chronology of events and supporting documentation relating to the September 30, 2025 incident and the circumstances leading to it.</p>
</div>
<div style="max-width: 800px; margin: 60px auto 0; padding: 0px;">
<div style="border-top: 1px solid #d9d9d9; margin: 0px;"><br></div>
<div style="overflow-x: auto;">
<table style="width: 100%; border-collapse: collapse; font-family: Montserrat, sans-serif; font-size: 12px; line-height: 1.7; color: #000000;">
<thead>
<tr>
<th style="width: 15%; text-align: left; padding: 0px 18px 14px 0px; border-bottom: 1px solid rgb(227, 227, 227); font-weight: bold; vertical-align: top; white-space: nowrap;">Date</th>
<th style="width: 20%; text-align: left; padding: 0px 18px 14px 0px; border-bottom: 1px solid rgb(227, 227, 227); font-weight: bold; vertical-align: top;">Contact(s)</th>
<th style="width: 35%; text-align: left; padding: 0px 18px 14px 0px; border-bottom: 1px solid rgb(227, 227, 227); font-weight: bold; vertical-align: top;">Event</th>
<th style="width: 30%; text-align: left; padding: 0px 0px 14px; border-bottom: 1px solid rgb(227, 227, 227); font-weight: bold; vertical-align: top;">Record Significance</th>
</tr>
</thead>
<tbody>
${rowHtml}
</tbody>
</table>
</div>
</div>
  </div>
</div>
    </section>`;
  return layout({ title: 'One11 Residences - Exhibit A', canonicalPath: '/pages/o1101/exhibita', body, assetPrefix: '../../../' });
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
writeFile('404.html', notFoundPage());

for (const page of pages) {
  const source = readSource(page.source);
  let fragment = page.type === 'contact' ? extractContactFragment(source) : extractPageFragment(source);
  fragment = boldRecordRefs(fragment);
  if (page.url === '/pages/authorized-users') {
    fragment = fragment.replace('padding: 50px 24px;\n    text-align: center;', 'padding: 0 24px 100px;\n    text-align: center;');
  }
  if (page.url === '/pages/cc01') {
    fragment = addToolbarToFragment(fragment, '/', 'Home', 'California Closets: Commercial Dispute', documentPdfPathForUrl(page.url));
    fragment = fragment
      .replace(/<a\s+href="\/pages\/cc01\/(exhibita|exhibitb|exhibitc|exhibitd|exhibith)"\s*>/g, '<a href="/pages/cc01/$1" target="_blank" rel="noopener">')
      .replace(/<a\s+href="\/pages\/authorized-users"\s*>/g, '<a href="/pages/authorized-users" target="_blank" rel="noopener">');
  }
  if (page.url === '/pages/cc01/exhibith') {
    fragment = fragment.replaceAll('California Closets - Exhibit E', 'California Closets - Exhibit H');
  }
  if (page.url.startsWith('/pages/cc01/exhibit')) {
    fragment = addToolbarToFragment(fragment, '/pages/cc01', 'California Closets: Commercial Dispute', page.title.replace('California Closets - ', ''), documentPdfPathForUrl(page.url));
  }
  const sectionClass = page.type === 'contact' ? 'contact-page' : page.url === '/pages/authorized-users' ? 'content-page authorized-users-page' : 'content-page';
  const body = `    <section class="${sectionClass}">\n      ${fragment}\n    </section>`;
  writeFile(page.output, layout({ title: page.title, canonicalPath: page.url, body, assetPrefix: page.url.startsWith('/pages/cc01/exhibit') ? '../../../' : '../../' }));
}

writeFile('pages/o1101/index.html', one11ExecutiveSummaryPage());
writeFile('pages/o1101/exhibita/index.html', one11ExhibitAPage());
writeFile('pages/cc01-exhibita/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibita"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibita"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibita">Continue to Exhibit A</a></p></body></html>\n');
writeFile('pages/cc01-exhibitb/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibitb"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibitb"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibitb">Continue to Exhibit B</a></p></body></html>\n');
writeFile('pages/cc01-exhibitc/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibitc"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibitc"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibitc">Continue to Exhibit C</a></p></body></html>\n');
writeFile('pages/cc01-exhibitd/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibitd"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibitd"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibitd">Continue to Exhibit D</a></p></body></html>\n');
writeFile('pages/exhibith/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibith"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibith"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibith">Continue to Exhibit H</a></p></body></html>\n');
writeFile('pages/o1101-exhibita/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/o1101/exhibita"><link rel="canonical" href="https://centralparkinvestors.com/pages/o1101/exhibita"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/o1101/exhibita">Continue to Exhibit A</a></p></body></html>\n');

writeFile(
  'pages/exhibit-e/index.html',
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/pages/cc01/exhibith"><link rel="canonical" href="https://centralparkinvestors.com/pages/cc01/exhibith"><title>Redirecting - CENTRAL PARK INVESTORS</title></head><body><p><a href="/pages/cc01/exhibith">Continue to Exhibit H</a></p></body></html>\n`,
);

console.log(`Built CPI static site from ${themeZip}`);
