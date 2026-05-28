document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== 'cpi-code-gate-form') return;

  event.preventDefault();

  const input = document.getElementById('cpi-access-code');
  const message = document.getElementById('cpi-code-message');
  const button = form.querySelector('button[type="submit"]');
  const code = input?.value.trim();

  if (!input || !message || !button) return;

  message.textContent = '';

  if (!code) {
    message.textContent = 'Please enter your PIN code.';
    return;
  }

  button.disabled = true;
  button.textContent = 'Checking...';

  try {
    const response = await fetch('/api/cpi-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();

    if (response.ok && result.redirectUrl) {
      window.location.href = result.redirectUrl;
      return;
    }

    message.textContent = 'Invalid PIN code.';
  } catch {
    message.textContent = 'Access verification needs to be connected on the new host.';
  } finally {
    button.disabled = false;
    button.textContent = 'Continue';
  }
});
