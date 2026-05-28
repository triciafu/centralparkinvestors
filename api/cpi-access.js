export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const expectedPin = process.env.CPI_ACCESS_PIN;
  const redirectUrl = process.env.CPI_ACCESS_REDIRECT_URL;

  if (!expectedPin || !redirectUrl) {
    return response.status(500).json({ error: 'Access is not configured.' });
  }

  const submittedCode = String(request.body?.code || '').trim();

  if (!submittedCode || submittedCode !== expectedPin) {
    return response.status(401).json({ error: 'Invalid PIN code.' });
  }

  return response.status(200).json({ redirectUrl });
}
