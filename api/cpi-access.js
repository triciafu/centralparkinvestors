function parseRawBody(raw, contentType) {
  if (!raw) return {};

  if (contentType.includes('application/json')) {
    return JSON.parse(raw);
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }

  return {};
}

async function parseBody(request) {
  const contentType = request.headers['content-type'] || '';

  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return parseRawBody(request.body, contentType);

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return parseRawBody(raw, contentType);
}

function parseAccessRoutes() {
  const routes = new Map();
  const routeList = process.env.CPI_ACCESS_ROUTES || '';

  for (const line of routeList.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const pin = trimmed.slice(0, separator).trim();
    const url = trimmed.slice(separator + 1).trim();
    if (pin && url) routes.set(pin, url);
  }

  const fallbackPin = process.env.CPI_ACCESS_PIN;
  const fallbackUrl = process.env.CPI_ACCESS_REDIRECT_URL;
  if (fallbackPin && fallbackUrl && !routes.has(fallbackPin)) {
    routes.set(fallbackPin, fallbackUrl);
  }

  return routes;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const accessRoutes = parseAccessRoutes();

  if (!accessRoutes.size) {
    return response.status(500).json({ error: 'Access is not configured.' });
  }

  let body;
  try {
    body = await parseBody(request);
  } catch {
    return response.status(400).json({ error: 'Invalid access request.' });
  }

  const submittedCode = String(body?.code || body?.pin || '').trim();
  const redirectUrl = accessRoutes.get(submittedCode);

  if (!redirectUrl) {
    return response.status(401).json({ error: 'Invalid PIN code.' });
  }

  response.setHeader('Cache-Control', 'no-store');
  return response.status(200).json({ redirectUrl });
}
