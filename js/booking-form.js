// js/booking-form.js · booking inquiry (AJAX to Formspree + Cloudflare Turnstile)
// Used on index.html (#booking) and booking.html
(function () {
  const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>';
  const ICON_ERR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
  const ICON_SEND = '<svg class="icon-shift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');

    function showStatus(type, message) {
      status.className = 'is-visible ' + type;
      status.innerHTML = (type === 'success' ? ICON_OK : ICON_ERR) + '<span></span>';
      status.querySelector('span').textContent = message;
    }
    function setLoading(loading) {
      btn.disabled = loading;
      btn.innerHTML = loading
        ? '<span class="spinner" aria-hidden="true"></span><span class="btn-text">Sending...</span>'
        : '<span class="btn-text">Send Inquiry</span>' + ICON_SEND;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(':invalid');
        showStatus('error', 'Please fill in all required fields marked with *.');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;
      if (!turnstileToken) {
        showStatus('error', 'Please confirm the Cloudflare Captcha.');
        return;
      }

      setLoading(true);
      status.className = '';

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formspree.io/f/mbgjvgen', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showStatus('success', 'Thank you! Your inquiry has been sent successfully.');
          form.reset();
          if (window.turnstile) turnstile.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Error sending message.');
        }
      } catch (err) {
        showStatus('error', 'Error sending message: ' + err.message);
        if (window.turnstile) turnstile.reset();
      } finally {
        setLoading(false);
      }
    });
  });
})();
