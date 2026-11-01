import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve from this script, never the caller's working directory.
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const sourceRoot = path.join(root, 'source', 'site');

export function build({ check = false } = {}) {
  const outputs = new Map();
  function collect(directory, relative = '') {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = path.join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Source symlinks are not supported: ' + name);
      if (entry.isDirectory()) collect(path.join(directory, entry.name), name);
      else if (entry.name.endsWith('.html')) {
        if (name !== 'index.html' && name !== '404.html' && !['pages', 'legal', 'cases'].some(directory => name.startsWith(directory + path.sep))) {
          throw new Error('Unexpected HTML source location: ' + name);
        }
        const html = fs.readFileSync(path.join(directory, entry.name), 'utf8');
        if (!/<!doctype html>/i.test(html) || !/<html[\s>]/i.test(html)) {
          throw new Error('Invalid HTML source: ' + name);
        }
        outputs.set(name, html);
      }
    }
  }
  collect(sourceRoot);
  for (const required of ['index.html', '404.html', 'pages/authorized-users/index.html', 'pages/contact/index.html']) {
    if (!outputs.has(required)) throw new Error('Missing required source: ' + required);
  }
  // Check local HTML links and assets before writing any output.
  for (const [name, html] of outputs) {
    for (const match of html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)) {
      const href = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) continue;
      const url = new URL(href, 'https://local.invalid/' + name.replaceAll(path.sep, '/'));
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = path.resolve(root, relative);
      if (target !== root && !target.startsWith(root + path.sep)) throw new Error('Path outside project: ' + href);
      if (relative.startsWith('api/')) continue;
      const candidates = [relative, path.join(relative, 'index.html')];
      const exists = candidates.some(candidate => outputs.has(candidate)
        || (!candidate.endsWith('.html') && fs.existsSync(path.join(root, candidate)) && fs.statSync(path.join(root, candidate)).isFile()));
      if (!exists) throw new Error('Missing local target in ' + name + ': ' + href);
    }
  }
  if (!check) {
    // Never remove pages. Only write validated sources that actually changed.
    for (const [name, html] of outputs) {
      const target = path.join(root, name);
      if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === html) continue;
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
    }
  }
  console.log((check ? 'Validated ' : 'Built ') + outputs.size + ' HTML files from source/site.');
  return outputs.size;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build-cpi-site.mjs [--check]');
  build({ check: args.includes('--check') });
}
