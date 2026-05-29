const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function field(body, name, fallback = '') {
  return String(body[name] || body[fallback] || '').trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  let body;
  try {
    body = await parseBody(request);
  } catch {
    return response.status(400).json({ error: 'Invalid form submission.' });
  }

  if (field(body, 'bot-field')) {
    return response.status(200).json({ message: 'Thank you. Your message has been sent.' });
  }

  const name = field(body, 'contact[Name]', 'name');
  const email = field(body, 'contact[email]', 'email').toLowerCase();
  const comment = field(body, 'contact[Comment]', 'message');

  if (!name || !email || !comment) {
    return response.status(400).json({ error: 'Please complete all fields.' });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return response.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'ops@centralparkinvestors.com';

  if (!apiKey || !fromEmail || !toEmail) {
    return response.status(500).json({ error: 'Contact form is not configured.' });
  }

  const subject = 'Central Park Investors contact form';
  const text = [
    'New Central Park Investors contact form submission',
    '',
    'Name: ' + name,
    'Email: ' + email,
    '',
    comment,
  ].join('\n');

  const html = '<p><strong>New Central Park Investors contact form submission</strong></p>'
    + '<p><strong>Name:</strong> ' + escapeHtml(name) + '<br>'
    + '<strong>Email:</strong> ' + escapeHtml(email) + '</p>'
    + '<p>' + escapeHtml(comment).replaceAll('\n', '<br>') + '</p>';

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    return response.status(502).json({ error: 'Message delivery failed.' });
  }

  return response.status(200).json({ message: 'Thank you. Your message has been sent.' });
}
