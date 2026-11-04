(function() {
  const COOKIE_NAME = 'enaly_cookie_consent';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  function injectStyles() {
    if (document.getElementById('cookie-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = `
      #cookie-banner-overlay {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        width: calc(100% - 2rem);
        max-width: 420px;
        background: rgba(0, 0, 0, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 16px;
        padding: 1.4rem;
        z-index: 999999;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(24px) saturate(140%);
        -webkit-backdrop-filter: blur(24px) saturate(140%);
        font-family: 'Manrope', system-ui, sans-serif;
        color: #FFFFFF;
        box-sizing: border-box;
        animation: cookieIn 400ms cubic-bezier(.2,.7,.2,1) both;
      }
      #cookie-banner-overlay *, #cookie-banner-overlay *::before, #cookie-banner-overlay *::after { box-sizing: border-box; }
      @keyframes cookieIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

      .cookie-head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.7rem;
      }
      .cookie-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 0, 110, 0.14);
        border: 1px solid rgba(255, 0, 110, 0.38);
        color: #FF006E;
        flex-shrink: 0;
      }
      .cookie-icon svg { width: 19px; height: 19px; }

      .cookie-title {
        font-family: 'League Gothic', 'Arial Narrow', sans-serif;
        font-weight: 400;
        font-size: 1.8rem;
        color: #FFFFFF;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1;
        margin: 0;
      }

      .cookie-text {
        font-size: 0.88rem;
        line-height: 1.6;
        color: #CCCCCC;
        margin: 0 0 1.2rem 0;
      }
      .cookie-text a {
        color: #FF006E;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .cookie-buttons { display: flex; gap: 0.5rem; width: 100%; }

      .cookie-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        font-family: 'League Gothic', 'Arial Narrow', sans-serif;
        font-weight: 400;
        font-size: 1.25rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        line-height: 1;
        padding: 0.75rem 1rem;
        border-radius: 9999px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        white-space: nowrap;
      }
      .cookie-btn svg { width: 16px; height: 16px; }
      .cookie-btn:focus-visible { outline: 2px solid #FF006E; outline-offset: 3px; }

      .cookie-btn-accept { background: #FF006E; color: #FFFFFF; }
      .cookie-btn-accept:hover { background: #E0005F; box-shadow: 0 8px 24px rgba(255, 0, 110, 0.35); }

      .cookie-btn-decline {
        background: rgba(255, 255, 255, 0.05);
        color: #FFFFFF;
        border-color: rgba(255, 255, 255, 0.12);
      }
      .cookie-btn-decline:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25); }

      @media (max-width: 480px) {
        #cookie-banner-overlay {
          right: 0.75rem;
          bottom: 0.75rem;
          width: calc(100% - 1.5rem);
          padding: 1.15rem;
        }
        .cookie-buttons { flex-direction: column; }
        .cookie-btn { width: 100%; }
      }
      @media (prefers-reduced-motion: reduce) {
        #cookie-banner-overlay { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyles();
    if (document.getElementById('cookie-banner-overlay')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner-overlay';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.setAttribute('aria-describedby', 'cookieText');
    banner.innerHTML = `
      <div class="cookie-head">
        <span class="cookie-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
        </span>
        <h2 class="cookie-title" id="cookieTitle">Privacy Settings</h2>
      </div>
      <p class="cookie-text" id="cookieText">
        We use essential cookies to ensure the basic functionality of the website. For more details, please check our <a href="/privacy-policies">Privacy Policy</a>.
      </p>
      <div class="cookie-buttons">
        <button type="button" class="cookie-btn cookie-btn-decline" id="cookieDecline">Essential Only</button>
        <button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
          Accept All
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', function() {
      setCookie(COOKIE_NAME, 'accepted', 365);
      banner.remove();
    });

    document.getElementById('cookieDecline').addEventListener('click', function() {
      setCookie(COOKIE_NAME, 'declined', 365);
      banner.remove();
    });
  }

  window.reopenCookieBanner = function() {
    showBanner();
  };

  document.addEventListener('DOMContentLoaded', function() {
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      showBanner();
    }
  });
})();
