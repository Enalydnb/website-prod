// js/booking-form.js · booking inquiry (own Cloudflare Worker /api/booking + Cloudflare Turnstile)
// The Worker checks Turnstile and sends the inquiry by e-mail via IONOS – nothing is stored.
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

    // Date field: phones show a number pad (inputmode="numeric") without a "." key,
    // so the dots are added automatically while typing: 22012027 → 22.01.2027.
    // Anything typed differently by hand (e.g. "1.2.2027" or "TBA") is left as it is.
    const dateInput = form.querySelector('[name="date"]');
    if (dateInput) {
      dateInput.addEventListener('input', function (e) {
        // a typed "." right after an automatic one is swallowed (22. + . → 22.)
        if (e.data === '.' && /\.\.$/.test(dateInput.value)) dateInput.value = dateInput.value.slice(0, -1);
        const v = dateInput.value;
        // only when dots sit where we would put them (so "1.2.2027" or "TBA" typed by hand stay untouched)
        if (!/^(\d{2}\.){0,2}\d*$/.test(v)) return;
        if (e.inputType && e.inputType.startsWith('delete')) return; // let backspace work normally
        const d = v.replace(/\D/g, '').slice(0, 8);
        let out = d.slice(0, 2);
        if (d.length >= 2) out += '.' + d.slice(2, 4);
        if (d.length >= 4) out += '.' + d.slice(4, 8);
        dateInput.value = out;
      });
    }

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

      const payload = Object.fromEntries(new FormData(form));

      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok && data.ok) {
          showStatus('success', 'Thank you! Your inquiry has been sent. You will receive a confirmation by e-mail.');
          form.reset();
          if (window.turnstile) turnstile.reset();
        } else {
          throw new Error(data.error || 'Your inquiry could not be sent. Please try again later or send an e-mail.');
        }
      } catch (err) {
        showStatus('error', err.message === 'Failed to fetch' ? 'Connection problem. Please try again or send an e-mail.' : err.message);
        if (window.turnstile) turnstile.reset();
      } finally {
        setLoading(false);
      }
    });
  });
})();
