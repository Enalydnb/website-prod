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
    style.innerHTML = `
      #cookie-banner-overlay {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 2rem);
        max-width: 500px;
        background: #0E0E10;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 1.25rem;
        z-index: 999999;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
        font-family: 'Manrope', sans-serif;
        color: #F2F2F2;
        box-sizing: border-box;
        overflow: hidden;
      }

      .cookie-title {
        font-family: 'League Gothic', sans-serif;
        font-weight: 400;
        font-size: clamp(1.4rem, 5vw, 1.8rem);
        color: #F2F2F2;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1.1;
        margin-bottom: 0.6rem;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      .cookie-text {
        font-size: 0.85rem;
        line-height: 1.5;
        color: #aaaaaa;
        margin: 0 0 1.2rem 0;
      }

      .cookie-text a {
        color: #FF006E;
        text-decoration: underline;
      }

      .cookie-buttons {
        display: flex;
        gap: 0.6rem;
        width: 100%;
      }

      .cookie-btn {
        flex: 1;
        font-family: 'League Gothic', sans-serif;
        font-weight: 400;
        font-size: 1.25rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 0.5rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        text-align: center;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .cookie-btn-accept {
        background: #FF006E;
        color: #ffffff;
      }

      .cookie-btn-accept:hover {
        background: #d4005b;
      }

      .cookie-btn-decline {
        background: rgba(255, 255, 255, 0.05);
        color: #cccccc;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .cookie-btn-decline:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      @media (max-width: 480px) {
        #cookie-banner-overlay {
          bottom: 0.75rem;
          width: calc(100% - 1.5rem);
          padding: 1rem;
        }

        .cookie-buttons {
          flex-direction: column;
          gap: 0.5rem;
        }

        .cookie-btn {
          width: 100%;
          padding: 0.6rem 0.5rem;
          font-size: 1.2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyles();
    if (document.getElementById('cookie-banner-overlay')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner-overlay';
    banner.innerHTML = `
      <div class="cookie-title">Privacy Settings</div>
      <p class="cookie-text">
        We use essential cookies to ensure the basic functionality of the website. For more details, please check our <a href="privacy-policies">Privacy Policy</a>.
      </p>
      <div class="cookie-buttons">
        <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Essential Only</button>
        <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept All</button>
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