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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const expectedPin = process.env.CPI_ACCESS_PIN;
  const redirectUrl = process.env.CPI_ACCESS_REDIRECT_URL;

  if (!expectedPin || !redirectUrl) {
    return response.status(500).json({ error: 'Access is not configured.' });
  }

  let body;
  try {
    body = await parseBody(request);
  } catch {
    return response.status(400).json({ error: 'Invalid access request.' });
  }

  const submittedCode = String(body?.code || body?.pin || '').trim();

  if (!submittedCode || submittedCode !== expectedPin) {
    return response.status(401).json({ error: 'Invalid PIN code.' });
  }

  response.setHeader('Cache-Control', 'no-store');
  return response.status(200).json({ redirectUrl });
}
