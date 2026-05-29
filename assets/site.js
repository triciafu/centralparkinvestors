function setFormMessage(container, text, tone = '') {
  if (!container) return;
  container.textContent = text;
  container.dataset.tone = tone;
}

function ensureContactMessage() {
  const form = document.getElementById('ContactForm');
  if (!form) return null;

  let message = document.getElementById('ContactForm-message');
  if (!message) {
    message = document.createElement('div');
    message.id = 'ContactForm-message';
    message.className = 'contact__message';
    const buttonWrap = form.querySelector('.contact__button');
    if (buttonWrap) {
      buttonWrap.appendChild(message);
    } else {
      form.appendChild(message);
    }
  }

  return message;
}

function showContactQueryMessage() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('sent') && !params.has('error')) return;

  const message = ensureContactMessage();
  if (!message) return;

  if (params.has('sent')) {
    setFormMessage(message, 'Thank you. Your message has been sent.', 'success');
    return;
  }

  setFormMessage(message, 'Your message could not be sent. Please email ops@centralparkinvestors.com directly.', 'error');
}

document.addEventListener('DOMContentLoaded', showContactQueryMessage);

document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === 'cpi-code-gate-form') {
    event.preventDefault();

    const input = document.getElementById('cpi-access-code');
    const message = document.getElementById('cpi-code-message');
    const button = form.querySelector('button[type="submit"]');
    const code = input?.value.trim();

    if (!input || !message || !button) return;

    setFormMessage(message, '');

    if (!code) {
      setFormMessage(message, 'Please enter your PIN code.', 'error');
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

      setFormMessage(message, result.error || 'Invalid PIN code.', 'error');
    } catch {
      setFormMessage(message, 'Access verification is temporarily unavailable.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Continue';
    }

    return;
  }

  if (form.id === 'ContactForm') {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const message = ensureContactMessage();
    if (!message) return;

    const data = new FormData(form);
    const name = String(data.get('contact[Name]') || '').trim();
    const email = String(data.get('contact[email]') || '').trim();
    const comment = String(data.get('contact[Comment]') || '').trim();

    setFormMessage(message, '');

    if (!name || !email || !comment) {
      setFormMessage(message, 'Please complete all fields.', 'error');
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'SENDING...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });

      const result = await response.json();

      if (response.ok) {
        form.reset();
        setFormMessage(message, result.message || 'Thank you. Your message has been sent.', 'success');
        return;
      }

      setFormMessage(message, result.error || 'Your message could not be sent.', 'error');
    } catch {
      setFormMessage(message, 'Your message could not be sent right now.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'SUBMIT';
      }
    }
  }
});
